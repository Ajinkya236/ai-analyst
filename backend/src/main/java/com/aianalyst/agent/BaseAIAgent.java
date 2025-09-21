package com.aianalyst.agent;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Base AI Agent
 *
 * Abstract base class for all AI agents providing common functionality.
 */
@Slf4j
@Component
public abstract class BaseAIAgent {

    /**
     * Execute the agent workflow
     *
     * @param input Input data for the agent
     * @return CompletableFuture containing the result
     */
    public abstract CompletableFuture<Map<String, Object>> execute(Map<String, Object> input);

    /**
     * Get the agent name
     *
     * @return Agent name
     */
    public abstract String getAgentName();

    /**
     * Validate input data
     *
     * @param input Input data to validate
     * @return true if valid, false otherwise
     */
    protected boolean validateInput(Map<String, Object> input) {
        if (input == null || input.isEmpty()) {
            log.warn("Input data is null or empty for agent: {}", getAgentName());
            return false;
        }
        return true;
    }

    /**
     * Log agent execution start
     *
     * @param input Input data
     */
    protected void logExecutionStart(Map<String, Object> input) {
        log.info("Starting execution of agent: {} with input size: {}", getAgentName(), input.size());
    }

    /**
     * Log agent execution completion
     *
     * @param result Result data
     */
    protected void logExecutionComplete(Map<String, Object> result) {
        log.info("Completed execution of agent: {} with result size: {}", getAgentName(), result.size());
    }

    /**
     * Log agent execution error
     *
     * @param error Error message
     * @param throwable Exception
     */
    protected void logExecutionError(String error, Throwable throwable) {
        log.error("Error in agent {}: {}", getAgentName(), error, throwable);
    }
}