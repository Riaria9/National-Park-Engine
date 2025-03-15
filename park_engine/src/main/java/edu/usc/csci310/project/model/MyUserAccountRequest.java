package edu.usc.csci310.project.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MyUserAccountRequest {

    private String username;
    private String password;

    public MyUserAccountRequest() {

    }

    public MyUserAccountRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

}
