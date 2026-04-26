package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.entity.Resource;
import com.smartcampus.facilities.entity.ResourceStatus;
import com.smartcampus.facilities.entity.ResourceType;

import java.util.List;

public interface ResourceRepositoryCustom {
    List<Resource> searchResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status);
}
