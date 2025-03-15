package edu.usc.csci310.project.StepDefinitions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class CompareStepDefs {
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

    @Given("I am on the compare page")
    public void iAmOnTheComparePage() {
        // log in as user "compareUser"
        driver.get(ROOT_URL + "/LoginPage");
        driver.findElement(By.id("username")).sendKeys("compareUser");
        driver.findElement(By.id("password")).sendKeys("1Qa");
        driver.findElement(By.id("Login")).click();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        driver.get(ROOT_URL + "/ComparePage");
    }

    @When("I enter {string} into the friend search query field")
    public void iEnterIntoTheFriendSearchQueryField(String arg0) {
        driver.findElement(By.id("friendSearchQuery")).sendKeys(arg0);
    }

    @When("I click on a park on the compare list")
    public void iClickOnAParkOnTheCompareList() {
        driver.findElement(By.className("compareResultDiv")).findElement(By.tagName("span")).click();
    }

    @When("I hover over the ratio next to the first result")
    public void iHoverOverTheRatioNextToTheFirstResult() {
        Actions actions = new Actions(driver);
        actions.moveToElement(driver.findElement(By.className("ratioDiv"))).pause(100).perform();
    }

    @And("I should see only {int} parks on compare list")
    public void iShouldSeeOnlyParksOnCompareList(int arg0) {
        assertEquals(arg0, driver.findElements(By.className("compareResultDiv")).size());
    }

    @Then("I should see {string} as the first compare result")
    public void iShouldSeeAsTheFirstCompareResult(String arg0) {
        assertTrue(driver.findElement(By.className("compareResultDiv")).getText().contains(arg0));
    }

    @And("I should see {string} as the second compare result")
    public void iShouldSeeAsTheSecondCompareResult(String arg0) {
        assertTrue(driver.findElements(By.className("compareResultDiv")).get(1).getText().contains(arg0));
    }

    @And("I should see more users favorite first result than second")
    public void iShouldSeeMoreUsersFavoriteFirstResultThanSecond() {
        assertTrue(driver.findElements(By.className("ratioDiv")).get(0).getText().contains("2 / 2"));
        assertTrue(driver.findElements(By.className("ratioDiv")).get(1).getText().contains("1 / 2"));
    }

    @And("Current user has favorites {string}")
    public void currentUserHasFavorites(String arg0) {

    }

    @And("User {string} has favorites {string}")
    public void userHasFavorites(String arg0, String arg1) {

    }

    @When("I check current URL for compare")
    public void iCheckCurrentURLForCompare() {
        driver.getCurrentUrl();
    }

    @Then("I should see https instead of http for compare")
    public void iShouldSeeHttpsInsteadOfHttpForCompare() {
        assertTrue(driver.getCurrentUrl().contains("https"));
    }

    @Given("I am not logged in for compare")
    public void iAmNotLoggedInForCompare() {
        driver.get(ROOT_URL + "/LoginPage");
    }

    @When("I access {string} page through address bar for compare")
    public void iAccessPageThroughAddressBarForCompare(String arg0) {
        driver.get(String.format("%s/%sPage", ROOT_URL, arg0));
    }

    @Then("I should be redirected to the {string} page for compare")
    public void iShouldBeRedirectedToThePageForCompare(String arg0) {
        assertEquals(String.format("%s/%sPage", ROOT_URL, arg0), driver.getCurrentUrl());
    }

    @When("I click the Log Out button in the navigation bar for compare")
    public void iClickTheLogOutButtonInTheNavigationBarForCompare() {
        driver.findElement(By.id("logOutButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Favorite button in the navigation bar for compare")
    public void iClickTheFavoriteButtonInTheNavigationBarForCompare() {
        driver.findElement(By.id("favoritePageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Search button in the navigation bar for compare")
    public void iClickTheSearchButtonInTheNavigationBarForCompare() {
        driver.findElement(By.id("searchPageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @And("I click the Add Friend button")
    public void iClickTheAddFriendButton() {
        driver.findElement(By.id("addFriendButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should see {string} for compare")
    public void iShouldSeeForCompare(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @When("I click the Compare button")
    public void iClickTheCompareButton() {
        driver.findElement(By.id("compareButton")).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("compareResultDiv")));
    }

    @Then("I should see park name in detail window compare")
    public void iShouldSeeParkNameInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Park Name:"));
    }

    @And("I should see location in detail window compare")
    public void iShouldSeeLocationInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Locations"));
    }

    @And("I should see park url in detail window compare")
    public void iShouldSeeParkUrlInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Visit Park Website:"));
    }

    @And("I should see entrance fee in detail window compare")
    public void iShouldSeeEntranceFeeInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Entrance Fee:"));
    }

    @And("I should see park picture in detail window compare")
    public void iShouldSeeParkPictureInDetailWindowCompare() {
        assertNotNull(driver.findElement(By.tagName("img")));
    }

    @And("I should see park description in detail window compare")
    public void iShouldSeeParkDescriptionInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Park Description:"));
    }

    @And("I should see amenities in detail window compare")
    public void iShouldSeeAmenitiesInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Amenities"));
    }

    @And("I should see activities in detail window compare")
    public void iShouldSeeActivitiesInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Activities"));
    }

    @And("I should see if park is favorited in detail window compare")
    public void iShouldSeeIfParkIsFavoritedInDetailWindowCompare() {
        assertTrue(driver.getPageSource().contains("Favorite?:"));
    }

    @Then("I should see ratio {string} for the first park")
    public void iShouldSeeRatioForTheFirstPark(String arg0) {
        assertTrue(driver.findElement(By.className("ratioDiv")).getText().contains(arg0));
    }

    @And("I should see ratio {string} for the second park")
    public void iShouldSeeRatioForTheSecondPark(String arg0) {
        assertTrue(driver.findElements(By.className("ratioDiv")).get(1).getText().contains(arg0));
    }

    @Then("I should see current user and {string} favorite the park")
    public void iShouldSeeCurrentUserAndFavoriteThePark(String arg0) {
        String hoverContent = driver.findElement(By.className("compareResultDiv")).getText();
        assertTrue(hoverContent.contains("compareUser") && hoverContent.contains(arg0));
    }

    @When("I access {string} page with http for compare")
    public void iAccessPageWithHttpForCompare(String arg0) {
        driver.get(String.format("%s/%sPage", "http://localhost:8443", arg0));
    }

    @Then("I should be denied access for compare")
    public void iShouldBeDeniedAccessForCompare() {
        assertTrue(driver.getPageSource().contains("Bad Request"));
    }

    @And("I click on the second compare result")
    public void iClickOnTheSecondCompareResult() {
        driver.findElements(By.className("compareResultDiv")).get(1).click();
    }

    @When("I click on the state {string} compare")
    public void iClickOnTheStateCompare(String arg0) {
        driver.findElement(By.className("stateInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @And("I should see {string} selected as the search option compare")
    public void iShouldSeeSelectedAsTheSearchOptionCompare(String arg0) {
        assertEquals("true", driver.findElement(By.id(arg0.toLowerCase())).getAttribute("checked"));
    }

    @And("I should see {string} entered into the search query field compare")
    public void iShouldSeeEnteredIntoTheSearchQueryFieldCompare(String arg0) {
        assertTrue(driver.findElement(By.id("searchQuery")).getAttribute("value").contains(arg0));
    }

    @And("I should see {string} displayed as the first search result compare")
    public void iShouldSeeDisplayedAsTheFirstSearchResultCompare(String arg0) {
        assertTrue(driver.findElement(By.className("searchResultDiv")).getText().contains(arg0));
    }

    @When("I click on the amenity {string} compare")
    public void iClickOnTheAmenityCompare(String arg0) {
        driver.findElement(By.className("amenityInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @When("I click on the activity {string} compare")
    public void iClickOnTheActivityCompare(String arg0) {
        driver.findElement(By.className("activityInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }
}
