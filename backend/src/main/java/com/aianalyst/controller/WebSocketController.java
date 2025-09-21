package com.aianalyst.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * WebSocket Controller
 * 
 * Handles WebSocket messages for real-time status updates
 * and notifications in the AI Analyst application.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Handle status update messages
     */
    @MessageMapping("/status-update")
    @SendTo("/topic/status-updates")
    public Map<String, Object> handleStatusUpdate(Map<String, Object> message) {
        log.debug("Received status update message: {}", message);
        
        // Process status update and broadcast to all subscribers
        Map<String, Object> response = Map.of(
            "timestamp", System.currentTimeMillis(),
            "type", "status-update",
            "data", message
        );
        
        return response;
    }
    
    /**
     * Handle agent execution updates
     */
    @MessageMapping("/agent-execution")
    @SendTo("/topic/agent-executions")
    public Map<String, Object> handleAgentExecution(Map<String, Object> message) {
        log.debug("Received agent execution message: {}", message);
        
        // Process agent execution update and broadcast to all subscribers
        Map<String, Object> response = Map.of(
            "timestamp", System.currentTimeMillis(),
            "type", "agent-execution",
            "data", message
        );
        
        return response;
    }
    
    /**
     * Handle memo generation updates
     */
    @MessageMapping("/memo-generation")
    @SendTo("/topic/memo-generations")
    public Map<String, Object> handleMemoGeneration(Map<String, Object> message) {
        log.debug("Received memo generation message: {}", message);
        
        // Process memo generation update and broadcast to all subscribers
        Map<String, Object> response = Map.of(
            "timestamp", System.currentTimeMillis(),
            "type", "memo-generation",
            "data", message
        );
        
        return response;
    }
    
    /**
     * Send notification to specific user
     */
    public void sendNotificationToUser(String userId, String type, Object data) {
        log.debug("Sending notification to user: {} with type: {}", userId, type);
        
        Map<String, Object> notification = Map.of(
            "timestamp", System.currentTimeMillis(),
            "type", type,
            "data", data
        );
        
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }
    
    /**
     * Send status update to specific user
     */
    public void sendStatusUpdateToUser(String userId, String status, Object data) {
        log.debug("Sending status update to user: {} with status: {}", userId, status);
        
        Map<String, Object> update = Map.of(
            "timestamp", System.currentTimeMillis(),
            "status", status,
            "data", data
        );
        
        messagingTemplate.convertAndSendToUser(userId, "/queue/status-updates", update);
    }
    
    /**
     * Broadcast message to all users
     */
    public void broadcastMessage(String topic, Object data) {
        log.debug("Broadcasting message to topic: {}", topic);
        
        Map<String, Object> message = Map.of(
            "timestamp", System.currentTimeMillis(),
            "data", data
        );
        
        messagingTemplate.convertAndSend(topic, message);
    }
}
