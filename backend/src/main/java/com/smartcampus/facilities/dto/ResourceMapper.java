package com.smartcampus.facilities.dto;

import com.smartcampus.facilities.entity.Resource;

import java.time.LocalDateTime;

public class ResourceMapper {

    public static Resource toEntity(ResourceRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();

        return Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .availabilityWindows(dto.getAvailabilityWindows())
                .status(dto.getStatus())
                .description(dto.getDescription())
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    public static ResourceResponseDTO toResponseDTO(Resource resource) {
        if (resource == null) {
            return null;
        }

        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityWindows(resource.getAvailabilityWindows())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
