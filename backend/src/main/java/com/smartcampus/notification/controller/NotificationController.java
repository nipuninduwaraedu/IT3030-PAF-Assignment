package com.smartcampus.notification.controller;

import com.smartcampus.auth.util.JwtUtil;
import com.smartcampus.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    private String extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                return jwtUtil.extractUserId(token);
            }
        }
        throw new RuntimeException("Invalid or expired token");
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserId(authHeader);
            return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserId(authHeader);
            long count = notificationService.getUnreadCount(userId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@RequestHeader("Authorization") String authHeader, @PathVariable String id) {
        try {
            String userId = extractUserId(authHeader);
            return ResponseEntity.ok(notificationService.markAsRead(id, userId));
        } catch (RuntimeException e) {
            if ("Notification not found".equals(e.getMessage()) || "Not authorized".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserId(authHeader);
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
