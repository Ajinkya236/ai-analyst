package com.aianalyst.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * AI Agent Entity
 * 
 * Represents different AI agents used in the application.
 * Includes agent types, configurations, and execution status.
 */
@Entity
@Table(name = "ai_agents")
@Data
@EqualsAndHashCode(callSuper = false)
public class AIAgentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AgentType type;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AgentStatus status;
    
    @Column(name = "enabled", nullable = false)
    private Boolean enabled = true;
    
    @Column(name = "priority")
    private Integer priority = 1;
    
    @Column(name = "timeout_seconds")
    private Integer timeoutSeconds = 300;
    
    @Column(name = "retry_attempts")
    private Integer retryAttempts = 1;
    
    @ElementCollection
    @CollectionTable(name = "agent_parameters", joinColumns = @JoinColumn(name = "agent_id"))
    @MapKeyColumn(name = "parameter_key")
    @Column(name = "parameter_value", columnDefinition = "TEXT")
    private Map<String, String> parameters;
    
    @Column(name = "last_execution")
    private LocalDateTime lastExecution;
    
    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AgentExecutionEntity> executionHistory;
    
    @Column(name = "user_id")
    private String userId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum AgentType {
        FOUNDER_VOICE,
        BEHAVIORAL_ASSESSMENT,
        DEEP_RESEARCH,
        DATA_INGESTION,
        CURATED_MEMO
    }
    
    public enum AgentStatus {
        IDLE,
        RUNNING,
        COMPLETED,
        FAILED,
        PAUSED
    }
}
