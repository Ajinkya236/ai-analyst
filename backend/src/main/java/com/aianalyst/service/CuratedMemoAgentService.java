package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Curated Memo Agent Service
 * 
 * Service for generating final curated investment memos.
 * Creates comprehensive memos with customizable preferences and visual summaries.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CuratedMemoAgentService {
    
    private final AIService aiService;
    private final DataSourceService dataSourceService;
    private final InvestmentMemoService investmentMemoService;
    private final VisualizationService visualizationService;
    
    /**
     * Execute curated memo generation
     */
    public String execute(Map<String, Object> input) {
        log.info("Executing curated memo generation with input: {}", input);
        
        try {
            // Extract memo parameters
            String stage1MemoId = (String) input.get("stage1MemoId");
            String companyName = (String) input.get("companyName");
            Map<String, Object> preferences = (Map<String, Object>) input.get("preferences");
            
            if (stage1MemoId == null && companyName == null) {
                throw new RuntimeException("Missing required input: stage1MemoId or companyName");
            }
            
            // Get source data
            String sourceData = getSourceData(stage1MemoId, companyName);
            
            // Generate curated memo sections
            String founderProfile = generateFounderProfile(sourceData, preferences);
            String problemSizing = generateProblemSizing(sourceData, preferences);
            String differentiation = generateDifferentiation(sourceData, preferences);
            String companyReview = generateCompanyReview(sourceData, preferences);
            
            // Generate visual summaries
            String visualSummaries = generateVisualSummaries(sourceData);
            
            // Generate risk analysis
            String riskAnalysis = generateRiskAnalysis(sourceData);
            
            // Combine into final memo
            String curatedMemo = combineIntoCurtatedMemo(founderProfile, problemSizing, 
                    differentiation, companyReview, visualSummaries, riskAnalysis);
            
            log.info("Curated memo generation completed successfully");
            return curatedMemo;
            
        } catch (Exception e) {
            log.error("Error executing curated memo generation: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to execute curated memo generation: " + e.getMessage());
        }
    }
    
    /**
     * Get source data
     */
    private String getSourceData(String stage1MemoId, String companyName) {
        log.debug("Getting source data for stage1MemoId: {} or companyName: {}", stage1MemoId, companyName);
        
        // In a real implementation, this would:
        // 1. Retrieve Stage 1 memo if available
        // 2. Get all data sources for the company
        // 3. Combine and structure the data
        
        return "Simulated source data from Stage 1 memo and data sources";
    }
    
    /**
     * Generate founder profile section
     */
    private String generateFounderProfile(String sourceData, Map<String, Object> preferences) {
        log.debug("Generating founder profile section");
        
        String prompt = String.format("""
            Generate a comprehensive founder profile section based on the following data:
            
            %s
            
            Preferences: %s
            
            The founder profile should include:
            1. Founder-Market Fit Analysis
            2. Behavioral Analysis Summary
            3. Work Profile & Achievements
            4. Founder Commitment Assessment
            5. Leadership Style Analysis
            6. Decision-Making Approach
            7. Risk Tolerance Assessment
            8. Communication Style
            9. Team Building Capabilities
            10. Industry Experience
            11. Previous Ventures
            12. Educational Background
            13. Key Strengths and Weaknesses
            14. Confidence Scores for each aspect
            
            Format as a structured section with clear subsections and actionable insights.
            """, sourceData, preferences);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate problem sizing section
     */
    private String generateProblemSizing(String sourceData, Map<String, Object> preferences) {
        log.debug("Generating problem sizing section");
        
        String prompt = String.format("""
            Generate a comprehensive problem sizing section based on the following data:
            
            %s
            
            Preferences: %s
            
            The problem sizing section should include:
            1. Problem Validation Analysis
            2. Market Sizing (TAM, SAM, SOM)
            3. Competitive Landscape Overview
            4. Market Growth Projections
            5. Customer Segment Analysis
            6. Market Timing Assessment
            7. Regulatory Environment
            8. Technology Adoption Trends
            9. Market Entry Barriers
            10. Competitive Advantages
            11. Market Share Potential
            12. Revenue Opportunity Sizing
            13. Confidence Scores for each metric
            
            Format as a structured section with data visualizations and market insights.
            """, sourceData, preferences);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate differentiation section
     */
    private String generateDifferentiation(String sourceData, Map<String, Object> preferences) {
        log.debug("Generating differentiation section");
        
        String prompt = String.format("""
            Generate a comprehensive differentiation section based on the following data:
            
            %s
            
            Preferences: %s
            
            The differentiation section should include:
            1. Positioning & Pricing Strategy
            2. Benefits & Product Differentiation
            3. Moat Analysis (Sustainable Competitive Advantages)
            4. Delivery Channels & Distribution
            5. Design Differentiation
            6. User Perception & Branding
            7. Technology Differentiation
            8. Business Model Innovation
            9. Customer Experience Differentiation
            10. Operational Excellence
            11. Intellectual Property Analysis
            12. Network Effects
            13. Switching Costs
            14. Confidence Scores for each differentiator
            
            Format as a structured section with competitive analysis and differentiation matrix.
            """, sourceData, preferences);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate company review section
     */
    private String generateCompanyReview(String sourceData, Map<String, Object> preferences) {
        log.debug("Generating company review section");
        
        String prompt = String.format("""
            Generate a comprehensive company review section based on the following data:
            
            %s
            
            Preferences: %s
            
            The company review section should include:
            1. Financial KPIs & Metrics
            2. User & Engagement KPIs
            3. Unit Economics / Retention Analysis
            4. Operating Health Assessment
            5. Sales & Funnel Analysis
            6. Risk Assessment
            7. Investment Thesis & Visual Summaries
            8. Red Flag Analysis
            9. Growth Trajectory Analysis
            10. Operational Efficiency
            11. Team Performance
            12. Product Development Status
            13. Market Traction
            14. Financial Projections
            15. Valuation Analysis
            16. Confidence Scores for each metric
            
            Format as a structured section with financial analysis and performance metrics.
            """, sourceData, preferences);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate visual summaries
     */
    private String generateVisualSummaries(String sourceData) {
        log.debug("Generating visual summaries");
        
        String prompt = String.format("""
            Generate visual summaries and charts based on the following data:
            
            %s
            
            Create visualizations for:
            1. Growth charts and graphs
            2. Traction metrics visualization
            3. Market share analysis
            4. KPI dashboards
            5. Risk assessment charts
            6. Financial performance graphs
            7. Competitive positioning matrix
            8. Market opportunity sizing
            9. Team structure and roles
            10. Product roadmap timeline
            
            Format as a structured section with chart descriptions and data specifications.
            """, sourceData);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate risk analysis
     */
    private String generateRiskAnalysis(String sourceData) {
        log.debug("Generating risk analysis");
        
        String prompt = String.format("""
            Generate a comprehensive risk analysis based on the following data:
            
            %s
            
            The risk analysis should include:
            1. Financial Risks
            2. Market Risks
            3. Operational Risks
            4. Technology Risks
            5. Regulatory Risks
            6. Competitive Risks
            7. Team Risks
            8. Product Risks
            9. Customer Risks
            10. Overall Risk Score
            11. Mitigation Strategies
            12. Risk Monitoring Plan
            13. Contingency Planning
            14. Risk Probability and Impact Assessment
            
            Format as a structured section with risk matrix and mitigation strategies.
            """, sourceData);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Combine into curated memo
     */
    private String combineIntoCurtatedMemo(String founderProfile, String problemSizing, 
                                         String differentiation, String companyReview, 
                                         String visualSummaries, String riskAnalysis) {
        log.debug("Combining sections into curated memo");
        
        String prompt = String.format("""
            Combine the following sections into a comprehensive curated investment memo:
            
            Founder Profile:
            %s
            
            Problem Sizing:
            %s
            
            Differentiation:
            %s
            
            Company Review:
            %s
            
            Visual Summaries:
            %s
            
            Risk Analysis:
            %s
            
            The final memo should include:
            1. Executive Summary
            2. Investment Recommendation
            3. Key Investment Highlights
            4. Risk-Reward Analysis
            5. Valuation Summary
            6. Next Steps
            7. Appendix with detailed analysis
            
            Format as a professional investment memo with clear structure and actionable insights.
            """, founderProfile, problemSizing, differentiation, companyReview, visualSummaries, riskAnalysis);
        
        return aiService.generateText(prompt);
    }
}
