package com.aianalyst.controller;

import com.aianalyst.dto.InvestmentMemoDTO;
import com.aianalyst.service.InvestmentMemoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Investment Memo Controller
 * 
 * REST controller for managing investment memos including generation,
 * editing, and analysis operations.
 */
@RestController
@RequestMapping("/investment-memos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class InvestmentMemoController {
    
    private final InvestmentMemoService investmentMemoService;
    
    /**
     * Get all investment memos
     */
    @GetMapping
    public ResponseEntity<List<InvestmentMemoDTO>> getMemos(
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting investment memos for user: {}", userId);
        List<InvestmentMemoDTO> memos = investmentMemoService.getMemos(userId);
        return ResponseEntity.ok(memos);
    }
    
    /**
     * Get investment memos with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<InvestmentMemoDTO>> getMemos(
            @RequestHeader("X-User-ID") String userId,
            Pageable pageable) {
        log.info("Getting investment memos with pagination for user: {}", userId);
        Page<InvestmentMemoDTO> memos = investmentMemoService.getMemos(userId, pageable);
        return ResponseEntity.ok(memos);
    }
    
    /**
     * Get memo by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<InvestmentMemoDTO> getMemo(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting investment memo: {} for user: {}", id, userId);
        InvestmentMemoDTO memo = investmentMemoService.getMemo(id, userId);
        return ResponseEntity.ok(memo);
    }
    
    /**
     * Create new memo
     */
    @PostMapping
    public ResponseEntity<InvestmentMemoDTO> createMemo(
            @RequestBody InvestmentMemoDTO memoDTO,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Creating investment memo: {} for user: {}", memoDTO.getTitle(), userId);
        InvestmentMemoDTO memo = investmentMemoService.createMemo(memoDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(memo);
    }
    
    /**
     * Update memo
     */
    @PutMapping("/{id}")
    public ResponseEntity<InvestmentMemoDTO> updateMemo(
            @PathVariable String id,
            @RequestBody InvestmentMemoDTO updates,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Updating investment memo: {} for user: {}", id, userId);
        InvestmentMemoDTO memo = investmentMemoService.updateMemo(id, updates, userId);
        return ResponseEntity.ok(memo);
    }
    
    /**
     * Delete memo
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemo(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Deleting investment memo: {} for user: {}", id, userId);
        investmentMemoService.deleteMemo(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Generate Stage 1 memo from data sources
     */
    @PostMapping("/generate/stage-1")
    public ResponseEntity<InvestmentMemoDTO> generateStage1Memo(
            @RequestBody Map<String, String[]> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Generating Stage 1 memo for user: {}", userId);
        
        String[] dataSourceIds = request.get("dataSourceIds");
        if (dataSourceIds == null) {
            return ResponseEntity.badRequest().build();
        }
        
        InvestmentMemoDTO memo = investmentMemoService.generateStage1Memo(dataSourceIds, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(memo);
    }
    
    /**
     * Generate Stage 2 memo from Stage 1 memo
     */
    @PostMapping("/generate/stage-2")
    public ResponseEntity<InvestmentMemoDTO> generateStage2Memo(
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Generating Stage 2 memo for user: {}", userId);
        
        String stage1MemoId = (String) request.get("stage1MemoId");
        Map<String, Object> preferences = (Map<String, Object>) request.get("preferences");
        
        if (stage1MemoId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        InvestmentMemoDTO memo = investmentMemoService.generateStage2Memo(stage1MemoId, preferences, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(memo);
    }
    
    /**
     * Search memos
     */
    @GetMapping("/search")
    public ResponseEntity<List<InvestmentMemoDTO>> searchMemos(
            @RequestParam String q,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Searching memos with query: {} for user: {}", q, userId);
        List<InvestmentMemoDTO> memos = investmentMemoService.searchMemos(q, userId);
        return ResponseEntity.ok(memos);
    }
    
    /**
     * Download memo as PDF
     */
    @GetMapping("/{id}/download/pdf")
    public ResponseEntity<byte[]> downloadMemoPDF(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Downloading memo as PDF: {} for user: {}", id, userId);
        
        // This would be implemented to generate and return PDF
        byte[] pdfContent = "Simulated PDF content".getBytes();
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=memo.pdf")
                .body(pdfContent);
    }
    
    /**
     * Download memo as Word document
     */
    @GetMapping("/{id}/download/word")
    public ResponseEntity<byte[]> downloadMemoWord(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Downloading memo as Word: {} for user: {}", id, userId);
        
        // This would be implemented to generate and return Word document
        byte[] wordContent = "Simulated Word content".getBytes();
        return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                .header("Content-Disposition", "attachment; filename=memo.docx")
                .body(wordContent);
    }
    
    /**
     * Download memo as PPT
     */
    @GetMapping("/{id}/download/ppt")
    public ResponseEntity<byte[]> downloadMemoPPT(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Downloading memo as PPT: {} for user: {}", id, userId);
        
        // This would be implemented to generate and return PPT
        byte[] pptContent = "Simulated PPT content".getBytes();
        return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.ms-powerpoint")
                .header("Content-Disposition", "attachment; filename=memo.pptx")
                .body(pptContent);
    }
    
    /**
     * Get memo generation status
     */
    @GetMapping("/{id}/generation-status")
    public ResponseEntity<Map<String, Object>> getGenerationStatus(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting generation status for memo: {} and user: {}", id, userId);
        
        // This would be implemented to get actual generation status
        Map<String, Object> status = Map.of(
            "status", "completed",
            "progress", 100,
            "message", "Generation completed successfully"
        );
        return ResponseEntity.ok(status);
    }
    
    /**
     * Regenerate memo
     */
    @PostMapping("/{id}/regenerate")
    public ResponseEntity<InvestmentMemoDTO> regenerateMemo(
            @PathVariable String id,
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Regenerating memo: {} for user: {}", id, userId);
        
        // This would be implemented to regenerate memo
        InvestmentMemoDTO memo = new InvestmentMemoDTO();
        memo.setId(id);
        memo.setTitle("Regenerated Memo");
        memo.setStatus(com.aianalyst.entity.InvestmentMemoEntity.MemoStatus.GENERATING);
        
        return ResponseEntity.ok(memo);
    }
    
    /**
     * Update memo preferences
     */
    @PutMapping("/{id}/preferences")
    public ResponseEntity<InvestmentMemoDTO> updateMemoPreferences(
            @PathVariable String id,
            @RequestBody Map<String, String> preferences,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Updating preferences for memo: {} and user: {}", id, userId);
        
        // This would be implemented to update preferences
        InvestmentMemoDTO memo = new InvestmentMemoDTO();
        memo.setId(id);
        memo.setPreferences(preferences);
        
        return ResponseEntity.ok(memo);
    }
    
    /**
     * Get memo analytics
     */
    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getMemoAnalytics(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting analytics for memo: {} and user: {}", id, userId);
        
        // This would be implemented to get memo analytics
        Map<String, Object> analytics = Map.of(
            "views", 10,
            "downloads", 5,
            "shares", 2,
            "lastAccessed", "2024-01-01T00:00:00Z"
        );
        return ResponseEntity.ok(analytics);
    }
    
    /**
     * Get memo statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getMemoStats(
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting memo statistics for user: {}", userId);
        
        // This would be implemented to get memo statistics
        Map<String, Object> stats = Map.of(
            "totalMemos", 5,
            "stage1Memos", 3,
            "stage2Memos", 2,
            "totalDownloads", 15
        );
        return ResponseEntity.ok(stats);
    }
}