package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * PPT Generation Service
 * 
 * Service for generating PowerPoint presentations from investment memos.
 * Creates structured PPT files with charts and visualizations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PPTGenerationService {
    
    private final AIService aiService;
    private final VisualizationService visualizationService;
    
    /**
     * Generate PPT from memo content
     */
    public byte[] generatePPT(String memoContent, String companyName) {
        log.info("Generating PPT for company: {}", companyName);
        
        try {
            XMLSlideShow ppt = new XMLSlideShow();
            
            // Create title slide
            createTitleSlide(ppt, companyName);
            
            // Create executive summary slide
            createExecutiveSummarySlide(ppt, memoContent);
            
            // Create company overview slide
            createCompanyOverviewSlide(ppt, memoContent);
            
            // Create market analysis slide
            createMarketAnalysisSlide(ppt, memoContent);
            
            // Create business model slide
            createBusinessModelSlide(ppt, memoContent);
            
            // Create financial analysis slide
            createFinancialAnalysisSlide(ppt, memoContent);
            
            // Create competitive landscape slide
            createCompetitiveLandscapeSlide(ppt, memoContent);
            
            // Create management team slide
            createManagementTeamSlide(ppt, memoContent);
            
            // Create investment thesis slide
            createInvestmentThesisSlide(ppt, memoContent);
            
            // Create risk assessment slide
            createRiskAssessmentSlide(ppt, memoContent);
            
            // Create recommendations slide
            createRecommendationsSlide(ppt, memoContent);
            
            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ppt.write(outputStream);
            byte[] pptBytes = outputStream.toByteArray();
            
            log.info("PPT generated successfully, size: {} bytes", pptBytes.length);
            return pptBytes;
            
        } catch (Exception e) {
            log.error("Error generating PPT: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PPT: " + e.getMessage());
        }
    }
    
    /**
     * Create title slide
     */
    private void createTitleSlide(XMLSlideShow ppt, String companyName) {
        log.debug("Creating title slide for company: {}", companyName);
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 100, 600, 100));
        titleShape.setText("Investment Memo\n" + companyName);
        
        XSLFTextShape subtitleShape = slide.createTextBox();
        subtitleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 250, 600, 50));
        subtitleShape.setText("AI-Generated Analysis\n" + java.time.LocalDate.now().toString());
    }
    
    /**
     * Create executive summary slide
     */
    private void createExecutiveSummarySlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating executive summary slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Executive Summary");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractExecutiveSummary(memoContent));
    }
    
    /**
     * Create company overview slide
     */
    private void createCompanyOverviewSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating company overview slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Company Overview");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractCompanyOverview(memoContent));
    }
    
    /**
     * Create market analysis slide
     */
    private void createMarketAnalysisSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating market analysis slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Market Analysis");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractMarketAnalysis(memoContent));
    }
    
    /**
     * Create business model slide
     */
    private void createBusinessModelSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating business model slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Business Model");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractBusinessModel(memoContent));
    }
    
    /**
     * Create financial analysis slide
     */
    private void createFinancialAnalysisSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating financial analysis slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Financial Analysis");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractFinancialAnalysis(memoContent));
    }
    
    /**
     * Create competitive landscape slide
     */
    private void createCompetitiveLandscapeSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating competitive landscape slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Competitive Landscape");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractCompetitiveLandscape(memoContent));
    }
    
    /**
     * Create management team slide
     */
    private void createManagementTeamSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating management team slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Management Team");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractManagementTeam(memoContent));
    }
    
    /**
     * Create investment thesis slide
     */
    private void createInvestmentThesisSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating investment thesis slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Investment Thesis");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractInvestmentThesis(memoContent));
    }
    
    /**
     * Create risk assessment slide
     */
    private void createRiskAssessmentSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating risk assessment slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Risk Assessment");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractRiskAssessment(memoContent));
    }
    
    /**
     * Create recommendations slide
     */
    private void createRecommendationsSlide(XMLSlideShow ppt, String memoContent) {
        log.debug("Creating recommendations slide");
        
        XSLFSlide slide = ppt.createSlide();
        XSLFTextShape titleShape = slide.createTextBox();
        titleShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 50, 600, 50));
        titleShape.setText("Recommendations");
        
        XSLFTextShape contentShape = slide.createTextBox();
        contentShape.setAnchor(new java.awt.geom.Rectangle2D.Double(50, 120, 600, 400));
        contentShape.setText(extractRecommendations(memoContent));
    }
    
    /**
     * Extract executive summary from memo content
     */
    private String extractExecutiveSummary(String memoContent) {
        String prompt = String.format("""
            Extract the executive summary from the following investment memo content:
            
            %s
            
            Format as a concise executive summary suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract company overview from memo content
     */
    private String extractCompanyOverview(String memoContent) {
        String prompt = String.format("""
            Extract the company overview from the following investment memo content:
            
            %s
            
            Format as a concise company overview suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract market analysis from memo content
     */
    private String extractMarketAnalysis(String memoContent) {
        String prompt = String.format("""
            Extract the market analysis from the following investment memo content:
            
            %s
            
            Format as a concise market analysis suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract business model from memo content
     */
    private String extractBusinessModel(String memoContent) {
        String prompt = String.format("""
            Extract the business model from the following investment memo content:
            
            %s
            
            Format as a concise business model description suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract financial analysis from memo content
     */
    private String extractFinancialAnalysis(String memoContent) {
        String prompt = String.format("""
            Extract the financial analysis from the following investment memo content:
            
            %s
            
            Format as a concise financial analysis suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract competitive landscape from memo content
     */
    private String extractCompetitiveLandscape(String memoContent) {
        String prompt = String.format("""
            Extract the competitive landscape from the following investment memo content:
            
            %s
            
            Format as a concise competitive landscape analysis suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract management team from memo content
     */
    private String extractManagementTeam(String memoContent) {
        String prompt = String.format("""
            Extract the management team information from the following investment memo content:
            
            %s
            
            Format as a concise management team overview suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract investment thesis from memo content
     */
    private String extractInvestmentThesis(String memoContent) {
        String prompt = String.format("""
            Extract the investment thesis from the following investment memo content:
            
            %s
            
            Format as a concise investment thesis suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract risk assessment from memo content
     */
    private String extractRiskAssessment(String memoContent) {
        String prompt = String.format("""
            Extract the risk assessment from the following investment memo content:
            
            %s
            
            Format as a concise risk assessment suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Extract recommendations from memo content
     */
    private String extractRecommendations(String memoContent) {
        String prompt = String.format("""
            Extract the recommendations from the following investment memo content:
            
            %s
            
            Format as a concise recommendations list suitable for a PowerPoint slide.
            """, memoContent);
        
        return aiService.generateText(prompt);
    }
}
