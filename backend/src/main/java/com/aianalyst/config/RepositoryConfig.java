package com.aianalyst.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

/**
 * Repository Configuration
 * 
 * Separates JPA and Redis repository configurations to avoid conflicts.
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.aianalyst.repository")
@EnableRedisRepositories(basePackages = "com.aianalyst.redis.repository")
public class RepositoryConfig {
    // Configuration class to separate JPA and Redis repositories
}
