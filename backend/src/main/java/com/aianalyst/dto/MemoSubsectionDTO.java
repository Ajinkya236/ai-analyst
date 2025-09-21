package com.aianalyst.dto;

import com.aianalyst.entity.MemoSubsectionEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Memo Subsection DTO
 * 
 * Data Transfer Object for MemoSubsection operations.
 * Maps to and from MemoSubsectionEntity for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoSubsectionDTO {
    
    private String id;
    private String sectionId;
    private String title;
    private String content;
    private Double weight;
    private Double confidence;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Convert from Entity to DTO
     */
    public static MemoSubsectionDTO fromEntity(MemoSubsectionEntity entity) {
        return MemoSubsectionDTO.builder()
                .id(entity.getId())
                .sectionId(entity.getSection().getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .weight(entity.getWeight())
                .confidence(entity.getConfidence())
                .orderIndex(entity.getOrderIndex())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert from DTO to Entity
     */
    public MemoSubsectionEntity toEntity() {
        MemoSubsectionEntity entity = new MemoSubsectionEntity();
        entity.setId(this.id);
        entity.setTitle(this.title);
        entity.setContent(this.content);
        entity.setWeight(this.weight);
        entity.setConfidence(this.confidence);
        entity.setOrderIndex(this.orderIndex);
        return entity;
    }
}
