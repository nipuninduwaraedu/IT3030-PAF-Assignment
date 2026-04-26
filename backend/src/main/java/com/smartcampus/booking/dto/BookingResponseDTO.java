package com.smartcampus.booking.dto;

import com.smartcampus.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {
    private String id;
    private String resourceId;
    private String resourceName;
    private String requestedById;
    private String requestedByEmail;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String rejectionReason;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
