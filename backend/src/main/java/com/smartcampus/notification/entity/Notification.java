package com.smartcampus.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;
    
    private String recipientId;
    
    private String recipientEmail;
    
    private NotificationType type;
    
    private String message;
    
    private String referenceId;
    
    private String referenceType;
    
    @Builder.Default
    private boolean isRead = false;
    
    private LocalDateTime createdAt;
}
