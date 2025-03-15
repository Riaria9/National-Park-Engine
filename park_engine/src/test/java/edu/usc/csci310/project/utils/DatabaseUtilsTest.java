package edu.usc.csci310.project.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseUtilsTest {

    @Test
    void encodeUsername() throws Exception {
        DatabaseUtils dbUtils = new DatabaseUtils();
        assertEquals("Q6MzOW7twDql7qT/o5T25w==", DatabaseUtils.encodeUsername("username"));
    }

    @Test
    void decodeUsername() throws Exception {
        DatabaseUtils dbUtils = new DatabaseUtils();
        assertEquals("username", DatabaseUtils.decodeUsername("Q6MzOW7twDql7qT/o5T25w=="));
    }
}