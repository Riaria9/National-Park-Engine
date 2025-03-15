import React, {useEffect, useState} from 'react';
import NavigationBar from './NavigationBar';

const ComparePage =() => {
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [selectedPark, setSelectedPark] = useState(null);
    const [hasCompared, setHasCompared] = useState(false);
    const [userFavoriteParks, setUserFavoriteParks] = useState({});
    const [hoveredratiopark, setHoveredRatiopark] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Code to check if user is logged in
        console.log("check login");
        if (sessionStorage.getItem("username") === null || sessionStorage.getItem("username") === 'null') {
            console.log("Not logged in!");
            window.location.href = '/LoginPage';
        }

        fetchUsers(); // Fetch users when the component mounts
        sessionStorage.setItem("state", null);
        sessionStorage.setItem("amenity", null);
        sessionStorage.setItem("activity", null);
        sessionStorage.setItem("preSearch", "0");
    }, []);

    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

        console.log("isMobile: " + /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }, [navigator.userAgent]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddUser();
        }
    };

    // Add a user to the selectedUsers list if valid
    const handleAddUser = () => {
        // disable compare results first
        setHasCompared(false);
        setUserFavoriteParks({});

        console.log("userinfo: ", users);
        console.log("newUser: ", newUser);
        if (newUser === "") {
            setErrorMessage("Empty query invalid");
            return;
        }

        const foundUser = users.find((user) => user && user.username === newUser);

        if (!foundUser) {
            setErrorMessage('User does not exist');
        } else if (foundUser.privacyStatus) {
            setErrorMessage('User has a private list');
        } else if (selectedUsers.includes(foundUser)) {
            setErrorMessage('User already added');
        } else {
            setErrorMessage(foundUser.username + " is added");
            setSelectedUsers([...selectedUsers, foundUser]);
        }

        setNewUser(''); // Clear the input field
    };


    const handleCompare = () => {
        if (selectedUsers.length <= 1) {
            setErrorMessage("No user to compare with");
            return;
        }

        setHasCompared(true);

        const usernames = selectedUsers.map(user => user.username);
        console.log("usernames: ", usernames);
        fetch(`/compare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.stringify(usernames),
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log("parks: ",JSON.parse(response.message));
                setUserFavoriteParks(JSON.parse(response.message));
            });

        // Object.values(selectedUsers).map((user, index) => {
        //     fetch("/favorite", {
        //         method: "POST", headers: {
        //             "Content-Type": "application/json"
        //         }, body: JSON.stringify({
        //             username: user.username,
        //         })
        //     })
        //         .then((response) => response.json())
        //         .then((response) => {
        //             // handle the case that the response array is empty
        //             if (JSON.parse(response.message) === null || JSON.parse(response.message).length === 0) {
        //             } else {
        //                 usersFavoriteParks[user.username] = JSON.parse(response.message).map(park => ({
        //                     ...park
        //                 }));
        //             }
        //         });
        // });
        //
        // console.log("userFavoriteParks: ", userFavoriteParks);
    };

    // useEffect(() => {
    //     setTimeout(() => {
    //         console.log("userFavoriteParks: ", userFavoriteParks);
    //     }, 1000);
    // }, [userFavoriteParks]);

    const handleKeyDownAccess = (e, func, arg0) => {
        if (e.key === 'Enter') {
            func(arg0);
        }
    };

    const ParkDetails = ({ park, onClose}) => {
        const handleModalClick = (event) => {
            // Prevent the click from bubbling up to the document body
            event.stopPropagation();
        };

        const handleOutsideClick = () => {
            setSelectedPark(null);
        };

        const searchByState = (state) => {
            sessionStorage.setItem("state", state);
            sessionStorage.setItem("preSearch", "1");
            console.log("state is set to " + state);
            window.location.href = '/SearchPage';
        }

        const searchByAmenity = (amenity) => {
            sessionStorage.setItem("amenity", Object.keys(amenity)[0]);
            sessionStorage.setItem("preSearch", "1");
            console.log("amenity is set to " + Object.keys(amenity)[0]);
            const a = sessionStorage.getItem("amenity");
            console.log("item is " + a + " in session storage");
            window.location.href = '/SearchPage';
        }

        const searchByActivity = (activity) => {
            sessionStorage.setItem("activity", activity.name);
            sessionStorage.setItem("preSearch", "1");
            console.log("activity is set to " + activity.name);
            window.location.href = '/SearchPage';
        }

        if (!park) return null;

        return (
            <div className={"modal"} onClick={handleOutsideClick} role="dialog">
                <div className="modal-content" onClick={handleModalClick}>
                    <h2 tabIndex={0}>Park Name: {park.fullName}</h2>
                    <div>
                        {(() => {
                            if (park.favoriteUsers.some(user => user === sessionStorage.getItem("username"))) {
                                return <p>Favorite?: Yes</p>;
                            } else {
                                return <p>Favorite?: No</p>;
                            }
                        })()}
                    </div>
                    <h4>Locations</h4>
                    <ul>
                        {park.addresses.map((address, index) => (
                            <li key={index}>{address.postalCode}, {address.city}, {address.stateCode}</li>
                        ))}
                    </ul>
                    <h4>States</h4>
                    <ul className="stateInfo">
                        {park.states.split(",").map((state, index) => (<li key={index}
                                                                           tabIndex={0}
                                                                           onKeyDown={(e) => handleKeyDownAccess(e, searchByState, state)}
                                                                           onClick={() => searchByState(state)}
                                                                           value={state}>{state};
                        </li>))}
                    </ul>
                    <a href={park.url} target="_self" rel="noopener noreferrer" className="parkUrl">Visit Park
                        Website: {park.url}</a>
                    {park.entranceFees.length > 0 && park.entranceFees[0].cost && (
                        <p>Entrance Fee: {park.entranceFees[0].cost}</p>
                    )}
                    <img src={park.images[0].url} alt={park.fullName}/>
                    <p>Park Description: {park.description}</p>
                    <h4>Amenities</h4>
                    <ul className="amenityInfo">
                        {park.amenities.map((amenity, index) => (<li key={index}
                                                                     tabIndex={0}
                                                                     onKeyDown={(e) => handleKeyDownAccess(e, searchByAmenity, amenity)}
                                                                     onClick={() => searchByAmenity(amenity)}
                                                                     value={Object.keys(amenity)[0]}>{Object.keys(amenity)[0]}</li>))}
                    </ul>
                    <h4>Activities</h4>
                    <ul className="activityInfo">
                        {park.activities.map((activity, index) => (<li key={index}
                                                                       tabIndex={0}
                                                                       onKeyDown={(e) => handleKeyDownAccess(e, searchByActivity, activity)}
                                                                       onClick={() => searchByActivity(activity)}
                                                                       value={activity.name}>{activity.name}</li>))}
                    </ul>
                    <button onClick={onClose}>Close</button>

                </div>

            </div>

        );
    };

    // function handleParkHover(results) {
    //     setHoveredPark(results);
    // }
    //
    // function handleParkLeave() {
    //     setHoveredPark(null);
    // }

    const handleParkClick = (park) => {
        setSelectedPark(park);
        console.log('Clicked Park:', park);
    };
    const fetchUsers = async () => {
        console.log("now fetching user");
        fetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (response) => {
                console.log("Fetch response:", response);
                try {
                    const data = await response.json();
                    console.log("Parsed data:", data);
                    console.log(typeof data);

                    // Create a new array with a custom format
                    const arr = [];
                    for (const key in data.message) {

                        const user = JSON.parse(data.message)[key];
                        console.log("pushing ",user,"into arr");
                        if (user && user.username) {
                            arr.push(user);
                        }
                    }
                    setUsers(arr);
                    const currentUsername = sessionStorage.getItem("username");
                    if (currentUsername && arr.some(user => user.username === currentUsername)) {
                        const currentUser = arr.find(user => user.username === currentUsername);

                        // Add the current user to selectedUsers
                        setSelectedUsers([currentUser]);
                    }

                    console.log("Users after setting state:", arr);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            });
    };

    const handleParkUser = (park) => {
        return (
            <div className="parkUser">
                <h4>Users who favorited this park:</h4>
                <ul>
                    {park.favoriteUsers.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div>
            <NavigationBar/>
            <div>
                <input
                    type="text"
                    id="friendSearchQuery"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a user"
                />
                <button id="addFriendButton" onClick={handleAddUser}>Add Friend</button> {/* Add a user button */}
                <button id="compareButton" onClick={handleCompare} data-testid="comparebutton"> Compare </button>
            </div>
            {errorMessage && <p>{errorMessage}</p>} {/* Display error message */}


            {hasCompared && (
                <div>
                    <h3>All Favorite Parks:</h3>
                    <ul>
                        {Object.values(userFavoriteParks).flatMap((parkArray) => parkArray).map((park, index) => (
                            <li className="compareResultDiv" key={index} onClick={() => handleParkClick(park)}
                            tabIndex={0} onKeyDown={(e) => handleKeyDownAccess(e, handleParkClick, park)}>
                                {park.fullName} <span className="ratioDiv" key={index} onMouseEnter={() => setHoveredRatiopark(park)} onMouseLeave={() => setHoveredRatiopark(null)} data-testid="ratio">{park.favoriteCount} / {selectedUsers.length}</span>
                                {(isMobile || (hoveredratiopark && hoveredratiopark.name === park.name)) && (
                                    handleParkUser(park)
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            <ParkDetails
                park={selectedPark}
                onClose={() => setSelectedPark(null)}
            />

        </div>

    );
}

export default ComparePage;
