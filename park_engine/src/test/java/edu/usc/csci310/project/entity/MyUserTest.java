package edu.usc.csci310.project.entity;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class MyUserTest {

    @Test
    void testMyUserEntity() {
        MyUser myUser = new MyUser();
        myUser.setId(1);
        myUser.setUsername("testUser");
        myUser.setHashedPassword("hashedPassword");
        myUser.setSalt("salt");
        myUser.setPrivacyStatus(true);
        MyUser myUser1 = new MyUser(1, "testuser", "hashedPassword", "salt", true);

        String myOtherUser = MyUser.builder().id(1).hashedPassword("hashedPassword").salt("salt").username("testUser").privacyStatus(true).build().toString();

        String s = MyUser.builder().id(1).hashedPassword("hashedPassword").salt("salt").username("testUser").toString();

        assertEquals(1, myUser.getId());
        assertEquals("testUser", myUser.getUsername());
        assertEquals("hashedPassword", myUser.getHashedPassword());
        assertEquals("salt", myUser.getSalt());
        assertTrue(myUser.isPrivacyStatus());
    }
}
