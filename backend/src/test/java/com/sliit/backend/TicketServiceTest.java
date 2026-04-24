package com.sliit.backend;

import com.sliit.backend.entity.Ticket;
import com.sliit.backend.repository.TicketRepository;
import com.sliit.backend.service.TicketService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private TicketService ticketService;

    @Test
    void testCreateTicket() throws Exception {
        Ticket mockTicket = new Ticket();
        mockTicket.setId("test-id");
        mockTicket.setCategory("IT");
        
        when(ticketRepository.save(any(Ticket.class))).thenReturn(mockTicket);

        Ticket result = ticketService.createTicket(
            "IT", "Test issue", "HIGH", "contact@test.com", "ST123", Collections.emptyList()
        );

        assertNotNull(result);
        assertEquals("IT", result.getCategory());
    }
}
