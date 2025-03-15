package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.entity.MyUser;
import edu.usc.csci310.project.model.MyUserAccountRequest;
import edu.usc.csci310.project.model.MyUserAccountResponse;
import edu.usc.csci310.project.service.MyUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class MyUserAccountControllerTest {

    @Mock
    private MyUserService myUserService;

    @InjectMocks
    private MyUserAccountController userAccountController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogin_UserNotFound() throws Exception {
        // Mock behavior of myUserService.verifyUser() to return null (user not found)
        when(myUserService.verifyUser("nonExistingUsername", "password")).thenReturn(null);

        // Perform the login operation
        ResponseEntity<MyUserAccountResponse> responseEntity = userAccountController.login(new MyUserAccountRequest("nonExistingUsername", "password"));

        // Verify the response
        assertEquals("Incorrect login credentials", Objects.requireNonNull(responseEntity.getBody()).getMessage());
    }

    @Test
    void testLogin_CorrectCredentials() throws Exception {
        // Mock behavior of myUserService.verifyUser() to return a user
        MyUser mockUser = new MyUser();
        when(myUserService.verifyUser(anyString(), anyString())).thenReturn(mockUser);

        // Perform the login operation
        ResponseEntity<MyUserAccountResponse> responseEntity = userAccountController.login(new MyUserAccountRequest("existingUsername", "correctPassword"));

        // Verify the response
        assertEquals("Login successful", Objects.requireNonNull(responseEntity.getBody()).getMessage());
    }

    @Test
    void testSignup_UsernameExists() throws Exception {
        // Mock behavior of myUserService.signUp() to return null (username exists)
        when(myUserService.signUp("existingUsername", "password")).thenReturn(null);

        // Perform the signup operation
        ResponseEntity<MyUserAccountResponse> responseEntity = userAccountController.signup(new MyUserAccountRequest("existingUsername", "password"));

        // Verify the response
        assertEquals("Username already exists", Objects.requireNonNull(responseEntity.getBody()).getMessage());
    }

    @Test
    void testSignup_SuccessfulSignup() throws Exception {
        // Mock behavior of myUserService.signUp() to return a user
        MyUser mockUser = new MyUser();
        when(myUserService.signUp(anyString(), anyString())).thenReturn(mockUser);

        // Perform the signup operation
        ResponseEntity<MyUserAccountResponse> responseEntity = userAccountController.signup(new MyUserAccountRequest("newUsername", "password"));

        // Verify the response
        assertEquals("Signup successful", Objects.requireNonNull(responseEntity.getBody()).getMessage());
    }
}