package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    java.util.List<Resource> findByStatus(String status);
}
