package com.smartcampus.notification.dto;

import com.smartcampus.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDTO {
    private String id;
    private String recipientId;
    private NotificationType type;
    private String message;
    private String referenceId;
    private String referenceType;
    private boolean isRead;
    private LocalDateTime createdAt;
}
