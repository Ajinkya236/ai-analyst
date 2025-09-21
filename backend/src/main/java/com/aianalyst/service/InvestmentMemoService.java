package com.aianalyst.service;

import com.aianalyst.dto.InvestmentMemoDTO;
import com.aianalyst.dto.DataSourceDTO;
import com.aianalyst.entity.InvestmentMemoEntity;
import com.aianalyst.repository.InvestmentMemoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Investment Memo Service
 * 
 * Service layer for managing investment memos including generation,
 * editing, and analysis operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InvestmentMemoService {
    
    private final InvestmentMemoRepository investmentMemoRepository;
    private final DataSourceService dataSourceService;
    private final AIService aiService;
    private final PPTGenerationService pptGenerationService;
    
    /**
     * Get all investment memos for a user
     */
    @Transactional(readOnly = true)
    public List<InvestmentMemoDTO> getMemos(String userId) {
        log.debug("Getting investment memos for user: {}", userId);
        return investmentMemoRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged())
                .getContent()
                .stream()
                .map(InvestmentMemoDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * Get investment memos with pagination
     */
    @Transactional(readOnly = true)
    public Page<InvestmentMemoDTO> getMemos(String userId, Pageable pageable) {
        log.debug("Getting investment memos for user: {} with pagination", userId);
        return investmentMemoRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(InvestmentMemoDTO::fromEntity);
    }
    
    /**
     * Get memo by ID
     */
    @Transactional(readOnly = true)
    public InvestmentMemoDTO getMemo(String id, String userId) {
        log.debug("Getting investment memo: {} for user: {}", id, userId);
        InvestmentMemoEntity entity = investmentMemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment memo not found"));
        
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        return InvestmentMemoDTO.fromEntity(entity);
    }
    
    /**
     * Create new memo
     */
    public InvestmentMemoDTO createMemo(InvestmentMemoDTO memoDTO, String userId) {
        log.info("Creating investment memo: {} for user: {}", memoDTO.getTitle(), userId);
        
        InvestmentMemoEntity entity = memoDTO.toEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setUserId(userId);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        InvestmentMemoEntity savedEntity = investmentMemoRepository.save(entity);
        log.info("Investment memo created successfully: {}", savedEntity.getId());
        return InvestmentMemoDTO.fromEntity(savedEntity);
    }
    
    /**
     * Update memo
     */
    public InvestmentMemoDTO updateMemo(String id, InvestmentMemoDTO updates, String userId) {
        log.info("Updating investment memo: {} for user: {}", id, userId);
        
        InvestmentMemoEntity entity = investmentMemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment memo not found"));
        
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        // Update fields
        if (updates.getTitle() != null) entity.setTitle(updates.getTitle());
        if (updates.getCompanyName() != null) entity.setCompanyName(updates.getCompanyName());
        if (updates.getStatus() != null) entity.setStatus(updates.getStatus());
        if (updates.getPreferences() != null) entity.setPreferences(updates.getPreferences());
        entity.setUpdatedAt(LocalDateTime.now());
        
        InvestmentMemoEntity savedEntity = investmentMemoRepository.save(entity);
        log.info("Investment memo updated successfully: {}", savedEntity.getId());
        return InvestmentMemoDTO.fromEntity(savedEntity);
    }
    
    /**
     * Delete memo
     */
    public void deleteMemo(String id, String userId) {
        log.info("Deleting investment memo: {} for user: {}", id, userId);
        
        InvestmentMemoEntity entity = investmentMemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment memo not found"));
        
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        investmentMemoRepository.delete(entity);
        log.info("Investment memo deleted successfully: {}", id);
    }
    
    /**
     * Generate Stage 1 memo from data sources
     */
    public InvestmentMemoDTO generateStage1Memo(String[] dataSourceIds, String userId) {
        log.info("Generating Stage 1 memo from {} data sources for user: {}", dataSourceIds.length, userId);
        
        try {
            // Get selected data sources
            List<String> selectedSources = dataSourceService.getSelectedDataSources(userId)
                    .stream()
                    .map(DataSourceDTO::getId)
                    .collect(Collectors.toList());
            
            if (selectedSources.isEmpty()) {
                throw new RuntimeException("No data sources selected");
            }
            
            // Generate memo content
            String memoContent = generateStage1Content(selectedSources);
            
            // Create memo entity
            InvestmentMemoEntity entity = new InvestmentMemoEntity();
            entity.setId(UUID.randomUUID().toString());
            entity.setVersion(1);
            entity.setTitle("AI-Generated Investment Memo");
            entity.setCompanyName("Company Name"); // Extract from data sources
            entity.setStage(InvestmentMemoEntity.MemoStage.STAGE_1);
            entity.setStatus(InvestmentMemoEntity.MemoStatus.GENERATING);
            entity.setGeneratedBy("ai-agent");
            entity.setUserId(userId);
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());
            
            InvestmentMemoEntity savedEntity = investmentMemoRepository.save(entity);
            
            // Generate PPT asynchronously
            generatePPTAsync(savedEntity.getId(), memoContent);
            
            log.info("Stage 1 memo generated successfully: {}", savedEntity.getId());
            return InvestmentMemoDTO.fromEntity(savedEntity);
            
        } catch (Exception e) {
            log.error("Error generating Stage 1 memo: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Stage 1 memo: " + e.getMessage());
        }
    }
    
    /**
     * Generate Stage 2 memo from Stage 1 memo
     */
    public InvestmentMemoDTO generateStage2Memo(String stage1MemoId, Map<String, Object> preferences, String userId) {
        log.info("Generating Stage 2 memo from Stage 1 memo: {} for user: {}", stage1MemoId, userId);
        
        try {
            // Get Stage 1 memo
            InvestmentMemoEntity stage1Memo = investmentMemoRepository.findById(stage1MemoId)
                    .orElseThrow(() -> new RuntimeException("Stage 1 memo not found"));
            
            if (!stage1Memo.getUserId().equals(userId)) {
                throw new RuntimeException("Access denied");
            }
            
            // Generate curated memo content
            String memoContent = generateStage2Content(stage1Memo, preferences);
            
            // Create Stage 2 memo entity
            InvestmentMemoEntity entity = new InvestmentMemoEntity();
            entity.setId(UUID.randomUUID().toString());
            entity.setVersion(1);
            entity.setTitle("Curated Investment Memo");
            entity.setCompanyName(stage1Memo.getCompanyName());
            entity.setStage(InvestmentMemoEntity.MemoStage.STAGE_2);
            entity.setStatus(InvestmentMemoEntity.MemoStatus.GENERATING);
            entity.setGeneratedBy("curated-memo-agent");
            entity.setUserId(userId);
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());
            
            InvestmentMemoEntity savedEntity = investmentMemoRepository.save(entity);
            
            // Generate curated memo asynchronously
            generateCuratedMemoAsync(savedEntity.getId(), memoContent);
            
            log.info("Stage 2 memo generated successfully: {}", savedEntity.getId());
            return InvestmentMemoDTO.fromEntity(savedEntity);
            
        } catch (Exception e) {
            log.error("Error generating Stage 2 memo: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Stage 2 memo: " + e.getMessage());
        }
    }
    
    /**
     * Search memos
     */
    @Transactional(readOnly = true)
    public List<InvestmentMemoDTO> searchMemos(String query, String userId) {
        log.debug("Searching memos with query: {} for user: {}", query, userId);
        return investmentMemoRepository.searchByQuery(userId, query)
                .stream()
                .map(InvestmentMemoDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * Generate Stage 1 content
     */
    private String generateStage1Content(List<String> dataSourceIds) {
        log.debug("Generating Stage 1 content from {} data sources", dataSourceIds.size());
        
        String prompt = String.format("""
            Generate a comprehensive Stage 1 AI-Generated Investment Memo based on the following data sources:
            
            Data Source IDs: %s
            
            The memo should include all standard investment memo sections:
            1. Executive Summary
            2. Company Overview
            3. Market Analysis
            4. Business Model
            5. Financial Analysis
            6. Competitive Landscape
            7. Management Team
            8. Investment Thesis
            9. Risk Assessment
            10. Valuation Analysis
            11. Recommendations
            
            Format as a professional investment memo with clear sections and actionable insights.
            """, String.join(", ", dataSourceIds));
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate Stage 2 content
     */
    private String generateStage2Content(InvestmentMemoEntity stage1Memo, Map<String, Object> preferences) {
        log.debug("Generating Stage 2 content from Stage 1 memo: {}", stage1Memo.getId());
        
        String prompt = String.format("""
            Generate a curated Stage 2 Investment Memo based on the following Stage 1 memo and preferences:
            
            Stage 1 Memo: %s
            Preferences: %s
            
            The curated memo should include:
            1. Founder Profile Analysis
            2. Problem Sizing and Market Opportunity
            3. Differentiation and Competitive Advantages
            4. Company Review and Performance
            5. Visual Summaries and Charts
            6. Risk Analysis and Mitigation
            7. Investment Recommendation
            8. Customized insights based on preferences
            
            Format as a professional curated investment memo with enhanced analysis and visual elements.
            """, stage1Memo.getTitle(), preferences);
        
        return aiService.generateText(prompt);
    }
    
    /**
     * Generate PPT asynchronously
     */
    private void generatePPTAsync(String memoId, String content) {
        // This would be implemented with @Async annotation
        log.debug("Generating PPT asynchronously for memo: {}", memoId);
    }
    
    /**
     * Generate curated memo asynchronously
     */
    private void generateCuratedMemoAsync(String memoId, String content) {
        // This would be implemented with @Async annotation
        log.debug("Generating curated memo asynchronously for memo: {}", memoId);
    }
}
