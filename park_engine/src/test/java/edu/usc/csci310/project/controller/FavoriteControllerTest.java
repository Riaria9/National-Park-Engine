package edu.usc.csci310.project.controller;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import edu.usc.csci310.project.utils.NationalParkServiceAPI;
import edu.usc.csci310.project.model.FavoriteRequest;
import edu.usc.csci310.project.model.FavoriteResponse;
import edu.usc.csci310.project.service.FavoriteService;
import edu.usc.csci310.project.service.MyUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

class FavoriteControllerTest {
    @Mock
    private FavoriteService favoriteService;

    @Mock
    private MyUserService myUserService;

    @InjectMocks
    private FavoriteController favoriteController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void favorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        ResponseEntity<FavoriteResponse> responseEntity;
        List<String> parkCodes = new ArrayList<>();
        parkCodes.add("1234");
        when(favoriteService.getParkCodes(anyString())).thenReturn(parkCodes);
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            JsonElement je = new JsonObject();
            mocked.when(() -> NationalParkServiceAPI.parkSingle(anyString())).thenReturn(je);
            responseEntity = favoriteController.favorite(favoriteRequest);

            // Verify response
            assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
            assertEquals("[{}]", Objects.requireNonNull(responseEntity.getBody()).getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        assertNotNull(responseEntity);
    }

    @Test
    void addFavorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        doNothing().when(favoriteService).addFavorite(anyString(), anyString());
        ResponseEntity<FavoriteResponse> responseEntity = favoriteController.addFavorite(favoriteRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    void removeFavorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        doNothing().when(favoriteService).deleteFavorite(anyString(), anyString());
        ResponseEntity<FavoriteResponse> responseEntity = favoriteController.removeFavorite(favoriteRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    void rankUp() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        favoriteRequest.setParkCode("1");
        List<String> parkCodes = new ArrayList<>();
        parkCodes.add("2");
        parkCodes.add("1");
        when(favoriteService.getParkCodes(anyString())).thenReturn(parkCodes);
        ResponseEntity<FavoriteResponse> responseEntity = favoriteController.rankUp(favoriteRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    void rankDown() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        favoriteRequest.setParkCode("1");
        List<String> parkCodes = new ArrayList<>();
        parkCodes.add("1");
        parkCodes.add("2");
        when(favoriteService.getParkCodes(anyString())).thenReturn(parkCodes);
        ResponseEntity<FavoriteResponse> responseEntity = favoriteController.rankDown(favoriteRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    void privacyStatus() throws Exception {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        doNothing().when(myUserService).changePrivacy(anyString());
        ResponseEntity<FavoriteResponse> responseEntity = favoriteController.privacyStatus(favoriteRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    void modifyFav() throws IOException {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUsername("username");
        favoriteRequest.setParkCode("[{'parkCode': 'yell'}]");
        List<String> parkCodes = new ArrayList<>();
        when(favoriteService.setParkCodes(anyString(), any())).thenReturn(parkCodes);
        ResponseEntity<FavoriteResponse> responseEntity = favoriteController.modifyFav(favoriteRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("[]", Objects.requireNonNull(responseEntity.getBody()).getMessage());
    }
}