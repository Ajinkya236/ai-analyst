"""
Founder Voice Agent - Conducts AI-powered voice interviews with founders
"""
import asyncio
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
import re

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage

from base_agent import BaseAIAgent, AgentState
from config import Config

logger = logging.getLogger(__name__)

class FounderVoiceAgent(BaseAIAgent):
    """Agent for conducting AI-powered voice interviews with founders"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(
            name="Founder Voice Agent",
            description="Conducts structured voice interviews with startup founders",
            config=config
        )
        
        # Interview questions structure
        self.question_categories = {
            "founder_background": [
                "Could you tell me about yourself and your professional journey so far?",
                "What inspired you to become a founder?",
                "What previous experience do you have in this industry?"
            ],
            "startup_vision": [
                "What problem is your startup solving?",
                "Why do you believe your solution is unique?",
                "What is your long-term vision for the company?"
            ],
            "market_product": [
                "Who are your target customers?",
                "How are they currently solving this problem today?",
                "What makes your product better than existing solutions?"
            ],
            "traction_metrics": [
                "Can you share your current traction (customers, revenue, or adoption numbers)?",
                "What key milestones have you achieved in the past 12 months?",
                "What are your most important KPIs?"
            ],
            "team_culture": [
                "Tell me about your founding team and their strengths.",
                "What kind of culture are you trying to build in your company?",
                "How do you handle disagreements within the team?"
            ],
            "future_outlook": [
                "What are your biggest challenges right now?",
                "Where do you see your startup in the next 3–5 years?",
                "What would you do with additional funding?"
            ]
        }
    
    def _build_graph(self):
        """Build the LangGraph workflow for founder voice interview"""
        from langgraph.graph import StateGraph, END
        
        workflow = StateGraph(AgentState)
        
        # Define nodes
        workflow.add_node("initiate_call", self._initiate_call)
        workflow.add_node("verify_identity", self._verify_identity)
        workflow.add_node("conduct_interview", self._conduct_interview)
        workflow.add_node("analyze_responses", self._analyze_responses)
        workflow.add_node("generate_report", self._generate_report)
        
        # Define edges
        workflow.set_entry_point("initiate_call")
        workflow.add_edge("initiate_call", "verify_identity")
        workflow.add_edge("verify_identity", "conduct_interview")
        workflow.add_edge("conduct_interview", "analyze_responses")
        workflow.add_edge("analyze_responses", "generate_report")
        workflow.add_edge("generate_report", END)
        
        return workflow.compile()
    
    async def _execute(self, state: AgentState) -> AgentState:
        """Execute the founder voice interview process"""
        try:
            self._update_progress(state, 10, "Starting founder voice interview")
            
            # Run the workflow
            result = await self.graph.ainvoke(state)
            
            self._update_progress(result, 100, "Founder voice interview completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Founder voice interview failed: {e}")
            return self._create_error_state(state, str(e))
    
    async def _initiate_call(self, state: AgentState) -> AgentState:
        """Initiate the voice call with the founder"""
        self._update_progress(state, 20, "Initiating voice call")
        
        founder_data = state.metadata.get("founder", {})
        phone_number = founder_data.get("phone_number")
        
        if not phone_number:
            return self._create_error_state(state, "No phone number provided for founder")
        
        # Simulate call initiation
        call_result = await self._make_voice_call(phone_number)
        
        if not call_result["success"]:
            return self._create_error_state(state, f"Failed to initiate call: {call_result['error']}")
        
        state.results["call_session"] = {
            "phone_number": phone_number,
            "call_id": call_result["call_id"],
            "status": "connected",
            "started_at": datetime.now().isoformat()
        }
        
        self._update_progress(state, 30, "Voice call connected successfully")
        return state
    
    async def _make_voice_call(self, phone_number: str) -> Dict[str, Any]:
        """Make actual voice call using Twilio or similar service"""
        # This would integrate with Twilio or similar voice service
        # For now, simulate the call
        
        try:
            # Simulate call initiation
            await asyncio.sleep(2)  # Simulate call setup time
            
            # In real implementation, this would use Twilio:
            # from twilio.rest import Client
            # client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)
            # call = client.calls.create(
            #     to=phone_number,
            #     from_=Config.TWILIO_PHONE_NUMBER,
            #     url='https://your-webhook-url.com/voice'
            # )
            
            return {
                "success": True,
                "call_id": f"call_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "status": "connected"
            }
            
        except Exception as e:
            logger.error(f"Failed to make voice call: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _verify_identity(self, state: AgentState) -> AgentState:
        """Verify founder's identity"""
        self._update_progress(state, 40, "Verifying founder identity")
        
        founder_data = state.metadata.get("founder", {})
        expected_name = founder_data.get("name", "")
        expected_role = founder_data.get("role", "Founder")
        
        # Simulate identity verification process
        verification_prompt = f"""
        Hello! I'm an AI assistant conducting an investor evaluation interview. 
        Is this a good time to answer a few questions about you and your startup?
        
        If yes, please confirm your full name and role in the company.
        """
        
        # In real implementation, this would be handled through voice interaction
        # For now, simulate the verification
        verification_result = await self._simulate_voice_interaction(
            verification_prompt,
            expected_response=f"My name is {expected_name} and I'm the {expected_role}"
        )
        
        if not verification_result["verified"]:
            state.results["verification"] = {
                "status": "failed",
                "reason": "Identity verification failed",
                "details": verification_result["details"]
            }
            return self._create_error_state(state, "Identity verification failed")
        
        state.results["verification"] = {
            "status": "verified",
            "verified_name": verification_result["verified_name"],
            "verified_role": verification_result["verified_role"],
            "verified_at": datetime.now().isoformat()
        }
        
        self._update_progress(state, 50, "Identity verification successful")
        return state
    
    async def _simulate_voice_interaction(self, prompt: str, expected_response: str = None) -> Dict[str, Any]:
        """Simulate voice interaction (in real implementation, this would handle actual voice)"""
        # This would integrate with speech-to-text and text-to-speech services
        # For now, simulate the interaction
        
        await asyncio.sleep(1)  # Simulate processing time
        
        if expected_response:
            # Simulate successful verification
            return {
                "verified": True,
                "verified_name": "John Doe",  # Would be extracted from actual response
                "verified_role": "Founder",
                "transcript": expected_response,
                "confidence": 0.95
            }
        else:
            # Simulate general interaction
            return {
                "verified": True,
                "transcript": "Yes, I'm ready to answer questions",
                "confidence": 0.9
            }
    
    async def _conduct_interview(self, state: AgentState) -> AgentState:
        """Conduct the structured interview"""
        self._update_progress(state, 60, "Conducting structured interview")
        
        interview_responses = []
        current_question_index = 0
        total_questions = sum(len(questions) for questions in self.question_categories.values())
        
        for category, questions in self.question_categories.items():
            for question in questions:
                try:
                    # Ask question
                    response = await self._ask_question(question, category)
                    
                    # Analyze response
                    analysis = await self._analyze_response(question, response, category)
                    
                    interview_responses.append({
                        "category": category,
                        "question": question,
                        "response": response["transcript"],
                        "analysis": analysis,
                        "sentiment": response["sentiment"],
                        "confidence": response["confidence"],
                        "timestamp": datetime.now().isoformat()
                    })
                    
                    current_question_index += 1
                    progress = 60 + (current_question_index / total_questions) * 20
                    self._update_progress(state, int(progress), f"Interview progress: {current_question_index}/{total_questions}")
                    
                    # Add delay between questions
                    await asyncio.sleep(0.5)
                    
                except Exception as e:
                    logger.error(f"Failed to process question: {e}")
                    continue
        
        state.results["interview_responses"] = interview_responses
        self._update_progress(state, 80, f"Interview completed with {len(interview_responses)} responses")
        return state
    
    async def _ask_question(self, question: str, category: str) -> Dict[str, Any]:
        """Ask a question and get response"""
        # Simulate asking question and getting response
        await asyncio.sleep(1)  # Simulate question delivery
        
        # Simulate response (in real implementation, this would be actual voice response)
        mock_responses = {
            "founder_background": "I have 10 years of experience in tech, previously worked at Google and Microsoft. I founded this company because I saw a gap in the market for AI-powered solutions.",
            "startup_vision": "We're solving the problem of data silos in enterprise companies. Our solution provides a unified platform that connects all data sources and provides real-time insights.",
            "market_product": "Our target customers are mid to large enterprise companies with complex data environments. They currently use multiple tools that don't communicate well with each other.",
            "traction_metrics": "We have 50 enterprise customers with $2M ARR. Our key metrics are customer acquisition cost of $5K and lifetime value of $50K.",
            "team_culture": "Our founding team includes a CTO with 15 years of experience and a VP of Sales who previously scaled a startup to $100M. We focus on transparency and data-driven decision making.",
            "future_outlook": "Our biggest challenge is scaling our sales team. With additional funding, we'd invest in sales and marketing to reach $10M ARR within 18 months."
        }
        
        response_text = mock_responses.get(category, "This is a mock response for demonstration purposes.")
        
        return {
            "transcript": response_text,
            "sentiment": "positive",  # Would be determined by sentiment analysis
            "confidence": 0.9,
            "duration": 30  # seconds
        }
    
    async def _analyze_response(self, question: str, response: Dict[str, Any], category: str) -> Dict[str, Any]:
        """Analyze the founder's response"""
        analysis_prompt = ChatPromptTemplate.from_template("""
        Analyze the following founder response to an investor interview question:
        
        Question: {question}
        Response: {response}
        Category: {category}
        
        Provide analysis including:
        1. Key insights extracted
        2. Red flags or concerns
        3. Strengths demonstrated
        4. Areas for follow-up
        5. Overall assessment score (1-10)
        
        Format as JSON.
        """)
        
        try:
            analysis = await self.llm.ainvoke(
                analysis_prompt.format_messages(
                    question=question,
                    response=response["transcript"],
                    category=category
                )
            )
            
            return json.loads(analysis.content)
            
        except Exception as e:
            logger.error(f"Failed to analyze response: {e}")
            return {
                "insights": ["Response received"],
                "red_flags": [],
                "strengths": ["Clear communication"],
                "follow_up": [],
                "score": 7
            }
    
    async def _analyze_responses(self, state: AgentState) -> AgentState:
        """Analyze all interview responses for patterns and insights"""
        self._update_progress(state, 85, "Analyzing interview responses")
        
        interview_responses = state.results.get("interview_responses", [])
        
        # Generate overall analysis
        overall_analysis = await self._generate_overall_analysis(interview_responses)
        
        # Generate founder profile
        founder_profile = await self._generate_founder_profile(interview_responses)
        
        # Generate risk assessment
        risk_assessment = await self._generate_risk_assessment(interview_responses)
        
        state.results["analysis"] = {
            "overall": overall_analysis,
            "founder_profile": founder_profile,
            "risk_assessment": risk_assessment,
            "total_responses": len(interview_responses),
            "average_confidence": sum(r["confidence"] for r in interview_responses) / len(interview_responses) if interview_responses else 0
        }
        
        self._update_progress(state, 90, "Response analysis completed")
        return state
    
    async def _generate_overall_analysis(self, responses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate overall analysis of all responses"""
        analysis_prompt = ChatPromptTemplate.from_template("""
        Analyze the following set of founder interview responses and provide an overall assessment:
        
        Responses: {responses}
        
        Provide:
        1. Overall impression of the founder
        2. Key strengths demonstrated
        3. Areas of concern
        4. Investment readiness assessment
        5. Recommended next steps
        
        Format as JSON.
        """)
        
        try:
            responses_text = json.dumps([{
                "category": r["category"],
                "question": r["question"],
                "response": r["response"],
                "analysis": r["analysis"]
            } for r in responses], indent=2)
            
            analysis = await self.llm.ainvoke(
                analysis_prompt.format_messages(responses=responses_text)
            )
            
            return json.loads(analysis.content)
            
        except Exception as e:
            logger.error(f"Failed to generate overall analysis: {e}")
            return {
                "impression": "Professional and articulate",
                "strengths": ["Clear vision", "Strong background"],
                "concerns": ["Limited market validation"],
                "readiness": "Moderate",
                "next_steps": ["Request additional metrics", "Conduct reference checks"]
            }
    
    async def _generate_founder_profile(self, responses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate founder personality and leadership profile"""
        return {
            "leadership_style": "Data-driven",
            "risk_tolerance": "Moderate",
            "communication_style": "Direct and clear",
            "vision_clarity": "High",
            "execution_focus": "Strong",
            "team_building": "Good",
            "market_understanding": "Deep"
        }
    
    async def _generate_risk_assessment(self, responses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate risk assessment based on responses"""
        return {
            "execution_risk": "Low",
            "market_risk": "Medium",
            "team_risk": "Low",
            "technology_risk": "Medium",
            "overall_risk": "Medium",
            "mitigation_strategies": [
                "Regular milestone reviews",
                "Market validation studies",
                "Technical due diligence"
            ]
        }
    
    async def _generate_report(self, state: AgentState) -> AgentState:
        """Generate final founder voice report"""
        self._update_progress(state, 100, "Generating founder voice report")
        
        call_session = state.results.get("call_session", {})
        verification = state.results.get("verification", {})
        interview_responses = state.results.get("interview_responses", [])
        analysis = state.results.get("analysis", {})
        
        # Generate comprehensive report
        report = {
            "call_details": {
                "call_id": call_session.get("call_id"),
                "phone_number": call_session.get("phone_number"),
                "duration": "45 minutes",  # Would be calculated from actual call
                "started_at": call_session.get("started_at"),
                "status": "completed"
            },
            "verification": verification,
            "interview_summary": {
                "total_questions": len(interview_responses),
                "categories_covered": list(set(r["category"] for r in interview_responses)),
                "average_confidence": analysis.get("average_confidence", 0),
                "sentiment_distribution": self._calculate_sentiment_distribution(interview_responses)
            },
            "responses": interview_responses,
            "analysis": analysis,
            "recommendations": self._generate_recommendations(analysis),
            "generated_at": datetime.now().isoformat()
        }
        
        state.results["final_report"] = report
        logger.info(f"Generated founder voice report with {len(interview_responses)} responses")
        
        return state
    
    def _calculate_sentiment_distribution(self, responses: List[Dict[str, Any]]) -> Dict[str, int]:
        """Calculate sentiment distribution across responses"""
        sentiments = [r["sentiment"] for r in responses]
        return {
            "positive": sentiments.count("positive"),
            "neutral": sentiments.count("neutral"),
            "negative": sentiments.count("negative")
        }
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        if analysis.get("overall", {}).get("readiness") == "Low":
            recommendations.append("Conduct additional due diligence before investment decision")
        
        if "Limited market validation" in analysis.get("overall", {}).get("concerns", []):
            recommendations.append("Request customer references and case studies")
        
        if analysis.get("risk_assessment", {}).get("overall_risk") == "High":
            recommendations.append("Consider staged investment with milestone-based releases")
        
        return recommendations
