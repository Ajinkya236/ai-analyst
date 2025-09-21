package com.aianalyst.dto;

import com.aianalyst.entity.VisualizationEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Visualization DTO
 * 
 * Data Transfer Object for Visualization operations.
 * Maps to and from VisualizationEntity for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisualizationDTO {
    
    private String id;
    private String sectionId;
    private VisualizationEntity.VisualizationType type;
    private String title;
    private String data; // JSON data
    private String config; // JSON configuration
    private String filePath; // For generated image files
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Convert from Entity to DTO
     */
    public static VisualizationDTO fromEntity(VisualizationEntity entity) {
        return VisualizationDTO.builder()
                .id(entity.getId())
                .sectionId(entity.getSection().getId())
                .type(entity.getType())
                .title(entity.getTitle())
                .data(entity.getData())
                .config(entity.getConfig())
                .filePath(entity.getFilePath())
                .orderIndex(entity.getOrderIndex())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert from DTO to Entity
     */
    public VisualizationEntity toEntity() {
        VisualizationEntity entity = new VisualizationEntity();
        entity.setId(this.id);
        entity.setType(this.type);
        entity.setTitle(this.title);
        entity.setData(this.data);
        entity.setConfig(this.config);
        entity.setFilePath(this.filePath);
        entity.setOrderIndex(this.orderIndex);
        return entity;
    }
}
