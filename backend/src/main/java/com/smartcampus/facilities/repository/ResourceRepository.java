package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    java.util.List<Resource> findByStatus(String status);
import com.smartcampus.facilities.entity.ResourceStatus;
import com.smartcampus.facilities.entity.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByType(ResourceType type);
    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);
    List<Resource> findByLocationContainingIgnoreCase(String location);
}
