package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Founder Voice Agent Service
 * 
 * Service for conducting structured interviews with founders.
 * Handles call initiation, Q&A processing, and sentiment analysis.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FounderVoiceAgentService {
    
    private final TwilioService twilioService;
    private final AIService aiService;
    
    /**
     * Execute founder voice interview
     */
    public String execute(Map<String, Object> input) {
        log.info("Executing founder voice interview with input: {}", input);
        
        try {
            // Extract contact information
            String phoneNumber = (String) input.get("phoneNumber");
            String founderName = (String) input.get("founderName");
            String companyName = (String) input.get("companyName");
            
            if (phoneNumber == null || founderName == null || companyName == null) {
                throw new RuntimeException("Missing required input: phoneNumber, founderName, companyName");
            }
            
            // Initiate call
            String callSid = twilioService.initiateCall(phoneNumber, founderName, companyName);
            log.info("Call initiated with SID: {}", callSid);
            
            // Generate interview questions
            String questions = generateInterviewQuestions(companyName, founderName);
            log.info("Generated {} questions for interview", questions.split("\n").length);
            
            // Process call results (this would be handled by webhook in real implementation)
            String callResults = processCallResults(callSid, questions);
            
            // Analyze sentiment and extract insights
            String analysis = analyzeCallResults(callResults);
            
            log.info("Founder voice interview completed successfully");
            return analysis;
            
        } catch (Exception e) {
            log.error("Error executing founder voice interview: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to execute founder voice interview: " + e.getMessage());
        }
    }
    
    /**
     * Generate interview questions
     */
    private String generateInterviewQuestions(String companyName, String founderName) {
        log.debug("Generating interview questions for company: {} and founder: {}", companyName, founderName);
        
        String prompt = String.format("""
            Generate 15 structured interview questions for a founder voice interview with %s, founder of %s.
            Focus on:
            1. Founder-market fit
            2. Problem validation
            3. Business model
            4. Growth strategy
            5. Team dynamics
            6. Market opportunity
            7. Competitive advantage
            8. Financial projections
            9. Risk assessment
            10. Investment thesis
            
            Format as a numbered list of questions.
            """, founderName, companyName);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Process call results
     */
    private String processCallResults(String callSid, String questions) {
        log.debug("Processing call results for SID: {}", callSid);
        
        // In a real implementation, this would:
        // 1. Wait for call completion
        // 2. Retrieve call recording
        // 3. Transcribe audio
        // 4. Extract Q&A pairs
        
        // For now, simulate processing
        return "Simulated call results with Q&A pairs extracted from transcription";
    }
    
    /**
     * Analyze call results
     */
    private String analyzeCallResults(String callResults) {
        log.debug("Analyzing call results");
        
        String prompt = String.format("""
            Analyze the following founder voice interview results and provide insights:
            
            %s
            
            Please provide:
            1. Key insights about the founder
            2. Sentiment analysis
            3. Confidence scores for each topic
            4. Red flags or concerns
            5. Recommendations for further investigation
            
            Format as a structured analysis report.
            """, callResults);
        
        return aiService.generateText(prompt);
    }
}
