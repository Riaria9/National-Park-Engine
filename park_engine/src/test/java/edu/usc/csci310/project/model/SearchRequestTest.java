package edu.usc.csci310.project.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SearchRequestTest {
    private SearchRequest request;

    @BeforeEach
    void setup() {
        request = new SearchRequest();
    }
    @Test
    void testSearchTerm() {
        request.setSearchTerm("q");
        assertEquals("q", request.getSearchTerm());
    }

    @Test
    void testSearchCriteria() {
        request.setSearchCriteria("q");
        assertEquals("q", request.getSearchCriteria());
    }

//    @Test
//    void testLimit() {
//        request.setLimit(1);
//        assertEquals(1, request.getLimit());
//    }
//
    @Test
    void testStart() {
        request.setStart(1);
        assertEquals(1, request.getStart());
    }
}