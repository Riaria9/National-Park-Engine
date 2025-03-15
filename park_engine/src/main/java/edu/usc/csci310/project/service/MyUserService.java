package edu.usc.csci310.project.service;

import edu.usc.csci310.project.entity.MyUser;

import java.security.NoSuchAlgorithmException;

public interface MyUserService {
    MyUser verifyUser(String username, String password) throws NoSuchAlgorithmException;
    MyUser signUp(String username, String password) throws NoSuchAlgorithmException;
    void changePrivacy(String username);
    Iterable<MyUser> getAllUsers();
}
