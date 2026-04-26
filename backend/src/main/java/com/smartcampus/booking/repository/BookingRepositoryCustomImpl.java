package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class BookingRepositoryCustomImpl implements BookingRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<Booking> searchBookings(BookingStatus status, String resourceId, LocalDate from, LocalDate to) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (status != null) {
            criteriaList.add(Criteria.where("status").is(status));
        }

        if (resourceId != null) {
            criteriaList.add(Criteria.where("resourceId").is(resourceId));
        }

        if (from != null) {
            criteriaList.add(Criteria.where("startTime").gte(from.atStartOfDay()));
        }

        if (to != null) {
            criteriaList.add(Criteria.where("endTime").lte(to.atTime(23, 59, 59)));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Booking.class);
    }
}
