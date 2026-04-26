package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepositoryCustom {
    List<Booking> searchBookings(BookingStatus status, String resourceId, LocalDate from, LocalDate to);
}
