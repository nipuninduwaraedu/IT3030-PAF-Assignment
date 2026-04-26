package com.sliit.backend.service;

import com.sliit.backend.dto.AuthResponse;
import com.sliit.backend.dto.LoginRequest;
import com.sliit.backend.dto.RegisterRequest;
import com.sliit.backend.dto.SocialLoginRequest;
import com.sliit.backend.entity.User;
import com.sliit.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File fallbackFile = new File("users_fallback.json");

    private static List<User> inMemoryUsers = new ArrayList<>();
    private static boolean mongoAvailable = true;
    private static LocalDateTime lastCheck = LocalDateTime.MIN;

    @PostConstruct
    public void init() {
        loadFallback();
        // Ensure admin exists
        if (inMemoryUsers.stream().noneMatch(u -> u.getUsername().equals("admin"))) {
            User admin = new User();
            admin.setId("MOCK_ADMIN");
            admin.setUsername("admin");
            admin.setEmail("admin@campus.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            inMemoryUsers.add(admin);
            saveFallback();
        }
    }

    private void loadFallback() {
        if (fallbackFile.exists()) {
            try {
                inMemoryUsers = objectMapper.readValue(fallbackFile, new TypeReference<List<User>>() {});
            } catch (IOException e) {
                System.err.println("Failed to load fallback users: " + e.getMessage());
            }
        }
    }

    private synchronized void saveFallback() {
        try {
            objectMapper.writeValue(fallbackFile, inMemoryUsers);
        } catch (IOException e) {
            System.err.println("Failed to save fallback users: " + e.getMessage());
        }
    }

    private void checkMongo() {
        if (!mongoAvailable && LocalDateTime.now().isBefore(lastCheck.plusMinutes(2))) {
            return; 
        }
        
        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            Future<Long> future = executor.submit(() -> userRepository.count());
            try {
                future.get(300, TimeUnit.MILLISECONDS);
                mongoAvailable = true;
            } catch (Exception e) {
                future.cancel(true);
                mongoAvailable = false;
                lastCheck = LocalDateTime.now();
            } finally {
                executor.shutdownNow();
            }
        } catch (Exception e) {
            mongoAvailable = false;
            lastCheck = LocalDateTime.now();
        }
    }

    public AuthResponse register(RegisterRequest request) {
        checkMongo();

        if (mongoAvailable) {
            try {
                if (userRepository.existsByUsername(request.getUsername())) {
                    throw new RuntimeException("Username already exists");
                }
                User user = new User();
                user.setUsername(request.getUsername());
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setRole(request.getRole() != null ? request.getRole() : "STUDENT");

                user = userRepository.save(user);
                return new AuthResponse(user.getId(), user.getUsername(), user.getRole(), "User registered successfully");
            } catch (Exception e) {
                if (e.getMessage() != null && e.getMessage().contains("exists")) throw e;
                mongoAvailable = false;
            }
        }

        // Fallback logic
        if (inMemoryUsers.stream().anyMatch(u -> u.getUsername().equals(request.getUsername()))) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "STUDENT");
        
        inMemoryUsers.add(user);
        saveFallback();
        return new AuthResponse(user.getId(), user.getUsername(), user.getRole(), "Registered successfully (Fallback Mode)");
    }

    public AuthResponse login(LoginRequest request) {
        checkMongo();

        if (mongoAvailable) {
            try {
                Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return new AuthResponse(user.getId(), user.getUsername(), user.getRole(), "Login successful");
                    }
                }
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }

        // Fallback login
        User user = inMemoryUsers.stream()
                .filter(u -> u.getUsername().equals(request.getUsername()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return new AuthResponse(user.getId(), user.getUsername(), user.getRole(), "Login successful (Fallback Mode)");
    }

    public AuthResponse socialLogin(SocialLoginRequest request) {
        checkMongo();
        
        if (mongoAvailable) {
            try {
                // Find or create user by email
                Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
                User user;
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                } else {
                    user = new User();
                    user.setUsername(request.getEmail().split("@")[0]);
                    user.setEmail(request.getEmail());
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password for social users
                    user.setRole("STUDENT");
                    user = userRepository.save(user);
                }
                return new AuthResponse(user.getId(), user.getUsername(), user.getRole(), "Google login successful");
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }

        // Fallback social login
        User user = inMemoryUsers.stream()
                .filter(u -> u.getEmail().equals(request.getEmail()))
                .findFirst()
                .orElse(null);

        if (user == null) {
            user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setUsername(request.getEmail().split("@")[0]);
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole("STUDENT");
            inMemoryUsers.add(user);
            saveFallback();
        }

        return new AuthResponse(user.getId(), user.getUsername(), user.getRole(), "Google login successful (Fallback Mode)");
    }
}
