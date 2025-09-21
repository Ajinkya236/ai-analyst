package com.aianalyst.controller;

import com.aianalyst.dto.DataSourceDTO;
import com.aianalyst.service.DataSourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Data Source Controller
 * 
 * REST controller for managing data sources including file uploads,
 * text input, URLs, and AI agent generated data.
 */
@RestController
@RequestMapping("/data-sources")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DataSourceController {
    
    private final DataSourceService dataSourceService;
    
    /**
     * Get all data sources
     */
    @GetMapping
    public ResponseEntity<List<DataSourceDTO>> getDataSources(
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting data sources for user: {}", userId);
        List<DataSourceDTO> dataSources = dataSourceService.getDataSources(userId);
        return ResponseEntity.ok(dataSources);
    }
    
    /**
     * Get data sources with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<DataSourceDTO>> getDataSources(
            @RequestHeader("X-User-ID") String userId,
            Pageable pageable) {
        log.info("Getting data sources with pagination for user: {}", userId);
        Page<DataSourceDTO> dataSources = dataSourceService.getDataSources(userId, pageable);
        return ResponseEntity.ok(dataSources);
    }
    
    /**
     * Get data source by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DataSourceDTO> getDataSource(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting data source: {} for user: {}", id, userId);
        DataSourceDTO dataSource = dataSourceService.getDataSource(id, userId);
        return ResponseEntity.ok(dataSource);
    }
    
    /**
     * Upload file
     */
    @PostMapping("/upload")
    public ResponseEntity<DataSourceDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "metadata", required = false) String metadata,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Uploading file: {} for user: {}", file.getOriginalFilename(), userId);
        
        Map<String, String> metadataMap = null;
        if (metadata != null) {
            // Parse metadata JSON in real implementation
            metadataMap = Map.of("originalName", file.getOriginalFilename());
        }
        
        DataSourceDTO dataSource = dataSourceService.uploadFile(file, userId, metadataMap);
        return ResponseEntity.status(HttpStatus.CREATED).body(dataSource);
    }
    
    /**
     * Add text source
     */
    @PostMapping("/text")
    public ResponseEntity<DataSourceDTO> addTextSource(
            @RequestBody Map<String, String> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Adding text source for user: {}", userId);
        
        String title = request.get("title");
        String content = request.get("content");
        
        if (title == null || content == null) {
            return ResponseEntity.badRequest().build();
        }
        
        DataSourceDTO dataSource = dataSourceService.addTextSource(title, content, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(dataSource);
    }
    
    /**
     * Add URL source
     */
    @PostMapping("/url")
    public ResponseEntity<DataSourceDTO> addUrlSource(
            @RequestBody Map<String, String> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Adding URL source for user: {}", userId);
        
        String url = request.get("url");
        String description = request.get("description");
        
        if (url == null) {
            return ResponseEntity.badRequest().build();
        }
        
        DataSourceDTO dataSource = dataSourceService.addUrlSource(url, description, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(dataSource);
    }
    
    /**
     * Update data source
     */
    @PutMapping("/{id}")
    public ResponseEntity<DataSourceDTO> updateDataSource(
            @PathVariable String id,
            @RequestBody DataSourceDTO updates,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Updating data source: {} for user: {}", id, userId);
        DataSourceDTO dataSource = dataSourceService.updateDataSource(id, updates, userId);
        return ResponseEntity.ok(dataSource);
    }
    
    /**
     * Delete data source
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataSource(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Deleting data source: {} for user: {}", id, userId);
        dataSourceService.deleteDataSource(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Search data sources
     */
    @GetMapping("/search")
    public ResponseEntity<List<DataSourceDTO>> searchDataSources(
            @RequestParam String q,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Searching data sources with query: {} for user: {}", q, userId);
        List<DataSourceDTO> dataSources = dataSourceService.searchDataSources(q, userId);
        return ResponseEntity.ok(dataSources);
    }
    
    /**
     * Get selected data sources
     */
    @GetMapping("/selected")
    public ResponseEntity<List<DataSourceDTO>> getSelectedDataSources(
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting selected data sources for user: {}", userId);
        List<DataSourceDTO> dataSources = dataSourceService.getSelectedDataSources(userId);
        return ResponseEntity.ok(dataSources);
    }
    
    /**
     * Update selection status
     */
    @PutMapping("/{id}/selection")
    public ResponseEntity<Void> updateSelectionStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Updating selection status for data source: {} for user: {}", id, userId);
        
        Boolean isSelected = request.get("isSelected");
        if (isSelected == null) {
            return ResponseEntity.badRequest().build();
        }
        
        dataSourceService.updateSelectionStatus(id, isSelected, userId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Trigger founder voice collection
     */
    @PostMapping("/founder-voice")
    public ResponseEntity<DataSourceDTO> triggerFounderVoice(
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Triggering founder voice collection for user: {}", userId);
        
        // This would be implemented to trigger the founder voice agent
        DataSourceDTO dataSource = new DataSourceDTO();
        dataSource.setId("founder-voice-" + System.currentTimeMillis());
        dataSource.setName("Founder Voice Interview");
        dataSource.setType(com.aianalyst.entity.DataSourceEntity.DataSourceType.FOUNDER_VOICE);
        dataSource.setStatus(com.aianalyst.entity.DataSourceEntity.DataSourceStatus.PENDING);
        dataSource.setUserId(userId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dataSource);
    }
    
    /**
     * Trigger behavioral assessment
     */
    @PostMapping("/behavioral-assessment")
    public ResponseEntity<DataSourceDTO> triggerBehavioralAssessment(
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Triggering behavioral assessment for user: {}", userId);
        
        // This would be implemented to trigger the behavioral assessment agent
        DataSourceDTO dataSource = new DataSourceDTO();
        dataSource.setId("behavioral-assessment-" + System.currentTimeMillis());
        dataSource.setName("Behavioral Assessment");
        dataSource.setType(com.aianalyst.entity.DataSourceEntity.DataSourceType.BEHAVIORAL_ASSESSMENT);
        dataSource.setStatus(com.aianalyst.entity.DataSourceEntity.DataSourceStatus.PENDING);
        dataSource.setUserId(userId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dataSource);
    }
    
    /**
     * Trigger deep research
     */
    @PostMapping("/deep-research")
    public ResponseEntity<DataSourceDTO> triggerDeepResearch(
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Triggering deep research for user: {}", userId);
        
        // This would be implemented to trigger the deep research agent
        DataSourceDTO dataSource = new DataSourceDTO();
        dataSource.setId("deep-research-" + System.currentTimeMillis());
        dataSource.setName("Deep Research Analysis");
        dataSource.setType(com.aianalyst.entity.DataSourceEntity.DataSourceType.DEEP_RESEARCH);
        dataSource.setStatus(com.aianalyst.entity.DataSourceEntity.DataSourceStatus.PENDING);
        dataSource.setUserId(userId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dataSource);
    }
}