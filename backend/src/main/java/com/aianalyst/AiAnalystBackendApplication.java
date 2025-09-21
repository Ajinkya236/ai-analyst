package com.aianalyst;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * AI Analyst Backend Application
 * 
 * Main Spring Boot application for the AI Analyst VC Investment Memo App.
 * Provides backend services for data collection, AI agent orchestration,
 * and investment memo generation.
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
public class AiAnalystBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiAnalystBackendApplication.class, args);
    }
}
