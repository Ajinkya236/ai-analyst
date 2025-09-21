package com.aianalyst.repository;

import com.aianalyst.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * User Repository
 * 
 * Repository interface for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    
    /**
     * Find user by email
     */
    Optional<UserEntity> findByEmail(String email);
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);
    
    /**
     * Find users by role
     */
    List<UserEntity> findByRole(UserEntity.Role role);
    
    /**
     * Find enabled users
     */
    List<UserEntity> findByEnabledTrue();
    
    /**
     * Find users created after a specific date
     */
    @Query("SELECT u FROM UserEntity u WHERE u.createdAt >= :date")
    List<UserEntity> findUsersCreatedAfter(@Param("date") LocalDateTime date);
    
    /**
     * Find users by company
     */
    List<UserEntity> findByCompany(String company);
    
    /**
     * Count users by role
     */
    long countByRole(UserEntity.Role role);
    
    /**
     * Find users with last login before a specific date (inactive users)
     */
    @Query("SELECT u FROM UserEntity u WHERE u.lastLoginAt < :date OR u.lastLoginAt IS NULL")
    List<UserEntity> findInactiveUsers(@Param("date") LocalDateTime date);
    
    /**
     * Find users by partial name search
     */
    @Query("SELECT u FROM UserEntity u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<UserEntity> findByNameContaining(@Param("name") String name);
}

