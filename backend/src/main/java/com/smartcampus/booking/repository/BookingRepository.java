package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByRequestedById(String userId);

    List<Booking> findByRequestedByIdAndStatus(String userId, BookingStatus status);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByStatus(BookingStatus status);

    @Query("{ 'resourceId': ?0, 'status': 'APPROVED', '_id': { $ne: ?1 }, 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } }")
    List<Booking> findConflictingBookings(String resourceId, String excludeId, LocalDateTime startTime, LocalDateTime endTime);
}
