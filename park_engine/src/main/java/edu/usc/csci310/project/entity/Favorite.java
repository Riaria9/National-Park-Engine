package edu.usc.csci310.project.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "favorite_seq_generator")
    @SequenceGenerator(name = "favorite_seq_generator", sequenceName = "favorite_sequence", initialValue = 7)
    private long id;
    private String username;
    @ElementCollection
    private List<String> parkCodes;
}
