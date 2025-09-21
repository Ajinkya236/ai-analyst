package com.aianalyst.repository;

import com.aianalyst.entity.AIAgentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * AI Agent Repository
 * 
 * Repository interface for AIAgentEntity operations.
 * Provides methods for querying AI agents by various criteria.
 */
@Repository
public interface AIAgentRepository extends JpaRepository<AIAgentEntity, String> {
    
    /**
     * Find agents by user ID
     */
    List<AIAgentEntity> findByUserIdOrderByPriorityAsc(String userId);
    
    /**
     * Find agents by type and user ID
     */
    List<AIAgentEntity> findByTypeAndUserIdOrderByPriorityAsc(
        AIAgentEntity.AgentType type, String userId);
    
    /**
     * Find agents by status and user ID
     */
    List<AIAgentEntity> findByStatusAndUserIdOrderByPriorityAsc(
        AIAgentEntity.AgentStatus status, String userId);
    
    /**
     * Find enabled agents by user ID
     */
    List<AIAgentEntity> findByEnabledTrueAndUserIdOrderByPriorityAsc(String userId);
    
    /**
     * Find agents by type and status
     */
    List<AIAgentEntity> findByTypeAndStatusAndUserIdOrderByPriorityAsc(
        AIAgentEntity.AgentType type, AIAgentEntity.AgentStatus status, String userId);
    
    /**
     * Find agents that need to be executed (enabled and idle)
     */
    List<AIAgentEntity> findByEnabledTrueAndStatusAndUserIdOrderByPriorityAsc(
        AIAgentEntity.AgentStatus status, String userId);
    
    /**
     * Find agents by priority range
     */
    List<AIAgentEntity> findByUserIdAndPriorityBetweenOrderByPriorityAsc(
        String userId, Integer minPriority, Integer maxPriority);
    
    /**
     * Find agents by last execution time
     */
    List<AIAgentEntity> findByUserIdAndLastExecutionBetweenOrderByLastExecutionDesc(
        String userId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * Find agents that haven't been executed recently
     */
    @Query("SELECT a FROM AIAgentEntity a WHERE a.userId = :userId AND a.enabled = true AND " +
           "(a.lastExecution IS NULL OR a.lastExecution < :cutoffTime)")
    List<AIAgentEntity> findAgentsNeedingExecution(@Param("userId") String userId, @Param("cutoffTime") LocalDateTime cutoffTime);
    
    /**
     * Find agents by parameter value
     * Note: This method is temporarily disabled due to HQL limitations with Map collections
     */
    // @Query("SELECT a FROM AIAgentEntity a JOIN a.parameters p WHERE a.userId = :userId AND p.key = :key AND p.value = :value")
    // List<AIAgentEntity> findByParameterKeyValue(@Param("userId") String userId, @Param("key") String key, @Param("value") String value);
    
    /**
     * Count agents by type and user ID
     */
    long countByTypeAndUserId(AIAgentEntity.AgentType type, String userId);
    
    /**
     * Count agents by status and user ID
     */
    long countByStatusAndUserId(AIAgentEntity.AgentStatus status, String userId);
    
    /**
     * Find agents by name pattern
     */
    List<AIAgentEntity> findByUserIdAndNameContainingIgnoreCaseOrderByNameAsc(String userId, String namePattern);
    
    /**
     * Find agents by description pattern
     */
    List<AIAgentEntity> findByUserIdAndDescriptionContainingIgnoreCaseOrderByNameAsc(String userId, String descriptionPattern);
    
    /**
     * Find agents with high priority
     */
    @Query("SELECT a FROM AIAgentEntity a WHERE a.userId = :userId AND a.priority >= :minPriority ORDER BY a.priority ASC")
    List<AIAgentEntity> findHighPriorityAgents(@Param("userId") String userId, @Param("minPriority") Integer minPriority);
    
    /**
     * Find agents by timeout range
     */
    List<AIAgentEntity> findByUserIdAndTimeoutSecondsBetweenOrderByTimeoutSecondsAsc(
        String userId, Integer minTimeout, Integer maxTimeout);
}
