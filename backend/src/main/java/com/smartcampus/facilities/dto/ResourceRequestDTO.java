package com.smartcampus.facilities.dto;

import com.smartcampus.facilities.entity.ResourceStatus;
import com.smartcampus.facilities.entity.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequestDTO {
    @NotBlank
    private String name;
    
    @NotNull
    private ResourceType type;
    
    private Integer capacity;
    
    @NotBlank
    private String location;
    
    private ResourceStatus status;
    private String description;
}
