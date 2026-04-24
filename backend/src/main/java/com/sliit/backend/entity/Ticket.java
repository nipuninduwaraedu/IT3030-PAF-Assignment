package com.sliit.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String category;
    private String description;
    private String priority;
    private String contactDetails;
    private List<String> imageUrls;
    private String status; // PENDING, ACCEPTED, REJECTED
    private String adminComment;
    private String studentId;
    private LocalDateTime createdAt;

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    public enum Status {
        PENDING, ACCEPTED, REJECTED
    }
}
