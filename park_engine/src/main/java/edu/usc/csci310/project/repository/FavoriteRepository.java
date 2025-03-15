package edu.usc.csci310.project.repository;

import edu.usc.csci310.project.entity.Favorite;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends CrudRepository<Favorite, Long> {
    Favorite findByUsername(String username);
}
