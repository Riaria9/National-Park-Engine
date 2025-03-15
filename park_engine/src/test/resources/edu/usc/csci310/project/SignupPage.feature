Feature: User Signup
# user "existUser" has password Aa1.
# If the user is not accessing the web page using SSL, the connection should be denied.
  Scenario: Not access this web page with SSL denied
    When I access "Signup" page with http for signup
    Then I should be denied access for signup

  Scenario: I can access the signup page without logging in
    Given I am not logged in for signup
    When I access "Signup" page through address bar for signup
    Then I should be redirected to the "Signup" page for signup

  Scenario: I can go to the Login page through nav bar
    Given I am not logged in for signup
    And I am on the signup page
    When I click the Log in button for signup
    Then I should be redirected to the "Login" page for signup

  Scenario: I can go to the Signup page through nav bar
    Given I am not logged in for signup
    And I am on the signup page
    When I click the Sign up button for signup
    Then I should be redirected to the "Signup" page for signup

  Scenario: Submitting the signup form with mismatched passwords
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I fill in "password" with "password" on the signup page
    And I fill in "confirmPassword" with "confirmPassword" on the signup page
    And I press the "signup" button on the signup page
    Then I should see "Passwords do not match" on the signup page

  Scenario: Submitting the signup form with a password only lower case
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I fill in "password" with "password" on the signup page
    And I fill in "confirmPassword" with "password" on the signup page
    And I press the "signup" button on the signup page
    Then I should see "Password must contain at least: " on the signup page
    And I should see "1 uppercase letter, 1 number." on the signup page

  Scenario: Submitting the signup form with a password with no uppercase
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I fill in "password" with "123a" on the signup page
    And I fill in "confirmPassword" with "123a" on the signup page
    And I press the "signup" button on the signup page
    Then I should see "Password must contain at least: " on the signup page
    And I should see "1 uppercase letter" on the signup page

  Scenario: Submitting the signup form with a password with no lower case
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I fill in "password" with "123A" on the signup page
    And I fill in "confirmPassword" with "123A" on the signup page
    And I press the "signup" button on the signup page
    Then I should see "Password must contain at least: " on the signup page
    And I should see "1 lowercase letter" on the signup page

  Scenario: Submitting the signup form with a password with no number
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I fill in "password" with "AAAaaa" on the signup page
    And I fill in "confirmPassword" with "AAAaaa" on the signup page
    And I press the "signup" button on the signup page
    Then I should see "Password must contain at least: " on the signup page
    And I should see "1 number." on the signup page

  Scenario: Submitting the signup form without filling the form
    Given I am on the signup page
    And I press the "signup" button on the signup page
    Then I should see a validation message for the required field

  Scenario: Successfully creating a new account
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I fill in "password" with "123QWEa" on the signup page
    And I fill in "confirmPassword" with "123QWEa" on the signup page
    And I press the "signup" button on the signup page
    Then I should be redirected to the "Search" page for signup

  Scenario: First click on the cancel button and then close it
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I press the "cancel" button on the signup page
    And I press the "close" button on the signup page
    Then the value in the form should stay

  Scenario: Canceling the signup process
    Given I am on the signup page
    When I press the "cancel" button on the signup page
    And I press the "confirm" button on the signup page
    Then I should be redirected to the sign-in page on the signup page

  Scenario: Fail to create new account since duplicated
    Given I am on the signup page
    And I fill in "username" with "existUser" on the signup page
    And I fill in "password" with "123QWEa" on the signup page
    And I fill in "confirmPassword" with "123QWEa" on the signup page
    When I press the "signup" button on the signup page
    Then I should see "Username already exists" on the signup page

  Scenario: Fail to confirm passwords
    Given I am on the signup page
    When I fill in "username" with "username" on the signup page
    And I fill in "password" with "123QWEa" on the signup page
    And I press the "signup" button on the signup page
    Then I should see a validation message for the required field
