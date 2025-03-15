package edu.usc.csci310.project.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import edu.usc.csci310.project.utils.DatabaseUtils;
import edu.usc.csci310.project.utils.NationalParkServiceAPI;
import edu.usc.csci310.project.model.FavoriteRequest;
import edu.usc.csci310.project.model.FavoriteResponse;
import edu.usc.csci310.project.service.FavoriteService;
import edu.usc.csci310.project.service.MyUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;
    @Autowired
    private MyUserService myUserService;

    Gson gson = new Gson();

    @PostMapping("/modifyFav")
    public ResponseEntity<FavoriteResponse> modifyFav(@RequestBody FavoriteRequest request) throws IOException {
        FavoriteResponse favoriteResponse = new FavoriteResponse();
        String username = request.getUsername();
        String dataString = request.getParkCode();
        List<String> parkCodes = new ArrayList<>();
        JsonArray data = gson.fromJson(dataString, JsonArray.class);
        for (JsonElement element : data) {
            parkCodes.add(element.getAsJsonObject().get("parkCode").getAsString());
        }
        parkCodes = favoriteService.setParkCodes(username, parkCodes);
        String message = gson.toJson(parkCodes);
        favoriteResponse.setMessage(message);
        return ResponseEntity.ok(favoriteResponse);
    }

    @PostMapping("/favorite")
    public ResponseEntity<FavoriteResponse> favorite(@RequestBody FavoriteRequest request) throws IOException {
        FavoriteResponse response = new FavoriteResponse();
        String username = request.getUsername();
        System.out.println(username);
        List<String> parkCodes = favoriteService.getParkCodes(username);
        JsonArray msgArr = new JsonArray();
        for (String parkCode : parkCodes) {
            System.out.println(parkCode);
            JsonElement park = NationalParkServiceAPI.parkSingle(parkCode);
            msgArr.add(park);
        }
        String message = gson.toJson(msgArr);
        System.out.println(message);
        response.setMessage(message);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/add-favorite")
    public ResponseEntity<FavoriteResponse> addFavorite(@RequestBody FavoriteRequest request) {
        FavoriteResponse response = new FavoriteResponse();
        String username = request.getUsername();
        String parkCode = request.getParkCode();
        favoriteService.addFavorite(username, parkCode);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/remove-favorite")
    public ResponseEntity<FavoriteResponse> removeFavorite(@RequestBody FavoriteRequest request) {
        FavoriteResponse response = new FavoriteResponse();
        String username = request.getUsername();
        String parkCode = request.getParkCode();
        favoriteService.deleteFavorite(username, parkCode);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/rank-up")
    public ResponseEntity<FavoriteResponse> rankUp(@RequestBody FavoriteRequest request) {
        FavoriteResponse response = new FavoriteResponse();
        String username = request.getUsername();
        String parkCode = request.getParkCode();
        List<String> parkCodes = favoriteService.getParkCodes(username);
        int index = parkCodes.indexOf(parkCode);
        parkCodes.remove(index);
        parkCodes.add(index - 1, parkCode);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/rank-down")
    public ResponseEntity<FavoriteResponse> rankDown(@RequestBody FavoriteRequest request) {
        FavoriteResponse response = new FavoriteResponse();
        String username = request.getUsername();
        String parkCode = request.getParkCode();
        List<String> parkCodes = favoriteService.getParkCodes(username);
        int index = parkCodes.indexOf(parkCode);
        parkCodes.remove(index);
        parkCodes.add(index + 1, parkCode);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/private")
    public ResponseEntity<FavoriteResponse> privacyStatus(@RequestBody FavoriteRequest request) throws Exception {
        FavoriteResponse response = new FavoriteResponse();
        String username = request.getUsername();
        String encodedUsername = DatabaseUtils.encodeUsername(username);
        myUserService.changePrivacy(encodedUsername);
        return ResponseEntity.ok().body(response);
    }
}
