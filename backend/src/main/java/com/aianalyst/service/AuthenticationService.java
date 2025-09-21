package com.aianalyst.service;

import com.aianalyst.dto.AuthenticationRequest;
import com.aianalyst.dto.AuthenticationResponse;
import com.aianalyst.dto.RegisterRequest;
import com.aianalyst.entity.UserEntity;
import com.aianalyst.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and JWT token management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    /**
     * Register a new user
     */
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists");
        }
        
        // Create new user
        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole() != null ? request.getRole() : UserEntity.Role.ANALYST)
                .phoneNumber(request.getPhoneNumber())
                .company(request.getCompany())
                .jobTitle(request.getJobTitle())
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();
        
        // Save user
        UserEntity savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        // Generate tokens
        String jwtToken = jwtService.generateTokenWithUserInfo(
                savedUser, 
                savedUser.getId(), 
                savedUser.getRole().name()
        );
        String refreshToken = jwtService.generateRefreshToken(savedUser);
        
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(convertToUserDto(savedUser))
                .build();
    }
    
    /**
     * Authenticate user
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());
        
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // Get user details
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate tokens
        String jwtToken = jwtService.generateTokenWithUserInfo(
                user, 
                user.getId(), 
                user.getRole().name()
        );
        String refreshToken = jwtService.generateRefreshToken(user);
        
        log.info("User authenticated successfully: {}", user.getEmail());
        
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(convertToUserDto(user))
                .build();
    }
    
    /**
     * Refresh access token
     */
    public AuthenticationResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");
        
        // Validate refresh token
        String username = jwtService.extractUsername(refreshToken);
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (!jwtService.validateToken(refreshToken, user)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        
        // Generate new tokens
        String newJwtToken = jwtService.generateTokenWithUserInfo(
                user, 
                user.getId(), 
                user.getRole().name()
        );
        String newRefreshToken = jwtService.generateRefreshToken(user);
        
        return AuthenticationResponse.builder()
                .accessToken(newJwtToken)
                .refreshToken(newRefreshToken)
                .user(convertToUserDto(user))
                .build();
    }
    
    /**
     * Get current user by token
     */
    public AuthenticationResponse.UserDto getCurrentUser(String token) {
        String username = jwtService.extractUsername(token);
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return convertToUserDto(user);
    }
    
    /**
     * Convert UserEntity to AuthenticationResponse.UserDto
     */
    private AuthenticationResponse.UserDto convertToUserDto(UserEntity user) {
        return AuthenticationResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .company(user.getCompany())
                .jobTitle(user.getJobTitle())
                .lastLoginAt(user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : null)
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }
    
    /**
     * Change user password
     */
    @Transactional
    public void changePassword(String userId, String currentPassword, String newPassword) {
        log.info("Changing password for user: {}", userId);
        
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("Password changed successfully for user: {}", userId);
    }
    
    /**
     * Reset user password (admin only)
     */
    @Transactional
    public void resetPassword(String userId, String newPassword) {
        log.info("Resetting password for user: {}", userId);
        
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("Password reset successfully for user: {}", userId);
    }
    
}
