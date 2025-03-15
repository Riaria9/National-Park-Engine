package edu.usc.csci310.project.controller;

import com.google.gson.JsonObject;
import edu.usc.csci310.project.entity.MyUser;
import edu.usc.csci310.project.model.CompareRequest;
import edu.usc.csci310.project.model.CompareResponse;
import edu.usc.csci310.project.service.FavoriteService;
import edu.usc.csci310.project.service.MyUserService;
import edu.usc.csci310.project.utils.NationalParkServiceAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class CompareControllerTest {
    @Mock
    private FavoriteService favoriteService;

    @Mock
    private MyUserService myUserService;

    @InjectMocks
    private CompareController compareController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void users() throws Exception {
        ResponseEntity<CompareResponse> responseEntity;
        List<MyUser> users = new ArrayList<>();
        users.add(new MyUser(1, "clrIjfJY0ZKxn28lrvA9SA==", "123", "123", true));
        users.add(new MyUser(2, "lvEzmME+10m1nUogi/UVtw==", "123", "123", false));
        when(myUserService.getAllUsers()).thenReturn(users);
        responseEntity = compareController.users();
        assertNotNull(responseEntity);
        assertEquals("[{\"username\":\"existUser\",\"privacyStatus\":true},{\"username\":\"searchUser\",\"privacyStatus\":false}]", Objects.requireNonNull(responseEntity.getBody()).getMessage());
    }

    @Test
    void compare() {
        CompareRequest compareRequest = new CompareRequest();
        ResponseEntity<CompareResponse> responseEntity;
        compareRequest.setUsername("[user1,user2,user3]");
        when(favoriteService.getParkCodes("user1")).thenReturn(Arrays.asList("a", "b", "c"));
        when(favoriteService.getParkCodes("user2")).thenReturn(Arrays.asList("a", "b"));
        when(favoriteService.getParkCodes("user3")).thenReturn(Arrays.asList("a", "c", "d"));
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.parkSingle(anyString())).thenAnswer(invocation -> new JsonObject());
            responseEntity = compareController.compare(compareRequest);

            // Verify response
//            assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
//            assertEquals("[{}]", Objects.requireNonNull(responseEntity.getBody()).getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        assertEquals("[{\"favoriteUsers\":[\"user1\",\"user2\",\"user3\"],\"favoriteCount\":3},{\"favoriteUsers\":[\"user1\",\"user2\"],\"favoriteCount\":2},{\"favoriteUsers\":[\"user1\",\"user3\"],\"favoriteCount\":2},{\"favoriteUsers\":[\"user3\"],\"favoriteCount\":1}]", Objects.requireNonNull(responseEntity.getBody()).getMessage());
    }
}