package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Data Enrichment Service
 * 
 * Service for enriching research data with AI analysis.
 * Combines multiple data sources and provides enhanced insights.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DataEnrichmentService {
    
    private final AIService aiService;
    
    /**
     * Enrich research data
     */
    public String enrichResearchData(String marketData, String competitorData, 
                                   String industryData, String financialData) {
        log.info("Enriching research data with AI analysis");
        
        try {
            String prompt = String.format("""
                Enrich and analyze the following research data to provide comprehensive insights:
                
                Market Data:
                %s
                
                Competitor Data:
                %s
                
                Industry Data:
                %s
                
                Financial Data:
                %s
                
                Please provide:
                1. Cross-referenced insights across all data sources
                2. Data validation and consistency checks
                3. Enhanced market analysis with AI insights
                4. Competitive positioning analysis
                5. Industry trend analysis with predictions
                6. Financial performance benchmarking
                7. Risk assessment based on all data
                8. Key opportunities and threats
                9. Confidence scores for each insight
                10. Recommendations for further research
                
                Format as a comprehensive enriched analysis report.
                """, marketData, competitorData, industryData, financialData);
            
            String enrichedData = aiService.generateText(prompt);
            log.info("Research data enriched successfully");
            return enrichedData;
            
        } catch (Exception e) {
            log.error("Error enriching research data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to enrich research data: " + e.getMessage());
        }
    }
    
    /**
     * Validate data consistency
     */
    public String validateDataConsistency(String data1, String data2, String context) {
        log.debug("Validating data consistency between two data sources");
        
        String prompt = String.format("""
            Validate the consistency between the following data sources:
            
            Context: %s
            
            Data Source 1:
            %s
            
            Data Source 2:
            %s
            
            Please provide:
            1. Consistency analysis
            2. Conflicting information identification
            3. Data quality assessment
            4. Confidence scores for each data point
            5. Recommendations for data reconciliation
            6. Trustworthiness assessment
            
            Format as a structured validation report.
            """, context, data1, data2);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate data insights
     */
    public String generateDataInsights(String data, String analysisType) {
        log.debug("Generating data insights for analysis type: {}", analysisType);
        
        String prompt = String.format("""
            Generate insights from the following data for %s analysis:
            
            %s
            
            Please provide:
            1. Key findings and patterns
            2. Statistical analysis
            3. Trend identification
            4. Anomaly detection
            5. Predictive insights
            6. Actionable recommendations
            7. Confidence levels for each insight
            8. Data limitations and caveats
            
            Format as a structured insights report.
            """, analysisType, data);
        
        return aiService.generateText(prompt);
    }
}
