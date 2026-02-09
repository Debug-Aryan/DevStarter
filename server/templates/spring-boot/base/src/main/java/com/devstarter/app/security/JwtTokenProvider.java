package com.devstarter.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final long expirationMs;
    private volatile SecretKey secretKey;

    public JwtTokenProvider(
            @Value("${app.jwt.secret:}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.expirationMs = expirationMs;
        this.secretKey = buildKey(secret);

        if (secret == null || secret.isBlank()) {
            log.warn("JWT secret not provided (JWT_SECRET/app.jwt.secret). A random secret was generated for this run. Tokens will be invalid after restart.");
        }
    }

    public String createToken(String email, String role) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expirationMs);

        return Jwts.builder()
            .subject(email)
            .claim("role", role)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .signWith(secretKey)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public String getEmail(String token) {
        return parse(token).getBody().getSubject();
    }

    public String getRole(String token) {
        Object role = parse(token).getBody().get("role");
        return role == null ? null : role.toString();
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token);
    }

    private SecretKey buildKey(String secret) {
        if (secret == null || secret.isBlank()) {
            return generateRandomKey();
        }

        // Accept either a raw string secret or a base64 secret.
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret.trim());
        } catch (IllegalArgumentException ex) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }

        if (keyBytes.length < 32) {
            log.warn("JWT secret is too short ({} bytes). Generating a secure random secret for this run.", keyBytes.length);
            return generateRandomKey();
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    private SecretKey generateRandomKey() {
        byte[] bytes = new byte[64];
        new SecureRandom().nextBytes(bytes);
        // Keep it stable within the running process.
        String base64 = Base64.getEncoder().encodeToString(bytes);
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64));
    }
}
