package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Behavioral Assessment Agent Service
 * 
 * Service for sending and processing psychometric surveys.
 * Handles survey generation, delivery, and analysis.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BehavioralAssessmentAgentService {
    
    private final EmailService emailService;
    private final SMSService smsService;
    private final AIService aiService;
    
    /**
     * Execute behavioral assessment
     */
    public String execute(Map<String, Object> input) {
        log.info("Executing behavioral assessment with input: {}", input);
        
        try {
            // Extract contact information
            String email = (String) input.get("email");
            String phoneNumber = (String) input.get("phoneNumber");
            String founderName = (String) input.get("founderName");
            String companyName = (String) input.get("companyName");
            String surveyType = (String) input.getOrDefault("surveyType", "big-five");
            
            if (email == null && phoneNumber == null) {
                throw new RuntimeException("Missing required input: email or phoneNumber");
            }
            
            // Generate survey
            String survey = generateSurvey(surveyType, companyName, founderName);
            log.info("Generated {} survey for {}", surveyType, founderName);
            
            // Create secure survey link
            String surveyLink = createSecureSurveyLink(survey, founderName, companyName);
            log.info("Created secure survey link: {}", surveyLink);
            
            // Send survey
            if (email != null) {
                sendSurveyByEmail(email, founderName, companyName, surveyLink);
            }
            if (phoneNumber != null) {
                sendSurveyBySMS(phoneNumber, founderName, companyName, surveyLink);
            }
            
            // Process survey results (this would be handled by webhook in real implementation)
            String results = processSurveyResults(surveyLink);
            
            // Analyze results
            String analysis = analyzeSurveyResults(results, surveyType);
            
            log.info("Behavioral assessment completed successfully");
            return analysis;
            
        } catch (Exception e) {
            log.error("Error executing behavioral assessment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to execute behavioral assessment: " + e.getMessage());
        }
    }
    
    /**
     * Generate survey questions
     */
    private String generateSurvey(String surveyType, String companyName, String founderName) {
        log.debug("Generating {} survey for company: {} and founder: {}", surveyType, companyName, founderName);
        
        String prompt = String.format("""
            Generate a %s psychometric survey for %s, founder of %s.
            
            The survey should include:
            1. 20-30 questions covering all dimensions
            2. Multiple choice and Likert scale questions
            3. Situational judgment scenarios
            4. Questions about leadership style
            5. Questions about decision-making approach
            6. Questions about risk tolerance
            7. Questions about communication style
            8. Questions about team dynamics
            
            Format as a structured survey with clear instructions.
            """, surveyType, founderName, companyName);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Create secure survey link
     */
    private String createSecureSurveyLink(String survey, String founderName, String companyName) {
        log.debug("Creating secure survey link for founder: {}", founderName);
        
        // In a real implementation, this would:
        // 1. Generate a secure token
        // 2. Store survey in database
        // 3. Create a secure URL with token
        
        return "https://ai-analyst.com/survey/" + java.util.UUID.randomUUID().toString();
    }
    
    /**
     * Send survey by email
     */
    private void sendSurveyByEmail(String email, String founderName, String companyName, String surveyLink) {
        log.info("Sending survey by email to: {}", email);
        
        String subject = "Behavioral Assessment - " + companyName;
        String body = String.format("""
            Dear %s,
            
            As part of our investment evaluation process for %s, we would like you to complete a brief behavioral assessment.
            
            This survey will help us understand your leadership style, decision-making approach, and team dynamics.
            
            Please complete the survey at your earliest convenience: %s
            
            The survey takes approximately 15-20 minutes to complete.
            
            Thank you for your time and cooperation.
            
            Best regards,
            AI Analyst Team
            """, founderName, companyName, surveyLink);
        
        emailService.sendEmail(email, subject, body);
    }
    
    /**
     * Send survey by SMS
     */
    private void sendSurveyBySMS(String phoneNumber, String founderName, String companyName, String surveyLink) {
        log.info("Sending survey by SMS to: {}", phoneNumber);
        
        String message = String.format("""
            Hi %s,
            
            Please complete the behavioral assessment for %s: %s
            
            Takes 15-20 minutes. Thank you!
            
            - AI Analyst Team
            """, founderName, companyName, surveyLink);
        
        smsService.sendSMS(phoneNumber, message);
    }
    
    /**
     * Process survey results
     */
    private String processSurveyResults(String surveyLink) {
        log.debug("Processing survey results from link: {}", surveyLink);
        
        // In a real implementation, this would:
        // 1. Retrieve survey responses from database
        // 2. Validate responses
        // 3. Calculate scores
        
        return "Simulated survey results with scores and responses";
    }
    
    /**
     * Analyze survey results
     */
    private String analyzeSurveyResults(String results, String surveyType) {
        log.debug("Analyzing survey results for type: {}", surveyType);
        
        String prompt = String.format("""
            Analyze the following %s behavioral assessment results and provide insights:
            
            %s
            
            Please provide:
            1. Personality profile summary
            2. Leadership style analysis
            3. Decision-making approach
            4. Risk tolerance assessment
            5. Communication style
            6. Team dynamics insights
            7. Potential red flags
            8. Recommendations for team building
            9. Confidence scores for each dimension
            
            Format as a structured analysis report.
            """, surveyType, results);
        
        return aiService.generateText(prompt);
    }
}
