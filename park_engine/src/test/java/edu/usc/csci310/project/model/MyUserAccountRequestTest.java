package edu.usc.csci310.project.model;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MyUserAccountRequestTest {

    private static final MyUserAccountRequest request = new MyUserAccountRequest();

    @BeforeAll
    static void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void getAndSetUsername() {
        request.setUsername("Alex");
        assertEquals("Alex", request.getUsername());
    }

    @Test
    void getAndSetPassword() {
        request.setPassword("Password123");
        assertEquals("Password123", request.getPassword());
    }
}