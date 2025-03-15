package edu.usc.csci310.project.service;

import edu.usc.csci310.project.entity.MyUser;
import edu.usc.csci310.project.repository.MyUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.*;

@Service
public class MyUserServiceImpl implements MyUserService {

    @Autowired
    private MyUserRepository myUserRepository;

    protected MyUser getUser(String username) {
        List<MyUser> myUsers = (List<MyUser>) myUserRepository.findAll();
        MyUser myUser = null;
        for (MyUser user : myUsers) {
            if (user.getUsername().equals(username)) {
                myUser = user;
            }
        }
        return myUser;
    }

    @Override
    public MyUser verifyUser(String username, String password) throws NoSuchAlgorithmException {
        MyUser myUser = getUser(username);
        if (Objects.isNull(myUser)) return null;
        String hashedPassword = get_SHA_256_SecurePassword(password, myUser.getSalt());
        if (hashedPassword.equals(myUser.getHashedPassword())) return myUser;
        else return null;
    }

    @Override
    public MyUser signUp(String username, String password) throws NoSuchAlgorithmException {
        if (!Objects.isNull(getUser(username))) {
            return null;
        }
        MyUser myUser = new MyUser();
        myUser.setUsername(username);
        myUser.setPrivacyStatus(true);
        myUser.setSalt(generateSalt());
        myUser.setHashedPassword(get_SHA_256_SecurePassword(password, myUser.getSalt()));
        return myUserRepository.save(myUser);
    }

    @Override
    public void changePrivacy(String username) {
        MyUser myUser = getUser(username);
//        myUserRepository.delete(myUser);
        myUser.setPrivacyStatus(!myUser.isPrivacyStatus());
        myUserRepository.save(myUser);
    }

    @Override
    public Iterable<MyUser> getAllUsers() {
        return  myUserRepository.findAll();
    }

    static String get_SHA_256_SecurePassword(String passwordToHash, String salt) throws NoSuchAlgorithmException {
        String generatedPassword;
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(salt.getBytes());
        byte[] bytes = md.digest(passwordToHash.getBytes());
        StringBuilder sb = new StringBuilder();
        for (byte aByte : bytes) {
            sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
        }
        generatedPassword = sb.toString();
        return generatedPassword;
    }

    private static String generateSalt() throws NoSuchAlgorithmException {
        SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        return Arrays.toString(salt);
    }

}
