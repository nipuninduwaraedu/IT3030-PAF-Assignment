package com.sliit.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
    "com.sliit.backend",
    "com.smartcampus"
})
@EnableMongoRepositories(basePackages = {
    "com.smartcampus.facilities.repository",
    "com.sliit.backend.repository",
    "com.smartcampus.booking.repository"
})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}