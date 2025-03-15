package edu.usc.csci310.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyUser {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_generator")
    @SequenceGenerator(name = "user_seq_generator", sequenceName = "user_sequence", initialValue = 7)
    private long id;
    private String username;
    private String hashedPassword;
    private String salt;
    private boolean privacyStatus;
}
