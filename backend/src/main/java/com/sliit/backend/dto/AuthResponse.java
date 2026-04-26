package com.sliit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String username;
    private String email;
    private String role;
    private String message;
}
