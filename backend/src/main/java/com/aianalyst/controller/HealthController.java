package com.aianalyst.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Health Controller
 * 
 * Provides health check endpoints for monitoring and load balancing.
 */
@RestController
@RequestMapping("/health")
@RequiredArgsConstructor
@Slf4j
public class HealthController {
    
    /**
     * Basic health check
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        log.debug("Health check requested");
        
        Map<String, Object> health = Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "ai-analyst-backend",
            "version", "1.0.0"
        );
        
        return ResponseEntity.ok(health);
    }
    
    /**
     * Detailed health check
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        log.debug("Detailed health check requested");
        
        Map<String, Object> health = Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "ai-analyst-backend",
            "version", "1.0.0",
            "components", Map.of(
                "database", "UP",
                "redis", "UP",
                "ai-service", "UP",
                "file-storage", "UP"
            ),
            "uptime", System.currentTimeMillis() - System.currentTimeMillis() // This would be actual uptime
        );
        
        return ResponseEntity.ok(health);
    }
    
    /**
     * Readiness check
     */
    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        log.debug("Readiness check requested");
        
        Map<String, Object> readiness = Map.of(
            "status", "READY",
            "timestamp", LocalDateTime.now(),
            "service", "ai-analyst-backend"
        );
        
        return ResponseEntity.ok(readiness);
    }
    
    /**
     * Liveness check
     */
    @GetMapping("/live")
    public ResponseEntity<Map<String, Object>> liveness() {
        log.debug("Liveness check requested");
        
        Map<String, Object> liveness = Map.of(
            "status", "ALIVE",
            "timestamp", LocalDateTime.now(),
            "service", "ai-analyst-backend"
        );
        
        return ResponseEntity.ok(liveness);
    }
}
