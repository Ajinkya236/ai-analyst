package com.aianalyst.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Memo Section Entity
 * 
 * Represents individual sections within an investment memo.
 * Includes content, confidence scores, and visualizations.
 */
@Entity
@Table(name = "memo_sections")
@Data
@EqualsAndHashCode(callSuper = false)
public class MemoSectionEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memo_id", nullable = false)
    private InvestmentMemoEntity memo;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private SectionType type;
    
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;
    
    @Column(name = "weight")
    private Double weight = 1.0;
    
    @Column(name = "confidence")
    private Double confidence = 0.0;
    
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MemoSubsectionEntity> subsections;
    
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VisualizationEntity> visualizations;
    
    @Column(name = "order_index")
    private Integer orderIndex = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum SectionType {
        FOUNDER_PROFILE,
        PROBLEM_SIZING,
        DIFFERENTIATION,
        COMPANY_REVIEW,
        MARKET_ANALYSIS,
        COMPETITIVE_LANDSCAPE,
        FINANCIAL_PROJECTIONS,
        RISK_ASSESSMENT,
        RECOMMENDATION
    }
}
