package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.entity.MyUser;
import edu.usc.csci310.project.model.MyUserAccountRequest;
import edu.usc.csci310.project.model.MyUserAccountResponse;
import edu.usc.csci310.project.service.MyUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

import static edu.usc.csci310.project.utils.DatabaseUtils.encodeUsername;

@RestController
public class MyUserAccountController {
    @Autowired
    private MyUserService myUserService;

    @PostMapping("/login")
    public ResponseEntity<MyUserAccountResponse> login(@RequestBody MyUserAccountRequest request) throws Exception {
        MyUserAccountResponse response = new MyUserAccountResponse();
        String username = request.getUsername();
        username = encodeUsername(username);
        String password = request.getPassword();
        String message;

        // query the database to see:
        // 1. whether username exists in database; if it doesn't exist, send error message "Username doesn't exist".
        // 2. if exists, whether username matches password; if it doesn't match, send error message "Incorrect password".
        // 3. if all good, send "Login successful" message.
        MyUser myUser = myUserService.verifyUser(username, password);

        if (Objects.isNull(myUser)) {
            message = "Incorrect login credentials";
        } else {
            message = "Login successful";
            response.setPrivacyStatus(myUser.isPrivacyStatus());
        }

        response.setMessage(message);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<MyUserAccountResponse> signup(@RequestBody MyUserAccountRequest request) throws Exception {
        MyUserAccountResponse response = new MyUserAccountResponse();
        String username = request.getUsername();
        username = encodeUsername(username);
        String password = request.getPassword();
        String message;

        // hash and query the database to see:
        // 1. whether username already exists in database; if it does exist, send error message "Username already exists".
        // 2. if all good, insert (username, password) pair into the database,
        // and send "Signup successful" message.
        MyUser myUser = myUserService.signUp(username, password);

        if (Objects.isNull(myUser)) message = "Username already exists";
        else message = "Signup successful";

        response.setMessage(message);
        return ResponseEntity.ok().body(response);
    }
}