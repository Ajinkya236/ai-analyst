package com.aianalyst.config;

import com.aianalyst.interceptor.MonitoringInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration
 * 
 * Configures web MVC settings including interceptors.
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {
    
    private final MonitoringInterceptor monitoringInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(monitoringInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                    "/api/health/**",
                    "/api/actuator/**",
                    "/api/monitoring/health"
                );
    }
}

