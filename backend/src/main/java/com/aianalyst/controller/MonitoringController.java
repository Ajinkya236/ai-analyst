package com.aianalyst.controller;

import com.aianalyst.service.MetricsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Monitoring Controller
 * 
 * REST controller for monitoring and metrics endpoints.
 */
@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class MonitoringController {
    
    private final MetricsService metricsService;
    
    /**
     * Get application metrics summary
     */
    @GetMapping("/metrics/summary")
    public ResponseEntity<Map<String, Object>> getMetricsSummary() {
        log.debug("Metrics summary requested");
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("timestamp", LocalDateTime.now());
        summary.put("activeUsers", metricsService.getActiveUsers());
        summary.put("activeReports", metricsService.getActiveReports());
        summary.put("activeAiAgents", metricsService.getActiveAiAgents());
        summary.put("dataSourcesInQueue", metricsService.getDataSourcesInQueue());
        
        return ResponseEntity.ok(summary);
    }
    
    /**
     * Get business metrics
     */
    @GetMapping("/metrics/business")
    public ResponseEntity<Map<String, Object>> getBusinessMetrics() {
        log.debug("Business metrics requested");
        
        Map<String, Object> businessMetrics = new HashMap<>();
        businessMetrics.put("timestamp", LocalDateTime.now());
        businessMetrics.put("activeUsers", metricsService.getActiveUsers());
        businessMetrics.put("activeReports", metricsService.getActiveReports());
        businessMetrics.put("activeAiAgents", metricsService.getActiveAiAgents());
        businessMetrics.put("dataSourcesInQueue", metricsService.getDataSourcesInQueue());
        
        return ResponseEntity.ok(businessMetrics);
    }
    
    /**
     * Record custom metric
     */
    @PostMapping("/metrics/custom")
    public ResponseEntity<Map<String, String>> recordCustomMetric(
            @RequestBody Map<String, Object> metricData) {
        
        String name = (String) metricData.get("name");
        String description = (String) metricData.get("description");
        Double value = (Double) metricData.get("value");
        String[] tags = ((String) metricData.getOrDefault("tags", "")).split(",");
        
        if (name == null || value == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Name and value are required"));
        }
        
        metricsService.recordCustomMetric(name, description, value, tags);
        
        log.info("Custom metric recorded: {} = {}", name, value);
        return ResponseEntity.ok(Map.of("message", "Metric recorded successfully"));
    }
    
    /**
     * Record custom counter
     */
    @PostMapping("/metrics/counter")
    public ResponseEntity<Map<String, String>> recordCustomCounter(
            @RequestBody Map<String, Object> counterData) {
        
        String name = (String) counterData.get("name");
        String description = (String) counterData.get("description");
        String[] tags = ((String) counterData.getOrDefault("tags", "")).split(",");
        
        if (name == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Name is required"));
        }
        
        metricsService.recordCustomCounter(name, description, tags);
        
        log.info("Custom counter incremented: {}", name);
        return ResponseEntity.ok(Map.of("message", "Counter incremented successfully"));
    }
    
    /**
     * Record business metric
     */
    @PostMapping("/metrics/business")
    public ResponseEntity<Map<String, String>> recordBusinessMetric(
            @RequestBody Map<String, Object> businessData) {
        
        String metricName = (String) businessData.get("metricName");
        Double value = (Double) businessData.get("value");
        String[] tags = ((String) businessData.getOrDefault("tags", "")).split(",");
        
        if (metricName == null || value == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Metric name and value are required"));
        }
        
        metricsService.recordBusinessMetric(metricName, value, tags);
        
        log.info("Business metric recorded: {} = {}", metricName, value);
        return ResponseEntity.ok(Map.of("message", "Business metric recorded successfully"));
    }
    
    /**
     * Record health check
     */
    @PostMapping("/health/check")
    public ResponseEntity<Map<String, String>> recordHealthCheck(
            @RequestBody Map<String, Object> healthData) {
        
        String component = (String) healthData.get("component");
        Boolean healthy = (Boolean) healthData.get("healthy");
        
        if (component == null || healthy == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Component and healthy status are required"));
        }
        
        metricsService.recordHealthCheck(component, healthy);
        
        log.info("Health check recorded: {} = {}", component, healthy);
        return ResponseEntity.ok(Map.of("message", "Health check recorded successfully"));
    }
    
    /**
     * Reset metrics (for testing)
     */
    @PostMapping("/metrics/reset")
    public ResponseEntity<Map<String, String>> resetMetrics() {
        metricsService.resetMetrics();
        
        log.info("Metrics reset requested");
        return ResponseEntity.ok(Map.of("message", "Metrics reset successfully"));
    }
    
    /**
     * Get application status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getApplicationStatus() {
        log.debug("Application status requested");
        
        Map<String, Object> status = new HashMap<>();
        status.put("timestamp", LocalDateTime.now());
        status.put("status", "UP");
        status.put("version", "1.0.0");
        status.put("uptime", System.currentTimeMillis() - System.currentTimeMillis()); // Placeholder
        status.put("activeUsers", metricsService.getActiveUsers());
        status.put("activeReports", metricsService.getActiveReports());
        status.put("activeAiAgents", metricsService.getActiveAiAgents());
        status.put("dataSourcesInQueue", metricsService.getDataSourcesInQueue());
        
        return ResponseEntity.ok(status);
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "timestamp", LocalDateTime.now(),
                "service", "monitoring"
        ));
    }
}

