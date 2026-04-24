package com.sliit.backend.repository;

import com.sliit.backend.entity.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<Ticket> findAllByOrderByCreatedAtDesc();
}
