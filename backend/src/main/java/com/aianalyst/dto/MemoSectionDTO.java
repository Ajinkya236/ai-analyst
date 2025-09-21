package com.aianalyst.dto;

import com.aianalyst.entity.MemoSectionEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Memo Section DTO
 * 
 * Data Transfer Object for MemoSection operations.
 * Maps to and from MemoSectionEntity for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoSectionDTO {
    
    private String id;
    private String memoId;
    private String title;
    private MemoSectionEntity.SectionType type;
    private String content;
    private Double weight;
    private Double confidence;
    private List<MemoSubsectionDTO> subsections;
    private List<VisualizationDTO> visualizations;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Convert from Entity to DTO
     */
    public static MemoSectionDTO fromEntity(MemoSectionEntity entity) {
        return MemoSectionDTO.builder()
                .id(entity.getId())
                .memoId(entity.getMemo().getId())
                .title(entity.getTitle())
                .type(entity.getType())
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
    public MemoSectionEntity toEntity() {
        MemoSectionEntity entity = new MemoSectionEntity();
        entity.setId(this.id);
        entity.setTitle(this.title);
        entity.setType(this.type);
        entity.setContent(this.content);
        entity.setWeight(this.weight);
        entity.setConfidence(this.confidence);
        entity.setOrderIndex(this.orderIndex);
        return entity;
    }
}
