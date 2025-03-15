package edu.usc.csci310.project.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FavoriteRequestTest {

    @Test
    void getUsername() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        assertEquals("username", favoriteRequest.getUsername());
    }

    @Test
    void setUsername() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        assertEquals("username", favoriteRequest.getUsername());
    }

    @Test
    void getParkCode() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setParkCode("parkCode");
        assertEquals("parkCode", favoriteRequest.getParkCode());
    }

    @Test
    void setParkCode() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setParkCode("parkCode");
        assertEquals("parkCode", favoriteRequest.getParkCode());
    }
}