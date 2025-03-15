package edu.usc.csci310.project.StepDefinitions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class SignupStepDefs {
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
        driver.quit();
    }

    @Given("I am on the signup page")
    public void iAmOnTheSignupPage() {driver.get(ROOT_URL + "/SignupPage");}


    @When("I fill in {string} with {string} on the signup page")
    public void iFillInWithOnTheSignupPage(String fieldName, String value) {
        driver.findElement(By.id(fieldName)).sendKeys(value);
    }

    @And("I press the {string} button on the signup page")
    public void iPressTheButtonOnTheSignupPage(String buttonId) {
        driver.findElement(By.id(buttonId)).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should see {string} on the signup page")
    public void iShouldSeeOnTheSignupPage(String expectedText) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(webDriver -> webDriver.findElement(By.id("information")));
        assertTrue(driver.getPageSource().contains(expectedText));

    }

    @Then("I should be redirected to the sign-in page on the signup page")
    public void iShouldBeRedirectedToTheSignInPageOnTheSignupPage() {
        assertEquals("https://localhost:8443/LoginPage", driver.getCurrentUrl());
    }

    @Then("I should see a validation message for the required field")
    public void iShouldSeeAValidationMessageForTheRequiredField() {
        WebElement requiredField = driver.findElement(By.id("username"));
        WebElement requiredField2 = driver.findElement(By.id("password"));
        WebElement requiredField3 = driver.findElement(By.id("confirmPassword"));
        // Execute JavaScript to check if the field is valid
        boolean isValid = (Boolean) ((JavascriptExecutor) driver).executeScript("return arguments[0].checkValidity();", requiredField);
        boolean isValid2 = (Boolean) ((JavascriptExecutor) driver).executeScript("return arguments[0].checkValidity();", requiredField2);
        boolean isValid3 = (Boolean) ((JavascriptExecutor) driver).executeScript("return arguments[0].checkValidity();", requiredField3);
        assertFalse(isValid && isValid2 && isValid3); // Assert that the field is not valid
    }

    @Then("the value in the form should stay")
    public void theValueInTheFormShouldStay() {
        String value = driver.findElement(By.id("username")).getAttribute("value");
        assertEquals(value,"username");
    }

    @When("I click the Sign up button for signup")
    public void iClickTheSignUpButtonInTheNavigationBar() {
        driver.findElement(By.id("signUpPageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Log in button for signup")
    public void iClickTheLogInButtonInTheNavigationBar() {
        driver.findElement(By.id("logInPageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should be redirected to the {string} page for signup")
    public void iShouldBeRedirectedToThePage(String arg0) {
        assertEquals(String.format("%s/%sPage", ROOT_URL, arg0), driver.getCurrentUrl());
    }

    @Given("I am not logged in for signup")
    public void iAmNotLoggedInForSignup() {
        driver.get(ROOT_URL + "/LoginPage");
    }

    @When("I access {string} page through address bar for signup")
    public void iAccessPageThroughAddressBarForSignup(String arg0) {
        driver.get(String.format("%s/%sPage", ROOT_URL, arg0));
    }

    @When("I access {string} page with http for signup")
    public void iAccessPageWithHttpForSignup(String arg0) {
        driver.get(String.format("%s/%sPage", "http://localhost:8443", arg0));
    }

    @Then("I should be denied access for signup")
    public void iShouldBeDeniedAccessForSignup() {
        assertTrue(driver.getPageSource().contains("Bad Request"));
    }
}
