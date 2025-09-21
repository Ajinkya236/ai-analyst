package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * SMS Service
 * 
 * Service for sending SMS messages.
 * Handles survey invitations and notifications via SMS.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SMSService {
    
    private final TwilioService twilioService;
    
    /**
     * Send SMS
     */
    public String sendSMS(String phoneNumber, String message) {
        log.info("Sending SMS to: {} with message length: {}", phoneNumber, message.length());
        
        try {
            String messageSid = twilioService.sendSMS(phoneNumber, message);
            log.info("SMS sent successfully with SID: {}", messageSid);
            return messageSid;
            
        } catch (Exception e) {
            log.error("Error sending SMS to {}: {}", phoneNumber, e.getMessage(), e);
            throw new RuntimeException("Failed to send SMS: " + e.getMessage());
        }
    }
    
    /**
     * Send SMS with link
     */
    public String sendSMSWithLink(String phoneNumber, String message, String link) {
        log.info("Sending SMS with link to: {} with message length: {}", phoneNumber, message.length());
        
        try {
            String fullMessage = message + "\n\n" + link;
            return sendSMS(phoneNumber, fullMessage);
            
        } catch (Exception e) {
            log.error("Error sending SMS with link to {}: {}", phoneNumber, e.getMessage(), e);
            throw new RuntimeException("Failed to send SMS with link: " + e.getMessage());
        }
    }
    
    /**
     * Send SMS with short link
     */
    public String sendSMSWithShortLink(String phoneNumber, String message, String link) {
        log.info("Sending SMS with short link to: {} with message length: {}", phoneNumber, message.length());
        
        try {
            // In a real implementation, this would use a URL shortener service
            String shortLink = "https://ai-analyst.com/s/" + link.substring(link.lastIndexOf("/") + 1);
            return sendSMSWithLink(phoneNumber, message, shortLink);
            
        } catch (Exception e) {
            log.error("Error sending SMS with short link to {}: {}", phoneNumber, e.getMessage(), e);
            throw new RuntimeException("Failed to send SMS with short link: " + e.getMessage());
        }
    }
}
