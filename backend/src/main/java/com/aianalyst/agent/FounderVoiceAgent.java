package com.aianalyst.agent;

import com.aianalyst.service.AIAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.CompletableFuture;

@Component
public class FounderVoiceAgent extends BaseAIAgent {
    
    @Autowired
    private AIAgentService aiAgentService;
    
    @Override
    public CompletableFuture<Map<String, Object>> execute(Map<String, Object> input) {
        logExecutionStart(input);
        
        if (!validateInput(input)) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "failed");
            errorResult.put("error", "Invalid input data");
            return CompletableFuture.completedFuture(errorResult);
        }
        
        try {
            // Prepare request for AI agent service
            Map<String, Object> request = new HashMap<>();
            request.put("founder_info", input.get("founder_info"));
            request.put("user_id", input.get("user_id"));
            request.put("session_id", input.get("session_id"));
            
            // Call AI agent service - using processDataSources as placeholder
            return aiAgentService.processDataSources(request)
                .thenApply(result -> {
                    logExecutionComplete(result);
                    return result;
                })
                .exceptionally(throwable -> {
                    logExecutionError("Founder voice analysis failed", throwable);
                    Map<String, Object> errorResult = new HashMap<>();
                    errorResult.put("status", "failed");
                    errorResult.put("error", throwable.getMessage());
                    return errorResult;
                });
        } catch (Exception e) {
            logExecutionError("Founder voice analysis failed", e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "failed");
            errorResult.put("error", e.getMessage());
            return CompletableFuture.completedFuture(errorResult);
        }
    }
    
    @Override
    public String getAgentName() {
        return "FounderVoiceAgent";
    }
    
    public Map<String, Object> getStatus(String sessionId) {
        return aiAgentService.getFounderVoiceStatus(sessionId);
    }
}
