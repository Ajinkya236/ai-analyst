package com.aianalyst.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Memo Subsection Entity
 * 
 * Represents subsections within memo sections.
 * Provides granular content organization and scoring.
 */
@Entity
@Table(name = "memo_subsections")
@Data
@EqualsAndHashCode(callSuper = false)
public class MemoSubsectionEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private MemoSectionEntity section;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;
    
    @Column(name = "weight")
    private Double weight = 1.0;
    
    @Column(name = "confidence")
    private Double confidence = 0.0;
    
    @Column(name = "order_index")
    private Integer orderIndex = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
