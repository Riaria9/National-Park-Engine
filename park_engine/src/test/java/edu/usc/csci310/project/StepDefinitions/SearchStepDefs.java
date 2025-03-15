package edu.usc.csci310.project.StepDefinitions;

import io.appium.java_client.android.AndroidDriver;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class SearchStepDefs {
    private static final String ROOT_URL = "https://localhost:8443";
    private static WebDriver driver;

    @Before
    public void setup() {
        // Ensure the WebDriver is initialized here
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true); // Ignore SSL certificate errors
        driver = new ChromeDriver(options);
    }

    @After
    public void after() {
        if (driver != null) {
        driver.quit();}
    }

    @Given("I am on the search page")
    public void iAmOnTheSearchPage() {
        // log in as user "searchUser"
        driver.get(ROOT_URL + "/LoginPage");
        driver.findElement(By.id("username")).sendKeys("searchUser");
        driver.findElement(By.id("password")).sendKeys("1Qa");
        driver.findElement(By.id("Login")).click();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        driver.get(ROOT_URL + "/SearchPage");
    }

    @When("I enter {string} into the search query field")
    public void iEnterIntoTheSearchQueryField(String arg0) {
        driver.findElement(By.id("searchQuery")).sendKeys(arg0);
    }


    @And("I click the Search button")
    public void iClickTheSearchButton() {

        driver.findElement(By.id("searchButton")).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @And("I click the Load More button")
    public void iClickTheLoadMoreButton() {
        driver.findElement(By.id("loadMoreButton")).click();

        try {
            Thread.sleep(7000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Add to Favorites button")
    public void iClickTheAddToFavoritesButton() {
        driver.findElement(By.className("favoriteButton")).click();
    }

    @Then("I should see {string} displayed on the page")
    public void iShouldSeeDisplayedOnThePage(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @Then("I should see {string} displayed as the first search result")
    public void iShouldSeeDisplayedAsTheFirstSearchResult(String arg0) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
        assertTrue(driver.findElement(By.className("searchResultDiv")).getText().contains(arg0));
    }

    @And("I hit the Enter key")
    public void iHitTheEnterKey() {

        driver.findElement(By.id("searchQuery")).sendKeys(Keys.ENTER);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @When("I select {string} as the search option")
    public void iSelectAsTheSearchOption(String arg0) {
        driver.findElement(By.id(arg0.toLowerCase())).click();
    }

    @Then("I should see {int} search results")
    public void iShouldSeeSearchResults(int arg0) {
        assertEquals(arg0, driver.findElements(By.className("searchResultDiv")).size());
    }

    @And("I should not see {string} displayed on the page")
    public void iShouldNotSeeDisplayedOnThePage(String arg0) {
        assertFalse(driver.getPageSource().contains(arg0));
    }

    @When("I hover the mouse over the first search result")
    public void iHoverTheMouseOverTheFirstSearchResult() {
        Actions actions = new Actions(driver);
        actions.moveToElement(driver.findElement(By.className("searchResultDiv"))).pause(100).perform();
    }

    @When("I hover the mouse over the second search result")
    public void iHoverTheMouseOverTheSecondSearchResult() {
        Actions actions = new Actions(driver);
        actions.moveToElement(driver.findElements(By.className("searchResultDiv")).get(1)).pause(100).perform();
    }

    @When("I move the mouse off from the first search result")
    public void iMoveTheMouseOffFromTheFirstSearchResult() {
        Actions actions = new Actions(driver);
        actions.moveToElement(driver.findElement(By.id("searchQuery"))).perform();
    }

    @Given("I am on the search page on a mobile device")
    public void iAmOnTheSearchPageOnAMobileDevice() {
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability("deviceName", "Android Emulator");
        capabilities.setCapability("platformName", "Android");
        capabilities.setCapability("platformVersion","4.3");
        capabilities.setCapability(CapabilityType.BROWSER_NAME, "Chrome");
//        capabilities.setPlatform(Platform.ANDROID);
//        capabilities.setBrowserName("Chrome");
        URL url;
        try {
            url = new URL(ROOT_URL + "/LoginPage");
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        driver = new AndroidDriver(url, capabilities);

        driver.findElement(By.id("username")).sendKeys("searchUser");
        driver.findElement(By.id("password")).sendKeys("1Qa");
        driver.findElement(By.id("Login")).click();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        driver.get(ROOT_URL + "/SearchPage");
    }

    @When("I click on the first search result")
    public void iClickOnTheFirstSearchResult() {
        driver.findElement(By.className("searchResultDiv")).findElement(By.tagName("span")).click();
    }

    @When("I click on the third search result")
    public void iClickOnTheThirdSearchResult() {
        driver.findElements(By.className("searchResultDiv")).get(2).findElement(By.tagName("span")).click();
    }

    @And("I should not see detail window displayed on the page")
    public void iShouldNotSeeDetailWindowDisplayedOnThePage() {
        assertFalse(driver.getPageSource().contains("Location"));
    }

    @And("I should see the park is not favorited")
    public void iShouldSeeTheParkIsNotFavorited() {
        assertTrue(driver.getPageSource().contains("Favorite?: No"));
    }

    @And("I should see the park is favorited")
    public void iShouldSeeTheParkIsFavorited() {
        assertTrue(driver.getPageSource().contains("Favorite?: Yes"));
    }

    @When("I click on the park url")
    public void iClickOnTheParkUrl() {
        driver.findElement(By.className("parkUrl")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should be redirected to the park website")
    public void iShouldBeRedirectedToTheParkWebsite() {
        assertEquals("https://www.nps.gov/brca/index.htm", driver.getCurrentUrl());
    }

    @When("I click on the state {string}")
    public void iClickOnTheState(String arg0) {
        driver.findElement(By.className("stateInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @Then("I should see {string} selected as the search option")
    public void iShouldSeeSelectedAsTheSearchOption(String arg0) {
        assertEquals("true", driver.findElement(By.id(arg0.toLowerCase())).getAttribute("checked"));
    }

    @And("I should see {string} entered into the search query field")
    public void iShouldSeeEnteredIntoTheSearchQueryField(String arg0) {
        assertEquals(arg0, driver.findElement(By.id("searchQuery")).getAttribute("value"));
    }

    @When("I click on the amenity {string}")
    public void iClickOnTheAmenity(String arg0) {
        driver.findElement(By.className("amenityInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @When("I click on the activity {string}")
    public void iClickOnTheActivity(String arg0) {
        driver.findElement(By.className("activityInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @Then("I should see park name in detail window")
    public void iShouldSeeParkNameInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Park Name:"));
    }

    @And("I should see location in detail window")
    public void iShouldSeeLocationInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Locations"));
    }

    @And("I should see park url in detail window")
    public void iShouldSeeParkUrlInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Visit Park Website:"));
    }

    @And("I should see entrance fee in detail window")
    public void iShouldSeeEntranceFeeInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Entrance Fee:"));
    }

    @And("I should see park picture in detail window")
    public void iShouldSeeParkPictureInDetailWindow() {
        assertNotNull(driver.findElement(By.tagName("img")));
    }

    @And("I should see park description in detail window")
    public void iShouldSeeParkDescriptionInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Park Description:"));
    }

    @And("I should see amenities in detail window")
    public void iShouldSeeAmenitiesInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Amenities"));
    }

    @And("I should see activities in detail window")
    public void iShouldSeeActivitiesInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Activities"));
    }

    @And("I should see if park is favorited in detail window")
    public void iShouldSeeIfParkIsFavoritedInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Favorite?:"));
    }

    @When("I click on the first search result again")
    public void iClickOnTheFirstSearchResultAgain() {
        // Find the element you want to click
        WebElement searchResult = driver.findElement(By.className("searchResultDiv"));

        // Get the location of the element on the page
        int xCoord = 0;
        int yCoord = searchResult.getLocation().getY();

        // Create an instance of Actions class
        Actions actions = new Actions(driver);

        // Move the mouse to the element's coordinates and click
        actions.moveByOffset(xCoord, yCoord).click().perform();
    }

    @And("I click the Search button with empty field")
    public void iClickTheSearchButtonWithEmptyField() {
        driver.findElement(By.id("searchButton")).click();
    }

    @When("I click the Log Out button in the navigation bar")
    public void iClickTheLogOutButtonInTheNavigationBar() {
        driver.findElement(By.id("logOutButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should be redirected to the {string} page")
    public void iShouldBeRedirectedToThePage(String arg0) {
        assertEquals(String.format("%s/%sPage", ROOT_URL, arg0), driver.getCurrentUrl());
    }

    @When("I click the Favorite button in the navigation bar")
    public void iClickTheFavoriteButtonInTheNavigationBar() {
        driver.findElement(By.id("favoritePageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Search button in the navigation bar")
    public void iClickTheSearchButtonInTheNavigationBar() {
        driver.findElement(By.id("searchPageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Compare button in the navigation bar")
    public void iClickTheCompareButtonInTheNavigationBar() {
        driver.findElement(By.id("comparePageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Add to Favorites button from detail window")
    public void iClickTheAddToFavoritesButtonFromDetailWindow() {
        driver.findElement(By.className("searchDetailResultDiv")).findElement(By.className("favoriteButton")).click();
    }

    @When("I check current URL for search")
    public void iCheckCurrentURLForSearch() {
        driver.getCurrentUrl();
    }

    @Then("I should see https instead of http for search")
    public void iShouldSeeHttpsInsteadOfHttpForSearch() {
        assertTrue(driver.getCurrentUrl().contains("https"));
    }

    @Given("I am not logged in for search")
    public void iAmNotLoggedInForSearch() {
        driver.get(ROOT_URL + "/LoginPage");
    }

    @When("I access {string} page through address bar for search")
    public void iAccessPageThroughAddressBarForSearch(String arg0) {
        driver.get(String.format("%s/%sPage", ROOT_URL, arg0));
    }

    @And("Current user has favorites {string} search")
    public void currentUserHasFavoritesSearch(String arg0) {
    }

    @When("I access {string} page with http for search")
    public void iAccessPageWithHttpForSearch(String arg0) {
        driver.get(String.format("%s/%sPage", "http://localhost:8443", arg0));
    }

    @Then("I should be denied access for search")
    public void iShouldBeDeniedAccessForSearch() {
        assertTrue(driver.getPageSource().contains("Bad Request"));
    }
}
