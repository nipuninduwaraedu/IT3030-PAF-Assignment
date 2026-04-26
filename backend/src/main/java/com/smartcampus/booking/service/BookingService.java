package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.BookingMapper;
import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;
import com.smartcampus.booking.exception.BookingNotFoundException;
import com.smartcampus.booking.exception.SchedulingConflictException;
import com.smartcampus.booking.repository.BookingRepository;
import com.smartcampus.booking.repository.BookingRepositoryCustomImpl;
import com.smartcampus.facilities.entity.Resource;
import com.smartcampus.facilities.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingRepositoryCustomImpl bookingRepositoryCustomImpl;
    private final ResourceRepository resourceRepository;

    public BookingResponseDTO requestBooking(BookingRequestDTO dto, String requestedById, String requestedByEmail) {
        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new IllegalStateException("Start time must be before end time");
        }

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new IllegalStateException("Resource not found"));

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), "NONE", dto.getStartTime(), dto.getEndTime());

        if (!conflicts.isEmpty()) {
            Booking firstConflict = conflicts.get(0);
            throw new SchedulingConflictException(firstConflict.getStartTime(), firstConflict.getEndTime());
        }

        Booking booking = Booking.builder()
                .resourceId(dto.getResourceId())
                .resourceName(resource.getName())
                .requestedById(requestedById)
                .requestedByEmail(requestedByEmail)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return BookingMapper.toResponseDTO(bookingRepository.save(booking));
    }

    public BookingResponseDTO approveBooking(String id, String adminNote) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminNote(adminNote);
        booking.setUpdatedAt(LocalDateTime.now());
        
        return BookingMapper.toResponseDTO(bookingRepository.save(booking));
    }

    public BookingResponseDTO rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        booking.setUpdatedAt(LocalDateTime.now());

        return BookingMapper.toResponseDTO(bookingRepository.save(booking));
    }

    public BookingResponseDTO cancelBooking(String id, String requestingUserId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Cannot cancel this booking");
        }

        if (!booking.getRequestedById().equals(requestingUserId)) {
            throw new IllegalStateException("Not authorized to cancel");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());

        return BookingMapper.toResponseDTO(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getMyBookings(String userId) {
        return bookingRepository.findByRequestedById(userId).stream()
                .map(BookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings(BookingStatus status, String resourceId, LocalDate from, LocalDate to) {
        return bookingRepositoryCustomImpl.searchBookings(status, resourceId, from, to).stream()
                .map(BookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
