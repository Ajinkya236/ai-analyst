package com.aianalyst.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Metrics Service
 * 
 * Service for collecting and managing application metrics.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsService {
    
    private final MeterRegistry meterRegistry;
    
    // Counters
    private Counter userRegistrations;
    private Counter userLogins;
    private Counter reportsCreated;
    private Counter aiAgentExecutions;
    private Counter dataSourcesProcessed;
    private Counter apiRequests;
    private Counter apiErrors;
    
    // Timers
    private Timer reportGenerationTime;
    private Timer aiAgentExecutionTime;
    private Timer dataProcessingTime;
    private Timer apiResponseTime;
    
    // Gauges
    private final AtomicLong activeUsers = new AtomicLong(0);
    private final AtomicLong activeReports = new AtomicLong(0);
    private final AtomicLong activeAiAgents = new AtomicLong(0);
    private final AtomicLong dataSourcesInQueue = new AtomicLong(0);
    
    @PostConstruct
    public void init() {
        // Initialize counters
        userRegistrations = Counter.builder("user.registrations")
                .description("Total number of user registrations")
                .register(meterRegistry);
        
        userLogins = Counter.builder("user.logins")
                .description("Total number of user logins")
                .register(meterRegistry);
        
        reportsCreated = Counter.builder("reports.created")
                .description("Total number of reports created")
                .register(meterRegistry);
        
        aiAgentExecutions = Counter.builder("ai.agent.executions")
                .description("Total number of AI agent executions")
                .register(meterRegistry);
        
        dataSourcesProcessed = Counter.builder("data.sources.processed")
                .description("Total number of data sources processed")
                .register(meterRegistry);
        
        apiRequests = Counter.builder("api.requests")
                .description("Total number of API requests")
                .register(meterRegistry);
        
        apiErrors = Counter.builder("api.errors")
                .description("Total number of API errors")
                .register(meterRegistry);
        
        // Initialize timers
        reportGenerationTime = Timer.builder("reports.generation.time")
                .description("Time taken to generate reports")
                .register(meterRegistry);
        
        aiAgentExecutionTime = Timer.builder("ai.agent.execution.time")
                .description("Time taken to execute AI agents")
                .register(meterRegistry);
        
        dataProcessingTime = Timer.builder("data.processing.time")
                .description("Time taken to process data sources")
                .register(meterRegistry);
        
        apiResponseTime = Timer.builder("api.response.time")
                .description("API response time")
                .register(meterRegistry);
        
        log.info("Metrics service initialized");
    }
    
    // User Metrics
    public void recordUserRegistration() {
        userRegistrations.increment();
        log.debug("User registration recorded");
    }
    
    public void recordUserLogin() {
        userLogins.increment();
        log.debug("User login recorded");
    }
    
    public void incrementActiveUsers() {
        activeUsers.incrementAndGet();
        log.debug("Active users incremented: {}", activeUsers.get());
    }
    
    public void decrementActiveUsers() {
        activeUsers.decrementAndGet();
        log.debug("Active users decremented: {}", activeUsers.get());
    }
    
    // Report Metrics
    public void recordReportCreated() {
        reportsCreated.increment();
        log.debug("Report creation recorded");
    }
    
    public void incrementActiveReports() {
        activeReports.incrementAndGet();
        log.debug("Active reports incremented: {}", activeReports.get());
    }
    
    public void decrementActiveReports() {
        activeReports.decrementAndGet();
        log.debug("Active reports decremented: {}", activeReports.get());
    }
    
    public Timer.Sample startReportGeneration() {
        return Timer.start(meterRegistry);
    }
    
    public void recordReportGenerationTime(Timer.Sample sample) {
        sample.stop(reportGenerationTime);
        log.debug("Report generation time recorded");
    }
    
    // AI Agent Metrics
    public void recordAiAgentExecution(String agentType) {
        aiAgentExecutions.increment();
        log.debug("AI agent execution recorded: {}", agentType);
    }
    
    public void incrementActiveAiAgents() {
        activeAiAgents.incrementAndGet();
        log.debug("Active AI agents incremented: {}", activeAiAgents.get());
    }
    
    public void decrementActiveAiAgents() {
        activeAiAgents.decrementAndGet();
        log.debug("Active AI agents decremented: {}", activeAiAgents.get());
    }
    
    public Timer.Sample startAiAgentExecution() {
        return Timer.start(meterRegistry);
    }
    
    public void recordAiAgentExecutionTime(Timer.Sample sample) {
        sample.stop(aiAgentExecutionTime);
        log.debug("AI agent execution time recorded");
    }
    
    // Data Processing Metrics
    public void recordDataSourceProcessed() {
        dataSourcesProcessed.increment();
        log.debug("Data source processing recorded");
    }
    
    public void incrementDataSourcesInQueue() {
        dataSourcesInQueue.incrementAndGet();
        log.debug("Data sources in queue incremented: {}", dataSourcesInQueue.get());
    }
    
    public void decrementDataSourcesInQueue() {
        dataSourcesInQueue.decrementAndGet();
        log.debug("Data sources in queue decremented: {}", dataSourcesInQueue.get());
    }
    
    public Timer.Sample startDataProcessing() {
        return Timer.start(meterRegistry);
    }
    
    public void recordDataProcessingTime(Timer.Sample sample) {
        sample.stop(dataProcessingTime);
        log.debug("Data processing time recorded");
    }
    
    // API Metrics
    public void recordApiRequest(String endpoint, String method) {
        apiRequests.increment();
        log.debug("API request recorded: {} {}", method, endpoint);
    }
    
    public void recordApiError(String endpoint, String method, String errorType) {
        apiErrors.increment();
        log.debug("API error recorded: {} {} - {}", method, endpoint, errorType);
    }
    
    public Timer.Sample startApiRequest() {
        return Timer.start(meterRegistry);
    }
    
    public void recordApiResponseTime(Timer.Sample sample, String endpoint, String method) {
        sample.stop(apiResponseTime);
        log.debug("API response time recorded: {} {}", method, endpoint);
    }
    
    // Health Metrics
    public void recordHealthCheck(String component, boolean healthy) {
        log.debug("Health check recorded: {} = {}", component, healthy);
    }
    
    // Get Current Metrics
    public long getActiveUsers() {
        return activeUsers.get();
    }
    
    public long getActiveReports() {
        return activeReports.get();
    }
    
    public long getActiveAiAgents() {
        return activeAiAgents.get();
    }
    
    public long getDataSourcesInQueue() {
        return dataSourcesInQueue.get();
    }
    
    // Custom Metrics
    public void recordCustomMetric(String name, String description, double value, String... tags) {
        log.debug("Custom metric recorded: {} = {}", name, value);
    }
    
    public void recordCustomCounter(String name, String description, String... tags) {
        log.debug("Custom counter incremented: {}", name);
    }
    
    public void recordBusinessMetric(String metricName, double value, String... tags) {
        log.debug("Business metric recorded: {} = {}", metricName, value);
    }
    
    // Reset Metrics (for testing)
    public void resetMetrics() {
        activeUsers.set(0);
        activeReports.set(0);
        activeAiAgents.set(0);
        dataSourcesInQueue.set(0);
        log.info("Metrics reset");
    }
}