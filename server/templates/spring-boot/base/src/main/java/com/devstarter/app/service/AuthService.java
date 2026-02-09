package com.devstarter.app.service;

import com.devstarter.app.model.User;
import com.devstarter.app.security.JwtTokenProvider;
import jakarta.validation.ValidationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserService userService, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResult register(String email, String password) {
        validateCredentials(email, password);

        if (userService.existsByEmail(email)) {
            throw new ResponseStatusException(CONFLICT, "Email already registered");
        }

        String passwordHash = passwordEncoder.encode(password);
        User user = userService.createUser(email, passwordHash);

        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());
        return new AuthResult(user.getId(), user.getEmail(), token);
    }

    public AuthResult login(String email, String password) {
        validateCredentials(email, password);

        User user;
        try {
            user = userService.getByEmail(email);
        } catch (Exception ex) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid credentials");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());
        return new AuthResult(user.getId(), user.getEmail(), token);
    }

    private void validateCredentials(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new ValidationException("Email is required");
        }
        if (password == null || password.length() < 8) {
            throw new ValidationException("Password must be at least 8 characters");
        }
    }

    public record AuthResult(Long userId, String email, String token) {
    }
}
