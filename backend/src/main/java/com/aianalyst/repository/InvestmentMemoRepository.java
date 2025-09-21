package com.aianalyst.repository;

import com.aianalyst.entity.InvestmentMemoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentMemoRepository extends JpaRepository<InvestmentMemoEntity, String> {
    
    List<InvestmentMemoEntity> findByUserId(String userId);
    
    Optional<InvestmentMemoEntity> findByUserIdAndId(String userId, String id);
    
    Page<InvestmentMemoEntity> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    List<InvestmentMemoEntity> findByStatus(String status);
    
    List<InvestmentMemoEntity> findByUserIdAndStatus(String userId, String status);
    
    @Query("SELECT m FROM InvestmentMemoEntity m WHERE m.userId = :userId AND " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.companyName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<InvestmentMemoEntity> searchByQuery(@Param("userId") String userId, @Param("query") String query);
}