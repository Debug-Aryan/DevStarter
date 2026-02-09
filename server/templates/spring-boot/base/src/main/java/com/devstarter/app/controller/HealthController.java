package com.devstarter.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
    return Map.of(
        "success", true,
        "message", "Server healthy",
        "data", Map.of(
            "status", "ok",
            "timestamp", Instant.now().toString()
        )
    );
    }

    @GetMapping("/health/secure")
    public Map<String, Object> secureHealth() {
    return Map.of(
        "success", true,
        "message", "Authenticated",
        "data", Map.of(
            "status", "ok",
            "timestamp", Instant.now().toString()
        )
    );
    }
}
