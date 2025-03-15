import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Additional Jest matchers
import fetchMock from 'jest-fetch-mock'; // To mock fetch
import ComparePage from './ComparePage';
import {BrowserRouter} from "react-router-dom"; // The component to test


fetchMock.enableMocks(); // Enable fetch mocks
let mockPark2;
let mockPark;
beforeEach(() => {
    sessionStorage.setItem("username", "compareUser");

    fetchMock.resetMocks(); // Reset mocks before each test
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
        favoriteUsers: ["User1, User2, User3, User4"],
        favoriteCount: 4,
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
        favoriteUsers: ['User1', 'compareUser'],
        favoriteCount: 2
    };
});

const sampleUsers = [
    {
        id: 1,
        username: "User1",
        privacyStatus: false, // A boolean indicating if the user has a private list
    },
    {
        id: 2,
        username: "User2",
        privacyStatus: true, // Another user with a private list
    },
    {
        id: 3,
        username: "User3",
        privacyStatus: false, // A public user
    },
    {
        id: 4,
        username: "User4",
        privacyStatus: true, // An additional user with a private list
    },
    {
        id: 4,
        username: "compareUser",
        privacyStatus: true, // An additional user with a private list
    },
];


describe('ComparePage', () => {
    it('renders without crashing', () => {
        render(<ComparePage />);
        expect(screen.getByPlaceholderText('Add a user')).toBeInTheDocument(); // Ensure it renders
    });

    it('not logged in user', async () => {
        sessionStorage.setItem("username", "null");

        render(<ComparePage/>);
        await waitFor(() => {
            expect(screen.getByText(/Camping/i)).toBeInTheDocument();
        });
    });

    it('fetches users on component mount', async () => {
        // Mock a successful fetch response
        fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(sampleUsers) }));

        render(<ComparePage />);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });
    });

    // it('handles fetch error gracefully', async () => {
    //     // Mock a fetch error
    //     fetchMock.mockRejectOnce(new Error("Network Error"));
    //
    //     render(<ComparePage />);
    //
    //     await waitFor(() => {
    //         expect(fetchMock).toHaveBeenCalledWith("/users", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });
    //     });
    //
    //     // Check for expected error handling
    //     const consoleSpy = jest.spyOn(console, 'error');
    //     //expect(consoleSpy).toHaveBeenCalled(); // Ensure error is logged
    // });

    it('adds a valid user, shows error for invalid users, and compare', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(sampleUsers) }));
        render(<ComparePage/>);
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        const input = screen.getByPlaceholderText('Add a user');
        const addButton = screen.getByText('Add Friend');

        // Test adding a valid user
        fireEvent.change(input, {target: {value: 'User1'}});
        fireEvent.click(addButton);
        await waitFor(() => {
            expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
        });

        // Test adding a valid user
        fireEvent.change(input, {target: {value: 'User3'}});
        fireEvent.click(addButton);
        await waitFor(() => {
            expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
        });

        // // Test adding a non-existent user
        fireEvent.change(input, {target: {value: 'InvalidUser'}});
        fireEvent.keyDown(input, {key: 'Enter'});
        expect(screen.getByText('User does not exist')).toBeInTheDocument(); // Error for invalid user

        // Test adding a private user
        fireEvent.change(input, {target: {value: 'User2'}});
        fireEvent.click(addButton);
        expect(screen.getByText('User has a private list')).toBeInTheDocument(); // Error for private user

        // Test adding a duplicate user
        fireEvent.change(input, {target: {value: 'User1'}});
        fireEvent.click(addButton);
        expect(screen.getByText('User already added')).toBeInTheDocument(); // Error for duplicate user
        fireEvent.keyDown(input, {key: 'a'});

        // Test empty query
        fireEvent.change(input, {target: {value: ''}});
        fireEvent.click(addButton);
        expect(screen.getByText('Empty query invalid')).toBeInTheDocument(); // Error for empty query

        fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify([mockPark]) }));
        fireEvent.click(screen.getByTestId('comparebutton'));
        await waitFor(() => {
            expect(screen.getByTestId("ratio")).toBeInTheDocument();
        });
        fireEvent.mouseEnter(screen.getByTestId("ratio"));
        fireEvent.mouseLeave(screen.getByTestId("ratio"));
    });

    it('compare without any user added', async () => {
        // Mock a successful fetch response
        fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(sampleUsers) }));

        render(<ComparePage />);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });

        fireEvent.click(screen.getByTestId('comparebutton'));
        await waitFor(() => {
            expect(screen.getByText('No user to compare with')).toBeInTheDocument(); // Error no user to compare with
        });
    });

    it('invalid current user', async () => {
        sessionStorage.setItem("username", "notExistUser");

        // Mock a successful fetch response
        fetchMock.mockResponseOnce(JSON.stringify({ message: JSON.stringify(sampleUsers) }));

        render(<ComparePage />);

        await waitFor(() => {
            expect(screen.getByText(/Camping/i)).toBeInTheDocument();
        });
    });

});

test("display detail", async () => {

        fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
        render(<ComparePage/>);
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        const input = screen.getByPlaceholderText('Add a user');
        const addButton = screen.getByText('Add Friend');
        const compareButton = screen.getByTestId("comparebutton")

        // Test adding a valid user
        fireEvent.change(input, {target: {value: 'User1'}});
        fireEvent.click(addButton);
        await waitFor(() => {
            expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
        });
        const park = {
            fullName: "Park1",
            addresses: [{postalCode: "12345", city: "City1", stateCode: "ST1"}],
            states: "ST1",
            url: "https://example.com/park1",
            entranceFees: [{cost: "10"}],
            images: [{url: "https://example.com/park1.jpg"}],
            description: "Description of Park1",
            amenities: [{"Amenity1": true}],
            activities: [{name: "Activity1"}],
            favoriteUsers: ['User1'],
            favoriteCount: 1
        };

        // Mock opening park details (unfavorite)
        fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([park])}));
        fireEvent.click(compareButton);
        await waitFor(() => {
            expect(screen.getByText(/Park1/i)).toBeInTheDocument();
        });
        const parkElement = screen.getByText(`${park.fullName}`);
        fireEvent.click(parkElement); // Open park details
        expect(screen.getByText(`Park Name: ${park.fullName}`)).toBeInTheDocument(); // Park details are open
        const modal = await screen.findByRole("dialog");

        const searchButton = screen.getByText(/close/i);
        fireEvent.click(searchButton);
        await waitFor(() => expect(modal).not.toBeInTheDocument());

        const park1 = {
            fullName: "Park1",
            addresses: [{postalCode: "12345", city: "City1", stateCode: "ST1"}],
            states: "ST1",
            url: "https://example.com/park1",
            entranceFees: [{cost: "10"}],
            images: [{url: "https://example.com/park1.jpg"}],
            description: "Description of Park1",
            amenities: [{"Amenity1": true}],
            activities: [{name: "Activity1"}],
            favoriteUsers: ['User1', 'compareUser'],
            favoriteCount: 2
        };

        // Mock opening park details (favorite)
        fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([park1])}));
        fireEvent.click(compareButton);
        await waitFor(() => {
            expect(screen.getByText(/Park1/i)).toBeInTheDocument();
        });
        const parkElement1 = screen.getByText(`${park1.fullName}`);
        fireEvent.click(parkElement1); // Open park details
        expect(screen.getByText(`Park Name: ${park1.fullName}`)).toBeInTheDocument(); // Park details are open
        const modal1 = await screen.findByRole("dialog");

        const searchButton1 = screen.getByText(/close/i);
        fireEvent.click(searchButton1);
        await waitFor(() => expect(modal1).not.toBeInTheDocument());
});

test("display detail with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    render(<ComparePage/>);
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });
    const park = {
        fullName: "Park1",
        addresses: [{postalCode: "12345", city: "City1", stateCode: "ST1"}],
        states: "ST1",
        url: "https://example.com/park1",
        entranceFees: [{cost: "10"}],
        images: [{url: "https://example.com/park1.jpg"}],
        description: "Description of Park1",
        amenities: [{"Amenity1": true}],
        activities: [{name: "Activity1"}],
        favoriteUsers: ['User1', 'compareUser'],
        favoriteCount: 2
    };

    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([park])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Park1/i)).toBeInTheDocument();
    });
    const parkElement = screen.getByText(`${park.fullName}`);

    // press another key
    fireEvent.keyDown(parkElement, {key:'Space'});

    fireEvent.keyDown(parkElement, {key:'Enter'}); // Open park details
    expect(screen.getByText(`Park Name: ${park.fullName}`)).toBeInTheDocument(); // Park details are open
    const modal = await screen.findByRole("dialog");

    const searchButton = screen.getByText(/close/i);
    fireEvent.click(searchButton);
    await waitFor(() => expect(modal).not.toBeInTheDocument());

});

test("display detail and click on state", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    render(<ComparePage/>);
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark2])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yosemite/i)).toBeInTheDocument();
    });
    const parkElement = screen.getByText("Yosemite");
    fireEvent.click(parkElement); // Open park details
    expect(screen.getByText("Yosemite")).toBeInTheDocument(); // Park details are open

    const stateElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'li' && content.includes('CA');
    });
    fireEvent.click(stateElement);

    // Assert that the page has been redirected to the SearchPage with the selected state as a query parameter
    await waitFor(() => {
        expect(sessionStorage.getItem("state")).toBe("CA");
    });
});

test("display detail and click on activities", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    render(<ComparePage/>);
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yellowstone National Park/i)).toBeInTheDocument();
    });
    const parkElement = screen.getByText("Yellowstone National Park");
    fireEvent.click(parkElement); // Open park details


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


test("display detail and click on amenity", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    render(<ComparePage/>);
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yellowstone National Park/i)).toBeInTheDocument();
    });
    const parkElement = screen.getByText("Yellowstone National Park");
    fireEvent.click(parkElement); // Open park details


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
        expect(sessionStorage.getItem("amenity")).toBe("Accessible Rooms");    })


});

test("display detail and hit on state with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    render(<ComparePage/>);
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark2])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yosemite/i)).toBeInTheDocument();
    });
    const parkElement = screen.getByText("Yosemite");
    fireEvent.click(parkElement); // Open park details
    expect(screen.getByText("Yosemite")).toBeInTheDocument(); // Park details are open

    const stateElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'li' && content.includes('CA');
    });
    fireEvent.keyDown(stateElement, {key:'Enter'});

    // Assert that the page has been redirected to the SearchPage with the selected state as a query parameter
    await waitFor(() => {
        expect(sessionStorage.getItem("state")).toBe("CA");
    });
});

test("display detail and hit on activity with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    render(<ComparePage/>);
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yellowstone National Park/i)).toBeInTheDocument();
    });
    fireEvent.mouseEnter(screen.getByTestId("ratio"));
    fireEvent.mouseLeave(screen.getByTestId("ratio"));
    const parkElement = screen.getByText("Yellowstone National Park");
    fireEvent.click(parkElement); // Open park details


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


test("display detail and hit on amenity with keyboard", async () => {

    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    render(<ComparePage/>);
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yellowstone National Park/i)).toBeInTheDocument();
    });
    const parkElement = screen.getByText("Yellowstone National Park");
    fireEvent.click(parkElement); // Open park details


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
        expect(sessionStorage.getItem("amenity")).toBe("Accessible Rooms");    })


});

test("closes modal and resets park and hover state on outside click", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify(sampleUsers)}));
    const { container } = render(<ComparePage />, { wrapper: BrowserRouter });
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const input = screen.getByPlaceholderText('Add a user');
    const addButton = screen.getByText('Add Friend');
    const compareButton = screen.getByTestId("comparebutton")

    // Test adding a valid user
    fireEvent.change(input, {target: {value: 'User1'}});
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.queryByText('User does not exist')).toBeNull(); // No error for valid user
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yellowstone National Park/i)).toBeInTheDocument();
    });


    // Mock opening park details
    fetchMock.mockResponseOnce(JSON.stringify({message: JSON.stringify([mockPark])}));
    fireEvent.click(compareButton);
    await waitFor(() => {
        expect(screen.getByText(/Yellowstone National Park/i)).toBeInTheDocument();
    });
    const parkElement = screen.getByText("Yellowstone National Park");
    fireEvent.click(parkElement); // Open park details


    await waitFor(() => {
        expect(screen.getByText(/Accessible Rooms/i)).toBeInTheDocument();

    });

    const modal = await screen.findByRole("dialog");
    const modalOverlay = container.querySelector('.modal');
    //const modalContent = container.querySelector('.modal-content');

    // Simulate clicking on the modal overlay, outside the modal content
    fireEvent.mouseDown(modalOverlay);
    fireEvent.click(modalOverlay);
    expect(modal).not.toBeInTheDocument();

});
