Feature: testing the compare page
# Assume current user "compareUser" with password "1Qa" has favorite parks "Bryce Canyon" and "Yellowstone";
# the user "existUser" has favorite parks "Yellowstone".
# the user "publicUser" has password "1Qa"
# the user "privateUser" has password "1Qa"
  Scenario: I cannot go to the Compare page without logging in
    Given I am not logged in for compare
    When I access "Compare" page through address bar for compare
    Then I should be redirected to the "Login" page for compare

# If the user is not accessing the web page using SSL, the connection should be denied.
  Scenario: Not access this web page with SSL denied
    When I access "Compare" page with http for compare
    Then I should be denied access for compare

# be able to log out
  Scenario: I should be logged in and able to log out
    Given I am on the compare page
    When I click the Log Out button in the navigation bar for compare
    Then I should be redirected to the "Login" page for compare

# be able go to the favorite park list page
  Scenario:I can go to the favorite park list page through navigation bar
    Given I am on the compare page
    When I click the Favorite button in the navigation bar for compare
    Then I should be redirected to the "Favorite" page for compare

# be able go to the search page
  Scenario:I should be able to go to the search page through the navigation bar
    Given I am on the compare page
    When I click the Search button in the navigation bar for compare
    Then I should be redirected to the "Search" page for compare

# Searching with an empty query should return an error message
  Scenario: Searching a friend with an empty query
    Given I am on the compare page
    When I enter "" into the friend search query field
    And I click the Add Friend button
    Then I should see "Empty query invalid" for compare

# Searching an existing user
  Scenario: Adding an existing user
    Given I am on the compare page
    When I enter "existUser" into the friend search query field
    And I click the Add Friend button
    Then I should see "existUser is added" for compare

# Searching a non-existing user
  Scenario: Adding a non-existing user
    Given I am on the compare page
    When I enter "NotExistUser" into the friend search query field
    And I click the Add Friend button
    Then I should see "User does not exist" for compare

# Adding multiple users
  Scenario: Adding multiple existing users
    Given I am on the compare page
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    And I enter "publicUser" into the friend search query field
    When I click the Add Friend button
    Then I should see "publicUser is added" for compare

# Privacy requirements
# Adding a user who marked their favorite list as public
  Scenario: Add a user who marks their list public
    Given I am on the compare page
    And I enter "publicUser" into the friend search query field
    When I click the Add Friend button
    Then I should see "publicUser is added" for compare

# Adding a user who marked their favorite list as private
  Scenario: Add a user who marks their list private
    Given I am on the compare page
    And I enter "privateUser" into the friend search query field
    When I click the Add Friend button
    Then I should see "User has a private list" for compare

# Comparison generates a ranking according to num of users who favorite the park (only park liked by at least 1 user is shown)
  Scenario: Compare should generate a ranking
    Given I am on the compare page
    And Current user has favorites "Bryce Canyon,Yellowstone"
    And User "existUser" has favorites "Yellowstone"
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    When I click the Compare button
    Then I should see "Yellowstone" as the first compare result
    And I should see "Bryce Canyon" as the second compare result
    And I should see only 2 parks on compare list
    And I should see more users favorite first result than second

# Parks are clickable and show details window
  Scenario: Click on a park expands details window
    Given I am on the compare page
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    And I click the Compare button
    When I click on a park on the compare list
    Then I should see park name in detail window compare
    And I should see location in detail window compare
    And I should see park url in detail window compare
    And I should see entrance fee in detail window compare
    And I should see park picture in detail window compare
    And I should see park description in detail window compare
    And I should see amenities in detail window compare
    And I should see activities in detail window compare
    And I should see if park is favorited in detail window compare

# Clicking on states, amenities, or activities trigger a new search
  Scenario: Click on a state in details window
    Given I am on the compare page
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    And I click the Compare button
    And I click on the second compare result
    When I click on the state "UT" compare
    Then I should be redirected to the "Search" page for compare
    And I should see "State" selected as the search option compare
    And I should see "UT" entered into the search query field compare
    And I should see "Arches" displayed as the first search result compare

# Clicking on states, amenities, or activities trigger a new search
  Scenario: Click on an amenity in details window
    Given I am on the compare page
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    And I click the Compare button
    And I click on the second compare result
    When I click on the amenity "ATM/Cash Machine" compare
    Then I should be redirected to the "Search" page for compare
    And I should see "Amenity" selected as the search option compare
    And I should see "ATM/Cash" entered into the search query field compare
    And I should see "Badlands" displayed as the first search result compare

# Clicking on states, amenities, or activities trigger a new search
  Scenario: Click on an activity in details window
    Given I am on the compare page
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    And I click the Compare button
    And I click on the second compare result
    When I click on the activity "Astronomy" compare
    Then I should be redirected to the "Search" page for compare
    And I should see "Activity" selected as the search option compare
    And I should see "Astro" entered into the search query field compare
    And I should see "Abraham" displayed as the first search result compare

# Each park should show a ratio
  Scenario: The generated parks show a ratio
    Given I am on the compare page
    And Current user has favorites "Bryce Canyon,Yellowstone"
    And User "existUser" has favorites "Yellowstone"
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    When I click the Compare button
    Then I should see ratio "2 / 2" for the first park
    And I should see ratio "1 / 2" for the second park

# Hovering over the ratio should display the users
  Scenario: Hover over a ratio show which users favorite the park
    Given I am on the compare page
    And Current user has favorites "Bryce Canyon,Yellowstone"
    And User "existUser" has favorites "Yellowstone"
    And I enter "existUser" into the friend search query field
    And I click the Add Friend button
    And I click the Compare button
    When I hover over the ratio next to the first result
    Then I should see current user and "existUser" favorite the park
