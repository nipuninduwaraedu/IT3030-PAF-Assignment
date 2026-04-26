package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingActionDTO;
import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.entity.BookingStatus;
import com.smartcampus.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> requestBooking(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Email") String email,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String role,
            @RequestBody @Valid BookingRequestDTO dto) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("error", "Admins cannot create bookings. Only students are allowed to make bookings."));
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.requestBooking(dto, userId, email));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, resourceId, from, to));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDTO> approveBooking(
            @PathVariable String id,
            @RequestBody(required = false) BookingActionDTO dto) {
        String reason = (dto != null) ? dto.getReason() : null;
        return ResponseEntity.ok(bookingService.approveBooking(id, reason));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
            @PathVariable String id,
            @RequestBody BookingActionDTO dto) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, dto.getReason()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }
}
