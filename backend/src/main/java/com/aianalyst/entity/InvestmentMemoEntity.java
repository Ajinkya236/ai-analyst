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
 * Investment Memo Entity
 * 
 * Represents AI-generated and curated investment memos.
 * Includes Stage 1 (AI-generated) and Stage 2 (curated) memo types.
 */
@Entity
@Table(name = "investment_memos")
@Data
@EqualsAndHashCode(callSuper = false)
public class InvestmentMemoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "version", nullable = false)
    private Integer version = 1;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "stage", nullable = false)
    private MemoStage stage;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MemoStatus status;
    
    @OneToMany(mappedBy = "memo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MemoSectionEntity> sections;
    
    @ElementCollection
    @CollectionTable(name = "memo_preferences", joinColumns = @JoinColumn(name = "memo_id"))
    @MapKeyColumn(name = "preference_key")
    @Column(name = "preference_value", columnDefinition = "TEXT")
    private Map<String, String> preferences;
    
    @Column(name = "generated_by")
    private String generatedBy; // AI agent identifier
    
    @Column(name = "file_path")
    private String filePath;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "download_count")
    private Integer downloadCount = 0;
    
    @Column(name = "user_id")
    private String userId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum MemoStage {
        STAGE_1, // AI-Generated
        STAGE_2  // Curated
    }
    
    public enum MemoStatus {
        GENERATING,
        COMPLETED,
        REVIEWING,
        APPROVED,
        REJECTED
    }
}
