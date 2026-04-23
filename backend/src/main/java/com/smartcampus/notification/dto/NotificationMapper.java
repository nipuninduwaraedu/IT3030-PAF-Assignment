package com.smartcampus.notification.dto;

import com.smartcampus.notification.entity.Notification;

public class NotificationMapper {
    public static NotificationResponseDTO toResponseDTO(Notification notification) {
        if (notification == null) {
            return null;
        }
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipientId())
                .type(notification.getType())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .referenceType(notification.getReferenceType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
