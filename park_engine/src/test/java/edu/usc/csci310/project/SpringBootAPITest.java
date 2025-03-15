package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SpringBootAPITest {

    @Test
    public void contextLoads() {
        // Ensure that the Spring Boot application context loads successfully
    }

    @Test
    public void testRedirection() {
        SpringBootAPI springBootAPI = new SpringBootAPI();
        assertEquals("forward:/", springBootAPI.redirect());
    }
}