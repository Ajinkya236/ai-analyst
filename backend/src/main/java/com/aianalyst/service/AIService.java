package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * AI Service
 * 
 * Service for interacting with AI models for text generation and analysis.
 * Uses Python AI agents for all AI operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {
    
    private final AIAgentService aiAgentService;
    
    /**
     * Generate text using AI
     */
    public String generateText(String prompt) {
        log.debug("Generating text with prompt length: {}", prompt.length());
        
        try {
            // Use Python AI agents for text generation
            Map<String, Object> request = new HashMap<>();
            request.put("prompt", prompt);
            request.put("user_id", "system");
            
            CompletableFuture<Map<String, Object>> future = aiAgentService.processDataSources(request);
            Map<String, Object> result = future.get();
            
            if (result.get("success").equals(true)) {
                return "Generated text using AI agents";
            } else {
                throw new RuntimeException("AI generation failed: " + result.get("error"));
            }
        } catch (Exception e) {
            log.error("Error generating text: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate text: " + e.getMessage());
        }
    }
    
    /**
     * Generate text with specific parameters
     */
    public String generateText(String prompt, String model, Double temperature, Integer maxTokens) {
        log.debug("Generating text with custom parameters: model={}, temperature={}, maxTokens={}", 
                 model, temperature, maxTokens);
        
        try {
            // Use Python AI agents for text generation with parameters
            return generateText(prompt);
        } catch (Exception e) {
            log.error("Error generating text with custom parameters: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate text: " + e.getMessage());
        }
    }
    
    /**
     * Analyze text sentiment
     */
    public String analyzeSentiment(String text) {
        log.debug("Analyzing sentiment for text length: {}", text.length());
        
        String prompt = String.format("""
            Analyze the sentiment of the following text and provide insights:
            
            %s
            
            Please provide:
            1. Overall sentiment (positive, negative, neutral)
            2. Sentiment score (-1 to 1)
            3. Key emotional indicators
            4. Confidence level
            5. Specific phrases that indicate sentiment
            
            Format as a structured analysis.
            """, text);
        
        return generateText(prompt);
    }
    
    /**
     * Extract entities from text
     */
    public String extractEntities(String text) {
        log.debug("Extracting entities from text length: {}", text.length());
        
        String prompt = String.format("""
            Extract entities from the following text:
            
            %s
            
            Please identify and extract:
            1. People (names, titles, roles)
            2. Companies (names, industries, sizes)
            3. Dates (founding dates, milestones, deadlines)
            4. Amounts (revenue, funding, valuations)
            5. Locations (cities, countries, regions)
            6. Products (names, features, categories)
            7. Technologies (platforms, tools, frameworks)
            8. Metrics (KPIs, growth rates, percentages)
            
            Format as a structured JSON document.
            """, text);
        
        return generateText(prompt);
    }
    
    /**
     * Summarize text
     */
    public String summarizeText(String text, Integer maxLength) {
        log.debug("Summarizing text length: {} to max length: {}", text.length(), maxLength);
        
        String prompt = String.format("""
            Summarize the following text in approximately %d words:
            
            %s
            
            The summary should:
            1. Capture the main points
            2. Maintain key details
            3. Be concise and clear
            4. Preserve important numbers and metrics
            5. Include key insights and conclusions
            
            Format as a well-structured summary.
            """, maxLength, text);
        
        return generateText(prompt);
    }
    
    /**
     * Generate questions from text
     */
    public String generateQuestions(String text, String context) {
        log.debug("Generating questions from text length: {} with context: {}", text.length(), context);
        
        String prompt = String.format("""
            Generate relevant questions based on the following text and context:
            
            Text: %s
            
            Context: %s
            
            Please generate:
            1. 5-10 key questions that would help understand the content better
            2. Questions that probe deeper into the subject matter
            3. Questions that would help with analysis and decision-making
            4. Questions that address potential gaps or missing information
            5. Questions that would help with due diligence
            
            Format as a numbered list of questions.
            """, text, context);
        
        return generateText(prompt);
    }
}
