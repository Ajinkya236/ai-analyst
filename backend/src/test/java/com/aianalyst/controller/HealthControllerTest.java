package com.aianalyst.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    private final HealthController healthController = new HealthController();

    @Test
    void health_ShouldReturnOk() {
        // When
        ResponseEntity<Map<String, Object>> response = healthController.health();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
    }

    @Test
    void readiness_ShouldReturnOk() {
        // When
        ResponseEntity<Map<String, Object>> response = healthController.readiness();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("READY", response.getBody().get("status"));
    }

    @Test
    void liveness_ShouldReturnOk() {
        // When
        ResponseEntity<Map<String, Object>> response = healthController.liveness();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("ALIVE", response.getBody().get("status"));
    }
}
