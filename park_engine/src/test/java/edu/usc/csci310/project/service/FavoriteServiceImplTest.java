package edu.usc.csci310.project.service;

import edu.usc.csci310.project.entity.Favorite;
import edu.usc.csci310.project.repository.FavoriteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceImplTest {
    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private FavoriteServiceImpl favoriteService;

    @Test
    void addFavorite() {
        // Arrange
        String username = "user1";
        String parkCode = "ABC123";
        List<String> initialParkCodes = new ArrayList<>();
        Favorite existingFavorite = Favorite.builder()
                .username(username)
                .parkCodes(initialParkCodes)
                .build();

        // Mock favoriteRepository.findByUsername
        when(favoriteRepository.findByUsername(username)).thenReturn(existingFavorite);

        // Act
        favoriteService.addFavorite(username, parkCode);

        assertEquals(1, existingFavorite.getParkCodes().size()); // Assert that the park code was added
        assertEquals(parkCode, existingFavorite.getParkCodes().get(0)); // Assert that the correct park code was added

        // Mock favoriteRepository.findByUsername to return null
        when(favoriteRepository.findByUsername(username)).thenReturn(null);

        // Act
        favoriteService.addFavorite(username, parkCode);
    }

    @Test
    void deleteFavorite() {
        // Arrange
        String username = "user1";
        String parkCodeToRemove = "ABC123";
        List<String> initialParkCodes = new ArrayList<>();
        initialParkCodes.add(parkCodeToRemove); // Add the park code to remove
        Favorite existingFavorite = Favorite.builder()
                .username(username)
                .parkCodes(initialParkCodes)
                .build();

        // Mock favoriteRepository.findByUsername
        when(favoriteRepository.findByUsername(username)).thenReturn(existingFavorite);

        // Act
        favoriteService.deleteFavorite(username, parkCodeToRemove);

        assertEquals(0, existingFavorite.getParkCodes().size()); // Assert that the park code was removed

        // Mock favoriteRepository.findByUsername to return null
        when(favoriteRepository.findByUsername(username)).thenReturn(null);

        // Act
        favoriteService.deleteFavorite(username, parkCodeToRemove);
    }

    @Test
    void getParkCodes() {
        // Arrange
        String username = "user1";
        List<String> parkCodes = List.of("ABC123", "DEF456", "GHI789");
        Favorite existingFavorite = Favorite.builder()
                .username(username)
                .parkCodes(parkCodes)
                .build();

        // Mock favoriteRepository.findByUsername
        when(favoriteRepository.findByUsername(username)).thenReturn(existingFavorite);

        // Act
        List<String> result = favoriteService.getParkCodes(username);

        // Assert
        assertEquals(parkCodes, result); // Assert that the returned park codes match the expected list
        // Mock favoriteRepository.findByUsername to return null
        when(favoriteRepository.findByUsername(username)).thenReturn(null);

        // Act
        result = favoriteService.getParkCodes(username);

        // Assert
        assertEquals(new ArrayList<>(), result); // Assert that an empty list is returned when favorite is null
    }

    @Test
    void setParkCodes() {
        // Arrange
        String username = "user1";
        List<String> parkCodes = List.of("ABC123", "DEF456", "GHI789");
        Favorite existingFavorite = Favorite.builder()
                .username(username)
                .parkCodes(new ArrayList<>()) // Start with an empty list
                .build();

        // Mock favoriteRepository.findByUsername
        when(favoriteRepository.findByUsername(username)).thenReturn(existingFavorite);

        // Act
        List<String> result = favoriteService.setParkCodes(username, parkCodes);

        // Assert
        assertEquals(parkCodes, existingFavorite.getParkCodes()); // Assert that the park codes were set correctly
        assertEquals(parkCodes, result); // Assert that the returned park codes match the input list

        // Mock favoriteRepository.findByUsername to return null
        when(favoriteRepository.findByUsername(username)).thenReturn(null);

        // Act
        result = favoriteService.setParkCodes(username, parkCodes);

        // Assert
        assertEquals(parkCodes, result); // Assert that the returned park codes match the input list
    }
}