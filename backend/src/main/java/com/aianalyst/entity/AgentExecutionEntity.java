package com.aianalyst.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Agent Execution Entity
 * 
 * Represents the execution history and status of AI agents.
 * Tracks execution metrics, input/output, and performance data.
 */
@Entity
@Table(name = "agent_executions")
@Data
@EqualsAndHashCode(callSuper = false)
public class AgentExecutionEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private AIAgentEntity agent;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ExecutionStatus status;
    
    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "duration_seconds")
    private Long durationSeconds;
    
    @Column(name = "input_data", columnDefinition = "LONGTEXT")
    private String inputData;
    
    @Column(name = "output_data", columnDefinition = "LONGTEXT")
    private String outputData;
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "processing_time_ms")
    private Long processingTimeMs;
    
    @Column(name = "memory_usage_mb")
    private Long memoryUsageMb;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(name = "data_processed_mb")
    private Double dataProcessedMb;
    
    @Column(name = "error_count")
    private Integer errorCount = 0;
    
    @ElementCollection
    @CollectionTable(name = "execution_metrics", joinColumns = @JoinColumn(name = "execution_id"))
    @MapKeyColumn(name = "metric_key")
    @Column(name = "metric_value", columnDefinition = "TEXT")
    private Map<String, String> metrics;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum ExecutionStatus {
        PENDING,
        RUNNING,
        COMPLETED,
        FAILED,
        CANCELLED
    }
}
