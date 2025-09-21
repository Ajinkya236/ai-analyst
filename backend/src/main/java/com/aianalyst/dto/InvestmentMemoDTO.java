package com.aianalyst.dto;

import com.aianalyst.entity.InvestmentMemoEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Investment Memo DTO
 * 
 * Data Transfer Object for InvestmentMemo operations.
 * Maps to and from InvestmentMemoEntity for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentMemoDTO {
    
    private String id;
    private Integer version;
    private String title;
    private String companyName;
    private InvestmentMemoEntity.MemoStage stage;
    private InvestmentMemoEntity.MemoStatus status;
    private List<MemoSectionDTO> sections;
    private Map<String, String> preferences;
    private String generatedBy;
    private String filePath;
    private Long fileSize;
    private Integer downloadCount;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Convert from Entity to DTO
     */
    public static InvestmentMemoDTO fromEntity(InvestmentMemoEntity entity) {
        return InvestmentMemoDTO.builder()
                .id(entity.getId())
                .version(entity.getVersion())
                .title(entity.getTitle())
                .companyName(entity.getCompanyName())
                .stage(entity.getStage())
                .status(entity.getStatus())
                .preferences(entity.getPreferences())
                .generatedBy(entity.getGeneratedBy())
                .filePath(entity.getFilePath())
                .fileSize(entity.getFileSize())
                .downloadCount(entity.getDownloadCount())
                .userId(entity.getUserId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert from DTO to Entity
     */
    public InvestmentMemoEntity toEntity() {
        InvestmentMemoEntity entity = new InvestmentMemoEntity();
        entity.setId(this.id);
        entity.setVersion(this.version);
        entity.setTitle(this.title);
        entity.setCompanyName(this.companyName);
        entity.setStage(this.stage);
        entity.setStatus(this.status);
        entity.setPreferences(this.preferences);
        entity.setGeneratedBy(this.generatedBy);
        entity.setFilePath(this.filePath);
        entity.setFileSize(this.fileSize);
        entity.setDownloadCount(this.downloadCount);
        entity.setUserId(this.userId);
        return entity;
    }
}
