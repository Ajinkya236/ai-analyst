package com.aianalyst.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Visualization Entity
 * 
 * Represents charts, graphs, and other visual elements in memos.
 * Stores visualization data and configuration.
 */
@Entity
@Table(name = "visualizations")
@Data
@EqualsAndHashCode(callSuper = false)
public class VisualizationEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private MemoSectionEntity section;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private VisualizationType type;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "data", columnDefinition = "LONGTEXT")
    private String data; // JSON data
    
    @Column(name = "config", columnDefinition = "LONGTEXT")
    private String config; // JSON configuration
    
    @Column(name = "file_path")
    private String filePath; // For generated image files
    
    @Column(name = "order_index")
    private Integer orderIndex = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum VisualizationType {
        CHART,
        GRAPH,
        TABLE,
        TIMELINE,
        METRIC_CARD
    }
}
