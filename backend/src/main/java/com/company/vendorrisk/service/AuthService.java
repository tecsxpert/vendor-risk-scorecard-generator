package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.LoginRequest;
import com.company.vendorrisk.dto.LoginResponse;
import com.company.vendorrisk.exception.InvalidRequestException;
import com.company.vendorrisk.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Auth service — for this capstone the credentials are validated against
 * a fixed demo account. In production this would query a users table.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEMO_EMAIL    = "admin@company.com";
    private static final String DEMO_PASSWORD = "admin123";

    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {

        String email    = request.getEmail() != null ? request.getEmail().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        if (!DEMO_EMAIL.equalsIgnoreCase(email) ||
            !DEMO_PASSWORD.equals(password)) {

            log.warn("Failed login attempt for email: '{}', password length: {}",
                    email, password.length());
            throw new InvalidRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(email);

        log.info("Successful login for: {}", email);

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .user(LoginResponse.UserInfo.builder()
                        .id("1")
                        .name("Admin User")
                        .email(DEMO_EMAIL)
                        .role("ADMIN")
                        .build())
                .build();
    }
}
