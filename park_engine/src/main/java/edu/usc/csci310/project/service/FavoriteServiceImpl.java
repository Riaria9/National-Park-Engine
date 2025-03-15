package edu.usc.csci310.project.service;

import edu.usc.csci310.project.entity.Favorite;
import edu.usc.csci310.project.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;


    @Override
    public void addFavorite(String username, String parkCode) {
        Favorite favorite = favoriteRepository.findByUsername(username);
        if (favorite == null) {
            favorite = Favorite.builder().username(username).parkCodes(new ArrayList<>()).build();
        }
        favorite.getParkCodes().add(parkCode);
        favoriteRepository.save(favorite);
    }

    @Override
    public void deleteFavorite(String username, String parkCode) {
        Favorite favorite = favoriteRepository.findByUsername(username);
        if (favorite != null) {
            favorite.getParkCodes().remove(parkCode);
            favoriteRepository.save(favorite);
        }
    }

    @Override
    public List<String> getParkCodes(String username) {
        Favorite favorite = favoriteRepository.findByUsername(username);
        if (favorite != null) {
            return favorite.getParkCodes();
        }
        return new ArrayList<>();
    }

    @Override
    public List<String> setParkCodes(String username, List<String> parkCodes) {
        Favorite favorite = favoriteRepository.findByUsername(username);
        if (favorite != null) {
            favorite.setParkCodes(parkCodes);
            favoriteRepository.save(favorite);
        }
        return parkCodes;
    }
}
