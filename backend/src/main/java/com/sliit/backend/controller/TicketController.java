package com.sliit.backend.controller;

import com.sliit.backend.entity.Ticket;
import com.sliit.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") 
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam("contactDetails") String contactDetails,
            @RequestParam("studentId") String studentId,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        
        try {
            if (images != null && images.size() > 3) {
                return ResponseEntity.badRequest().build();
            }
            Ticket ticket = ticketService.createTicket(category, description, priority, contactDetails, studentId, images);
            return ResponseEntity.ok(ticket);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable String id,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam("contactDetails") String contactDetails,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        
        try {
            Ticket ticket = ticketService.updateTicket(id, category, description, priority, contactDetails, images);
            return ResponseEntity.ok(ticket);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Ticket>> getStudentTickets(@PathVariable String studentId) {
        return ResponseEntity.ok(ticketService.getTicketsByStudent(studentId));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/action")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable String id,
            @RequestParam("status") String status,
            @RequestParam("comment") String comment) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status, comment));
    }
}
