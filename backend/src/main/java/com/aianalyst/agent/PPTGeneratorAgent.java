package com.aianalyst.agent;

import com.aianalyst.service.AIAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.CompletableFuture;

@Component
public class PPTGeneratorAgent extends BaseAIAgent {
    
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
            request.put("startup_data", input.get("startup_data"));
            request.put("user_id", input.get("user_id"));
            request.put("session_id", input.get("session_id"));
            
            // Call AI agent service - using processDataSources as placeholder
            return aiAgentService.processDataSources(request)
                .thenApply(result -> {
                    logExecutionComplete(result);
                    return result;
                })
                .exceptionally(throwable -> {
                    logExecutionError("PPT generation failed", throwable);
                    Map<String, Object> errorResult = new HashMap<>();
                    errorResult.put("status", "failed");
                    errorResult.put("error", throwable.getMessage());
                    return errorResult;
                });
        } catch (Exception e) {
            logExecutionError("PPT generation failed", e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "failed");
            errorResult.put("error", e.getMessage());
            return CompletableFuture.completedFuture(errorResult);
        }
    }
    
    @Override
    public String getAgentName() {
        return "PPTGeneratorAgent";
    }
    
    public Map<String, Object> getStatus(String sessionId) {
        return aiAgentService.getInvestmentMemoStatus(sessionId);
    }
}