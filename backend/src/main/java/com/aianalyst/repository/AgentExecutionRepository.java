package com.aianalyst.repository;

import com.aianalyst.entity.AgentExecutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Agent Execution Repository
 * 
 * Repository interface for AgentExecutionEntity operations.
 * Provides methods for querying agent executions by various criteria.
 */
@Repository
public interface AgentExecutionRepository extends JpaRepository<AgentExecutionEntity, String> {
    
    /**
     * Find executions by agent ID
     */
    List<AgentExecutionEntity> findByAgentIdOrderByStartedAtDesc(String agentId);
    
    /**
     * Find executions by status
     */
    List<AgentExecutionEntity> findByStatusOrderByStartedAtDesc(AgentExecutionEntity.ExecutionStatus status);
    
    /**
     * Find executions by agent ID and status
     */
    List<AgentExecutionEntity> findByAgentIdAndStatusOrderByStartedAtDesc(
        String agentId, AgentExecutionEntity.ExecutionStatus status);
    
    /**
     * Find executions by date range
     */
    List<AgentExecutionEntity> findByStartedAtBetweenOrderByStartedAtDesc(
        LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find executions by agent ID and date range
     */
    List<AgentExecutionEntity> findByAgentIdAndStartedAtBetweenOrderByStartedAtDesc(
        String agentId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find running executions
     */
    @Query("SELECT e FROM AgentExecutionEntity e WHERE e.status = 'RUNNING'")
    List<AgentExecutionEntity> findRunningExecutions();
    
    /**
     * Find executions by duration range
     */
    List<AgentExecutionEntity> findByDurationSecondsBetweenOrderByDurationSecondsDesc(
        Long minDuration, Long maxDuration);
    
    /**
     * Find executions by confidence score range
     */
    List<AgentExecutionEntity> findByConfidenceScoreBetweenOrderByConfidenceScoreDesc(
        Double minScore, Double maxScore);
    
    /**
     * Count executions by agent ID
     */
    long countByAgentId(String agentId);
    
    /**
     * Count executions by status
     */
    long countByStatus(AgentExecutionEntity.ExecutionStatus status);
    
    /**
     * Count executions by agent ID and status
     */
    long countByAgentIdAndStatus(String agentId, AgentExecutionEntity.ExecutionStatus status);
    
    /**
     * Find recent executions
     */
    @Query("SELECT e FROM AgentExecutionEntity e WHERE e.startedAt >= :cutoffTime ORDER BY e.startedAt DESC")
    List<AgentExecutionEntity> findRecentExecutions(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    /**
     * Find executions with errors
     */
    @Query("SELECT e FROM AgentExecutionEntity e WHERE e.errorMessage IS NOT NULL ORDER BY e.startedAt DESC")
    List<AgentExecutionEntity> findExecutionsWithErrors();
    
    /**
     * Find executions by agent ID with errors
     */
    @Query("SELECT e FROM AgentExecutionEntity e WHERE e.agent.id = :agentId AND e.errorMessage IS NOT NULL ORDER BY e.startedAt DESC")
    List<AgentExecutionEntity> findExecutionsWithErrorsByAgent(@Param("agentId") String agentId);
}
