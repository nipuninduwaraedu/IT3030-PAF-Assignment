package com.smartcampus.booking.dto;

import com.smartcampus.booking.entity.Booking;

public class BookingMapper {

    public static BookingResponseDTO toResponseDTO(Booking booking) {
        if (booking == null) {
            return null;
        }

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .resourceName(booking.getResourceName())
                .requestedById(booking.getRequestedById())
                .requestedByEmail(booking.getRequestedByEmail())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .rejectionReason(booking.getRejectionReason())
                .adminNote(booking.getAdminNote())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
