package edu.usc.csci310.project.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import edu.usc.csci310.project.entity.MyUser;
import edu.usc.csci310.project.model.CompareRequest;
import edu.usc.csci310.project.model.CompareResponse;
import edu.usc.csci310.project.service.FavoriteService;
import edu.usc.csci310.project.service.MyUserService;
import edu.usc.csci310.project.utils.DatabaseUtils;
import edu.usc.csci310.project.utils.NationalParkServiceAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;

@RestController
public class CompareController {
    @Autowired
    private FavoriteService favoriteService;
    @Autowired
    private MyUserService myUserService;

    Gson gson = new Gson();

    @PostMapping("/users")
    public ResponseEntity<CompareResponse> users() throws Exception {
        CompareResponse compareResponse = new CompareResponse();
        Iterable<MyUser> users = myUserService.getAllUsers();
        JsonArray userList = new JsonArray();
        for (MyUser user : users) {
            JsonObject userJson = new JsonObject();
            userJson.addProperty("username", DatabaseUtils.decodeUsername(user.getUsername()));
            userJson.addProperty("privacyStatus", user.isPrivacyStatus());
            userList.add(userJson);
        }
        compareResponse.setMessage(gson.toJson(userList));
        return ResponseEntity.ok(compareResponse);
    }

    @PostMapping("/compare")
    public ResponseEntity<CompareResponse> compare(@RequestBody CompareRequest compareRequest) throws IOException {
        CompareResponse compareResponse = new CompareResponse();
        String username = compareRequest.getUsername();
        JsonArray userList = gson.fromJson(username, JsonArray.class);
        Map<String, ArrayList<String>> compareMap = new HashMap<>();
        for (JsonElement user : userList) {
            List<String> parkCodes = favoriteService.getParkCodes(user.getAsString());
            for (String parkCode : parkCodes) {
                if (!compareMap.containsKey(parkCode)) {
                    ArrayList<String> list = new ArrayList<>();
                    list.add(user.getAsString());
                    compareMap.put(parkCode, list);
                } else {
                    compareMap.get(parkCode).add(user.getAsString());
                }
            }
        }
        List<Map.Entry<String, ArrayList<String>>> entryList = new ArrayList<>(compareMap.entrySet());
        entryList.sort(Comparator.comparingInt((Map.Entry<String, ArrayList<String>> entry) -> entry.getValue().size()).reversed());
        JsonArray messageArray = new JsonArray();
        for (Map.Entry<String, ArrayList<String>> entry : entryList) {
            JsonElement parkSingle = NationalParkServiceAPI.parkSingle(entry.getKey());
            JsonArray userArr = new JsonArray();
            for (String user : entry.getValue()) {
                userArr.add(user);
            }
            parkSingle.getAsJsonObject().add("favoriteUsers", userArr);
            parkSingle.getAsJsonObject().addProperty("favoriteCount", entry.getValue().size());
            messageArray.add(parkSingle);
        }
        compareResponse.setMessage(gson.toJson(messageArray));
        return ResponseEntity.ok(compareResponse);
    }
}
