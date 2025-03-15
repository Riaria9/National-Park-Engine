package edu.usc.csci310.project.controller;
import edu.usc.csci310.project.utils.NationalParkServiceAPI;
import edu.usc.csci310.project.model.SearchRequest;
import edu.usc.csci310.project.model.SearchResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class SearchController {
    @PostMapping("/search")
    public ResponseEntity<SearchResponse> search(@RequestBody SearchRequest request) throws IOException {
        SearchResponse response = new SearchResponse();
        String q = request.getSearchTerm();
        String criteria = request.getSearchCriteria();
        int start = request.getStart();
        String message = switch (criteria) {
            case "parkname" ->  NationalParkServiceAPI.parkname(q, start);
            case "amenity" -> NationalParkServiceAPI.amenity(q, start);
            case "state" -> NationalParkServiceAPI.state(q, start);
            case "activity" -> NationalParkServiceAPI.activity(q, start);
            default -> "";
        };
        response.setMessage(message);
        return ResponseEntity.ok().body(response);
    }
}