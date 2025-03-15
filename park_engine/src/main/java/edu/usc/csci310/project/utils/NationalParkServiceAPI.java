package edu.usc.csci310.project.utils;

import com.google.gson.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

public class NationalParkServiceAPI {
    private static final Gson gson = new Gson();

    protected static String getApiKey() {
        String filePath = "src/main/resources/config.json";

        String apiJsonString;
        try {
            apiJsonString = readFile(filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return JsonParser.parseString(apiJsonString).getAsJsonObject().get("api_key").getAsString();
    }

    protected static String readFile(String filePath) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath));
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            stringBuilder.append(line);
        }
        bufferedReader.close();
        return stringBuilder.toString();
    }

    public static String parkname(String q, int start) throws IOException {
        String encodedQ = URLEncoder.encode(q, StandardCharsets.UTF_8);
        String urlString = String.format("https://developer.nps.gov/api/v1/parks?q=%s&limit=10&start=%d", encodedQ, start);
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        String message = sendRequest(connection);
        if (Objects.isNull(message)) {
            return gson.toJson(new JsonArray());
        }
        JsonArray data = JsonParser.parseString(message).getAsJsonObject().get("data").getAsJsonArray();
        JsonArray response = new JsonArray();
        for (JsonElement je : data) {
            String parkCode = je.getAsJsonObject().get("parkCode").getAsString();
            JsonElement park = parkSingle(parkCode);
            response.add(park);
        }
        return gson.toJson(response);
    }

    public static String state(String q, int start) throws IOException {
        String encodedQ = URLEncoder.encode(q, StandardCharsets.UTF_8);
        String urlString = String.format("https://developer.nps.gov/api/v1/parks?stateCode=%s&limit=10&start=%d", encodedQ, start);
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        String message = sendRequest(connection);
        if (Objects.isNull(message)) {
            return gson.toJson(new JsonArray());
        }
        JsonArray data = JsonParser.parseString(message).getAsJsonObject().get("data").getAsJsonArray();
        JsonArray response = new JsonArray();
        for (JsonElement je : data) {
            String parkCode = je.getAsJsonObject().get("parkCode").getAsString();
            JsonElement park = parkSingle(parkCode);
            response.add(park);
        }
        return gson.toJson(response);
    }

    public static String activity(String q, int start) throws IOException {
        String encodedQ = URLEncoder.encode(q, StandardCharsets.UTF_8);
        int searchRange = 5;
        String urlString = String.format("https://developer.nps.gov/api/v1/activities/parks?q=%s&limit=%d", encodedQ, searchRange);
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        String message = sendRequest(connection);
        if (Objects.isNull(message)) {
            return gson.toJson(new JsonArray());
        }
        JsonArray data = JsonParser.parseString(message).getAsJsonObject().get("data").getAsJsonArray();
        // Check whether data is empty
        if (data.isEmpty()) {
            return gson.toJson(new JsonArray());
        }

        JsonArray parks = data.get(0).getAsJsonObject().get("parks").getAsJsonArray();
        // Add a check that the returned activity is really the one we want
        for (JsonElement activity : data) {
            if (Objects.equals(activity.getAsJsonObject().get("name").getAsString(), q)) {
                parks = activity.getAsJsonObject().get("parks").getAsJsonArray();
            }
        }

        JsonArray response = new JsonArray();
        int maxIterations = 10;
        for (int i = start; i < Math.min(parks.size(), start + maxIterations); i++) {
            JsonElement je = parks.get(i);
            String parkCode = je.getAsJsonObject().get("parkCode").getAsString();
            JsonElement park = parkSingle(parkCode);
            response.add(park);
        }
        return gson.toJson(response);
    }

    public static String amenity(String q, int start) throws IOException {
        String encodedQ = URLEncoder.encode(q, StandardCharsets.UTF_8);
        int searchRange = 5;
        String urlString = String.format("https://developer.nps.gov/api/v1/amenities/parksplaces?q=%s&limit=%d", encodedQ, searchRange);
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        String message = sendRequest(connection);
        if (Objects.isNull(message)) {
            return gson.toJson(new JsonArray());
        }
        JsonArray data = JsonParser.parseString(message).getAsJsonObject().get("data").getAsJsonArray();
        // Check whether data is empty
        if (data.isEmpty()) {
            return gson.toJson(new JsonArray());
        }

        JsonArray parks = data.get(0).getAsJsonArray().get(0).getAsJsonObject().get("parks").getAsJsonArray();
        // Add a check that the returned activity is really the one we want
        for (JsonElement amenity : data) {
            if (Objects.equals(amenity.getAsJsonArray().get(0).getAsJsonObject().get("name").getAsString(), q)) {
                parks = amenity.getAsJsonArray().get(0).getAsJsonObject().get("parks").getAsJsonArray();
            }
        }

        JsonArray response = new JsonArray();
        int maxIterations = 10;
        for (int i = start; i < Math.min(parks.size(), start + maxIterations); i++) {
            JsonElement je = parks.get(i);
            String parkCode = je.getAsJsonObject().get("parkCode").getAsString();
            JsonElement park = parkSingle(parkCode);
            response.add(park);
        }
        return gson.toJson(response);
    }

    public static JsonElement parkSingle(String parkCode) throws IOException {
        String urlString = String.format("https://developer.nps.gov/api/v1/parks?parkCode=%s&limit=1", parkCode);
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        String message = sendRequest(connection);
        if (Objects.isNull(message)) {
            return null;
        }
        JsonElement data = JsonParser.parseString(message).getAsJsonObject().get("data").getAsJsonArray().get(0);
        JsonElement amenities = parkSingleAmenity(parkCode);
        if (Objects.isNull(amenities)) {
            return null;
        }
        data.getAsJsonObject().add("amenities", amenities);
        return data;
    }

    protected static JsonArray parkSingleAmenity(String parkCode) throws IOException {
        String urlString = String.format("https://developer.nps.gov/api/v1/amenities/parksplaces?parkCode=%s&limit=127&start=0", parkCode);
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        String message = sendRequest(connection);
        if (Objects.isNull(message)) {
            return null;
        }
        JsonArray data = JsonParser.parseString(message).getAsJsonObject().get("data").getAsJsonArray();
        JsonArray amenities = new JsonArray();
        for (JsonElement je : data) {
            String id = je.getAsJsonArray().get(0).getAsJsonObject().get("id").getAsString();
            String amenity = je.getAsJsonArray().get(0).getAsJsonObject().get("name").getAsString();
            JsonObject jo = new JsonObject();
            jo.addProperty(amenity, id);
            amenities.add(jo);
        }
        return amenities;
    }


    protected static String sendRequest(HttpURLConnection connection) throws IOException {
        connection.setRequestMethod("GET");
        connection.setRequestProperty("X-Api-Key", getApiKey());

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            return response.toString();
        } else {
            return null;
        }
    }

}
