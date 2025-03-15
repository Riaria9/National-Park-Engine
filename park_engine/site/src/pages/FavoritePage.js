import React, {useEffect, useState} from 'react';
import './SearchPage.css';
import NavigationBar from './NavigationBar';

const FavoritePage = () => {

    const [searchResults, setSearchResults] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedPark, setSelectedPark] = useState(null);

    const [privateString, setPrivateString] = useState("Make It Public");
    const [privateStatus, setPrivateStatus] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [hoveredPark, setHoveredPark] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState([]);

    useEffect(() => {
        // Code to check if user is logged in
        if (sessionStorage.getItem("username") === null || sessionStorage.getItem("username") === 'null') {
            console.log("Not logged in!");
            window.location.href = '/LoginPage';
        }

        if(sessionStorage.getItem("privacyStatus") === 'true'){
            setPrivateStatus(true);
            setPrivateString("Make It Public");
        }else{
            setPrivateStatus(false);
            setPrivateString("Make It Private");
        }
    }, []);

    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

        console.log("isMobile: " + /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }, [navigator.userAgent]);

    const handleConfirmDeleteAll =async () => {
        // Redirect to the sign-in page
        setSearchResults([]);
        setShowDeleteAllModal(false);
        const username = sessionStorage.getItem('username');
        fetch(`/modifyFav`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                parkCode: JSON.stringify([])
            })
        }).then(response => {
            console.log("success");
        });
    };

    // useEffect(() => {
    //     const username = sessionStorage.getItem('username');
    //     fetch(`/modifyFav`, {
    //         method: 'POST', headers: {
    //             "Content-Type": "application/json"
    //         }, body: JSON.stringify({
    //             username: username, parkCode: JSON.stringify(searchResults)
    //         })
    //     }).then(response => {
    //         // Handle response or additional logic
    //         console.log("success modify Fav")
    //     })
    // }, [searchResults]);

    useEffect(() => {//load the favorite components
        setIsLoading(true);
        sessionStorage.setItem("state", null);
        sessionStorage.setItem("amenity", null);
        sessionStorage.setItem("activity", null);
        sessionStorage.setItem("preSearch", "0");
        const username = sessionStorage.getItem('username');
        fetch("/favorite", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                username: username
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.parse(response.message));
                setSearchResults(JSON.parse(response.message));
                setIsLoading(false);
            });
    }, []);


    const handlePrivate = () => {
        if (privateStatus === true) {
            setPrivateStatus(false);
            setPrivateString("Make It Private");
            sessionStorage.setItem("privacyStatus", 'false');
        } else {
            setPrivateStatus(true);
            setPrivateString("Make It Public");
            sessionStorage.setItem("privacyStatus", 'true');
        }
        const username = sessionStorage.getItem('username');
        fetch("/private", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                username: username
            })
        })

    }

    const handleParkClick = (park) => {
        setSelectedPark(park);
    };

    const handleParkHover = (park) => {
        setHoveredPark(park);
    };

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
    //TODO
    const deletefromFavorites = (indexToRemove) => {
        const updatedResults = [...searchResults];
        updatedResults.splice(indexToRemove, 1);
        setSearchResults(updatedResults);
        handlefalseShowCancelModal(indexToRemove);

        const username = sessionStorage.getItem('username');
        fetch(`/modifyFav`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                parkCode: JSON.stringify(updatedResults)
            })
        }).then(response => {
            console.log("success");
        });
    };
    //TODO
    const rankupFavorites = (index) => {
        if (index > 0) {
            const updatedResults = [...searchResults];
            const temp = updatedResults[index];
            updatedResults[index] = updatedResults[index - 1];
            updatedResults[index - 1] = temp;
            setSearchResults(updatedResults);

            const username = sessionStorage.getItem('username');
            fetch(`/modifyFav`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    parkCode: JSON.stringify(updatedResults)
                })
            }).then(response => {
                console.log("success");
            });
        }
    };

    const handletrueShowCancelModal = (index) => {
        const newShowCancelModal = [...showCancelModal];
        newShowCancelModal[index] = true;
        setShowCancelModal(newShowCancelModal);
    }

    const handlefalseShowCancelModal = (index) => {
        const newShowCancelModal = [...showCancelModal];
        newShowCancelModal[index] = false;
        setShowCancelModal(newShowCancelModal);
    }

    const ifshowCancelModel = (index) => {
        return showCancelModal[index];
    }

    const rankdownFavorites = (index) => {
        if (index < searchResults.length - 1) {
            const updatedResults = [...searchResults];
            const temp = updatedResults[index];
            updatedResults[index] = updatedResults[index + 1];
            updatedResults[index + 1] = temp;
            setSearchResults(updatedResults);

            const username = sessionStorage.getItem('username');
            fetch(`/modifyFav`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    parkCode: JSON.stringify(updatedResults)
                })
            }).then(response => {
                console.log("success");
            });
        }
    };

    const handleKeyDown = (e, func, arg0) => {
        if (e.key === 'Enter') {
            func(arg0);
        }
    };

    //detailed page rendering
    const ParkDetails = ({park, onClose}) => {

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

        return (<div className={"modal"} onClick={handleOutsideClick} role="dialog">
                <div className="modal-content" onClick={handleModalClick}>
                    <h2 tabIndex={0}>Park Name: {park.fullName}</h2>
                    <p>Favorite?: yes</p>
                    <h4>Locations</h4>
                    <ul>
                        {park.addresses.map((address, index) => (
                            <li key={index}>{address.postalCode}, {address.city}, {address.stateCode}</li>))}
                    </ul>
                    <h4>States</h4>
                    <ul className="stateInfo">
                        {park.states.split(",").map((state, index) => (<li key={index}
                                                                           tabIndex={0}
                                                                           onKeyDown={(e) => handleKeyDown(e, searchByState, state)}
                                                                           onClick={() => searchByState(state)}
                                                                           value={state}>{state};
                        </li>))}
                    </ul>
                    <a href={park.url} target="_self" rel="noopener noreferrer" className="parkUrl">Visit
                        Park
                        Website: {park.url}</a>
                    {park.entranceFees.length > 0 && park.entranceFees[0].cost && (
                        <p>Entrance Fee: {park.entranceFees[0].cost}</p>)}
                    <img src={park.images[0].url} alt={park.fullName}/>
                    <p>Park Description: {park.description}</p>
                    <h4>Amenities</h4>
                    <ul className="amenityInfo">
                        {park.amenities.map((amenity, index) => (<li key={index}
                                                                     tabIndex={0}
                                                                     onKeyDown={(e) => handleKeyDown(e, searchByAmenity, amenity)}
                                                                     onClick={() => searchByAmenity(amenity)}
                                                                     value={Object.keys(amenity)[0]}>{Object.keys(amenity)[0]}</li>))}
                    </ul>
                    <h4>Activities</h4>
                    <ul className="activityInfo">
                        {park.activities.map((activity, index) => (<li key={index}
                                                                       tabIndex={0}
                                                                       onKeyDown={(e) => handleKeyDown(e, searchByActivity, activity)}
                                                                       onClick={() => searchByActivity(activity)}
                                                                       value={activity.name}>{activity.name}</li>))}
                    </ul>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };

    return (<div>
            <NavigationBar/>
            <button onClick={() => handlePrivate()} id="privacyCheckbox"
                    data-testid="private-button">
                {privateString}
            </button>


            <button id={"deleteAllButton"} data-testid={"deleteAllButton"} type="button"
                    onClick={() => setShowDeleteAllModal(true)}>Delete All
            </button>
            {showDeleteAllModal && (<div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px'
            }}>
                <p>Are you sure you want to delete all?</p>
                <button id={"confirmDeleteAllButton"} data-testid={"confirmDeleteAllButton"}
                        onClick={handleConfirmDeleteAll}>Confirm
                </button>
                <button id={"cancelDeleteAllButton"} data-testid={"cancelDeleteAllButton"}
                        onClick={() => setShowDeleteAllModal(false)}>Close
                </button>
            </div>)}
            {/*Edward:*/}

            {/*Display error message*/}
            {/*{hasError && (*/}
            {/*    <div>*/}
            {/*        <p>{errorMessage}</p>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/*The displayed field of result*/}

            <div>
                <h2>Favorite:</h2>
                <div className="fav-result">
                    {searchResults.map((result, index) => (
                        <div key={index} className="favoriteResultDiv"
                             onMouseEnter={() => handleParkHover(result)}
                             onMouseLeave={() => handleParkMouseLeave(result)}>
                            <h3>
                                            <span tabIndex={0} onKeyDown={(e) => handleKeyDown(e, handleParkClick, result)}
                                                onClick={() => handleParkClick(result)}> Park: {result.fullName}</span>
                                {(isMobile || (hoveredPark && hoveredPark.fullName === result.fullName)) && (
                                    <button onClick={() => handletrueShowCancelModal(index)}
                                            data-testid="deletefromfav"
                                            className="deleteButton">-</button>)}
                                {ifshowCancelModel(index) && (
                                    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px'}}>
                                        <p>Are you sure you want to delete?</p>
                                        <button className={"confirmDeleteButton"} data-testid = {"confirm"} onClick={() => deletefromFavorites(index)}>Confirm</button>
                                        <button className={"cancelDeleteButton"} data-testid = {"close"} onClick={() => handlefalseShowCancelModal(index)}>Cancel</button>
                                    </div>
                                )}
                                {(isMobile || (hoveredPark && hoveredPark.fullName === result.fullName)) && (
                                    <button onClick={() => rankupFavorites(index)} data-testid="rankupfav"
                                            className="upButton">&#8593;</button>)}
                                {(isMobile || (hoveredPark && hoveredPark.fullName === result.fullName)) && (
                                    <button onClick={() => rankdownFavorites(index)}
                                            data-testid="rankdownfav"
                                            className="downButton">&#8595;</button>)}
                            </h3>
                        </div>))}
                </div>
            </div>


            {/*Show its loading*/}
            {isLoading && (<div>
                <p>Content Loading...</p>
            </div>)}
            <ParkDetails
                park={selectedPark}
                onClose={() => setSelectedPark(null)}

            />
        </div>

    );
};

export default FavoritePage;
