import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import FavoritePage from "./FavoritePage";
fetchMock.enableMocks();
let mockPark = {};
let mockPark2;

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

beforeEach(() => {
    sessionStorage.setItem("username", "existUser");
    sessionStorage.setItem("privacyStatus", "true");

    fetchMock.resetMocks()
    mockPark = {
        fullName: "Yellowstone National Park",
        addresses: [
            {
                "postalCode": "82190",
                "city": "Yellowstone National Park",
                "stateCode": "WY"
            }
        ],
        activities: [
            {
                id: "122",
                name: "Guided Tours"
            }
        ],
        amenities: [
            {
                "Accessible Rooms": "1",
                "name": "bath"
            },
        ],
        description: "Visit Yellowstone and experience the world's first national park.",
        states: "CA,CO",
        entranceFees: [
            {
                cost: 30,
                description: "7-day pass for Yellowstone National Park",
                title: "Yellowstone (private, non-commercial vehicle)"
            },
            {
                cost: 25,
                description: "7-day pass for Yellowstone National Park. Snowmobile entry limited to guided tours or permit holders.",
                title: "Yellowstone (motorcycle or snowmobile)"
            }
        ],
        images: [
            {
                credit: "NPS/Jim Peaco",
                altText: "Crowd watching Aurum Geyser erupt",
                title: "Aurum Geyser",
                id: 1789,
                caption: "Aurum Geyser Erupting",
                url: "https://www.nps.gov/common/uploads/structured_data/3C7D2FBB-1DD8-B71B-0BED99731011CFCE.jpg"
            },
            {
                credit: "NPS/Neal Herbert",
                altText: "Photo of bison in Lamar Valley",
                title: "Bison in Lamar Valley",
                id: 1792,
                caption: "Bison in Lamar Valley",
                url: "https://www.nps.gov/common/uploads/structured_data/3C7D34E6-1DD8-B71B-0BBB1C0F478318E2.jpg"
            }
        ],
    };

    mockPark2 = {
        fullName: "Yosemite",
        addresses: [
            {
                "postalCode": "82190",
                "city": "Yellowstone National Park",
                "stateCode": "WY"
            }
        ],
        activities: [
            {
                id: "122",
                name: "Guided Tours"
            }
        ],
        amenities: [
            {
                "Accessible Rooms": "1",
                "name": "bath"
            },
        ],
        description: "Visit Yellowstone and experience the world's first national park.",
        states: "CA,CO",
        entranceFees: [
            {
                cost: 30,
                description: "7-day pass for Yellowstone National Park",
                title: "Yellowstone (private, non-commercial vehicle)"
            },
            {
                cost: 25,
                description: "7-day pass for Yellowstone National Park. Snowmobile entry limited to guided tours or permit holders.",
                title: "Yellowstone (motorcycle or snowmobile)"
            }
        ],
        images: [
            {
                credit: "NPS/Jim Peaco",
                altText: "Crowd watching Aurum Geyser erupt",
                title: "Aurum Geyser",
                id: 1789,
                caption: "Aurum Geyser Erupting",
                url: "https://www.nps.gov/common/uploads/structured_data/3C7D2FBB-1DD8-B71B-0BED99731011CFCE.jpg"
            },
            {
                credit: "NPS/Neal Herbert",
                altText: "Photo of bison in Lamar Valley",
                title: "Bison in Lamar Valley",
                id: 1792,
                caption: "Bison in Lamar Valley",
                url: "https://www.nps.gov/common/uploads/structured_data/3C7D34E6-1DD8-B71B-0BBB1C0F478318E2.jpg"
            }
        ],
    };
});

//button test from here by Edward
test("rank up and rank down", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2, mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });
    await screen.findByText(/Park: Yosemite/i);

    const parkNameElement = screen.getByText(/Yellowstone National Park/i);
    // Simulate hovering over the park name to trigger button display
    fireEvent.mouseEnter(parkNameElement);

    // Rank up the park
    const rankUpButton = await screen.findByTestId("rankupfav");
    fireEvent.click(rankUpButton);

    await waitFor(() => {
        // Verify that the park has moved up in the displayed list
        const parkNameAfterRankUp = screen.getAllByText(/Park:/i);
        expect(parkNameAfterRankUp[0]).toHaveTextContent(/Yellowstone National Park/i);
        expect(parkNameAfterRankUp[1]).toHaveTextContent(/Yosemite/i);
    });

    // Rank down the park
    const rankDown = screen.getByText(/Yellowstone National Park/i)
    fireEvent.mouseEnter(rankDown);
    const rankDownButton = await screen.findByTestId("rankdownfav");
    fireEvent.click(rankDownButton);

    await waitFor(() => {
        // Verify that the park has moved down in the displayed list
        const parkNameAfterRankDown = screen.getAllByText(/Park:/i);
        expect(parkNameAfterRankDown[0]).toHaveTextContent(/Yosemite/i);
        expect(parkNameAfterRankDown[1]).toHaveTextContent(/Yellowstone National Park/i);
    });
});

test("error rank up down", async  ()=> {
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark2, mockPark])}));
    render(<FavoritePage/>, {wrapper: BrowserRouter});
    await screen.findByText(/Park: Yosemite/i);

    const parkNameElement = screen.getByText(/Yosemite/i);
    // Simulate hovering over the park name to trigger button display
    fireEvent.mouseEnter(parkNameElement);

    // Rank up the park
    const rankUpButton = await screen.findByTestId("rankupfav");
    fireEvent.click(rankUpButton);

    await waitFor(() => {
        // Verify that the park has moved up in the displayed list
        const parkNameAfterRankUp = screen.getAllByText(/Park:/i);
        expect(parkNameAfterRankUp[1]).toHaveTextContent(/Yellowstone National Park/i);
        expect(parkNameAfterRankUp[0]).toHaveTextContent(/Yosemite/i);
    });

    // Rank down the park
    const rankDown = screen.getByText(/Yosemite/i)
    fireEvent.mouseEnter(rankDown);
    const rankDownButton = await screen.findByTestId("rankdownfav");
    fireEvent.click(rankDownButton);

    await waitFor(() => {
        // Verify that the park has moved down in the displayed list
        const parkNameAfterRankDown = screen.getAllByText(/Park:/i);
        expect(parkNameAfterRankDown[1]).toHaveTextContent(/Yosemite/i);
        expect(parkNameAfterRankDown[0]).toHaveTextContent(/Yellowstone National Park/i);
    });
});
test("display detail", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    // Wait for the modal to appear
    const modal = await screen.findByRole("dialog");

    // Assert that the modal is in the document
    expect(modal).toBeInTheDocument();

    // Assert that the park name is displayed in the modal
    expect(screen.getByText(/Park Name: Yellowstone National Park/i)).toBeInTheDocument();
});

test("display detail with keyboard", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);

    // hit another key
    fireEvent.keyDown(parkName, { key: 'Space'});

    // hit Enter
    fireEvent.keyDown(parkName, { key: 'Enter'});

    // Wait for the modal to appear
    const modal = await screen.findByRole("dialog");

    // Assert that the modal is in the document
    expect(modal).toBeInTheDocument();

    // Assert that the park name is displayed in the modal
    expect(screen.getByText(/Park Name: Yellowstone National Park/i)).toBeInTheDocument();
});

test('deleting all favorites displays confirmation modal and deletes favorites', async () => {
    // Mock the response for the favorite API
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    render(<FavoritePage/>, {wrapper: BrowserRouter});

    // Wait for the delete all button to be rendered
    const deleteAllButton = await screen.findByTestId('deleteAllButton');

    // Click on the delete all button
    fireEvent.click(deleteAllButton);

    // Assert that the confirmation modal is displayed
    const confirmationModal = screen.getByText('Are you sure you want to delete all?');
    expect(confirmationModal).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancelDeleteAllButton');
    fireEvent.click(cancelButton);
    fireEvent.click(deleteAllButton);

    // Click on the confirm button
    fetchMock.mockResponseOnce(JSON.stringify({ message: "All favorites deleted" }));
    const confirmButton = screen.getByTestId('confirmDeleteAllButton');
    fireEvent.click(confirmButton);

    // Wait for the deleteAll API response
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});



test("click activity in detail", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    //click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    //     return (
    //         element.tagName.toLowerCase() === 'h3' &&
    //         content.includes('Park: Yellowstone National Park')
    //     );
    // });
    // fireEvent.click(parkNameHeader);
    await waitFor(() => {
        expect(screen.getByText(/Guided Tours/i)).toBeInTheDocument();
    });

    const mockPark2 = [
        {
            fullName: "No where"
        }
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.click(screen.getByText(/Guided Tours/));
    await waitFor(()=>{
        expect(sessionStorage.getItem("activity")).toBe("Guided Tours");    })

});

test("click amenities in detail", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    // Click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    //     return (
    //         element.tagName.toLowerCase() === 'h3' &&
    //         content.includes('Park: Yellowstone National Park')
    //     );
    // });
    // fireEvent.click(parkNameHeader);
    await waitFor(() => {
        expect(screen.getByText(/Accessible Rooms/i)).toBeInTheDocument();
    });

    const mockPark2 = {
        fullName: "No where"
    };
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.click(screen.getByText(/Accessible Rooms/));
    await waitFor(() => {
        expect(sessionStorage.getItem("amenity")).toBe("Accessible Rooms");
    });


});

test("click state in detail and redirect to search page", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    // Wait for the state element to be rendered in the modal
    await screen.findByRole("dialog");

    // Find the specific state element within the stateInfo list and click on it
    const stateElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'li' && content.includes('CA');
    });
    fireEvent.click(stateElement);

    // Assert that the page has been redirected to the SearchPage with the selected state as a query parameter
    await waitFor(() => {
        expect(sessionStorage.getItem("state")).toBe("CA");
    });

});

test("hit activity in detail with keyboard", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    //click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    //     return (
    //         element.tagName.toLowerCase() === 'h3' &&
    //         content.includes('Park: Yellowstone National Park')
    //     );
    // });
    // fireEvent.click(parkNameHeader);
    await waitFor(() => {
        expect(screen.getByText(/Guided Tours/i)).toBeInTheDocument();
    });

    const mockPark2 = [
        {
            fullName: "No where"
        }
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.keyDown(screen.getByText(/Guided Tours/), {key:'Enter'});
    await waitFor(()=>{
        expect(sessionStorage.getItem("activity")).toBe("Guided Tours");    })

});

test("hit amenity in detail with keyboard", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    // Click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    //     return (
    //         element.tagName.toLowerCase() === 'h3' &&
    //         content.includes('Park: Yellowstone National Park')
    //     );
    // });
    // fireEvent.click(parkNameHeader);
    await waitFor(() => {
        expect(screen.getByText(/Accessible Rooms/i)).toBeInTheDocument();
    });

    const mockPark2 = {
        fullName: "No where"
    };
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.keyDown(screen.getByText(/Accessible Rooms/), {key:'Enter'});
    await waitFor(() => {
        expect(sessionStorage.getItem("amenity")).toBe("Accessible Rooms");
    });


});

test("hit state in detail page with keyboard", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    // Wait for the state element to be rendered in the modal
    await screen.findByRole("dialog");

    // Find the specific state element within the stateInfo list and click on it
    const stateElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'li' && content.includes('CA');
    });
    fireEvent.keyDown(stateElement, {key:'Enter'});

    // Assert that the page has been redirected to the SearchPage with the selected state as a query parameter
    await waitFor(() => {
        expect(sessionStorage.getItem("state")).toBe("CA");
    });

});

test("click private public, init with public", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    const privateButton = await screen.findByTestId('private-button');
    expect(privateButton).toHaveTextContent("Make It Public");
    // Find the park name element and click on it

    fireEvent.click(privateButton);

    // Mock the response for the toggle action if it makes a fetch call
    fetchMock.mockResponseOnce(JSON.stringify({ privateStatus: true }));  // Assume some response if your API returns something

    // Wait for the button text to change to "Make It Private"
    expect(await screen.findByText("Make It Private")).toBeInTheDocument();

    // Optionally you could click again and test for revert to "Make It Public"
    fireEvent.click(privateButton);
    fetchMock.mockResponseOnce(JSON.stringify({ privateStatus: false }));  // Mock the revert action
    expect(await screen.findByText("Make It Public")).toBeInTheDocument();

});

test("init with public", async () => {
    sessionStorage.setItem("privacyStatus", "false")
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    // Wait for the park name to be rendered
    const privateButton = await screen.findByTestId('private-button');
    expect(privateButton).toHaveTextContent("Make It Private");
});

test('click outside the modal content should close the modal', async () => {
    // Setup initial state where modal is visible
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    const { container } = render(<FavoritePage />, { wrapper: BrowserRouter });
    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    const modal = await screen.findByRole("dialog");

    // Get the modal overlay and the modal content
    const modalOverlay = container.querySelector('.modal');
    //const modalContent = container.querySelector('.modal-content');

    // Simulate clicking on the modal overlay, outside the modal content
    fireEvent.mouseDown(modalOverlay);
    fireEvent.click(modalOverlay);
    expect(modal).not.toBeInTheDocument();
});

test('click close button after show detail', async () => {
    // Setup initial state where modal is visible
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    const {} = render(<FavoritePage />, { wrapper: BrowserRouter });
    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.click(parkName);

    const modal = await screen.findByRole("dialog");

    const searchButton = screen.getByText(/close/i);
    fireEvent.click(searchButton);
    await waitFor(() => expect(modal).not.toBeInTheDocument());

});

test ('test hover', async () => {
    // Setup initial state where modal is visible
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark, mockPark2]) }));
    const {} = render(<FavoritePage />, { wrapper: BrowserRouter });
    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.mouseEnter(parkName);
    const rankupbutton = await screen.findByTestId('rankupfav');
    const rankdownbutton = await screen.findByTestId('rankdownfav');
    fireEvent.click(rankupbutton);
    fireEvent.click(rankdownbutton);
    fireEvent.mouseLeave(parkName);
    const parkName2 = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.mouseEnter(parkName2);
    const rankdownbuttonn = await screen.findByTestId('rankdownfav');
    fireEvent.click(rankdownbuttonn);
    fireEvent.mouseLeave(parkName2);

    await screen.findByText(/Park: Yosemite/i);
    const secondPark = screen.getByText(/Park: Yosemite/i);
    fireEvent.mouseEnter(secondPark);
    fireEvent.mouseLeave(secondPark);
});

test("Not logged in for favorite", async () => {
    sessionStorage.setItem("username", "null");

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2, mockPark]) }));
    render(<FavoritePage />, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText(/Camping/i)).toBeInTheDocument();
    });
});

test("Delete cancel and not cancel", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    const {} = render(<FavoritePage />, { wrapper: BrowserRouter });
    // Wait for the park name to be rendered
    await screen.findByText(/Park: Yellowstone National Park/i);

    // Find the park name element and click on it
    const parkName = screen.getByText(/Park: Yellowstone National Park/i);
    fireEvent.mouseEnter(parkName);
    const deletebutton = await screen.findByTestId('deletefromfav');
    fireEvent.click(deletebutton);
    const cancelbutton = await screen.findByTestId('close');
    fireEvent.click(cancelbutton);
    fireEvent.mouseEnter(parkName);
    fireEvent.click(deletebutton);
    const confirmbutton = await screen.findByTestId('confirm');
    fireEvent.click(confirmbutton);
    await waitFor(() => {
        expect(screen.queryByText(/Park: Yellowstone National Park/i)).not.toBeInTheDocument();
    });
});