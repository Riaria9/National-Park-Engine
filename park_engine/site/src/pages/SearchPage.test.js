import React from "react";
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import SearchPage from "./SearchPage"
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
let mockPark = {};

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
    fetchMock.resetMocks();
    sessionStorage.clear();
});

beforeEach(() => {

    sessionStorage.setItem("username", "existUser");

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
                id: "B33DC9B6-0B7D-4322-BAD7-A13A34C584A3",
                name: "Guided Tours"
            }
        ],
        amenities: [
            {
                "Accessible Rooms": "4"
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
test("display detail and close window", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));

    render(<SearchPage />, { wrapper: BrowserRouter });

    // waitFor(() => {
    //     expect(screen.getByPlaceholderText("Search...").toBeInTheDocument());
    // });

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    await waitFor(() => {
        expect(screen.getByText(/Visit Yellowstone and experience the world's first national park./i)).toBeInTheDocument();
    });

    document.getElementsByClassName("modal")[0].click();
    expect(screen.getByText(/Park: /i)).toBeInTheDocument();
});
test("display detail with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));

    render(<SearchPage />, { wrapper: BrowserRouter });

    // waitFor(() => {
    //     expect(screen.getByPlaceholderText("Search...").toBeInTheDocument());
    // });

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.keyDown(screen.getByText(/Yellowstone National Park/), {key:'Space'});
    fireEvent.keyDown(screen.getByText(/Yellowstone National Park/), {key:'Enter'});
    await waitFor(() => {
        expect(screen.getByText(/Visit Yellowstone and experience the world's first national park./i)).toBeInTheDocument();
    });
});
test("search and more to load after loading once", async () => {

    const mockArray = [];

    for (let i = 0; i < 10; i++) {
        mockArray.push({ ...mockPark });
    }
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));

    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(mockArray) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "parkname" } });
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getAllByText(/Park: Yellowstone National Park/i)[0]).toBeInTheDocument();
    });
    const mockPark2 = {
        fullName: "Joshua Tree",
        description: "Middle of nowhere",
        url: "https://www.nps.gov/yell/index.htm",
        parkCode: "yell",
    };

    const mockArray2 = [];

    for (let i = 0; i < 10; i++) {
        mockArray2.push({ ...mockPark2 });
    }

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(mockArray2) }));
    waitFor(() => {
        expect(screen.getByText(/Load More/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Load More/i));
    await waitFor(() => {
        expect(screen.getAllByText(/Joshua Tree/i)[0]).toBeInTheDocument();
    });
});
test("search and no more to load after loading once", async () => {

    const mockArray = [];

    for (let i = 0; i < 10; i++) {
        mockArray.push({ ...mockPark });
    }
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));

    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(mockArray) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "parkname" } });
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getAllByText(/Park: Yellowstone National Park/i)[0]).toBeInTheDocument();
    });
    const mockPark2 = {
        fullName: "Joshua Tree",
        description: "Middle of nowhere",
        url: "https://www.nps.gov/yell/index.htm",
        parkCode: "yell",
    };
    const mockPark3 = {
        fullName: "Death Valley",
        description: "Top of nowhere",
        url: "https://www.nps.gov/yell/index.htm",
        parkCode: "yelll",
    };

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2, mockPark3]) }));
    fireEvent.click(screen.getByText(/Load More/i));
    await waitFor(() => {
        expect(screen.getByText(/Death Valley/i)).toBeInTheDocument();
        expect(screen.getByText(/Joshua Tree/i)).toBeInTheDocument();

    });

    //expect(document.body.textContent).not.toContain("Load More");
});
test("search and no more to load", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "parkname" } });
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: Yellowstone National Park/i)).toBeInTheDocument();
    });
    // waitFor(() => {
    //     expect(screen.getByText(/Load More/i)).NotintheDocument();
    // });
    //expect(document.body.textContent).not.toContain("Load More");
});
test("click state in detail", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    //click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    // return (
    //     element.tagName.toLowerCase() === 'h3' &&
    //     content.includes('Park: Yellowstone National Park')
    // );
    // });
    // fireEvent.click(parkNameHeader);
    await waitFor(() => {
        expect(screen.getAllByText(/CA/i)[0]).toBeInTheDocument();
    });

    const mockPark2 = [
        {
            fullName: "No where"
        }
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.click(screen.getByText(/CA/));
    await waitFor(()=>{
        expect(true);
    })
});
test("click activity in detail", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    //click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    //     return (
    //         element.tagName.toLowerCase() === 'h3' &&
    //         content.includes('Park: Yellowstone National Park')
    //     );
    // });
    //fireEvent.click(parkNameHeader);
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
        expect(true);
    })
});
test("click amenity in detail", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    //click on the detailed page park
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

    const mockPark2 = [
        {
            fullName: "No where"
        }
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.click(screen.getByText(/Accessible Rooms/));
    await waitFor(()=>{
        expect(true);
    })
});
test("hit state in detail with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    //click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    // return (
    //     element.tagName.toLowerCase() === 'h3' &&
    //     content.includes('Park: Yellowstone National Park')
    // );
    // });
    // fireEvent.click(parkNameHeader);
    await waitFor(() => {
        expect(screen.getAllByText(/CA/i)[0]).toBeInTheDocument();
    });

    const mockPark2 = [
        {
            fullName: "No where"
        }
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.keyDown(screen.getByText(/CA/), {key:'Enter'});
    await waitFor(()=>{
        expect(true);
    })
});
test("hit activity in detail with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    //click on the detailed page park
    // const parkNameHeader = screen.getByText((content, element) => {
    //     return (
    //         element.tagName.toLowerCase() === 'h3' &&
    //         content.includes('Park: Yellowstone National Park')
    //     );
    // });
    //fireEvent.click(parkNameHeader);
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
        expect(true);
    })
});
test("hit amenity in detail with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    //click on the detailed page park
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

    const mockPark2 = [
        {
            fullName: "No where"
        }
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark2]) }));
    fireEvent.keyDown(screen.getByText(/Accessible Rooms/), {key:'Enter'});
    await waitFor(()=>{
        expect(true);
    })
});
test("press enter key and click close button", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: 'Yellowstone National Park'}});
    fireEvent.keyDown(inputElement, {key: 'Enter'});
    // for else path
    fireEvent.keyDown(inputElement, {key: 'a'});
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
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
    fireEvent.click(screen.getByText(/close/i));
    await waitFor(() => {
        expect(screen.getByText(/Park: /i)).toBeInTheDocument();
    });


});
test("search by empty query", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));
    render(<SearchPage />, { wrapper: BrowserRouter });

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: ""}});
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "parkname" } });
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Empty query invalid/i)).toBeInTheDocument();
    });
});
test("search returns empty response array", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([]) }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([]) }));

    render(<SearchPage />, { wrapper: BrowserRouter });

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "hello"}});
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "parkname" } });
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });
});
test("load more returns empty response array", async () => {

    const mockArray = [];

    for (let i = 0; i < 10; i++) {
        mockArray.push({ ...mockPark });
    }

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(mockArray) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "parkname" } });
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getAllByText(/Park: Yellowstone National Park/i)[0]).toBeInTheDocument();
    });

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([]) }));
    fireEvent.click(screen.getByText(/Load More/i));
    // await waitFor(() => {
    //     expect(screen.getByText(/Load More/i)).not.toBeInTheDocument();
    // });

    expect(document.body.textContent).not.toContain("Load More");
});

test('initializes with state from sessionStorage', async () => {
    // Set sessionStorage for state
    sessionStorage.setItem("state", "CA");
    sessionStorage.setItem("preSearch", "1");

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));

    render(<SearchPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText(/Park: Yellowstone National Park/i)).toBeInTheDocument();
    });

    // Cleanup sessionStorage
    sessionStorage.clear();
});
test('initializes with amenity from sessionStorage', async () => {
    // Set sessionStorage for amenity
    sessionStorage.setItem("amenity", "Accessible Rooms");
    sessionStorage.setItem("preSearch", "1");

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));


    render(<SearchPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText(/Park: Yellowstone National Park/i)).toBeInTheDocument();
    });

    // Cleanup sessionStorage
    sessionStorage.clear();
});
test('initializes with activity from sessionStorage', async () => {
    // Set sessionStorage for activity
    sessionStorage.setItem("activity", "Guided Tours");
    sessionStorage.setItem("preSearch", "1");

    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));


    render(<SearchPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText(/Park: Yellowstone National Park/i)).toBeInTheDocument();
    });

    // Cleanup sessionStorage
    sessionStorage.clear();
});
test('automatically triggers search based on sessionStorage settings', async () => {
    // Setup sessionStorage
    sessionStorage.setItem("state", "CA");
    sessionStorage.setItem("preSearch", "1");

    // Mock fetch response for automatic search
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));


    render(<SearchPage />, { wrapper: BrowserRouter });

    // Assert that the search was performed automatically
    await waitFor(() => {
        expect(screen.getByText(/Park: Yellowstone National Park/i)).toBeInTheDocument();
    });

    // Cleanup sessionStorage
    sessionStorage.clear();
});
test("handleParkHover", async () => {

    const mockArray = [];

    for (let i = 0; i < 10; i++) {
        mockArray.push({ ...mockPark });
    }
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));

    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(mockArray) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "parkname" } });
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getAllByText(/Park: Yellowstone National Park/i)[0]).toBeInTheDocument();
    });
    const parkDiv = screen.getAllByText(/Park: Yellowstone National Park/i)[0].closest('div');
    fireEvent.mouseEnter(parkDiv);

    // Assert the 'Add to Favorites' button appears
    const parkElement = within(parkDiv);
    const addToFavButton = parkElement.getByTestId('addtofav');
    expect(addToFavButton).toBeInTheDocument();

    // Check detail page
    fireEvent.click(screen.getAllByText(/Park: Yellowstone National Park/i)[0]);
    await waitFor(() => {
        expect(screen.getByText("Favorite?: No")).toBeInTheDocument();
    });
    document.getElementsByClassName("modal")[0].click();

    // Click the 'Add to Favorites' button
    fireEvent.click(addToFavButton);

    // Assert the feedback message appears
    await waitFor(() => {
        expect(parkElement.getByText("Park successfully added")).toBeInTheDocument();
    });

    // Check detail page
    // fireEvent.click(screen.getAllByText(/Park: Yellowstone National Park/i)[0]);
    // await waitFor(() => {
    //     expect(screen.getByText("Favorite?: Yes")).toBeInTheDocument();
    // });
    // document.getElementsByClassName("modal")[0].click();
    //
    // fireEvent.mouseLeave(parkDiv);
    //fireEvent.mouseEnter(parkDiv);

    // Click the 'Add to Favorites' button
    fireEvent.click(addToFavButton);

    // Assert the feedback message appears
    // await waitFor(() => {
    //     expect(parkElement.getByText("Park already added")).toBeInTheDocument();
    // });

    fireEvent.mouseLeave(parkDiv);

    const mockPark2 = {
        fullName: "Joshua Tree",
        description: "Middle of nowhere",
        url: "https://www.nps.gov/yell/index.htm",
        parkCode: "yell",
    };

    const mockArray2 = [];

    for (let i = 0; i < 10; i++) {
        mockArray2.push({...mockPark2});
    }

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(mockArray2)}));
    fireEvent.click(screen.getByText(/Load More/i));
    await waitFor(() => {
        expect(screen.getAllByText(/Joshua Tree/i)[0]).toBeInTheDocument();
    });

    const parkDivv = screen.getAllByText(/Joshua Tree/i)[0].closest('div');
    fireEvent.mouseEnter(parkDivv);

    // Assert the 'Add to Favorites' button appears
    const parkElementt = within(parkDivv);
    const addToFavButtonn = parkElementt.getByTestId('addtofav');
    expect(addToFavButtonn).toBeInTheDocument();

    // Click the 'Add to Favorites' button
    fireEvent.click(addToFavButtonn);

    // Assert the feedback message appears
    await waitFor(() => {
        expect(parkElementt.getByText("Park successfully added")).toBeInTheDocument();
    });

    fireEvent.click(addToFavButtonn);

    // Assert the feedback message appears
    await waitFor(() => {
        expect(parkElementt.getByText("Park already added")).toBeInTheDocument();
    });
});

test("display detail and add to favorite", async () => {
    const mockPark2 = {
        fullName: "Joshua Tree",
        description: "Middle of nowhere",
        url: "https://www.nps.gov/yell/index.htm",
        parkCode: "yell",
    };
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark, mockPark2]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "Yellowstone National Park"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: Y/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Yellowstone National Park/));
    await waitFor(() => {
        expect(screen.getByText(/Visit Yellowstone and experience the world's first national park./i)).toBeInTheDocument();
    });

    const elements = screen.getAllByText(/Yellowstone National Park/);
    await waitFor(() => {
        expect(elements.length > 1 && elements[1]);
    });
    const parkDiv = screen.getByTestId('park-div');
    await new Promise(resolve => setTimeout(resolve, 2000));
    fireEvent.mouseEnter(parkDiv);
    fireEvent.mouseLeave(parkDiv);
    fireEvent.mouseEnter(parkDiv);

    // Assert the 'Add to Favorites' button appears
    //console.log(parkElement);
    const addToFavButton = screen.getByTestId('addtodetailfav');
    expect(addToFavButton).toBeInTheDocument();
    await waitFor(() => {
        expect(screen.getByText("Favorite?: No")).toBeInTheDocument();
    });

    // Click the 'Add to Favorites' button
    fireEvent.click(addToFavButton);

    // Assert the feedback message appears
    await waitFor(() => {
        expect(screen.getByText("Park successfully added")).toBeInTheDocument();
    });

    // Check detail page
    await waitFor(() => {
        expect(screen.getByText("Favorite?: Yes")).toBeInTheDocument();
    });

    // Click the 'Add to Favorites' button
    const addToFavButtonn = screen.getByTestId('addtodetailfav');
    expect(addToFavButtonn).toBeInTheDocument();
    fireEvent.click(addToFavButtonn);

    // Assert the feedback message appears
    await waitFor(() => {
        expect(screen.getByText("Park already added")).toBeInTheDocument();
    });

    fireEvent.mouseLeave(parkDiv);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await waitFor(() => {
        expect(screen.getByText("Favorite?: Yes")).toBeInTheDocument();
    });

    document.getElementsByClassName("modal")[0].click();
    //expect(screen.getByText(/Park: Y/i)).toBeInTheDocument();
});

test("two things in favorites", async () => {
    const mockPark2 = {
        fullName: "Joshua Tree National Park",
        description: "Middle of nowhere",
        url: "https://www.nps.gov/yell/index.htm",
        parkCode: "yell",
    };
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));


    render(<SearchPage />, { wrapper: BrowserRouter });
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark, mockPark2]) }));

    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, {target: {value: "national"}});
    fireEvent.select(screen.getByRole("combobox"), screen.getByText(/park name/i));
    fireEvent.click(screen.getByTestId("search-button"));
    await waitFor(() => {
        expect(screen.getByText(/Park: Y/i)).toBeInTheDocument();
    });
    fireEvent.mouseEnter(screen.getByText(/Joshua/));
    fireEvent.mouseLeave(screen.getByText(/Joshua/));
});
test("Not logged in", async () => {
    sessionStorage.setItem("username", "null");
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(null) }));

    render(<SearchPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText(/Camping/i)).toBeInTheDocument();
    });
});

test("load in the favorite page", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
    render(<SearchPage />, { wrapper: BrowserRouter });
});