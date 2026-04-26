package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.ResourceMapper;
import com.smartcampus.facilities.dto.ResourceRequestDTO;
import com.smartcampus.facilities.dto.ResourceResponseDTO;
import com.smartcampus.facilities.entity.Resource;
import com.smartcampus.facilities.entity.ResourceStatus;
import com.smartcampus.facilities.entity.ResourceType;
import com.smartcampus.facilities.exception.ResourceNotFoundException;
import com.smartcampus.facilities.repository.ResourceRepository;
import com.smartcampus.facilities.repository.ResourceRepositoryCustomImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Autowired
    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public ResourceResponseDTO createResource(ResourceRequestDTO dto) {
        Resource resource = ResourceMapper.toEntity(dto);
        LocalDateTime now = LocalDateTime.now();
        resource.setCreatedAt(now);
        resource.setUpdatedAt(now);
        Resource saved = resourceRepository.save(resource);
        return ResourceMapper.toResponseDTO(saved);
    }

    public ResourceResponseDTO updateResource(String id, ResourceRequestDTO dto) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));

        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setCapacity(dto.getCapacity());
        existing.setLocation(dto.getLocation());
        existing.setStatus(dto.getStatus());
        existing.setDescription(dto.getDescription());
        existing.setUpdatedAt(LocalDateTime.now());

        Resource saved = resourceRepository.save(existing);
        return ResourceMapper.toResponseDTO(saved);
    }

    public void deleteResource(String id) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));

        resourceRepository.delete(existing); // hard delete
    }

    public ResourceResponseDTO getResourceById(String id) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
        return ResourceMapper.toResponseDTO(existing);
    }

    public List<ResourceResponseDTO> searchResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status) {
        List<Resource> resources = resourceRepository.searchResources(type, minCapacity, location, status);
        return resources.stream()
                .map(ResourceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
