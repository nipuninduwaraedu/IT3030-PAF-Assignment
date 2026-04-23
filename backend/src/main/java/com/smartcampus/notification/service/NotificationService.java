package com.smartcampus.notification.service;

import com.smartcampus.auth.entity.User;
import com.smartcampus.auth.repository.UserRepository;
import com.smartcampus.notification.dto.NotificationMapper;
import com.smartcampus.notification.dto.NotificationResponseDTO;
import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.entity.NotificationType;
import com.smartcampus.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationResponseDTO createNotification(String recipientId, NotificationType type, String message, String referenceId, String referenceType) {
        String recipientEmail = null;
        User user = userRepository.findById(recipientId).orElse(null);
        if (user != null) {
            recipientEmail = user.getEmail();
        }

        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .recipientEmail(recipientEmail)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        Notification saved = notificationRepository.save(notification);
        return NotificationMapper.toResponseDTO(saved);
    }

    public List<NotificationResponseDTO> getNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public NotificationResponseDTO markAsRead(String notificationId, String requestingUserId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipientId().equals(requestingUserId)) {
            throw new RuntimeException("Not authorized");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return NotificationMapper.toResponseDTO(saved);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unreadList = notificationRepository.findByRecipientIdAndIsReadFalse(userId);
        for (Notification n : unreadList) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unreadList);
    }

    public void notifyBookingApproved(String userId, String userEmail, String bookingId, String resourceName) {
        createNotification(userId, NotificationType.BOOKING_APPROVED,
                "Your booking for " + resourceName + " has been approved", bookingId, "BOOKING");
    }

    public void notifyBookingRejected(String userId, String userEmail, String bookingId, String resourceName, String reason) {
        createNotification(userId, NotificationType.BOOKING_REJECTED,
                "Your booking for " + resourceName + " was rejected: " + reason, bookingId, "BOOKING");
    }

    public void notifyBookingCancelled(String userId, String bookingId, String resourceName) {
        createNotification(userId, NotificationType.BOOKING_CANCELLED,
                "Your booking for " + resourceName + " has been cancelled", bookingId, "BOOKING");
    }

    public void notifyTicketStatusChanged(String userId, String ticketId, String newStatus) {
        createNotification(userId, NotificationType.TICKET_STATUS_CHANGED,
                "Your ticket status has been updated to " + newStatus, ticketId, "TICKET");
    }

    public void notifyNewComment(String userId, String ticketId) {
        createNotification(userId, NotificationType.NEW_COMMENT,
                "A new comment was added to your ticket", ticketId, "TICKET");
    }
}
