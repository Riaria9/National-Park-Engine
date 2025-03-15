package edu.usc.csci310.project.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FavoriteResponseTest {

    @Test
    void getMessage() {
        FavoriteResponse favoriteResponse = new FavoriteResponse();
        favoriteResponse.setMessage("message");
        assertEquals("message", favoriteResponse.getMessage());
    }

    @Test
    void setMessage() {
        FavoriteResponse favoriteResponse = new FavoriteResponse();
        favoriteResponse.setMessage("message");
        assertEquals("message", favoriteResponse.getMessage());
    }
}