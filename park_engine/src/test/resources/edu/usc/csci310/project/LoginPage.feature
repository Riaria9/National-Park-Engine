Feature: Test filling out and submit the login form
# If the user is not accessing the web page using SSL, the connection should be denied.
  Scenario: Not access this web page with SSL denied
    When I access "Login" page with http for login
    Then I should be denied access for login
  Scenario: I can access the login page without logging in
    Given I am not logged in for login
    When I access "Login" page through address bar for login
    Then I should be redirected to the "Login" page for login
  Scenario: I can go to the Login page through nav bar
    Given I am on the login page
    When I click the Log in button for login
    Then I should be redirected to the "Login" page for login
  Scenario: I can go to the Signup page through nav bar
    Given I am on the login page
    When I click the Sign up button for login
    Then I should be redirected to the "Signup" page for login
  Scenario: Submitting the form with invalid credentials
    Given I am on the login page
    When I fill in the "username" field with "admin"
    And I fill in the "password" field with "admin"
    And I press the "Login" button
    Then I should see "Incorrect login credentials"
  Scenario: Submitting the form with valid credentials
    Given I am on the login page
    When I fill in the "username" field with "existUser"
    And I fill in the "password" field with "Aa1"
    And I press the "Login" button
    Then I should be redirected to the "Search" page for login
  Scenario: Submitting the login form without filling the form
    Given I am on the login page
    And I press the "Login" button
    Then I should see a validation message for required field