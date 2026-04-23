package com.smartcampus.auth.dto;

import com.smartcampus.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private String id;
    private String email;
    private String name;
    private String profilePictureUrl;
    private Set<Role> roles;
    private LocalDateTime createdAt;
}
