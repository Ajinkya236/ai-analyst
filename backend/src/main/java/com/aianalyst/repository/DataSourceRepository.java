package com.aianalyst.repository;

import com.aianalyst.entity.DataSourceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Data Source Repository
 * 
 * Repository interface for DataSourceEntity operations.
 * Provides methods for querying data sources by various criteria.
 */
@Repository
public interface DataSourceRepository extends JpaRepository<DataSourceEntity, String> {
    
    /**
     * Find data sources by user ID
     */
    List<DataSourceEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Find data sources by user ID with pagination
     */
    Page<DataSourceEntity> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    /**
     * Find data sources by type and user ID
     */
    List<DataSourceEntity> findByTypeAndUserIdOrderByCreatedAtDesc(
        DataSourceEntity.DataSourceType type, String userId);
    
    /**
     * Find data sources by status and user ID
     */
    List<DataSourceEntity> findByStatusAndUserIdOrderByCreatedAtDesc(
        DataSourceEntity.DataSourceStatus status, String userId);
    
    /**
     * Find selected data sources by user ID
     */
    List<DataSourceEntity> findByIsSelectedTrueAndUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Search data sources by name or description
     */
    @Query("SELECT ds FROM DataSourceEntity ds WHERE ds.userId = :userId AND " +
           "(LOWER(ds.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(ds.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<DataSourceEntity> searchByQuery(@Param("userId") String userId, @Param("query") String query);
    
    /**
     * Find data sources created between dates
     */
    List<DataSourceEntity> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
        String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Count data sources by type and user ID
     */
    long countByTypeAndUserId(DataSourceEntity.DataSourceType type, String userId);
    
    /**
     * Count data sources by status and user ID
     */
    long countByStatusAndUserId(DataSourceEntity.DataSourceStatus status, String userId);
    
    /**
     * Find data sources by confidence score range
     */
    List<DataSourceEntity> findByUserIdAndConfidenceScoreBetweenOrderByConfidenceScoreDesc(
        String userId, Double minScore, Double maxScore);
    
    /**
     * Find data sources by file type
     */
    List<DataSourceEntity> findByUserIdAndFileTypeOrderByCreatedAtDesc(String userId, String fileType);
    
    /**
     * Find data sources with high confidence scores
     */
    @Query("SELECT ds FROM DataSourceEntity ds WHERE ds.userId = :userId AND ds.confidenceScore >= :minConfidence")
    List<DataSourceEntity> findHighConfidenceSources(@Param("userId") String userId, @Param("minConfidence") Double minConfidence);
    
    /**
     * Find data sources that need processing
     */
    List<DataSourceEntity> findByStatusInAndUserIdOrderByCreatedAtAsc(
        List<DataSourceEntity.DataSourceStatus> statuses, String userId);
    
    /**
     * Find data sources by metadata key-value pair
     * Note: This method is temporarily disabled due to HQL limitations with Map collections
     */
    // @Query("SELECT ds FROM DataSourceEntity ds WHERE ds.userId = :userId AND KEY(ds.metadata) = :key AND VALUE(ds.metadata) = :value")
    // List<DataSourceEntity> findByMetadataKeyValue(@Param("userId") String userId, @Param("key") String key, @Param("value") String value);
}
