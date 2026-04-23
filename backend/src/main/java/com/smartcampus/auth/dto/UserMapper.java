package com.smartcampus.auth.dto;

import com.smartcampus.auth.entity.User;

public class UserMapper {
    public static UserResponseDTO toResponseDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(user.getRoles())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
