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

public class LoginStepDefs {
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

    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        driver.get(ROOT_URL + "/LoginPage");
    }

//    @When("I fill in {string} with {string}")
//    public void iFillInWith(String arg0, String arg1) {
//        driver.findElement(By.id(arg0)).sendKeys(arg1);
//    }

    @And("I press the {string} button")
    public void iPressTheButton(String arg0) {
        driver.findElement(By.id(arg0)).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should see {string}")
    public void iShouldSee(String arg0)
    {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(webDriver -> webDriver.findElement(By.id("information")));
        assertTrue(driver.findElement(By.id("information")).getText().contains(arg0));
    }

    @When("I fill in the {string} field with {string}")
    public void iFillInTheFieldWith(String arg0, String arg1) {
        driver.findElement(By.id(arg0)).sendKeys(arg1);
    }

    @Then("I should see a validation message for required field")
    public void iShouldSeeAValidationMessageForTheRequiredField() {
        WebElement requiredField = driver.findElement(By.id("username"));
        // Execute JavaScript to check if the field is valid
        boolean isValid = (Boolean) ((JavascriptExecutor) driver).executeScript("return arguments[0].checkValidity();", requiredField);
        assertFalse(isValid); // Assert that the field is not valid
    }

    @Then("I should be redirected to the signup page on the login page")
    public void iShouldBeRedirectedToTheSignupPageOnTheLoginPage() {
        assertEquals("http://localhost:8080/SignupPage", driver.getCurrentUrl());
    }

    @When("I press the signup button on the login page")
    public void iPressTheSignupButtonOnTheLoginPage() {
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/a")).click();
    }

    @When("I click the Sign up button for login")
    public void iClickTheSignUpButtonInTheNavigationBar() {
        driver.findElement(By.id("signUpPageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @When("I click the Log in button for login")
    public void iClickTheLogInButtonInTheNavigationBar() {
        driver.findElement(By.id("logInPageButton")).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I should be redirected to the {string} page for login")
    public void iShouldBeRedirectedToThePage(String arg0) {
        assertEquals(String.format("%s/%sPage", ROOT_URL, arg0), driver.getCurrentUrl());
    }
    
    @Given("I am not logged in for login")
    public void iAmNotLoggedInForLogin() {
        driver.get(ROOT_URL + "/LoginPage");
    }

    @When("I access {string} page through address bar for login")
    public void iAccessPageThroughAddressBarForLogin(String arg0) {
        driver.get(String.format("%s/%sPage", ROOT_URL, arg0));
    }

    @When("I access {string} page with http for login")
    public void iAccessPageWithHttpForLogin(String arg0) {
        driver.get(String.format("%s/%sPage", "http://localhost:8443", arg0));
    }

    @Then("I should be denied access for login")
    public void iShouldBeDeniedAccessForLogin() {
        assertTrue(driver.getPageSource().contains("Bad Request"));
    }
}

