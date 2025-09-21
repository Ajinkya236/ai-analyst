package com.aianalyst.interceptor;

import com.aianalyst.service.MetricsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Monitoring Interceptor
 * 
 * Intercepts HTTP requests to record metrics and performance data.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MonitoringInterceptor implements HandlerInterceptor {
    
    private final MetricsService metricsService;
    private final AtomicLong requestCounter = new AtomicLong(0);
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Record API request
        String endpoint = request.getRequestURI();
        String method = request.getMethod();
        
        metricsService.recordApiRequest(endpoint, method);
        
        // Store start time for response time calculation
        request.setAttribute("startTime", System.currentTimeMillis());
        
        // Increment request counter
        long requestNumber = requestCounter.incrementAndGet();
        request.setAttribute("requestNumber", requestNumber);
        
        log.debug("Request #{} started: {} {}", requestNumber, method, endpoint);
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                              Object handler, Exception ex) {
        
        // Calculate response time
        Long startTime = (Long) request.getAttribute("startTime");
        if (startTime != null) {
            long responseTime = System.currentTimeMillis() - startTime;
            
            String endpoint = request.getRequestURI();
            String method = request.getMethod();
            
            // Record response time
            metricsService.recordApiResponseTime(
                metricsService.startApiRequest(), 
                endpoint, 
                method
            );
            
            log.debug("Request completed: {} {} - {}ms", method, endpoint, responseTime);
        }
        
        // Record errors
        if (ex != null) {
            String endpoint = request.getRequestURI();
            String method = request.getMethod();
            String errorType = ex.getClass().getSimpleName();
            
            metricsService.recordApiError(endpoint, method, errorType);
            
            log.error("Request failed: {} {} - {}", method, endpoint, ex.getMessage());
        }
        
        // Record response status
        int status = response.getStatus();
        if (status >= 400) {
            String endpoint = request.getRequestURI();
            String method = request.getMethod();
            String errorType = "HTTP_" + status;
            
            metricsService.recordApiError(endpoint, method, errorType);
            
            log.warn("HTTP error: {} {} - Status: {}", method, endpoint, status);
        }
    }
}

