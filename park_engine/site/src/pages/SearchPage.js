import React, {useEffect, useState} from 'react';
import './SearchPage.css';
import NavigationBar from './NavigationBar';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('parkname');
    const [searchResults, setSearchResults] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoadMore, setHasLoadMore] = useState(false);
    const [selectedPark, setSelectedPark] = useState(null);
    const [hoveredPark, setHoveredPark] = useState(null);
    const [favoriteParks, setFavoriteParks] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedBackMessage] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    // const handleFetchResponse = (data) => {
    //     setSearchResults(data);
    // };
    useEffect(() => {
        // Code to check if user is logged in
        if (sessionStorage.getItem("username") === null || sessionStorage.getItem("username") === 'null') {
            console.log("Not logged in!");
            window.location.href = '/LoginPage';
        }

        fetchFav();
        setTimeout(() => {
            console.log("Favorite parks: ", favoriteParks);
        } , 1000);
    }, []);

    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

        console.log("isMobile: " + /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }, [navigator.userAgent]);

    // useEffect(() => {//handle click from other page
    //     if (sessionStorage.getItem("state") !== null && sessionStorage.getItem("state") !== "null") {
    //         console.log("find state");
    //         console.log("The state is " + sessionStorage.getItem("state"));
    //         setSearchTerm(sessionStorage.getItem("state"));
    //         setSearchCriteria("state");
    //     } else if (sessionStorage.getItem("amenity") !== null && sessionStorage.getItem("amenity") !== "null") {
    //         console.log("find amenity");
    //         setSearchTerm(sessionStorage.getItem("amenity"));
    //         setSearchCriteria("amenity");
    //     } else if (sessionStorage.getItem("activity") !== null && sessionStorage.getItem("activity") !== "null") {
    //         console.log("find activity");
    //         setSearchTerm(sessionStorage.getItem("activity"));
    //         setSearchCriteria("activity");
    //     } else {
    //         console.log("all are empty");
    //     }
    //
    //
    //     // sessionStorage.setItem("state",null);
    //     // sessionStorage.setItem("amenity",null);
    //     // sessionStorage.setItem("activity",null);
    //
    // }, []);
    useEffect(() => {
        // Code to set searchTerm and searchCriteria based on session storage
        if (sessionStorage.getItem("state") !== null && sessionStorage.getItem("state") !== "null") {
            console.log("find state");
            console.log("The state is " + sessionStorage.getItem("state"));
            setSearchTerm(sessionStorage.getItem("state"));
            setSearchCriteria("state");
        } else if (sessionStorage.getItem("amenity") !== null && sessionStorage.getItem("amenity") !== "null") {
            console.log("find amenity");
            setSearchTerm(sessionStorage.getItem("amenity"));
            setSearchCriteria("amenity");
        } else if (sessionStorage.getItem("activity") !== null && sessionStorage.getItem("activity") !== "null") {
            console.log("find activity");
            setSearchTerm(sessionStorage.getItem("activity"));
            setSearchCriteria("activity");
        } else {
            console.log("all are empty");
        }
    }, []);

    const fetchFav = async () => {
        fetch("/favorite", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                username: sessionStorage.getItem("username")
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.parse(response.message));
                // handle the case that the response array is empty
                if (JSON.parse(response.message) === null || JSON.parse(response.message).length === 0) {
                    setFavoriteParks([]);
                }
                else {
                    const parks = JSON.parse(response.message).map(park => ({
                        ...park, showFeedback: false, feedbackMessage: ''
                    }));
                    console.log(parks);
                    setFavoriteParks(parks);
                }
            });
        // fetch("/favorites", {
        //     method: "POST", headers: {
        //         "Content-Type": "application/json"
        //     }, body: JSON.stringify({
        //         username: sessionStorage.getItem("username")
        //     })
        // })
        //     .then((response) => response.json())
        //     .then((response) => {
        //         try{
        //         console.log(typeof response.message);
        //         console.log(response.message);
        //         // console.log(JSON.parse(response.message));
        //         if (response.message !== undefined && JSON.parse(response.message).length > 0) {
        //             const parks = JSON.parse(response.message).map(park => ({
        //                 ...park
        //             }));
        //             setFavoriteParks(parks);
        //             console.log(JSON.parse(response.message));
        //             console.log("Favorite parks: ", favoriteParks);
        //
        //         }
        //         } catch (error) {
        //             console.error("Error parsing JSON:", error); // Handle parsing errors
        //         }
        //     });
        // fetch("/users", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then(async (response) => {
        //         console.log("Fetch response:", response); // Log the fetch response
        //         // if (response.ok) {
        //         try {
        //             const data = await response.json();
        //             console.log("Parsed data:", data); // Log the parsed JSON data
        //             console.log(typeof data);
        //             act(() => {
        //                 console.log(data.name);
        //                 // Create a new array with a custom format
        //                 const arr = [];
        //                 for (const key in data) {
        //                     arr.push(data[key]);
        //                 }
        //
        //                 setUsers(arr);
        //                 console.log(users);
        //             });
        //             //setUsers(data);
        //             return data;
        //         } catch (error) {
        //             console.error("Error parsing JSON:", error); // Handle parsing errors
        //         }
        //         //}
        //     })


    };

    useEffect(() => {
        console.log("in triggered");
        console.log("Favorite parks: ", favoriteParks);
        if (searchTerm !== '' && searchCriteria !== '' && sessionStorage.getItem("preSearch") === "1") {
            console.log("searchTerm: " + searchTerm + ", searchCriteria: " + searchCriteria);
            sessionStorage.setItem("preSearch", "0")
            handleSearch(searchTerm, searchCriteria);
        }
    }, [searchTerm, searchCriteria]);

    //when you click on the load more button,
    const handleLoadMore = async (searchTerm, searchCriteria) => {

        // Perform the search operation here
        // useEffect(() => {
        //     console.log(startIndex);
        // }, [startIndex])
        setIsLoading(true);
        setHasLoadMore(false);
        console.log(`Load more for "${searchTerm}" with criteria "${searchCriteria}" start at ${startIndex + 10}`);

        fetch("/search", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                searchTerm: searchTerm, searchCriteria: searchCriteria, start: startIndex + 10
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.parse(response.message));
                // handle the case where the response array is empty
                if (JSON.parse(response.message).length > 0) {
                    setSearchResults([...searchResults, ...JSON.parse(response.message)]); // add more to the data structure
                }

                setIsLoading(false);

                if (JSON.parse(response.message).length < 10) {
                    setHasLoadMore(false);
                } else {
                    setHasLoadMore(true);
                }

            });

        setStartIndex(prevStartIndex => prevStartIndex + 10);
    };

    const handleSearch = async (searchTerm, searchCriteria) => {
        // Perform the search operation here
        //Edward: set bool to true and display the result section and load more button
        setHasSearched(false);
        setHasLoadMore(false);
        if (searchTerm === "") {
            setHasError(true);
            setHasSearched(false);
            setErrorMessage("Empty query invalid");
            return
        } else {
            setHasError(false);
            setIsLoading(true);
        }

        setStartIndex(0);

        console.log(searchTerm);

        fetch("/search", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                searchTerm: searchTerm, searchCriteria: searchCriteria, start: 0
            })
        })
            .then((response) => response.json())
            .then((response) => {
                setHasLoadMore(true);
                console.log(JSON.parse(response.message));
                // handle the case that the response array is empty
                if (JSON.parse(response.message) === null || JSON.parse(response.message).length === 0) {
                    console.log("false");
                    setHasError(true);
                    setHasSearched(false);
                    setSearchResults([]);
                    setErrorMessage("No results found");
                } else {
                    console.log("here");
                    const parks = JSON.parse(response.message).map(park => ({
                        ...park, showFeedback: false, feedbackMessage: ''
                    }));
                    console.log(parks);
                        setSearchResults(parks);
                        setHasSearched(true);
                        setHasError(false);
                }

                setIsLoading(false);
                console.log(isLoading);

                if (JSON.parse(response.message) === null || JSON.parse(response.message).length < 10) {
                    console.log("false")
                    setHasLoadMore(false);
                } else {
                    console.log("true")
                    setHasLoadMore(true);
                    setTimeout (() => {
                        console.log("HasLoadMore: ", hasLoadMore);
                    } , 1000);
                }
                console.log(hasLoadMore);
            });
    };

    useEffect(() => {
        setTimeout(() => {
            console.log("HasLoadMore: ", hasLoadMore);
        }, 1000);
    }, [hasLoadMore]);

    const handleKeyDown = (event) => {
        // Trigger search when the Enter key is pressed
        if (event.key === 'Enter') {
            handleSearch(searchTerm, searchCriteria);
        }
    };
    const handleParkClick = (park) => {
        setSelectedPark(park);
        console.log('Clicked Park:', park);
    };

    const handleParkHover = (park) => {
        setHoveredPark(park);
    };

    useEffect(() => {
        if (hoveredPark) {
            const timer = setTimeout(() => {
                console.log("Updated hoveredPark:", hoveredPark);
                // Perform any additional actions here after the delay
            }, 1000); // Delay of 1000 milliseconds (1 second)

            // Cleanup function to clear the timeout if the component unmounts or hoveredPark changes again
            return () => clearTimeout(timer);
        }
    }, [hoveredPark]);

    // Function to handle park mouse leave
    const handleParkMouseLeave = (park) => {
        setHoveredPark(null);
        const newSearchResults = searchResults.map(p => {
            if (p.fullName === park.fullName) {
                return {...p, feedbackMessage: null, showFeedback: false};
            }
            return p;
        });
        setSearchResults(newSearchResults);
    };

    const addToFavorites = (park) => {
        const newSearchResults = searchResults.map(p => {
            if (p.fullName === park.fullName) {
                let message;
                if (favoriteParks.some(favorite => favorite.fullName === park.fullName)) {
                    message = "Park already added";
                } else {
                    setFavoriteParks([...favoriteParks, park]);
                    fetch("/add-favorite", {
                        method: "POST", headers: {
                            "Content-Type": "application/json"
                        }, body: JSON.stringify({
                            username: sessionStorage.getItem("username"), parkCode: park.parkCode
                        })
                    })
                    message = "Park successfully added";
                }
                return {...p, feedbackMessage: message, showFeedback: true};
            }
            return p;
        });
        setSearchResults(newSearchResults);
        // console.log(newSearchResults);
    }

    const addTodetailFavorites = (park) => {
        let message;
        if (favoriteParks.some(favorite => favorite.fullName === park.fullName)) {
            message = "Park already added";
        } else {
            setFavoriteParks([...favoriteParks, park]);
            fetch("/add-favorite", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({
                    username: sessionStorage.getItem("username"), parkCode: park.parkCode
                })
            })
            message = "Park successfully added";
        }
        setFeedBackMessage(message);
        setShowFeedback(true);
    }

    const handleKeyDownAccess = (e, func, arg0) => {
        if (e.key === 'Enter') {
            func(arg0);
        }
    };

    //detailed page rendering
    const ParkDetails = ({park, onClose, onSearchClick}) => {
        // console.log('Park:', park);
        const handleModalClick = (event) => {
            // Prevent the click from bubbling up to the document body
            event.stopPropagation();
        };

        const handleOutsideClick = () => {
                setSelectedPark(null);
                setHoveredPark(null);
                setShowFeedback(false);
                setFeedBackMessage('');
        };

        const searchByState = (state) => {
            onSearchClick('state', state);
        }

        const searchByAmenity = (amenity) => {
            onSearchClick('amenity', Object.keys(amenity)[0]);
        }

        const searchByActivity = (activity) => {
            onSearchClick('activity', activity.name);
        }

        if (!park) return null;

        return (<div className={"modal"} onClick={handleOutsideClick}>
                <div className="modal-content" onClick={handleModalClick}>
                    <div data-testid="park-div" className="searchDetailResultDiv"
                         onMouseEnter={() => handleParkHover(park)}>
                        <h2><span tabIndex={0}> Park Name: {park.fullName}</span> {<button onClick={() => addTodetailFavorites(park)}
                                                                              data-testid="addtodetailfav"
                                                                              className={"favoriteButton"}>+</button>} {showFeedback && feedbackMessage}
                        </h2>
                    </div>
                    {/*<h2>Park Name: {park.fullName}</h2>*/}
                    <div>
                        {(() => {
                            if (favoriteParks.some(favorite => favorite.fullName === park.fullName)) {
                                return <p>Favorite?: Yes</p>;
                            } else {
                                return <p>Favorite?: No</p>;
                            }
                        })()}
                    </div>
                    <h4>Locations</h4>
                    <ul>
                        {park.addresses.map((address, index) => (
                            <li key={index}>{address.postalCode}, {address.city}, {address.stateCode}</li>))}
                    </ul>
                    <h4>States</h4>
                    <ul className="stateInfo">
                        {park.states.split(",").map((state, index) => (<li key={index}
                                                                           tabIndex={0}
                                                                           onKeyDown={(e) => handleKeyDownAccess(e, searchByState, state)}
                                                                           onClick={() => onSearchClick('state', state)}
                                                                           value={state}>{state}</li>))}
                    </ul>
                    <a href={park.url} target="_self" rel="noopener noreferrer" className="parkUrl">Visit Park
                        Website: {park.url}</a>
                    {park.entranceFees.length > 0 && park.entranceFees[0].cost && (
                        <p>Entrance Fee: {park.entranceFees[0].cost}</p>)}
                    <img src={park.images[0].url} alt={park.fullName}/>
                    <p>Park Description: {park.description}</p>
                    <h4>Amenities</h4>
                    <ul className="amenityInfo">
                        {park.amenities.map((amenity, index) => (<li key={index}
                                                                     tabIndex={0}
                                                                     onKeyDown={(e) => handleKeyDownAccess(e, searchByAmenity, amenity)}
                                                                     onClick={() => onSearchClick('amenity', Object.keys(amenity)[0])}
                                                                     value={Object.keys(amenity)[0]}>{Object.keys(amenity)[0]}</li>))}
                    </ul>
                    <h4>Activities</h4>
                    <ul className="activityInfo">
                        {park.activities.map((activity, index) => (<li key={index}
                                                                       tabIndex={0}
                                                                       onKeyDown={(e) => handleKeyDownAccess(e, searchByActivity, activity)}
                                                                       onClick={() => onSearchClick('activity', activity.name)}
                                                                       value={activity.name}>{activity.name}</li>))}
                    </ul>
                    <button onClick={onClose} data-testid="closebutton">Close</button>

                </div>

            </div>

        );
    };

    return (<div>
            <NavigationBar/>
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                id="searchQuery"
                placeholder="Search..."
            />

            <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)}>
                <option value="parkname" id="name">Park Name</option>
                <option value="amenity" id="amenity">Amenity</option>
                <option value="state" id="state">State</option>
                <option value="activity" id="activity">Activity</option>
            </select>

            <button onClick={() => handleSearch(searchTerm, searchCriteria)} id="searchButton"
                    data-testid="search-button">
                Search
            </button>

            {/*Display error message*/}
            {hasError && (<div>
                    <p>{errorMessage}</p>
                </div>)}

            {/*The displayed field of result and load more button*/}
            {hasSearched && (<div>
                    <h2>Search Results</h2>
                    <div className="search-result">
                        {searchResults.map((result, index) => (
                            <div key={index} className="searchResultDiv" onMouseEnter={() => handleParkHover(result)}
                                 onMouseLeave={() => handleParkMouseLeave(result)}>
                                <h3><span tabIndex={0} onKeyDown={(e) => handleKeyDownAccess(e, handleParkClick, result)}
                                    onClick={() => handleParkClick(result)}> Park: {result.fullName}</span> {(isMobile || (hoveredPark && hoveredPark.fullName === result.fullName)) && (
                                    <button onClick={() => addToFavorites(result)} data-testid="addtofav"
                                            className={"favoriteButton"}>+</button>)} {result.showFeedback && result.feedbackMessage}
                                </h3>
                            </div>))}
                    </div>


                </div>)}
            {/*Display the load more button*/}
            {hasLoadMore && (<div>
                    <button id="loadMoreButton" onClick={() => handleLoadMore(searchTerm, searchCriteria)}>Load More
                    </button>
                </div>)}

            {/*Show its loading*/}
            {isLoading && (<div>
                    <p>Content Loading...</p>
                </div>)}
            <ParkDetails
                park={selectedPark}
                onClose={() => setSelectedPark(null) & setHoveredPark(null) & setShowFeedback(false) & setFeedBackMessage('')}
                onSearchClick={(criteria, term) => {
                    setSearchCriteria(criteria);
                    setSearchTerm(term);
                    handleSearch(term, criteria);
                    setSelectedPark(null);
                }}
            />
        </div>

    );
};

export default SearchPage;
