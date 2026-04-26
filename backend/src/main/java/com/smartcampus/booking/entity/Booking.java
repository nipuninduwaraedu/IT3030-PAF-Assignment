package com.smartcampus.booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String resourceId;
    private String resourceName;
    private String requestedById;
    private String requestedByEmail;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    private String purpose;
    private Integer expectedAttendees;
    
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;
    
    private String rejectionReason;
    private String adminNote;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
