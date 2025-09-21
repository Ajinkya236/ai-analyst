package com.aianalyst.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class AIAgentService {
    
    @Value("${ai.agents.base-url:http://localhost:8001}")
    private String aiAgentsBaseUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public AIAgentService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    public CompletableFuture<Map<String, Object>> processDataSources(Map<String, Object> request) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String url = aiAgentsBaseUrl + "/api/data-ingestion/process";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
                
                if (response.getStatusCode() == HttpStatus.OK) {
                    return (Map<String, Object>) response.getBody();
                } else {
                    throw new RuntimeException("AI agent service returned error: " + response.getStatusCode());
                }
            } catch (Exception e) {
                throw new RuntimeException("Error calling AI agent service: " + e.getMessage(), e);
            }
        });
    }
    
    public Map<String, Object> getDataIngestionStatus(String sessionId) {
        try {
            String url = aiAgentsBaseUrl + "/api/data-ingestion/status/" + sessionId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return (Map<String, Object>) response.getBody();
            } else {
                throw new RuntimeException("AI agent service returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error calling AI agent service: " + e.getMessage(), e);
        }
    }
    
    public boolean isHealthy() {
        try {
            String url = aiAgentsBaseUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Additional methods for AIAgentController
    public Map<String, Object> getAgents(String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents?user_id=" + userId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error getting agents: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> getAgent(String agentId, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents/" + agentId + "?user_id=" + userId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error getting agent: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> createAgent(Map<String, Object> agentData, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents?user_id=" + userId;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(agentData, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error creating agent: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> updateAgent(String agentId, Map<String, Object> agentData, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents/" + agentId + "?user_id=" + userId;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(agentData, headers);
            restTemplate.put(url, entity);
            return Map.of("status", "success", "message", "Agent updated successfully");
        } catch (Exception e) {
            throw new RuntimeException("Error updating agent: " + e.getMessage(), e);
        }
    }
    
    public void deleteAgent(String agentId, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents/" + agentId + "?user_id=" + userId;
            restTemplate.delete(url);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting agent: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> triggerAgent(String agentId, Map<String, Object> input, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents/" + agentId + "/trigger?user_id=" + userId;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(input, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error triggering agent: " + e.getMessage(), e);
        }
    }
    
    public void stopAgent(String agentId, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents/" + agentId + "/stop?user_id=" + userId;
            restTemplate.postForEntity(url, null, Void.class);
        } catch (Exception e) {
            throw new RuntimeException("Error stopping agent: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> getExecutionHistory(String agentId, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents/" + agentId + "/history?user_id=" + userId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error getting execution history: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> getAgentMetrics(String agentId, String userId) {
        try {
            String url = aiAgentsBaseUrl + "/api/agents/" + agentId + "/metrics?user_id=" + userId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error getting agent metrics: " + e.getMessage(), e);
        }
    }
    
    // Placeholder methods for agent-specific operations
    public Map<String, Object> getFounderVoiceStatus(String sessionId) {
        return Map.of("status", "placeholder", "message", "Founder voice status not implemented");
    }
    
    public Map<String, Object> getInvestmentMemoStatus(String sessionId) {
        return Map.of("status", "placeholder", "message", "Investment memo status not implemented");
    }
}