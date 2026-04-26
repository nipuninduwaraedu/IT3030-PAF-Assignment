package com.sliit.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.smartcampus.facilities.repository.ResourceRepository;
import com.smartcampus.facilities.entity.Resource;

@SpringBootApplication
@ComponentScan(basePackages = {"com.sliit.backend", "com.smartcampus.booking", "com.smartcampus.facilities"})
@EnableMongoRepositories(basePackages = {"com.smartcampus.booking", "com.smartcampus.facilities"})
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(ResourceRepository resourceRepository) {
		return args -> {
			if (resourceRepository.count() == 0) {
				resourceRepository.save(Resource.builder()
						.name("Main Lecture Hall")
						.type("HALL")
						.capacity(200)
						.location("Building A, Floor 1")
						.status("ACTIVE")
						.description("Large hall for lectures and events")
						.build());
				resourceRepository.save(Resource.builder()
						.name("Lab 01")
						.type("LAB")
						.capacity(30)
						.location("Building B, Floor 2")
						.status("ACTIVE")
						.description("Computer lab with high-end PCs")
						.build());
				resourceRepository.save(Resource.builder()
						.name("Meeting Room A")
						.type("ROOM")
						.capacity(10)
						.location("Building C, Floor 1")
						.status("ACTIVE")
						.description("Small meeting room with projector")
						.build());
				System.out.println("Sample resources initialized.");
			}
		};
	}
}
@ComponentScan(basePackages = {
    "com.sliit.backend",
    "com.smartcampus"
})
@EnableMongoRepositories(basePackages = {
    "com.smartcampus.facilities.repository",
    "com.sliit.backend.repository"
})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
