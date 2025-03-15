package edu.usc.csci310.project.entity;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class FavoriteTest {

    @Test
    void getId() {
        Favorite favorite = new Favorite();
        favorite.setId(1);
        assertEquals(1, favorite.getId());
    }

    @Test
    void getUsername() {
        Favorite favorite = new Favorite();
        favorite.setUsername("username");
        assertEquals("username", favorite.getUsername());
    }

    @Test
    void getParkCodes() {
        Favorite favorite = new Favorite();
        favorite.setParkCodes(new ArrayList<>());
        assertEquals(0, favorite.getParkCodes().size());
    }

    @Test
    void setId() {
        Favorite favorite = new Favorite();
        favorite.setId(1);
        assertEquals(1, favorite.getId());
    }

    @Test
    void setUsername() {
        Favorite favorite = new Favorite();
        favorite.setUsername("username");
        assertEquals("username", favorite.getUsername());
    }

    @Test
    void setParkCodes() {
        Favorite favorite = new Favorite();
        favorite.setParkCodes(new ArrayList<>());
        assertEquals(0, favorite.getParkCodes().size());
    }

    @Test
    void builder() {
        Favorite favorite = new Favorite();
        Favorite favorite1 = Favorite.builder().id(1).username("username").parkCodes(new ArrayList<>()).build();
        favorite.setId(1);
        favorite.setUsername("username");
        favorite.setParkCodes(new ArrayList<>());
        String s = Favorite.builder().id(1).username("username").parkCodes(new ArrayList<>()).toString();
        assertNotNull(s);
        assertEquals(favorite1.getParkCodes().size(), favorite.getParkCodes().size());
        assertEquals(favorite1.getUsername(), favorite.getUsername());
        assertEquals(favorite1.getId(), favorite.getId());
    }
}