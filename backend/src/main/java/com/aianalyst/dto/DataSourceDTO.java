package com.aianalyst.dto;

import com.aianalyst.entity.DataSourceEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Data Source DTO
 * 
 * Data Transfer Object for DataSource operations.
 * Maps to and from DataSourceEntity for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataSourceDTO {
    
    private String id;
    private DataSourceEntity.DataSourceType type;
    private String name;
    private String description;
    private String url;
    private String filePath;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String content;
    private DataSourceEntity.DataSourceStatus status;
    private Double confidenceScore;
    private Map<String, String> metadata;
    private String userId;
    private Boolean isSelected;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Convert from Entity to DTO
     */
    public static DataSourceDTO fromEntity(DataSourceEntity entity) {
        return DataSourceDTO.builder()
                .id(entity.getId())
                .type(entity.getType())
                .name(entity.getName())
                .description(entity.getDescription())
                .url(entity.getUrl())
                .filePath(entity.getFilePath())
                .fileName(entity.getFileName())
                .fileSize(entity.getFileSize())
                .fileType(entity.getFileType())
                .content(entity.getContent())
                .status(entity.getStatus())
                .confidenceScore(entity.getConfidenceScore())
                .metadata(entity.getMetadata())
                .userId(entity.getUserId())
                .isSelected(entity.getIsSelected())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert from DTO to Entity
     */
    public DataSourceEntity toEntity() {
        DataSourceEntity entity = new DataSourceEntity();
        entity.setId(this.id);
        entity.setType(this.type);
        entity.setName(this.name);
        entity.setDescription(this.description);
        entity.setUrl(this.url);
        entity.setFilePath(this.filePath);
        entity.setFileName(this.fileName);
        entity.setFileSize(this.fileSize);
        entity.setFileType(this.fileType);
        entity.setContent(this.content);
        entity.setStatus(this.status);
        entity.setConfidenceScore(this.confidenceScore);
        entity.setMetadata(this.metadata);
        entity.setUserId(this.userId);
        entity.setIsSelected(this.isSelected);
        return entity;
    }
}
