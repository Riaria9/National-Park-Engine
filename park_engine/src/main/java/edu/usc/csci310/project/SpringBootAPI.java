package edu.usc.csci310.project;

import lombok.Generated;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@SpringBootApplication
public class SpringBootAPI {

    @Generated
    public static void main(String[] args) {
        SpringApplication.run(SpringBootAPI.class, args);
    }

    @RequestMapping(value = "{_:^(?!index\\.html|api).*$}")
    public String redirect() {
        // Forward to home page so that route is preserved.(i.e forward:/index.html)
        return "forward:/";
    }
}
