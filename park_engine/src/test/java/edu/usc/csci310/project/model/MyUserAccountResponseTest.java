package edu.usc.csci310.project.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MyUserAccountResponseTest {

    private static final MyUserAccountResponse response = new MyUserAccountResponse();

    @Test
    void getAndSetMessage() {
        response.setMessage("Yes");
        assertEquals("Yes", response.getMessage());
    }
    @Test
    void getAndSetPrivacy() {
        response.setPrivacyStatus(true);
        assertTrue(response.isPrivacyStatus());
    }
}