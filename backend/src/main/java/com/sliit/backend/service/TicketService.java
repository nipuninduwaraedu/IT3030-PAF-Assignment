package com.sliit.backend.service;

import com.sliit.backend.entity.Ticket;
import com.sliit.backend.repository.TicketRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private final File fallbackFile = new File("tickets_fallback.json");

    private static List<Ticket> inMemoryTickets = new ArrayList<>();
    private static boolean mongoAvailable = true;
    private static LocalDateTime lastCheck = LocalDateTime.MIN;

    @PostConstruct
    public void init() {
        loadFallback();
    }

    private void loadFallback() {
        if (fallbackFile.exists()) {
            try {
                inMemoryTickets = objectMapper.readValue(fallbackFile, new TypeReference<List<Ticket>>() {});
            } catch (IOException e) {
                System.err.println("Failed to load fallback tickets: " + e.getMessage());
            }
        }
    }

    private synchronized void saveFallback() {
        try {
            objectMapper.writeValue(fallbackFile, inMemoryTickets);
        } catch (IOException e) {
            System.err.println("Failed to save fallback tickets: " + e.getMessage());
        }
    }

    private void checkMongo() {
        if (!mongoAvailable && LocalDateTime.now().isBefore(lastCheck.plusMinutes(2))) {
            return;
        }
        
        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            Future<Long> future = executor.submit(() -> ticketRepository.count());
            try {
                future.get(300, TimeUnit.MILLISECONDS);
                mongoAvailable = true;
            } catch (Exception e) {
                future.cancel(true);
                mongoAvailable = false;
                lastCheck = LocalDateTime.now();
            } finally {
                executor.shutdownNow();
            }
        } catch (Exception e) {
            mongoAvailable = false;
            lastCheck = LocalDateTime.now();
        }
    }

    public Ticket createTicket(String category, String description, String priority, 
                                String contactDetails, String studentId, List<MultipartFile> images) throws IOException {
        
        checkMongo();
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
        ticket.setStatus("PENDING");
        ticket.setCreatedAt(LocalDateTime.now());

        if (mongoAvailable) {
            try {
                return ticketRepository.save(ticket);
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }

        inMemoryTickets.add(ticket);
        saveFallback();
        return ticket;
    }

    public List<Ticket> getTicketsByStudent(String studentId) {
        checkMongo();
        if (mongoAvailable) {
            try {
                return ticketRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }
        return inMemoryTickets.stream()
                .filter(t -> t.getStudentId().equals(studentId))
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .toList();
    }

    public List<Ticket> getAllTickets() {
        checkMongo();
        if (mongoAvailable) {
            try {
                return ticketRepository.findAllByOrderByCreatedAtDesc();
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }
        return new ArrayList<>(inMemoryTickets);
    }

    public Ticket getTicketById(String id) {
        checkMongo();
        if (mongoAvailable) {
            try {
                ticketRepository.findById(id).orElseGet(() -> 
                    inMemoryTickets.stream().filter(t -> t.getId().equals(id)).findFirst()
                        .orElseThrow(() -> new RuntimeException("Ticket not found"))
                );
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }
        return inMemoryTickets.stream().filter(t -> t.getId().equals(id)).findFirst()
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket updateTicket(String id, String category, String description, String priority, 
                                String contactDetails, List<MultipartFile> images) throws IOException {
        checkMongo();
        Ticket ticket = getTicketById(id);
        ticket.setCategory(category);
        ticket.setDescription(description);
        ticket.setPriority(priority);
        ticket.setContactDetails(contactDetails);
        
        if (images != null && !images.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    ticket.getImageUrls().add("/uploads/" + fileName);
                }
            }
        }

        if (mongoAvailable) {
            try {
                return ticketRepository.save(ticket);
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }
        saveFallback();
        return ticket;
    }

    public void deleteTicket(String id) {
        checkMongo();
        if (mongoAvailable) {
            try {
                ticketRepository.deleteById(id);
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }
        inMemoryTickets.removeIf(t -> t.getId().equals(id));
        saveFallback();
    }

    public Ticket updateTicketStatus(String id, String status, String comment) {
        checkMongo();
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        ticket.setAdminComment(comment);
        
        if (mongoAvailable) {
            try {
                return ticketRepository.save(ticket);
            } catch (Exception e) {
                mongoAvailable = false;
            }
        }
        saveFallback();
        return ticket;
    }
}
