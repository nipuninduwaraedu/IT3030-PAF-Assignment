package com.smartcampus.booking.exception;

import java.time.LocalDateTime;

public class SchedulingConflictException extends RuntimeException {
    public SchedulingConflictException(LocalDateTime start, LocalDateTime end) {
        super("Resource already booked from " + start + " to " + end);
    }
}
