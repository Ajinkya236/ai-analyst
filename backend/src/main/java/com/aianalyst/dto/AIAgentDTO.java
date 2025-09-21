package com.aianalyst.dto;

import com.aianalyst.entity.AIAgentEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * AI Agent DTO
 * 
 * Data Transfer Object for AIAgent operations.
 * Maps to and from AIAgentEntity for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIAgentDTO {
    
    private String id;
    private String name;
    private AIAgentEntity.AgentType type;
    private String description;
    private AIAgentEntity.AgentStatus status;
    private Boolean enabled;
    private Integer priority;
    private Integer timeoutSeconds;
    private Integer retryAttempts;
    private Map<String, String> parameters;
    private LocalDateTime lastExecution;
    private List<AgentExecutionDTO> executionHistory;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Convert from Entity to DTO
     */
    public static AIAgentDTO fromEntity(AIAgentEntity entity) {
        return AIAgentDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .enabled(entity.getEnabled())
                .priority(entity.getPriority())
                .timeoutSeconds(entity.getTimeoutSeconds())
                .retryAttempts(entity.getRetryAttempts())
                .parameters(entity.getParameters())
                .lastExecution(entity.getLastExecution())
                .userId(entity.getUserId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert from DTO to Entity
     */
    public AIAgentEntity toEntity() {
        AIAgentEntity entity = new AIAgentEntity();
        entity.setId(this.id);
        entity.setName(this.name);
        entity.setType(this.type);
        entity.setDescription(this.description);
        entity.setStatus(this.status);
        entity.setEnabled(this.enabled);
        entity.setPriority(this.priority);
        entity.setTimeoutSeconds(this.timeoutSeconds);
        entity.setRetryAttempts(this.retryAttempts);
        entity.setParameters(this.parameters);
        entity.setLastExecution(this.lastExecution);
        entity.setUserId(this.userId);
        return entity;
    }
}
