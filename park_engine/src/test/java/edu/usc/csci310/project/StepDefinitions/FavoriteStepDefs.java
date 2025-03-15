package edu.usc.csci310.project.StepDefinitions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

public class FavoriteStepDefs {
    private static final String ROOT_URL = "https://localhost:8443";
    private static WebDriver driver;
    private static String tempPark;
    private static String tempPark1;
    private static String tempPark2;
    private static List<String> tempParks;

    @Before
    public void setup() {
        // Ensure the WebDriver is initialized here
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true); // Ignore SSL certificate errors
        driver = new ChromeDriver(options);
    }
    @After
    public void after() {
        driver.quit();
    }

    @Given("I am logged in for favorite page")
    public void iAmLoggedInForFavoritePage() {
        // log in as user "searchUser"
        driver.get(ROOT_URL + "/LoginPage");
        driver.findElement(By.id("username")).sendKeys("favUser");
        driver.findElement(By.id("password")).sendKeys("1Qa");
        driver.findElement(By.id("Login")).click();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @And("I am on the favorite page")
    public void iAmOnTheFavoritePage() {
        driver.get(ROOT_URL + "/FavoritePage");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("favoriteResultDiv")));
    }

    @When("I look at the privacy status")
    public void iLookAtThePrivacyStatus() {

    }

    @Then("I should see status is private")
    public void iShouldSeePrivateCheckboxIsChecked() {
        assertEquals("Make It Public", driver.findElement(By.id("privacyCheckbox")).getText());
    }

    @When("I click private checkbox")
    public void iClickPrivateCheckbox() {
        driver.findElement(By.id("privacyCheckbox")).click();
    }

    @Then("I should see confirmation list is changed to public")
    public void iShouldSeeConfirmationListIsChangedToPublic() {
        assertTrue(driver.getPageSource().contains("Make It Private"));
    }

    @Then("I should see confirmation list is changed to private")
    public void iShouldSeeConfirmationListIsChangedToPrivate() {
        assertTrue(driver.getPageSource().contains("Make It Public"));
    }

    @Then("I should see status is public")
    public void iShouldSeePrivateCheckboxIsNotChecked() {
        assertEquals("Make It Private", driver.findElement(By.id("privacyCheckbox")).getText());
    }

    @And("I click on the first favorite park")
    public void iClickOnTheFirstFavoritePark() {
        // Assume we ranked Grand Canyon on 1st spot at first
        driver.findElement(By.className("favoriteResultDiv")).findElement(By.tagName("span")).click();
    }

    @And("I hover over the first favorite park")
    public void iHoverOverTheFirstFavoritePark() {
        Actions actions = new Actions(driver);
        actions.moveToElement(driver.findElement(By.className("favoriteResultDiv"))).pause(100).perform();
    }

    @Then("I should see a minus button")
    public void iShouldSeeAMinusButton() {
        assertTrue(driver.getPageSource().contains("-"));
    }

    @When("I click on the minus button")
    public void iClickOnTheMinusButton() {
        // first store the park name we are operating on
        tempPark = driver.findElement(By.className("favoriteResultDiv")).findElement(By.tagName("span")).getText();
        driver.findElement(By.className("deleteButton")).click();
    }

    @Then("I should see a delete confirmation dialogue")
    public void iShouldSeeADeleteConfirmationDialogue() {
        boolean hasCancel = driver.getPageSource().contains("Cancel");
        boolean hasConfirm = driver.getPageSource().contains("Confirm");
        assertTrue(hasCancel && hasConfirm);
    }

    @When("I click on the cancel button on delete dialogue")
    public void iClickOnTheCancelButtonOnDeleteDialogue() {
        driver.findElement(By.className("cancelDeleteButton")).click();
    }

    @Then("I should see the favorite park is not deleted")
    public void iShouldSeeTheFavoriteParkIsNotDeleted() {
        assertTrue(driver.getPageSource().contains(tempPark));
    }

    @When("I click on the confirm button on delete dialogue")
    public void iClickOnTheConfirmButtonOnDeleteDialogue() {
        driver.findElement(By.className("confirmDeleteButton")).click();
    }

    @Then("I should see the favorite park is deleted")
    public void iShouldSeeTheFavoriteParkIsDeleted() {
        assertFalse(driver.getPageSource().contains(tempPark));
    }

    @Then("I should see an up arrow")
    public void iShouldSeeAnUpArrow() {
        assertTrue(driver.getPageSource().contains("↑"));
    }

    @And("I should see a down arrow")
    public void iShouldSeeADownArrow() {
        assertTrue(driver.getPageSource().contains("↓"));
    }

    @And("I hover over the second favorite park")
    public void iHoverOverTheSecondFavoritePark() {
        Actions actions = new Actions(driver);
        actions.moveToElement(driver.findElements(By.className("favoriteResultDiv")).get(1)).pause(100).perform();
    }

    @When("I click on the up arrow")
    public void iClickOnTheUpArrow() {
        driver.findElement(By.className("upButton")).click();
    }

    @Then("I should see first and second switched places")
    public void iShouldSeeFirstAndSecondSwitchedPlaces() {
        String newPark1 = driver.findElements(By.className("favoriteResultDiv")).get(0).findElement(By.tagName("span")).getText();
        String newPark2 = driver.findElements(By.className("favoriteResultDiv")).get(1).findElement(By.tagName("span")).getText();
        assertTrue(Objects.equals(newPark1, tempPark2) && Objects.equals(newPark2, tempPark1));
    }

    @Then("I should see first and second stayed same")
    public void iShouldSeeFirstAndSecondStayedSame() {
        String newPark1 = driver.findElements(By.className("favoriteResultDiv")).get(0).findElement(By.tagName("span")).getText();
        String newPark2 = driver.findElements(By.className("favoriteResultDiv")).get(1).findElement(By.tagName("span")).getText();
        assertTrue(Objects.equals(newPark1, tempPark1) && Objects.equals(newPark2, tempPark2));
    }

    @Then("I should see second-to-last and last stayed same")
    public void iShouldSeeSecondToLastAndLastStayedSame() {
        String newPark1 = driver.findElements(By.className("favoriteResultDiv")).get(1).findElement(By.tagName("span")).getText();
        String newPark2 = driver.findElements(By.className("favoriteResultDiv")).get(2).findElement(By.tagName("span")).getText();
        assertTrue(Objects.equals(newPark1, tempPark1) && Objects.equals(newPark2, tempPark2));
    }

    @Then("I should see error message {string}")
    public void iShouldSeeErrorMessage(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @When("I click on the down arrow")
    public void iClickOnTheDownArrow() {
        driver.findElement(By.className("downButton")).click();
    }

    @And("I hover over the last favorite park")
    public void iHoverOverTheLastFavoritePark() {
        Actions actions = new Actions(driver);
        List<WebElement> allResults = driver.findElements(By.className("favoriteResultDiv"));
        actions.moveToElement(allResults.get(allResults.size() - 1)).pause(100).perform();
    }

    @And("I record the first and second favorite parks")
    public void iRecordTheFirstAndSecondFavoriteParks() {
        tempPark1 = driver.findElements(By.className("favoriteResultDiv")).get(0).findElement(By.tagName("span")).getText();
        tempPark2 = driver.findElements(By.className("favoriteResultDiv")).get(1).findElement(By.tagName("span")).getText();
    }

    @And("I record the second-to-last and last favorite parks")
    public void iRecordTheSecondToLastAndLastFavoriteParks() {
        tempPark1 = driver.findElements(By.className("favoriteResultDiv")).get(1).findElement(By.tagName("span")).getText();
        tempPark2 = driver.findElements(By.className("favoriteResultDiv")).get(2).findElement(By.tagName("span")).getText();
    }

    @When("I click the Delete All button for favorite list")
    public void iClickTheDeleteAllButtonForFavoriteList() {
        tempParks = new ArrayList<>();
        List<WebElement> allResults = driver.findElements(By.className("favoriteResultDiv"));
        for (WebElement resultDiv : allResults) {
            tempParks.add(resultDiv.findElement(By.tagName("span")).getText());
        }
        driver.findElement(By.id("deleteAllButton")).click();
    }

    @Then("I should see a delete-all confirmation dialogue")
    public void iShouldSeeADeleteAllConfirmationDialogue() {
        boolean hasCancel = driver.getPageSource().contains("Close");
        boolean hasConfirm = driver.getPageSource().contains("Confirm");
        assertTrue(hasCancel && hasConfirm);
    }

    @When("I click the cancel button on delete-all dialogue")
    public void iClickTheCancelButtonOnDeleteAllDialogue() {
        driver.findElement(By.id("cancelDeleteAllButton")).click();
    }

    @Then("I should see whole favorite list is not deleted")
    public void iShouldSeeWholeFavoriteListIsNotDeleted() {
        for (String parkName : tempParks) {
            assertTrue(driver.getPageSource().contains(parkName));
        }
    }

    @When("I click the confirm button on delete-all dialogue")
    public void iClickTheConfirmButtonOnDeleteAllDialogue() {
        driver.findElement(By.id("confirmDeleteAllButton")).click();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should see whole favorite list is deleted")
    public void iShouldSeeWholeFavoriteListIsDeleted() {
        for (String parkName : tempParks) {
            assertFalse(driver.getPageSource().contains(parkName));
        }
    }

    @When("I click the Log Out button for favorite")
    public void iClickTheLogOutButtonForFavorite() {
        driver.findElement(By.id("logOutButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Search button for favorite")
    public void iClickTheSearchButtonForFavorite() {
        driver.findElement(By.id("searchPageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Favorite button for favorite")
    public void iClickTheFavoriteButtonForFavorite() {
        driver.findElement(By.id("favoritePageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Compare button for favorite")
    public void iClickTheCompareButtonForFavorite() {
        driver.findElement(By.id("comparePageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should be redirected to the {string} page for favorite")
    public void iShouldBeRedirectedToThePageForFavorite(String arg0) {
        assertEquals(String.format("%s/%sPage", ROOT_URL, arg0), driver.getCurrentUrl());
    }

    @Then("I should see {string} displayed for favorite page")
    public void iShouldSeeDisplayedForFavoritePage(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @Then("I should see park name in detail window fav")
    public void iShouldSeeParkNameInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Park Name:"));
    }

    @And("I should see location in detail window fav")
    public void iShouldSeeLocationInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Locations"));
    }

    @And("I should see park url in detail window fav")
    public void iShouldSeeParkUrlInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Visit Park Website:"));
    }

    @And("I should see entrance fee in detail window fav")
    public void iShouldSeeEntranceFeeInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Entrance Fee:"));
    }

    @And("I should see park picture in detail window fav")
    public void iShouldSeeParkPictureInDetailWindow() {
        assertNotNull(driver.findElement(By.tagName("img")));
    }

    @And("I should see park description in detail window fav")
    public void iShouldSeeParkDescriptionInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Park Description:"));
    }

    @And("I should see amenities in detail window fav")
    public void iShouldSeeAmenitiesInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Amenities"));
    }

    @And("I should see activities in detail window fav")
    public void iShouldSeeActivitiesInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Activities"));
    }

    @And("I should see if park is favorited in detail window fav")
    public void iShouldSeeIfParkIsFavoritedInDetailWindow() {
        assertTrue(driver.getPageSource().contains("Favorite?:"));
    }

    @When("I click on the state {string} fav")
    public void iClickOnTheState(String arg0) {
        driver.findElement(By.className("stateInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @Then("I should see {string} selected as the search option fav")
    public void iShouldSeeSelectedAsTheSearchOption(String arg0) {
        assertEquals("true", driver.findElement(By.id(arg0.toLowerCase())).getAttribute("checked"));
    }

    @And("I should see {string} entered into the search query field fav")
    public void iShouldSeeEnteredIntoTheSearchQueryField(String arg0) {
        assertTrue(driver.findElement(By.id("searchQuery")).getAttribute("value").contains(arg0));
    }

    @Then("I should see {string} displayed as the first search result fav")
    public void iShouldSeeDisplayedAsTheFirstSearchResult(String arg0) {
        assertTrue(driver.findElement(By.className("searchResultDiv")).getText().contains(arg0));
    }

    @When("I click on the amenity {string} fav")
    public void iClickOnTheAmenity(String arg0) {
        driver.findElement(By.className("amenityInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @When("I click on the activity {string} fav")
    public void iClickOnTheActivity(String arg0) {
        driver.findElement(By.className("activityInfo")).findElement(By.cssSelector(String.format("li[value='%s']", arg0))).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(webDriver -> webDriver.findElement(By.className("searchResultDiv")));
    }

    @When("I check current URL for favorite")
    public void iCheckCurrentURLForFavorite() {
        driver.getCurrentUrl();
    }

    @Then("I should see https instead of http for favorite")
    public void iShouldSeeHttpsInsteadOfHttpForFavorite() {
        assertTrue(driver.getCurrentUrl().contains("https"));
    }

    @Given("I am not logged in for fav")
    public void iAmNotLoggedInForFav() {
        driver.get(ROOT_URL + "/LoginPage");
    }

    @When("I access {string} page through address bar for fav")
    public void iAccessPageThroughAddressBarForFav(String arg0) {
        driver.get(String.format("%s/%sPage", ROOT_URL, arg0));
    }

    @And("Current user has favorites {string} fav")
    public void currentUserHasFavoritesFav(String arg0) {
    }

    @When("I access {string} page with http for fav")
    public void iAccessPageWithHttpForFav(String arg0) {
        driver.get(String.format("%s/%sPage", "http://localhost:8443", arg0));
    }

    @Then("I should be denied access for fav")
    public void iShouldBeDeniedAccessForFav() {
        assertTrue(driver.getPageSource().contains("Bad Request"));
    }

    @And("I click on the third favorite park")
    public void iClickOnTheThirdFavoritePark() {
        // Assume we ranked Bryce Canyon on 3rd spot at first
        driver.findElements(By.className("favoriteResultDiv")).get(2).findElement(By.tagName("span")).click();
    }
}
