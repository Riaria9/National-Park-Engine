package edu.usc.csci310.project.service;

import java.util.List;

public interface FavoriteService {
    void addFavorite(String username, String parkCode);
    void deleteFavorite(String username, String parkCode);
    List<String> getParkCodes(String username);
    List<String> setParkCodes(String username, List<String> parkCodes);
}
