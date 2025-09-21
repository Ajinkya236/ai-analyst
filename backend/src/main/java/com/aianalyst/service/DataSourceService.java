package com.aianalyst.service;

import com.aianalyst.dto.DataSourceDTO;
import com.aianalyst.entity.DataSourceEntity;
import com.aianalyst.repository.DataSourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Data Source Service
 * 
 * Service layer for managing data sources including file uploads,
 * text input, URLs, and AI agent generated data.
 */
@Service
@Slf4j
@Transactional
public class DataSourceService {
    
    private final DataSourceRepository dataSourceRepository;
    private final FileStorageService fileStorageService;
    // private final FileProcessingService fileProcessingService;
    
    public DataSourceService(DataSourceRepository dataSourceRepository, FileStorageService fileStorageService) {
        this.dataSourceRepository = dataSourceRepository;
        this.fileStorageService = fileStorageService;
    }
    
    /**
     * Get all data sources for a user
     */
    @Transactional(readOnly = true)
    public List<DataSourceDTO> getDataSources(String userId) {
        log.debug("Getting data sources for user: {}", userId);
        return dataSourceRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(DataSourceDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * Get data sources with pagination
     */
    @Transactional(readOnly = true)
    public Page<DataSourceDTO> getDataSources(String userId, Pageable pageable) {
        log.debug("Getting data sources for user: {} with pagination", userId);
        return dataSourceRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(DataSourceDTO::fromEntity);
    }
    
    /**
     * Get data source by ID
     */
    @Transactional(readOnly = true)
    public DataSourceDTO getDataSource(String id, String userId) {
        log.debug("Getting data source: {} for user: {}", id, userId);
        DataSourceEntity entity = dataSourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data source not found"));
        
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        return DataSourceDTO.fromEntity(entity);
    }
    
    /**
     * Upload file data source
     */
    public DataSourceDTO uploadFile(MultipartFile file, String userId, Map<String, String> metadata) {
        log.info("Uploading file: {} for user: {}", file.getOriginalFilename(), userId);
        
        try {
            // Store file
            String filePath = fileStorageService.storeFile(file);
            
            // Process file content
            // String content = fileProcessingService.extractContent(file);
            String content = "File content extraction temporarily disabled";
            
            // Create data source entity
            DataSourceEntity entity = new DataSourceEntity();
            entity.setId(UUID.randomUUID().toString());
            entity.setType(DataSourceEntity.DataSourceType.FILE_UPLOAD);
            entity.setName(file.getOriginalFilename());
            entity.setFilePath(filePath);
            entity.setFileName(file.getOriginalFilename());
            entity.setFileSize(file.getSize());
            entity.setFileType(file.getContentType());
            entity.setContent(content);
            entity.setStatus(DataSourceEntity.DataSourceStatus.PROCESSING);
            entity.setMetadata(metadata);
            entity.setUserId(userId);
            entity.setIsSelected(false);
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());
            
            // Save entity
            DataSourceEntity savedEntity = dataSourceRepository.save(entity);
            
            // Process file asynchronously
            processFileAsync(savedEntity.getId());
            
            log.info("File uploaded successfully: {}", savedEntity.getId());
            return DataSourceDTO.fromEntity(savedEntity);
            
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }
    
    /**
     * Add text data source
     */
    public DataSourceDTO addTextSource(String title, String content, String userId) {
        log.info("Adding text source: {} for user: {}", title, userId);
        
        DataSourceEntity entity = new DataSourceEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setType(DataSourceEntity.DataSourceType.TEXT_INPUT);
        entity.setName(title);
        entity.setContent(content);
        entity.setStatus(DataSourceEntity.DataSourceStatus.COMPLETED);
        entity.setUserId(userId);
        entity.setIsSelected(false);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        DataSourceEntity savedEntity = dataSourceRepository.save(entity);
        log.info("Text source added successfully: {}", savedEntity.getId());
        return DataSourceDTO.fromEntity(savedEntity);
    }
    
    /**
     * Add URL data source
     */
    public DataSourceDTO addUrlSource(String url, String description, String userId) {
        log.info("Adding URL source: {} for user: {}", url, userId);
        
        DataSourceEntity entity = new DataSourceEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setType(DataSourceEntity.DataSourceType.URL_LINK);
        entity.setName(description != null ? description : url);
        entity.setUrl(url);
        entity.setStatus(DataSourceEntity.DataSourceStatus.PENDING);
        entity.setUserId(userId);
        entity.setIsSelected(false);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        DataSourceEntity savedEntity = dataSourceRepository.save(entity);
        
        // Process URL asynchronously
        processUrlAsync(savedEntity.getId());
        
        log.info("URL source added successfully: {}", savedEntity.getId());
        return DataSourceDTO.fromEntity(savedEntity);
    }
    
    /**
     * Update data source
     */
    public DataSourceDTO updateDataSource(String id, DataSourceDTO updates, String userId) {
        log.info("Updating data source: {} for user: {}", id, userId);
        
        DataSourceEntity entity = dataSourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data source not found"));
        
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        // Update fields
        if (updates.getName() != null) entity.setName(updates.getName());
        if (updates.getDescription() != null) entity.setDescription(updates.getDescription());
        if (updates.getIsSelected() != null) entity.setIsSelected(updates.getIsSelected());
        if (updates.getMetadata() != null) entity.setMetadata(updates.getMetadata());
        entity.setUpdatedAt(LocalDateTime.now());
        
        DataSourceEntity savedEntity = dataSourceRepository.save(entity);
        log.info("Data source updated successfully: {}", savedEntity.getId());
        return DataSourceDTO.fromEntity(savedEntity);
    }
    
    /**
     * Delete data source
     */
    public void deleteDataSource(String id, String userId) {
        log.info("Deleting data source: {} for user: {}", id, userId);
        
        DataSourceEntity entity = dataSourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data source not found"));
        
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        // Delete associated file if exists
        if (entity.getFilePath() != null) {
            fileStorageService.deleteFile(entity.getFilePath());
        }
        
        dataSourceRepository.delete(entity);
        log.info("Data source deleted successfully: {}", id);
    }
    
    /**
     * Search data sources
     */
    @Transactional(readOnly = true)
    public List<DataSourceDTO> searchDataSources(String query, String userId) {
        log.debug("Searching data sources with query: {} for user: {}", query, userId);
        return dataSourceRepository.searchByQuery(userId, query)
                .stream()
                .map(DataSourceDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * Get selected data sources
     */
    @Transactional(readOnly = true)
    public List<DataSourceDTO> getSelectedDataSources(String userId) {
        log.debug("Getting selected data sources for user: {}", userId);
        return dataSourceRepository.findByIsSelectedTrueAndUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(DataSourceDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * Update selection status
     */
    public void updateSelectionStatus(String id, boolean isSelected, String userId) {
        log.debug("Updating selection status for data source: {} to {} for user: {}", id, isSelected, userId);
        
        DataSourceEntity entity = dataSourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data source not found"));
        
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        entity.setIsSelected(isSelected);
        entity.setUpdatedAt(LocalDateTime.now());
        dataSourceRepository.save(entity);
    }
    
    /**
     * Process file asynchronously
     */
    private void processFileAsync(String dataSourceId) {
        // This would be implemented with @Async annotation
        // For now, we'll simulate processing
        log.debug("Processing file asynchronously: {}", dataSourceId);
    }
    
    /**
     * Process URL asynchronously
     */
    private void processUrlAsync(String dataSourceId) {
        // This would be implemented with @Async annotation
        // For now, we'll simulate processing
        log.debug("Processing URL asynchronously: {}", dataSourceId);
    }
}
