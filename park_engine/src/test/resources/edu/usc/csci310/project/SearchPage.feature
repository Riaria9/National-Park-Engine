Feature: Testing the search page functions.
# I have matched the following search terms with the search results using the api
# user "searchUser" has password 1Qa.
  Scenario: I cannot go to the Search page without logging in
    Given I am not logged in for search
    When I access "Search" page through address bar for search
    Then I should be redirected to the "Login" page

# If the user is not accessing the web page using SSL, the connection should be denied.
  Scenario: Not access this web page with SSL denied
    When I access "Search" page with http for search
    Then I should be denied access for search

# be able to log out
  Scenario: I should be able to log out
    Given I am on the search page
    When I click the Log Out button in the navigation bar
    Then I should be redirected to the "Login" page

# be able to go to the search page
  Scenario: I should be able to go to the search page
    Given I am on the search page
    When I click the Search button in the navigation bar
    Then I should be redirected to the "Search" page

# be able go to the favorite park list page
  Scenario: I should be able to go to the favorite park list page
    Given I am on the search page
    When I click the Favorite button in the navigation bar
    Then I should be redirected to the "Favorite" page

# be able go to the compare list page
  Scenario: I should be able to go to the compare list page
    Given I am on the search page
    When I click the Compare button in the navigation bar
    Then I should be redirected to the "Compare" page

# Searching with an empty query should return an error message
  Scenario: Searching with an empty query
    Given I am on the search page
    When I enter "" into the search query field
    And I click the Search button with empty field
    Then I should see "Empty query invalid" displayed on the page

# Searching default to by park name
  # This is done by GET /parks and setting q to our query, limit to 10, start to 0
  Scenario: Searching with the default search option
    Given I am on the search page
    When I enter "Grand" into the search query field
    And I click the Search button
    Then I should see "Bryce Canyon" displayed as the first search result

# Searching by clicking on the search button
  Scenario: Searching by clicking on the search button
    Given I am on the search page
    When I enter "Grand" into the search query field
    And I click the Search button
    Then I should see "Bryce Canyon" displayed as the first search result

# Searching by hitting on the enter key
  Scenario: Searching by hitting on the enter key
    Given I am on the search page
    When I enter "Grand" into the search query field
    And I hit the Enter key
    Then I should see "Bryce Canyon" displayed as the first search result

# Searching by explicitly choosing park name as the filter
  # This is done by GET /parks and setting q to our query, limit to 10, start to 0
  Scenario: Searching with park name as the search option
    Given I am on the search page
    When I select "Name" as the search option
    And I enter "Grand" into the search query field
    And I click the Search button
    Then I should see "Bryce Canyon" displayed as the first search result

# Searching by explicitly choosing state as the filter
  # This is done by GET /parks and setting stateCode to our query, limit to 10, start to 0
  Scenario: Searching with state as the search option
    Given I am on the search page
    When I select "State" as the search option
    And I enter "CA" into the search query field
    And I click the Search button
    Then I should see "Alcatraz Island" displayed as the first search result

# Searching by explicitly choosing amenity as the filter
  # This is done by GET /amenities/parksplaces and setting q to our query, limit to 1 since we extract the parks from the first amenity name, start to 0
  Scenario: Searching with amenity as the search option
    Given I am on the search page
    When I select "Amenity" as the search option
    And I enter "Aquatic Invasive Species" into the search query field
    And I click the Search button
    Then I should see "Dry Tortugas" displayed as the first search result

# Searching by explicitly choosing activity as the filter
  # This is done by GET /activities/parks and setting q to our query, limit to 10, start to 0
  Scenario: Searching with activity as the search option
    Given I am on the search page
    When I select "Activity" as the search option
    And I enter "Astronomy" into the search query field
    And I click the Search button
    Then I should see "Abraham Lincoln" displayed as the first search result

# After the initial search, at most 10 search results should be displayed
  Scenario: Searching initially should display 10 search results
    Given I am on the search page
    When I enter "Grand" into the search query field
    And I click the Search button
    Then I should see 10 search results

# After the initial search, clicking on the load more button should load 10 more results
  Scenario: Clicking on the load more button once should display 20 results
    Given I am on the search page
    And I enter "Grand" into the search query field
    And I click the Search button
    When I click the Load More button
    Then I should see 20 search results

# Since the load more process cannot be repeated indefinitely, we have various error cases
# When there are no more results to load, the load more button should be hidden
# Initial search doesn't have more than 10 total results
  Scenario: Initial search have no more than 10 results
    Given I am on the search page
    When I enter "Alcatraz" into the search query field
    And I click the Search button
    Then I should see 2 search results
    And I should not see "Load More" displayed on the page

# Hovering the mouse over a search result should activate a hover control with a add to favorite button
  Scenario: Hovering the mouse over a result should activate a hover control
    Given I am on the search page
    And I enter "Grand Canyon National Park" into the search query field
    And I click the Search button
    When I hover the mouse over the first search result
    Then I should see "+" displayed on the page

# Unhovering should deactivate the hover control
  Scenario: Moving the mouse off from a search should deactivate the hover control
    Given I am on the search page
    And I enter "Grand Canyon National Park" into the search query field
    And I click the Search button
    And I hover the mouse over the first search result
    When I move the mouse off from the first search result
    Then I should not see "+" displayed on the page

# The add to favorites button should add the park into the favorite park list with visual confirmation
  Scenario: Adding successfully a park to the favorite parks list
    Given I am on the search page
    And Current user has favorites "Bryce Canyon"
    And I enter "Grand" into the search query field
    And I click the Search button
    And I hover the mouse over the second search result
    When I click the Add to Favorites button
    Then I should see "Park successfully added" displayed on the page

# If already in the favorite park list, display error message
  Scenario: Adding existing park to the favorite parks list
    Given I am on the search page
    And Current user has favorites "Bryce Canyon" search
    And I enter "Grand" into the search query field
    And I click the Search button
    And I hover the mouse over the first search result
    When I click the Add to Favorites button
    Then I should see "Park already added" displayed on the page

# When a search result is clicked, an inline window with details should pop up
  Scenario: Clicking on a search result should activate the inline window
    Given I am on the search page
    And I enter "Grand" into the search query field
    And I click the Search button
    When I click on the first search result
    Then I should see park name in detail window
    And I should see location in detail window
    And I should see park url in detail window
    And I should see entrance fee in detail window
    And I should see park picture in detail window
    And I should see park description in detail window
    And I should see amenities in detail window
    And I should see activities in detail window
    And I should see if park is favorited in detail window

# When an unfavorited search result is clicked, an inline window with details should pop up
  Scenario: Clicking on a search result should activate the inline window unfav
    Given I am on the search page
    And Current user has favorites "Bryce Canyon"
    And I enter "Grand" into the search query field
    And I click the Search button
    When I click on the third search result
    Then I should see the park is not favorited

# When a favorited search result is clicked, an inline window with details should pop up
  Scenario: Clicking on favorited search result should activate the inline window
    Given I am on the search page
    And Current user has favorites "Bryce Canyon"
    And I enter "Grand" into the search query field
    And I click the Search button
    When I click on the first search result
    Then I should see the park is favorited

# The park url should be clickable and redirect to the park page
  Scenario: Clicking on the park url in the details window should redirect
    Given I am on the search page
    And I enter "Grand" into the search query field
    And I click the Search button
    And I click on the first search result
    When I click on the park url
    Then I should be redirected to the park website

# Clicking on a search result will make the hover control always visible and usable
  Scenario: Add park to favorite successfully from detail window
    Given I am on the search page
    And Current user has favorites "Bryce Canyon"
    And I enter "Grand" into the search query field
    And I click the Search button
    And I click on the third search result
    When I click the Add to Favorites button from detail window
    Then I should see "Park successfully added" displayed on the page

# Clicking on a search result will make the hover control always visible and usable
  Scenario: Add park to favorite unsuccessfully from detail window
    Given I am on the search page
    And Current user has favorites "Bryce Canyon"
    And I enter "Grand" into the search query field
    And I click the Search button
    And I click on the first search result
    When I click the Add to Favorites button from detail window
    Then I should see "Park already added" displayed on the page

# Clicking on states, amenities, or activities will trigger a new park search with the clicked-on item replacing the current search term
  Scenario: Clicking state in the details should initiate a new search
    Given I am on the search page
    And I enter "Grand" into the search query field
    And I click the Search button
    And I click on the first search result
    When I click on the state "UT"
    Then I should see "State" selected as the search option
    And I should see "UT" entered into the search query field
    And I should see "Arches" displayed as the first search result

# Clicking on states, amenities, or activities will trigger a new park search with the clicked-on item replacing the current search term
  Scenario: Clicking amenity in the details should initiate a new search
    Given I am on the search page
    And I enter "Grand" into the search query field
    And I click the Search button
    And I click on the first search result
    When I click on the amenity "ATM/Cash Machine"
    Then I should see "Amenity" selected as the search option
    And I should see "ATM/Cash Machine" entered into the search query field
    And I should see "Badlands" displayed as the first search result

# Clicking on states, amenities, or activities will trigger a new park search with the clicked-on item replacing the current search term
  Scenario: Clicking activity in the details should initiate a new search
    Given I am on the search page
    And I enter "Grand" into the search query field
    And I click the Search button
    And I click on the first search result
    When I click on the activity "Astronomy"
    Then I should see "Activity" selected as the search option
    And I should see "Astronomy" entered into the search query field
    And I should see "Abraham Lincoln" displayed as the first search result

# Clicking on the search result (park name) again will minimize the inline window
  Scenario: Clicking on a search result twice should close the details window
    Given I am on the search page
    And I enter "Grand" into the search query field
    And I click the Search button
    And I click on the first search result
    When I click on the first search result again
    And I should not see detail window displayed on the page
