package com.aianalyst.dto;

import com.aianalyst.entity.AgentExecutionEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Agent Execution DTO
 * 
 * Data Transfer Object for AgentExecution operations.
 * Maps to and from AgentExecutionEntity for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentExecutionDTO {
    
    private String id;
    private String agentId;
    private AgentExecutionEntity.ExecutionStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Long durationSeconds;
    private String inputData;
    private String outputData;
    private String errorMessage;
    private Long processingTimeMs;
    private Long memoryUsageMb;
    private Double confidenceScore;
    private Double dataProcessedMb;
    private Integer errorCount;
    private Map<String, String> metrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Convert from Entity to DTO
     */
    public static AgentExecutionDTO fromEntity(AgentExecutionEntity entity) {
        return AgentExecutionDTO.builder()
                .id(entity.getId())
                .agentId(entity.getAgent().getId())
                .status(entity.getStatus())
                .startedAt(entity.getStartedAt())
                .completedAt(entity.getCompletedAt())
                .durationSeconds(entity.getDurationSeconds())
                .inputData(entity.getInputData())
                .outputData(entity.getOutputData())
                .errorMessage(entity.getErrorMessage())
                .processingTimeMs(entity.getProcessingTimeMs())
                .memoryUsageMb(entity.getMemoryUsageMb())
                .confidenceScore(entity.getConfidenceScore())
                .dataProcessedMb(entity.getDataProcessedMb())
                .errorCount(entity.getErrorCount())
                .metrics(entity.getMetrics())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert from DTO to Entity
     */
    public AgentExecutionEntity toEntity() {
        AgentExecutionEntity entity = new AgentExecutionEntity();
        entity.setId(this.id);
        entity.setStatus(this.status);
        entity.setStartedAt(this.startedAt);
        entity.setCompletedAt(this.completedAt);
        entity.setDurationSeconds(this.durationSeconds);
        entity.setInputData(this.inputData);
        entity.setOutputData(this.outputData);
        entity.setErrorMessage(this.errorMessage);
        entity.setProcessingTimeMs(this.processingTimeMs);
        entity.setMemoryUsageMb(this.memoryUsageMb);
        entity.setConfidenceScore(this.confidenceScore);
        entity.setDataProcessedMb(this.dataProcessedMb);
        entity.setErrorCount(this.errorCount);
        entity.setMetrics(this.metrics);
        return entity;
    }
}
