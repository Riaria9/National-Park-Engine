package edu.usc.csci310.project.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CompareResponseTest {

    @Test
    void getMessage() {
        CompareResponse compareResponse = new CompareResponse();
        compareResponse.setMessage("message");
        assertEquals("message", compareResponse.getMessage());
    }

    @Test
    void setMessage() {
        CompareResponse compareResponse = new CompareResponse();
        compareResponse.setMessage("message");
        assertEquals("message", compareResponse.getMessage());
    }
}