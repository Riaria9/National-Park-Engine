package edu.usc.csci310.project.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SearchResponseTest {
    @Test
    void testMessage() {
        SearchResponse response = new SearchResponse();
        response.setMessage("msg");
        assertEquals("msg", response.getMessage());
    }
}