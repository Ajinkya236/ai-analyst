package com.aianalyst.controller;

import com.aianalyst.dto.AIAgentDTO;
import com.aianalyst.dto.AgentExecutionDTO;
import com.aianalyst.service.AIAgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AI Agent Controller
 * 
 * REST controller for managing AI agents including triggering,
 * monitoring, and configuration management.
 */
@RestController
@RequestMapping("/ai-agents")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AIAgentController {
    
    private final AIAgentService aiAgentService;
    
    /**
     * Get all AI agents
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAgents(
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting AI agents for user: {}", userId);
        Map<String, Object> agents = aiAgentService.getAgents(userId);
        return ResponseEntity.ok(agents);
    }
    
    /**
     * Get agent by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAgent(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting AI agent: {} for user: {}", id, userId);
        Map<String, Object> agent = aiAgentService.getAgent(id, userId);
        return ResponseEntity.ok(agent);
    }
    
    /**
     * Create new agent
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createAgent(
            @RequestBody AIAgentDTO agentDTO,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Creating AI agent: {} for user: {}", agentDTO.getName(), userId);
        // Convert DTO to Map for service call
        Map<String, Object> agentData = Map.of(
            "name", agentDTO.getName(),
            "type", agentDTO.getType(),
            "description", agentDTO.getDescription(),
            "parameters", agentDTO.getParameters()
        );
        Map<String, Object> agent = aiAgentService.createAgent(agentData, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(agent);
    }
    
    /**
     * Update agent configuration
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateAgent(
            @PathVariable String id,
            @RequestBody AIAgentDTO updates,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Updating AI agent: {} for user: {}", id, userId);
        // Convert DTO to Map for service call
        Map<String, Object> agentData = Map.of(
            "name", updates.getName(),
            "type", updates.getType(),
            "description", updates.getDescription(),
            "parameters", updates.getParameters()
        );
        Map<String, Object> agent = aiAgentService.updateAgent(id, agentData, userId);
        return ResponseEntity.ok(agent);
    }
    
    /**
     * Delete agent
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Deleting AI agent: {} for user: {}", id, userId);
        aiAgentService.deleteAgent(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Trigger agent execution
     */
    @PostMapping("/{id}/trigger")
    public ResponseEntity<Map<String, Object>> triggerAgent(
            @PathVariable String id,
            @RequestBody Map<String, Object> input,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Triggering AI agent: {} for user: {}", id, userId);
        Map<String, Object> execution = aiAgentService.triggerAgent(id, input, userId);
        return ResponseEntity.ok(execution);
    }
    
    /**
     * Stop agent execution
     */
    @PostMapping("/{id}/stop")
    public ResponseEntity<Void> stopAgent(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Stopping AI agent: {} for user: {}", id, userId);
        aiAgentService.stopAgent(id, userId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get agent execution history
     */
    @GetMapping("/{id}/executions")
    public ResponseEntity<Map<String, Object>> getExecutionHistory(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting execution history for agent: {} and user: {}", id, userId);
        Map<String, Object> executions = aiAgentService.getExecutionHistory(id, userId);
        return ResponseEntity.ok(executions);
    }
    
    /**
     * Get agent metrics
     */
    @GetMapping("/{id}/metrics")
    public ResponseEntity<Map<String, Object>> getAgentMetrics(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting metrics for agent: {} and user: {}", id, userId);
        Map<String, Object> metrics = aiAgentService.getAgentMetrics(id, userId);
        return ResponseEntity.ok(metrics);
    }
    
    /**
     * Get all agent executions
     */
    @GetMapping("/executions")
    public ResponseEntity<List<AgentExecutionDTO>> getAllExecutions(
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting all executions for user: {}", userId);
        // This would be implemented to get all executions for the user
        return ResponseEntity.ok(List.of());
    }
    
    /**
     * Get execution by ID
     */
    @GetMapping("/executions/{executionId}")
    public ResponseEntity<AgentExecutionDTO> getExecution(
            @PathVariable String executionId,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting execution: {} for user: {}", executionId, userId);
        // This would be implemented to get specific execution
        return ResponseEntity.ok(new AgentExecutionDTO());
    }
    
    /**
     * Cancel execution
     */
    @PostMapping("/executions/{executionId}/cancel")
    public ResponseEntity<Void> cancelExecution(
            @PathVariable String executionId,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Cancelling execution: {} for user: {}", executionId, userId);
        // This would be implemented to cancel execution
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get agent health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getAgentHealth(
            @RequestParam(required = false) String agentId,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting agent health for user: {}", userId);
        // This would be implemented to get agent health status
        return ResponseEntity.ok(Map.of("status", "healthy"));
    }
    
    /**
     * Restart agent
     */
    @PostMapping("/{id}/restart")
    public ResponseEntity<Void> restartAgent(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Restarting AI agent: {} for user: {}", id, userId);
        // This would be implemented to restart agent
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get agent capabilities
     */
    @GetMapping("/{id}/capabilities")
    public ResponseEntity<Map<String, Object>> getAgentCapabilities(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting capabilities for agent: {} and user: {}", id, userId);
        // This would be implemented to get agent capabilities
        return ResponseEntity.ok(Map.of("capabilities", List.of()));
    }
    
    /**
     * Validate agent input
     */
    @PostMapping("/{id}/validate-input")
    public ResponseEntity<Map<String, Object>> validateAgentInput(
            @PathVariable String id,
            @RequestBody Map<String, Object> input,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Validating input for agent: {} and user: {}", id, userId);
        // This would be implemented to validate agent input
        return ResponseEntity.ok(Map.of("valid", true));
    }
    
    /**
     * Get agent output schema
     */
    @GetMapping("/{id}/output-schema")
    public ResponseEntity<Map<String, Object>> getAgentOutputSchema(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        log.info("Getting output schema for agent: {} and user: {}", id, userId);
        // This would be implemented to get agent output schema
        return ResponseEntity.ok(Map.of("schema", Map.of()));
    }
}
