Feature: Testing the favorite page functionalities
# We use a user account that has already added 3 favorite parks to their list
# user "favUser" with password '1Qa'.
# Favorite parks: Grand Canyon, Yellowstone...
# Privacy setting usecases
# Default is private
  Scenario: Favorite list is private by default
    Given I am logged in for favorite page
    When I am on the favorite page
    Then I should see status is private

# Can switch from private to public
  Scenario: Change favorite list to public
    Given I am logged in for favorite page
    And I am on the favorite page
    When I click private checkbox
    Then I should see confirmation list is changed to public

# Can switch from public to private
  Scenario: Change favorite list to private
    Given I am logged in for favorite page
    And I am on the favorite page
    When I click private checkbox
    Then I should see confirmation list is changed to private

# Changes are persistent
  Scenario: Privacy changes are persistent
    Given I am logged in for favorite page
    And I am on the favorite page
    And I click private checkbox
    And I click the Log Out button for favorite
    And I am logged in for favorite page
    When I am on the favorite page
    Then I should see status is public

  Scenario: I cannot go to the Favorite page without logging in
    Given I am not logged in for fav
    When I access "Favorite" page through address bar for fav
    Then I should be redirected to the "Login" page for favorite

# If the user is not accessing the web page using SSL, the connection should be denied.
  Scenario: Not access this web page with SSL denied
    When I access "Favorite" page with http for fav
    Then I should be denied access for fav

# be able to log out
  Scenario: If I am on the favorite page, I should be able to log out
    Given I am logged in for favorite page
    And I am on the favorite page
    When I click the Log Out button for favorite
    Then I should be redirected to the "Login" page for favorite

# be able go to the search page
  Scenario: I should be able to go to the search page
    Given I am logged in for favorite page
    And I am on the favorite page
    When I click the Search button for favorite
    Then I should be redirected to the "Search" page for favorite

# be able go to the favorite page
  Scenario: I should be able to go to the favorite page
    Given I am logged in for favorite page
    And I am on the favorite page
    When I click the Favorite button for favorite
    Then I should be redirected to the "Favorite" page for favorite

# be able go to the compare list page
  Scenario: I should be able to go to the compare list page
    Given I am logged in for favorite page
    And I am on the favorite page
    When I click the Compare button for favorite
    Then I should be redirected to the "Compare" page for favorite

# Favorite list functions
# Each favorite park shows a name
  Scenario: Favorite park shows its name
    Given I am logged in for favorite page
    And Current user has favorites "Grand Canyon,Yellowstone,Bryce" fav
    When I am on the favorite page
    Then I should see "Grand Canyon" displayed for favorite page
    And I should see "Yellowstone" displayed for favorite page
    And I should see "Bryce" displayed for favorite page

# Clicking on a favorite park opens a details window
  Scenario: Click on a favorite park shows details
    Given I am logged in for favorite page
    And Current user has favorites "Grand Canyon,Yellowstone,Bryce" fav
    And I am on the favorite page
    When I click on the first favorite park
    Then I should see park name in detail window fav
    And I should see location in detail window fav
    And I should see park url in detail window fav
    And I should see entrance fee in detail window fav
    And I should see park picture in detail window fav
    And I should see park description in detail window fav
    And I should see amenities in detail window fav
    And I should see activities in detail window fav
    And I should see if park is favorited in detail window fav

# Clicking on states, amenities, or activities trigger a new search
  Scenario: Click on a state in details window
    Given I am logged in for favorite page
    And Current user has favorites "Grand Canyon,Yellowstone,Bryce" fav
    And I am on the favorite page
    And I click on the third favorite park
    When I click on the state "UT" fav
    Then I should be redirected to the "Search" page for favorite
    And I should see "State" selected as the search option fav
    And I should see "UT" entered into the search query field fav
    And I should see "Arches" displayed as the first search result fav

# Clicking on states, amenities, or activities trigger a new search
  Scenario: Click on an amenity in details window
    Given I am logged in for favorite page
    And Current user has favorites "Grand Canyon,Yellowstone,Bryce" fav
    And I am on the favorite page
    And I click on the third favorite park
    When I click on the amenity "ATM/Cash Machine" fav
    Then I should be redirected to the "Search" page for favorite
    And I should see "Amenity" selected as the search option fav
    And I should see "ATM/Cash" entered into the search query field fav
    And I should see "Badlands" displayed as the first search result fav

# Clicking on states, amenities, or activities trigger a new search
  Scenario: Click on an activity in details window
    Given I am logged in for favorite page
    And Current user has favorites "Grand Canyon,Yellowstone,Bryce" fav
    And I am on the favorite page
    And I click on the third favorite park
    When I click on the activity "Astronomy" fav
    Then I should be redirected to the "Search" page for favorite
    And I should see "Activity" selected as the search option fav
    And I should see "Astro" entered into the search query field fav
    And I should see "Abraham" displayed as the first search result fav

# Hover control
# Hovering over a park should see up and down arrows
  Scenario: Hover mouse over a park shows up and down arrows
    Given I am logged in for favorite page
    And I am on the favorite page
    When I hover over the first favorite park
    Then I should see an up arrow
    And I should see a down arrow

# Click up arrow on a park that is not on the head of the ranking
  Scenario: Click up arrow on a non-head-ranked park
    Given I am logged in for favorite page
    And I am on the favorite page
    And I record the first and second favorite parks
    And I hover over the second favorite park
    When I click on the up arrow
    Then I should see first and second switched places

# Click up arrow on a park that is on the head of the ranking
  Scenario: Click up arrow on a head-ranked park
    Given I am logged in for favorite page
    And I am on the favorite page
    And I record the first and second favorite parks
    And I hover over the first favorite park
    When I click on the up arrow
    Then I should see first and second stayed same

# Click down arrow on a park that is not on the tail of the ranking
  Scenario: Click down arrow on a non-tail-ranked park
    Given I am logged in for favorite page
    And I am on the favorite page
    And I record the first and second favorite parks
    And I hover over the first favorite park
    When I click on the down arrow
    Then I should see first and second switched places

# Click down arrow on a park that is on the tail of the ranking
  Scenario: Click down arrow on a tail-ranked park
    Given I am logged in for favorite page
    And I am on the favorite page
    And I record the second-to-last and last favorite parks
    And I hover over the last favorite park
    When I click on the down arrow
    Then I should see second-to-last and last stayed same

# Favorite parks ranking should be persistent
  Scenario: Changes to the favorite ranking should be persistent
    Given I am logged in for favorite page
    And I am on the favorite page
    And I record the first and second favorite parks
    And I hover over the second favorite park
    And I click on the up arrow
    And I click the Log Out button for favorite
    And I am logged in for favorite page
    When I am on the favorite page
    Then I should see first and second switched places

# Hovering over a park should see a minus button
  Scenario: Hover mouse over a park shows a minus button
    Given I am logged in for favorite page
    And I am on the favorite page
    When I hover over the first favorite park
    Then I should see a minus button

# Clicking on minus button initiates a confirmation dialogue
  Scenario: Click on the minus button initiates dialogue
    Given I am logged in for favorite page
    And I am on the favorite page
    And I hover over the first favorite park
    When I click on the minus button
    Then I should see a delete confirmation dialogue

# Cancel delete
  Scenario: Cancel the delete dialogue
    Given I am logged in for favorite page
    And I am on the favorite page
    And I hover over the first favorite park
    And I click on the minus button
    When I click on the cancel button on delete dialogue
    Then I should see the favorite park is not deleted

# Confirm delete
  Scenario: Confirm the delete dialogue
    Given I am logged in for favorite page
    And I am on the favorite page
    And I hover over the first favorite park
    And I click on the minus button
    When I click on the confirm button on delete dialogue
    Then I should see the favorite park is deleted

# Delete-all button functionalities
# Click on the delete-all button initiates dialogue
  Scenario: Click delete-all button initiates dialogue
    Given I am logged in for favorite page
    And I am on the favorite page
    When I click the Delete All button for favorite list
    Then I should see a delete-all confirmation dialogue

# Cancel delete-all
  Scenario: Click delete-all button then cancel
    Given I am logged in for favorite page
    And I am on the favorite page
    And I click the Delete All button for favorite list
    When I click the cancel button on delete-all dialogue
    Then I should see whole favorite list is not deleted

# Confirm delete-all
  Scenario: Click delete-all button then confirm
    Given I am logged in for favorite page
    And I am on the favorite page
    And I click the Delete All button for favorite list
    When I click the confirm button on delete-all dialogue
    Then I should see whole favorite list is deleted
