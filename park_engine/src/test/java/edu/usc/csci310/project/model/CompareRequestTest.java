package edu.usc.csci310.project.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CompareRequestTest {

    @Test
    void getUsername() {
        CompareRequest compareRequest = new CompareRequest();
        compareRequest.setUsername("username");
        assertEquals("username", compareRequest.getUsername());
    }

    @Test
    void setUsername() {
        CompareRequest compareRequest = new CompareRequest();
        compareRequest.setUsername("username");
        assertEquals("username", compareRequest.getUsername());
    }
}