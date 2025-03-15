package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.utils.NationalParkServiceAPI;
import edu.usc.csci310.project.model.SearchRequest;
import edu.usc.csci310.project.model.SearchResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

class   SearchControllerTest {
    private final SearchController searchController = new SearchController();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSearchParkname() {
        // Test request
        SearchRequest request = new SearchRequest();
        request.setSearchTerm("Yellowstone");
        request.setSearchCriteria("parkname");
        request.setStart(0);
        String expectedString = "sampleMessage";
        ResponseEntity<SearchResponse> responseEntity;

        // Invoke controller method
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.parkname(anyString(), anyInt())).thenReturn(expectedString);
            responseEntity = searchController.search(request);

            // Verify response
            assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
            assertEquals(expectedString, Objects.requireNonNull(responseEntity.getBody()).getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testSearchState() {
        // Test request
        SearchRequest request = new SearchRequest();
        request.setSearchTerm("CA");
        request.setSearchCriteria("state");
        request.setStart(0);
        String expectedString = "sampleMessage";
        ResponseEntity<SearchResponse> responseEntity;

        // Invoke controller method
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.state(anyString(), anyInt())).thenReturn(expectedString);
            responseEntity = searchController.search(request);

            // Verify response
            assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
            assertEquals(expectedString, Objects.requireNonNull(responseEntity.getBody()).getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testSearchActivity() {
        // Test request
        SearchRequest request = new SearchRequest();
        request.setSearchTerm("Astronomy");
        request.setSearchCriteria("activity");
        request.setStart(0);
        String expectedString = "sampleMessage";
        ResponseEntity<SearchResponse> responseEntity;

        // Invoke controller method
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.activity(anyString(), anyInt())).thenReturn(expectedString);
            responseEntity = searchController.search(request);

            // Verify response
            assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
            assertEquals(expectedString, Objects.requireNonNull(responseEntity.getBody()).getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testSearchAmenity() {
        // Test request
        SearchRequest request = new SearchRequest();
        request.setSearchTerm("Aquatic Invasive Species Inspection");
        request.setSearchCriteria("amenity");
        request.setStart(0);
        String expectedString = "sampleMessage";
        ResponseEntity<SearchResponse> responseEntity;

        // Invoke controller method
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.amenity(anyString(), anyInt())).thenReturn(expectedString);
            responseEntity = searchController.search(request);

            // Verify response
            assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
            assertEquals(expectedString, Objects.requireNonNull(responseEntity.getBody()).getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testSearchDefault() {
        // Test request
        SearchRequest request = new SearchRequest();
        request.setSearchTerm("dude");
        request.setSearchCriteria("due");
        request.setStart(0);
        String expectedString = "";
        ResponseEntity<SearchResponse> responseEntity;

        // Invoke controller method
        try (MockedStatic<NationalParkServiceAPI> ignored = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            responseEntity = searchController.search(request);

            // Verify response
            assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
            assertEquals(expectedString, Objects.requireNonNull(responseEntity.getBody()).getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

//    @Test
//    public void test() throws IOException {
//        String response = NationalParkServiceAPI.state("CA", 0);
//        System.out.println(response);
//    }
}