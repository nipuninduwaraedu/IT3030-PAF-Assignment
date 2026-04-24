package com.sliit.backend.service;

import com.sliit.backend.entity.Ticket;
import com.sliit.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final List<Ticket> inMemoryTickets = new ArrayList<>();

    public Ticket createTicket(String category, String description, String priority, 
                                String contactDetails, String studentId, List<MultipartFile> images) throws IOException {
        
        List<String> imageUrls = new ArrayList<>();
        
        if (images != null && !images.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    imageUrls.add("/uploads/" + fileName);
                }
            }
        }

        Ticket ticket = new Ticket();
        ticket.setId(UUID.randomUUID().toString());
        ticket.setCategory(category);
        ticket.setDescription(description);
        ticket.setPriority(priority);
        ticket.setContactDetails(contactDetails);
        ticket.setStudentId(studentId);
        ticket.setImageUrls(imageUrls);
        ticket.setStatus(Ticket.Status.PENDING.name());
        ticket.setCreatedAt(LocalDateTime.now());

        try {
            return ticketRepository.save(ticket);
        } catch (Exception e) {
            System.err.println("MongoDB not available, using in-memory storage: " + e.getMessage());
            inMemoryTickets.add(ticket);
            return ticket;
        }
    }

    public List<Ticket> getTicketsByStudent(String studentId) {
        try {
            return ticketRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        } catch (Exception e) {
            return inMemoryTickets.stream()
                    .filter(t -> t.getStudentId().equals(studentId))
                    .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                    .toList();
        }
    }

    public List<Ticket> getAllTickets() {
        try {
            return ticketRepository.findAllByOrderByCreatedAtDesc();
        } catch (Exception e) {
            return new ArrayList<>(inMemoryTickets);
        }
    }

    public Ticket getTicketById(String id) {
        try {
            return ticketRepository.findById(id).orElseGet(() -> 
                inMemoryTickets.stream().filter(t -> t.getId().equals(id)).findFirst()
                    .orElseThrow(() -> new RuntimeException("Ticket not found"))
            );
        } catch (Exception e) {
            return inMemoryTickets.stream().filter(t -> t.getId().equals(id)).findFirst()
                    .orElseThrow(() -> new RuntimeException("Ticket not found"));
        }
    }

    public Ticket updateTicketStatus(String id, String status, String comment) {
        try {
            Ticket ticket = getTicketById(id);
            ticket.setStatus(status);
            ticket.setAdminComment(comment);
            
            try {
                return ticketRepository.save(ticket);
            } catch (Exception e) {
                // Already updated in memory by getTicketById which returns the reference
                return ticket;
            }
        } catch (Exception e) {
            System.err.println("Failed to update ticket: " + e.getMessage());
            return null;
        }
    }
}
