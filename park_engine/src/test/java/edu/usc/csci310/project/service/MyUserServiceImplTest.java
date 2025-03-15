package edu.usc.csci310.project.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import edu.usc.csci310.project.entity.MyUser;
import edu.usc.csci310.project.repository.MyUserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.NoSuchAlgorithmException;
import java.util.*;

@ExtendWith(MockitoExtension.class)
class MyUserServiceImplTest {

    @Mock
    private MyUserRepository myUserRepository;

    @InjectMocks
    private MyUserServiceImpl myUserServiceImpl;

    @Test
    void testVerifyUser_UserFound() throws NoSuchAlgorithmException {
        // Create test data
        MyUser user1 = new MyUser();
        user1.setUsername("user1");
        user1.setHashedPassword(MyUserServiceImpl.get_SHA_256_SecurePassword("hashedPassword1", "1"));
        user1.setSalt("1");
        MyUser user2 = new MyUser();
        user2.setUsername("user2");
        user2.setHashedPassword("hashedPassword2");
        user2.setSalt("2");
        List<MyUser> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);

        // Mock behavior of myUserRepository.findAll()
        when(myUserRepository.findAll()).thenReturn(users);

        // Call verifyUser method
        MyUser resultUser = myUserServiceImpl.verifyUser("user1", "hashedPassword1");

        // Verify that the correct user is returned
        assertNotNull(resultUser);
    }

    @Test
    void testVerifyUser_WrongPassword() throws NoSuchAlgorithmException {
        // Create test data
        MyUser user1 = new MyUser();
        user1.setUsername("user1");
        user1.setHashedPassword(MyUserServiceImpl.get_SHA_256_SecurePassword("hashedPassword1", "1"));
        user1.setSalt("1");
        MyUser user2 = new MyUser();
        user2.setUsername("user2");
        user2.setHashedPassword(MyUserServiceImpl.get_SHA_256_SecurePassword("hashedPassword2", "2"));
        user2.setSalt("2");
        List<MyUser> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);

        // Mock behavior of myUserRepository.findAll()
        when(myUserRepository.findAll()).thenReturn(users);

        // Call verifyUser method
        MyUser resultUser = myUserServiceImpl.verifyUser("user1", "hashedPassword");

        // Verify that the correct user is returned
        assertNull(resultUser);
    }

    @Test
    void testVerifyUser_UserNotFound() throws NoSuchAlgorithmException {
        // Mock behavior of myUserRepository.findAll()
        when(myUserRepository.findAll()).thenReturn(new ArrayList<>());

        // Call verifyUser method
        MyUser resultUser = myUserServiceImpl.verifyUser("nonExistingUser", "hashedPassword");

        // Verify that null is returned when user is not found
        assertNull(resultUser);
    }

    @Test
    void testSignUp_UserDoesNotExist() throws NoSuchAlgorithmException {
        // Create test data
        MyUser user1 = new MyUser();
        user1.setUsername("user1");
        user1.setHashedPassword(MyUserServiceImpl.get_SHA_256_SecurePassword("hashedPassword1", "1"));
        user1.setSalt("1");
        MyUser user2 = new MyUser();
        user2.setUsername("user2");
        user2.setHashedPassword(MyUserServiceImpl.get_SHA_256_SecurePassword("hashedPassword2", "2"));
        user2.setSalt("2");
        List<MyUser> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);

        // Mock behavior of myUserRepository.findAll()
        when(myUserRepository.findAll()).thenReturn(users);

        // Mock behavior of myUserRepository.save()
        MyUser savedUser = new MyUser(1, "newUser", "password", "1", true);
        when(myUserRepository.save(any(MyUser.class))).thenReturn(savedUser);

        // Call signUp method
        MyUser resultUser = myUserServiceImpl.signUp("newUser", "password");

        // Verify that the correct user is saved
        assertNotNull(resultUser);
        assertEquals("newUser", resultUser.getUsername());
        assertNotNull(resultUser.getSalt());
        assertNotNull(resultUser.getHashedPassword());
    }

    @Test
    void testSignUp_UserExists() throws NoSuchAlgorithmException {
        // Create test data
        MyUser user1 = new MyUser();
        user1.setUsername("user1");
        user1.setHashedPassword(MyUserServiceImpl.get_SHA_256_SecurePassword("hashedPassword1", "1"));
        user1.setSalt("1");
        MyUser user2 = new MyUser();
        user2.setUsername("user2");
        user2.setHashedPassword(MyUserServiceImpl.get_SHA_256_SecurePassword("hashedPassword2", "2"));
        user2.setSalt("2");
        List<MyUser> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);

        // Mock behavior of myUserRepository.findAll()
        when(myUserRepository.findAll()).thenReturn(users);

        MyUser resultUser = myUserServiceImpl.signUp("user1", "password");

        assertNull(resultUser);
    }

    @Test
    void changePrivacy() {
        MyUser myUser = new MyUser();
        myUser.setUsername("testUsername");
        List<MyUser> users = new ArrayList<>();
        users.add(myUser);
        when(myUserRepository.findAll()).thenReturn(users);

        myUserServiceImpl.changePrivacy("testUsername");
        assertTrue(myUser.isPrivacyStatus());

        MyUser myUser1 = new MyUser();
        myUser1.setPrivacyStatus(true);
        myUser1.setUsername("testUsername");
        List<MyUser> users1 = new ArrayList<>();
        users1.add(myUser1);
        when(myUserRepository.findAll()).thenReturn(users1);

        myUserServiceImpl.changePrivacy("testUsername");
        assertFalse(myUser1.isPrivacyStatus());
    }

    @Test
    void getAllUsers() {
        when(myUserRepository.findAll()).thenReturn(new ArrayList<>());
        assertNotNull(myUserServiceImpl.getAllUsers());
    }
}