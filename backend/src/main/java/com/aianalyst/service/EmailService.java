package com.aianalyst.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Email Service
 * 
 * Service for sending emails through SMTP.
 * Handles survey invitations and notifications.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:}")
    private String fromEmail;
    
    /**
     * Send email
     */
    public void sendEmail(String to, String subject, String body) {
        log.info("Sending email to: {} with subject: {}", to, subject);
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
            
        } catch (Exception e) {
            log.error("Error sending email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
    
    /**
     * Send HTML email
     */
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        log.info("Sending HTML email to: {} with subject: {}", to, subject);
        
        try {
            // In a real implementation, this would use MimeMessage for HTML emails
            // For now, use simple text email
            sendEmail(to, subject, htmlBody);
            
        } catch (Exception e) {
            log.error("Error sending HTML email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send HTML email: " + e.getMessage());
        }
    }
    
    /**
     * Send email with attachment
     */
    public void sendEmailWithAttachment(String to, String subject, String body, String attachmentPath) {
        log.info("Sending email with attachment to: {} with subject: {}", to, subject);
        
        try {
            // In a real implementation, this would use MimeMessage with attachments
            // For now, use simple text email
            sendEmail(to, subject, body + "\n\nAttachment: " + attachmentPath);
            
        } catch (Exception e) {
            log.error("Error sending email with attachment to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email with attachment: " + e.getMessage());
        }
    }
}
