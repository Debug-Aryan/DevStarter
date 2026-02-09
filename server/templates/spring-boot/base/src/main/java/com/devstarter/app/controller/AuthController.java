package com.devstarter.app.controller;

import com.devstarter.app.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request) {
        AuthService.AuthResult result = authService.register(request.email(), request.password());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registered successfully",
                "data", Map.of(
                        "user", Map.of(
                                "id", result.userId(),
                                "email", result.email()
                        ),
                        "token", result.token()
                )
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        AuthService.AuthResult result = authService.login(request.email(), request.password());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logged in successfully",
                "data", Map.of(
                        "user", Map.of(
                                "id", result.userId(),
                                "email", result.email()
                        ),
                        "token", result.token()
                )
        ));
    }

    public record AuthRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 100) String password
    ) {
    }
}
