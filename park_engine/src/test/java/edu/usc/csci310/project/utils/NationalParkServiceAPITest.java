package edu.usc.csci310.project.utils;

import com.google.gson.*;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class NationalParkServiceAPITest {
    private final Gson gson = new Gson();
    private final NationalParkServiceAPI nationalParkServiceAPI = new NationalParkServiceAPI();

    @Test
    public void testReadFile() throws IOException {
        String filePath = "src/test/java/edu/usc/csci310/project/CucumberBootstrap.java";
        String expected = "package edu.usc.csci310.project;" + "import io.cucumber.spring.CucumberContextConfiguration;" + "import org.springframework.boot.test.context.SpringBootTest;" + "@CucumberContextConfiguration" + "@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)" + "public class CucumberBootstrap {}";

        assertEquals(expected, NationalParkServiceAPI.readFile(filePath));
    }

    @Test
    public void testGetApiKey() {
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            mocked.when(() -> NationalParkServiceAPI.readFile(anyString())).thenReturn("{\"api_key\": \"foo\"}");

            assertEquals("foo", NationalParkServiceAPI.getApiKey());

            mocked.when(() -> NationalParkServiceAPI.readFile(anyString())).thenThrow(new IOException());

            Exception exception = assertThrows(RuntimeException.class, NationalParkServiceAPI::getApiKey);

            String expectedMessage = "java.io.IOException";
            String actualMessage = exception.getMessage();

            assertEquals(expectedMessage, actualMessage);
        }
    }

    @Test
    public void testParkname() {
        String query = "sample";
        int start = 0;

        String jsonString = "{\"data\":[{\"parkCode\":\"sampleString\"}]}";

        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(jsonString);
            mocked.when(() -> NationalParkServiceAPI.parkSingle(anyString())).thenReturn(JsonParser.parseString("{\"sample\":\"sampleString\"}"));
            assertEquals("[{\"sample\":\"sampleString\"}]", NationalParkServiceAPI.parkname(query, start));

            // null response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(null);
            assertEquals("[]", NationalParkServiceAPI.parkname(query, start));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testState() {
        String query = "sample";
        int start = 0;

        String jsonString = "{\"data\":[{\"parkCode\":\"sampleString\"}]}";

        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(jsonString);
            mocked.when(() -> NationalParkServiceAPI.parkSingle(anyString())).thenReturn(JsonParser.parseString("{\"sample\":\"sampleString\"}"));
            assertEquals("[{\"sample\":\"sampleString\"}]", NationalParkServiceAPI.state(query, start));

            // null response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(null);
            assertEquals("[]", NationalParkServiceAPI.state(query, start));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testActivity() {
        String query = "correct activity";
        int start = 0;

        String jsonString = "{\"data\":[{\"name\":\"sample activity\", \"parks\":[{\"parkCode\": \"abli\"}]}, {\"name\":\"correct activity\", \"parks\":[{\"parkCode\": \"abli\"}]}]}";
        String emptyDataString = "{\"data\":[]}";
        String sampleResponse = "{\"sample\":\"sampleString\"}";

        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(jsonString);
            mocked.when(() -> NationalParkServiceAPI.parkSingle(anyString())).thenReturn(JsonParser.parseString(sampleResponse));
            assertEquals(String.format("[%s]", sampleResponse), NationalParkServiceAPI.activity(query, start));

            // null response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(null);
            assertEquals("[]", NationalParkServiceAPI.activity(query, start));

            // data is empty response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(emptyDataString);
            assertEquals("[]", NationalParkServiceAPI.activity(query, start));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testAmenity() {
        String query = "correct amenity";
        int start = 0;

        String jsonString = "{\"data\":[[{\"name\":\"sample amenity\", \"parks\":[{\"parkCode\": \"abli\"}]}], [{\"name\":\"correct amenity\", \"parks\":[{\"parkCode\": \"abli\"}]}]]}";
        String emptyDataString = "{\"data\":[]}";
        String sampleResponse = "{\"sample\":\"sampleString\"}";

        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(jsonString);
            mocked.when(() -> NationalParkServiceAPI.parkSingle(anyString())).thenReturn(JsonParser.parseString(sampleResponse));
            assertEquals(String.format("[%s]", sampleResponse), NationalParkServiceAPI.amenity(query, start));

            // null response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(null);
            assertEquals("[]", NationalParkServiceAPI.amenity(query, start));

            // data is empty response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(emptyDataString);
            assertEquals("[]", NationalParkServiceAPI.amenity(query, start));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testParkSingle() {
        String query = "sample";

        String jsonString = "{\"data\":[{\"parkCode\":\"sampleString\"}]}";

        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(jsonString);
            mocked.when(() -> NationalParkServiceAPI.parkSingleAmenity(any())).thenReturn(new JsonArray());
            assertEquals("{\"parkCode\":\"sampleString\",\"amenities\":[]}", gson.toJson(NationalParkServiceAPI.parkSingle(query)));

            // null response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(null);
            assertNull(NationalParkServiceAPI.parkSingle(query));
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(jsonString);
            mocked.when(() -> NationalParkServiceAPI.parkSingleAmenity(any())).thenReturn(null);
            assertNull(NationalParkServiceAPI.parkSingle(query));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testParkSingleAmenity() {
        String query = "sample";

        String jsonString = "{\"data\":[[{\"id\":\"sampleID\",\"name\":\"sampleName\"}]]}";

        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            // normal response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(jsonString);
            assertEquals("[{\"sampleName\":\"sampleID\"}]", gson.toJson(NationalParkServiceAPI.parkSingleAmenity(query)));

            // null response
            mocked.when(() -> NationalParkServiceAPI.sendRequest(any())).thenReturn(null);
            assertNull(NationalParkServiceAPI.parkSingleAmenity(query));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testSendRequest() {
        try (MockedStatic<NationalParkServiceAPI> mocked = Mockito.mockStatic(NationalParkServiceAPI.class, Mockito.CALLS_REAL_METHODS)) {
            mocked.when(NationalParkServiceAPI::getApiKey).thenReturn("foo");

            HttpURLConnection connection = mock();

            String expectedString = "This is the response.";
            when(connection.getInputStream()).thenReturn(new ByteArrayInputStream(expectedString.getBytes(StandardCharsets.UTF_8)));

            when(connection.getResponseCode()).thenReturn(HttpURLConnection.HTTP_OK);
            assertEquals(expectedString, NationalParkServiceAPI.sendRequest(connection));

            when(connection.getResponseCode()).thenReturn(HttpURLConnection.HTTP_BAD_REQUEST);
            assertNull(NationalParkServiceAPI.sendRequest(connection));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}