"""
Behavioral Assessment Agent - Sends and processes founder behavioral assessments
"""
import asyncio
import json
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

from base_agent import BaseAIAgent, AgentState
from config import Config

logger = logging.getLogger(__name__)

class BehavioralAssessmentAgent(BaseAIAgent):
    """Agent for sending and processing founder behavioral assessments"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(
            name="Behavioral Assessment Agent",
            description="Sends and processes founder behavioral psychometric assessments",
            config=config
        )
        
        # Assessment configuration
        self.assessment_config = {
            "expiry_days": 7,
            "retry_interval_hours": 24,
            "max_retries": 3,
            "assessment_duration_minutes": 30
        }
        
        # Behavioral traits to assess
        self.behavioral_traits = {
            "leadership": {
                "description": "Ability to lead and inspire others",
                "questions": 8,
                "weight": 0.2
            },
            "resilience": {
                "description": "Ability to bounce back from setbacks",
                "questions": 6,
                "weight": 0.15
            },
            "risk_taking": {
                "description": "Willingness to take calculated risks",
                "questions": 7,
                "weight": 0.15
            },
            "collaboration": {
                "description": "Ability to work effectively with others",
                "questions": 6,
                "weight": 0.15
            },
            "adaptability": {
                "description": "Ability to adapt to changing circumstances",
                "questions": 7,
                "weight": 0.15
            },
            "vision": {
                "description": "Ability to think strategically and long-term",
                "questions": 6,
                "weight": 0.2
            }
        }
    
    def _build_graph(self):
        """Build the LangGraph workflow for behavioral assessment"""
        from langgraph.graph import StateGraph, END
        
        workflow = StateGraph(AgentState)
        
        # Define nodes
        workflow.add_node("validate_founder", self._validate_founder)
        workflow.add_node("generate_assessment", self._generate_assessment)
        workflow.add_node("send_assessment", self._send_assessment)
        workflow.add_node("monitor_completion", self._monitor_completion)
        workflow.add_node("process_responses", self._process_responses)
        workflow.add_node("calculate_scores", self._calculate_scores)
        workflow.add_node("generate_report", self._generate_report)
        
        # Define edges
        workflow.set_entry_point("validate_founder")
        workflow.add_edge("validate_founder", "generate_assessment")
        workflow.add_edge("generate_assessment", "send_assessment")
        workflow.add_edge("send_assessment", "monitor_completion")
        workflow.add_edge("monitor_completion", "process_responses")
        workflow.add_edge("process_responses", "calculate_scores")
        workflow.add_edge("calculate_scores", "generate_report")
        workflow.add_edge("generate_report", END)
        
        return workflow.compile()
    
    async def _execute(self, state: AgentState) -> AgentState:
        """Execute the behavioral assessment process"""
        try:
            self._update_progress(state, 10, "Starting behavioral assessment process")
            
            # Run the workflow
            result = await self.graph.ainvoke(state)
            
            self._update_progress(result, 100, "Behavioral assessment completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Behavioral assessment failed: {e}")
            return self._create_error_state(state, str(e))
    
    async def _validate_founder(self, state: AgentState) -> AgentState:
        """Validate founder contact information"""
        self._update_progress(state, 20, "Validating founder information")
        
        founder_data = state.metadata.get("founder", {})
        phone_number = founder_data.get("phone_number")
        email = founder_data.get("email")
        
        if not phone_number or not email:
            return self._create_error_state(state, "Phone number and email are required for assessment")
        
        # Validate phone number format
        if not self._validate_phone_number(phone_number):
            return self._create_error_state(state, "Invalid phone number format")
        
        # Validate email format
        if not self._validate_email(email):
            return self._create_error_state(state, "Invalid email format")
        
        # Check for recent assessment
        recent_assessment = await self._check_recent_assessment(phone_number, email)
        if recent_assessment:
            return self._create_error_state(state, f"Recent assessment found: {recent_assessment}")
        
        state.results["founder_validation"] = {
            "phone_number": phone_number,
            "email": email,
            "validated_at": datetime.now().isoformat(),
            "status": "valid"
        }
        
        self._update_progress(state, 30, "Founder validation completed")
        return state
    
    def _validate_phone_number(self, phone_number: str) -> bool:
        """Validate phone number format"""
        import re
        pattern = r'^\+?1?\d{9,15}$'
        return bool(re.match(pattern, phone_number.replace(' ', '').replace('-', '')))
    
    def _validate_email(self, email: str) -> bool:
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    async def _check_recent_assessment(self, phone_number: str, email: str) -> Optional[Dict[str, Any]]:
        """Check for recent assessment to prevent duplicates"""
        # In real implementation, this would query the database
        # For now, return None (no recent assessment)
        return None
    
    async def _generate_assessment(self, state: AgentState) -> AgentState:
        """Generate the behavioral assessment questions"""
        self._update_progress(state, 40, "Generating assessment questions")
        
        assessment_id = str(uuid.uuid4())
        assessment_url = f"https://assessment.ai-analyst.com/{assessment_id}"
        
        # Generate questions for each behavioral trait
        assessment_questions = {}
        
        for trait, config in self.behavioral_traits.items():
            questions = await self._generate_trait_questions(trait, config)
            assessment_questions[trait] = {
                "description": config["description"],
                "questions": questions,
                "weight": config["weight"]
            }
        
        # Create assessment structure
        assessment = {
            "assessment_id": assessment_id,
            "url": assessment_url,
            "expires_at": (datetime.now() + timedelta(days=self.assessment_config["expiry_days"])).isoformat(),
            "duration_minutes": self.assessment_config["assessment_duration_minutes"],
            "traits": assessment_questions,
            "total_questions": sum(len(trait["questions"]) for trait in assessment_questions.values()),
            "created_at": datetime.now().isoformat()
        }
        
        state.results["assessment"] = assessment
        self._update_progress(state, 50, f"Generated assessment with {assessment['total_questions']} questions")
        return state
    
    async def _generate_trait_questions(self, trait: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate questions for a specific behavioral trait"""
        question_prompt = ChatPromptTemplate.from_template("""
        Generate {num_questions} behavioral assessment questions for the trait: {trait}
        
        Description: {description}
        
        Each question should be:
        1. A situational judgment scenario
        2. Multiple choice with 5 options (A, B, C, D, E)
        3. Realistic for a startup founder context
        4. Designed to reveal the behavioral trait
        
        Format as JSON array with:
        - question: the question text
        - options: array of 5 options
        - correct_answer: the letter of the best answer
        - explanation: why this answer demonstrates the trait
        
        Generate questions that are:
        - Professional and relevant
        - Not too obvious
        - Cover different aspects of the trait
        """)
        
        try:
            response = await self.llm.ainvoke(
                question_prompt.format_messages(
                    num_questions=config["questions"],
                    trait=trait,
                    description=config["description"]
                )
            )
            
            return json.loads(response.content)
            
        except Exception as e:
            logger.error(f"Failed to generate questions for {trait}: {e}")
            # Return default questions if generation fails
            return self._get_default_questions(trait, config["questions"])
    
    def _get_default_questions(self, trait: str, num_questions: int) -> List[Dict[str, Any]]:
        """Get default questions if AI generation fails"""
        default_questions = {
            "leadership": [
                {
                    "question": "Your team is struggling with a critical deadline. How do you respond?",
                    "options": [
                        "A) Take over all tasks yourself",
                        "B) Call an emergency meeting to reassign work",
                        "C) Motivate the team and provide additional resources",
                        "D) Extend the deadline without discussion",
                        "E) Blame external factors"
                    ],
                    "correct_answer": "C",
                    "explanation": "Demonstrates leadership by motivating team and providing support"
                }
            ],
            "resilience": [
                {
                    "question": "Your biggest client just cancelled their contract. What's your first reaction?",
                    "options": [
                        "A) Panic and call everyone for help",
                        "B) Accept it and move on immediately",
                        "C) Analyze what went wrong and create a recovery plan",
                        "D) Blame the client for being unreasonable",
                        "E) Give up on the business"
                    ],
                    "correct_answer": "C",
                    "explanation": "Shows resilience by learning from setbacks and planning recovery"
                }
            ]
        }
        
        return default_questions.get(trait, [])[:num_questions]
    
    async def _send_assessment(self, state: AgentState) -> AgentState:
        """Send assessment via SMS and email"""
        self._update_progress(state, 60, "Sending assessment invitations")
        
        founder_validation = state.results.get("founder_validation", {})
        assessment = state.results.get("assessment", {})
        
        phone_number = founder_validation.get("phone_number")
        email = founder_validation.get("email")
        assessment_url = assessment.get("url")
        
        # Send SMS
        sms_result = await self._send_sms(phone_number, assessment_url)
        
        # Send email
        email_result = await self._send_email(email, assessment_url, assessment)
        
        state.results["delivery"] = {
            "sms": sms_result,
            "email": email_result,
            "sent_at": datetime.now().isoformat(),
            "status": "sent" if sms_result["success"] and email_result["success"] else "partial"
        }
        
        self._update_progress(state, 70, "Assessment invitations sent")
        return state
    
    async def _send_sms(self, phone_number: str, assessment_url: str) -> Dict[str, Any]:
        """Send SMS with assessment link"""
        message = f"""
        Hi! You've been invited to complete a behavioral assessment for investor evaluation.
        
        Assessment Link: {assessment_url}
        
        This will take about 30 minutes and helps us understand your leadership style.
        Please complete within 7 days.
        
        Best regards,
        AI Analyst Team
        """
        
        try:
            # In real implementation, this would use Twilio:
            # from twilio.rest import Client
            # client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)
            # message = client.messages.create(
            #     body=message,
            #     from_=Config.TWILIO_PHONE_NUMBER,
            #     to=phone_number
            # )
            
            # For now, simulate SMS sending
            await asyncio.sleep(1)
            
            return {
                "success": True,
                "message_id": f"sms_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "status": "sent"
            }
            
        except Exception as e:
            logger.error(f"Failed to send SMS: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _send_email(self, email: str, assessment_url: str, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Send email with assessment link"""
        subject = "Behavioral Assessment Invitation - AI Analyst"
        
        html_content = f"""
        <html>
        <body>
            <h2>Behavioral Assessment Invitation</h2>
            <p>Dear Founder,</p>
            <p>You've been invited to complete a behavioral assessment as part of our investor evaluation process.</p>
            
            <h3>Assessment Details:</h3>
            <ul>
                <li><strong>Duration:</strong> {assessment.get('duration_minutes', 30)} minutes</li>
                <li><strong>Questions:</strong> {assessment.get('total_questions', 0)} questions</li>
                <li><strong>Expires:</strong> {assessment.get('expires_at', '7 days')}</li>
            </ul>
            
            <h3>What We're Assessing:</h3>
            <ul>
                <li>Leadership style and capabilities</li>
                <li>Resilience and adaptability</li>
                <li>Risk-taking tendencies</li>
                <li>Collaboration and team-building skills</li>
                <li>Strategic vision and long-term thinking</li>
            </ul>
            
            <p><strong>Assessment Link:</strong> <a href="{assessment_url}">{assessment_url}</a></p>
            
            <p>This assessment helps us better understand your entrepreneurial profile and leadership approach. Your responses are confidential and will be used solely for investment evaluation purposes.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>AI Analyst Team</p>
        </body>
        </html>
        """
        
        try:
            # In real implementation, this would use SendGrid or similar:
            # import sendgrid
            # from sendgrid.helpers.mail import Mail
            
            # sg = sendgrid.SendGridAPIClient(api_key=Config.SENDGRID_API_KEY)
            # message = Mail(
            #     from_email='noreply@ai-analyst.com',
            #     to_emails=email,
            #     subject=subject,
            #     html_content=html_content
            # )
            # response = sg.send(message)
            
            # For now, simulate email sending
            await asyncio.sleep(1)
            
            return {
                "success": True,
                "message_id": f"email_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "status": "sent"
            }
            
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _monitor_completion(self, state: AgentState) -> AgentState:
        """Monitor assessment completion status"""
        self._update_progress(state, 80, "Monitoring assessment completion")
        
        assessment = state.results.get("assessment", {})
        assessment_id = assessment.get("assessment_id")
        
        # In real implementation, this would poll the assessment system
        # For now, simulate monitoring
        await asyncio.sleep(2)  # Simulate monitoring time
        
        # Simulate completion (in real system, this would check actual status)
        completion_status = await self._check_completion_status(assessment_id)
        
        state.results["completion_status"] = completion_status
        
        if completion_status["completed"]:
            self._update_progress(state, 90, "Assessment completed successfully")
        else:
            self._update_progress(state, 85, f"Assessment status: {completion_status['status']}")
        
        return state
    
    async def _check_completion_status(self, assessment_id: str) -> Dict[str, Any]:
        """Check if assessment has been completed"""
        # In real implementation, this would query the assessment system
        # For now, simulate completion
        return {
            "completed": True,
            "status": "completed",
            "completed_at": datetime.now().isoformat(),
            "responses_received": 40,  # Total questions answered
            "completion_time_minutes": 28
        }
    
    async def _process_responses(self, state: AgentState) -> Dict[str, Any]:
        """Process assessment responses"""
        self._update_progress(state, 90, "Processing assessment responses")
        
        assessment = state.results.get("assessment", {})
        completion_status = state.results.get("completion_status", {})
        
        if not completion_status.get("completed"):
            return self._create_error_state(state, "Assessment not completed")
        
        # Simulate processing responses
        responses = await self._simulate_responses_processing(assessment)
        
        state.results["responses"] = responses
        self._update_progress(state, 95, "Responses processed successfully")
        return state
    
    async def _simulate_responses_processing(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate processing of assessment responses"""
        # In real implementation, this would process actual responses
        # For now, simulate response processing
        
        responses = {}
        for trait, config in assessment.get("traits", {}).items():
            trait_responses = []
            for question in config.get("questions", []):
                # Simulate response (in real system, this would be actual user responses)
                trait_responses.append({
                    "question_id": question.get("question", "")[:50],
                    "selected_answer": "C",  # Simulate answer selection
                    "is_correct": question.get("correct_answer") == "C",
                    "response_time_seconds": 45
                })
            responses[trait] = trait_responses
        
        return responses
    
    async def _calculate_scores(self, state: AgentState) -> AgentState:
        """Calculate behavioral scores for each trait"""
        self._update_progress(state, 95, "Calculating behavioral scores")
        
        responses = state.results.get("responses", {})
        assessment = state.results.get("assessment", {})
        
        trait_scores = {}
        overall_score = 0
        total_weight = 0
        
        for trait, config in assessment.get("traits", {}).items():
            trait_responses = responses.get(trait, [])
            
            if trait_responses:
                # Calculate score for this trait
                correct_answers = sum(1 for r in trait_responses if r.get("is_correct", False))
                total_questions = len(trait_responses)
                trait_score = (correct_answers / total_questions) * 100
                
                trait_scores[trait] = {
                    "score": trait_score,
                    "correct_answers": correct_answers,
                    "total_questions": total_questions,
                    "weight": config.get("weight", 0),
                    "description": config.get("description", ""),
                    "interpretation": self._interpret_score(trait_score)
                }
                
                # Add to overall score
                weight = config.get("weight", 0)
                overall_score += trait_score * weight
                total_weight += weight
        
        # Calculate overall score
        if total_weight > 0:
            overall_score = overall_score / total_weight
        
        state.results["scores"] = {
            "trait_scores": trait_scores,
            "overall_score": overall_score,
            "overall_interpretation": self._interpret_score(overall_score),
            "calculated_at": datetime.now().isoformat()
        }
        
        self._update_progress(state, 98, "Behavioral scores calculated")
        return state
    
    def _interpret_score(self, score: float) -> str:
        """Interpret behavioral score"""
        if score >= 90:
            return "Exceptional"
        elif score >= 80:
            return "Strong"
        elif score >= 70:
            return "Good"
        elif score >= 60:
            return "Average"
        else:
            return "Below Average"
    
    async def _generate_report(self, state: AgentState) -> AgentState:
        """Generate final behavioral assessment report"""
        self._update_progress(state, 100, "Generating behavioral assessment report")
        
        assessment = state.results.get("assessment", {})
        completion_status = state.results.get("completion_status", {})
        responses = state.results.get("responses", {})
        scores = state.results.get("scores", {})
        
        # Generate comprehensive report
        report = {
            "assessment_details": {
                "assessment_id": assessment.get("assessment_id"),
                "completed_at": completion_status.get("completed_at"),
                "completion_time_minutes": completion_status.get("completion_time_minutes"),
                "total_questions": assessment.get("total_questions"),
                "responses_received": completion_status.get("responses_received")
            },
            "behavioral_profile": {
                "overall_score": scores.get("overall_score", 0),
                "overall_interpretation": scores.get("overall_interpretation", ""),
                "trait_breakdown": scores.get("trait_scores", {})
            },
            "strengths": self._identify_strengths(scores.get("trait_scores", {})),
            "development_areas": self._identify_development_areas(scores.get("trait_scores", {})),
            "recommendations": self._generate_recommendations(scores.get("trait_scores", {})),
            "investment_implications": self._generate_investment_implications(scores.get("overall_score", 0)),
            "generated_at": datetime.now().isoformat()
        }
        
        state.results["final_report"] = report
        logger.info(f"Generated behavioral assessment report with overall score: {scores.get('overall_score', 0):.1f}")
        
        return state
    
    def _identify_strengths(self, trait_scores: Dict[str, Any]) -> List[str]:
        """Identify behavioral strengths"""
        strengths = []
        for trait, data in trait_scores.items():
            if data.get("score", 0) >= 80:
                strengths.append(f"Strong {trait.replace('_', ' ')}: {data.get('description', '')}")
        return strengths
    
    def _identify_development_areas(self, trait_scores: Dict[str, Any]) -> List[str]:
        """Identify areas for development"""
        development_areas = []
        for trait, data in trait_scores.items():
            if data.get("score", 0) < 70:
                development_areas.append(f"Improve {trait.replace('_', ' ')}: {data.get('description', '')}")
        return development_areas
    
    def _generate_recommendations(self, trait_scores: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on scores"""
        recommendations = []
        
        for trait, data in trait_scores.items():
            score = data.get("score", 0)
            if score < 60:
                recommendations.append(f"Consider leadership coaching to improve {trait.replace('_', ' ')}")
            elif score < 80:
                recommendations.append(f"Provide mentorship opportunities to enhance {trait.replace('_', ' ')}")
        
        return recommendations
    
    def _generate_investment_implications(self, overall_score: float) -> List[str]:
        """Generate investment implications based on overall score"""
        implications = []
        
        if overall_score >= 85:
            implications.append("Strong behavioral profile suggests high leadership potential")
            implications.append("Low risk from behavioral perspective")
        elif overall_score >= 70:
            implications.append("Good behavioral profile with some areas for development")
            implications.append("Moderate risk - monitor leadership development")
        else:
            implications.append("Behavioral profile indicates potential leadership challenges")
            implications.append("High risk - requires significant support and development")
        
        return implications
