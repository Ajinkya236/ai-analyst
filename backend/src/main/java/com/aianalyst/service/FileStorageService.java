package com.aianalyst.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * File Storage Service
 * 
 * Service for handling file uploads and storage operations.
 * Supports local file system storage with plans for S3 integration.
 */
@Service
@Slf4j
public class FileStorageService {
    
    @Value("${storage.local.path:./uploads}")
    private String storagePath;
    
    @Value("${storage.type:local}")
    private String storageType;
    
    /**
     * Store uploaded file
     */
    public String storeFile(MultipartFile file) throws IOException {
        log.info("Storing file: {} with size: {} bytes", file.getOriginalFilename(), file.getSize());
        
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + extension;
        
        // Create storage directory if it doesn't exist
        Path storageDir = Paths.get(storagePath);
        if (!Files.exists(storageDir)) {
            Files.createDirectories(storageDir);
        }
        
        // Store file
        Path targetLocation = storageDir.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        String filePath = targetLocation.toString();
        log.info("File stored successfully at: {}", filePath);
        return filePath;
    }
    
    /**
     * Delete file
     */
    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                log.info("File deleted successfully: {}", filePath);
            } else {
                log.warn("File not found for deletion: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", filePath, e);
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }
    
    /**
     * Get file content as byte array
     */
    public byte[] getFileContent(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new RuntimeException("File not found: " + filePath);
        }
        return Files.readAllBytes(path);
    }
    
    /**
     * Check if file exists
     */
    public boolean fileExists(String filePath) {
        return Files.exists(Paths.get(filePath));
    }
    
    /**
     * Get file size
     */
    public long getFileSize(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new RuntimeException("File not found: " + filePath);
        }
        return Files.size(path);
    }
    
    /**
     * Get file extension
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
    
    /**
     * Validate file type
     */
    public boolean isValidFileType(String filename, String[] allowedTypes) {
        String extension = getFileExtension(filename).toLowerCase();
        for (String allowedType : allowedTypes) {
            if (extension.equals(allowedType.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get allowed file types for different data source types
     */
    public String[] getAllowedFileTypes(String dataSourceType) {
        switch (dataSourceType.toLowerCase()) {
            case "document":
                return new String[]{".pdf", ".docx", ".doc", ".ppt", ".pptx", ".txt"};
            case "video":
                return new String[]{".mp4", ".avi", ".mov", ".wmv", ".flv"};
            case "audio":
                return new String[]{".mp3", ".wav", ".m4a", ".aac", ".ogg"};
            case "image":
                return new String[]{".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"};
            default:
                return new String[]{".pdf", ".docx", ".doc", ".ppt", ".pptx", ".txt", ".mp4", ".mp3", ".jpg", ".png"};
        }
    }
}
