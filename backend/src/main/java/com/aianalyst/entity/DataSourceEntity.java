package com.aianalyst.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Data Source Entity
 * 
 * Represents different types of data sources that can be ingested in Stage 0.
 * Includes file uploads, text input, URLs, and AI agent generated data.
 */
@Entity
@Table(name = "data_sources")
@Data
@EqualsAndHashCode(callSuper = false)
public class DataSourceEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private DataSourceType type;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "url")
    private String url;
    
    @Column(name = "file_path")
    private String filePath;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DataSourceStatus status;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @ElementCollection
    @CollectionTable(name = "data_source_metadata", joinColumns = @JoinColumn(name = "data_source_id"))
    @MapKeyColumn(name = "metadata_key")
    @Column(name = "metadata_value", columnDefinition = "TEXT")
    private Map<String, String> metadata;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "is_selected", nullable = false)
    private Boolean isSelected = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum DataSourceType {
        FILE_UPLOAD,
        TEXT_INPUT,
        URL_LINK,
        FOUNDER_VOICE,
        BEHAVIORAL_ASSESSMENT,
        DEEP_RESEARCH
    }
    
    public enum DataSourceStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED,
        ARCHIVED
    }
}
