package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Visualization Service
 * 
 * Service for generating charts, graphs, and visual summaries.
 * Creates data visualizations for investment memos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VisualizationService {
    
    private final AIService aiService;
    
    /**
     * Generate chart data
     */
    public String generateChartData(String data, String chartType) {
        log.debug("Generating chart data for type: {}", chartType);
        
        try {
            String prompt = String.format("""
                Generate chart data for the following data using %s chart type:
                
                %s
                
                Please provide:
                1. Chart configuration (type, colors, labels)
                2. Data points and values
                3. Axis labels and scales
                4. Chart title and description
                5. Legend information
                6. Data source attribution
                7. Chart dimensions and styling
                
                Format as structured chart configuration data.
                """, chartType, data);
            
            String chartData = aiService.generateText(prompt);
            log.debug("Chart data generated successfully for type: {}", chartType);
            return chartData;
            
        } catch (Exception e) {
            log.error("Error generating chart data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate chart data: " + e.getMessage());
        }
    }
    
    /**
     * Generate dashboard data
     */
    public String generateDashboardData(String data) {
        log.info("Generating dashboard data");
        
        try {
            String prompt = String.format("""
                Generate dashboard data for the following information:
                
                %s
                
                Please create:
                1. Key metrics cards
                2. Growth charts
                3. Performance indicators
                4. Risk assessment visualizations
                5. Market analysis charts
                6. Financial summary charts
                7. Competitive positioning matrix
                8. Timeline visualizations
                
                Format as a comprehensive dashboard configuration.
                """, data);
            
            String dashboardData = aiService.generateText(prompt);
            log.info("Dashboard data generated successfully");
            return dashboardData;
            
        } catch (Exception e) {
            log.error("Error generating dashboard data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate dashboard data: " + e.getMessage());
        }
    }
    
    /**
     * Generate risk matrix
     */
    public String generateRiskMatrix(String riskData) {
        log.debug("Generating risk matrix");
        
        try {
            String prompt = String.format("""
                Generate a risk matrix for the following risk data:
                
                %s
                
                Please create:
                1. Risk probability vs impact matrix
                2. Risk categories and classifications
                3. Risk mitigation strategies visualization
                4. Risk monitoring dashboard
                5. Risk trend analysis
                6. Risk heat map
                7. Risk score calculations
                8. Risk priority rankings
                
                Format as a structured risk matrix configuration.
                """, riskData);
            
            String riskMatrix = aiService.generateText(prompt);
            log.debug("Risk matrix generated successfully");
            return riskMatrix;
            
        } catch (Exception e) {
            log.error("Error generating risk matrix: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate risk matrix: " + e.getMessage());
        }
    }
}
