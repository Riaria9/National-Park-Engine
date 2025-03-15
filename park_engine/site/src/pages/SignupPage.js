import React, {useEffect, useState} from 'react';
import SigninupBar from './SigninupBar';

function SignupPage(key, value) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        // Your code to run when the component is mounted
        sessionStorage.clear();
        // You can perform any action here, such as fetching data or setting state
    }, []); // empty dependency array ensures the effect runs only once

    const handleCancelClick = async () => {
        // Show the cancel confirmation modal
        setShowCancelModal(true);
    };

    const handleCloseCancelModal = async () => {
        // Hide the cancel confirmation modal without doing anything else
        setShowCancelModal(false);
    };

    const handleConfirmCancel =async () => {
        // Redirect to the sign-in page
        setShowCancelModal(false); // Close the modal
        window.location.href = '/LoginPage'; // Change to your sign-in page URL
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            let errorMessage = 'Password must contain at least:';
            if (!hasUpperCase) errorMessage += ' 1 uppercase letter,';
            if (!hasLowerCase) errorMessage += ' 1 lowercase letter,';
            if (!hasNumbers) errorMessage += ' 1 number.';
            errorMessage = errorMessage.replace(/,$/, '.');
            setError(errorMessage);
            return;
        }


        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then((response) => response.json())
            .then((response) => {
                setError(response.message);
                if (response.message === "Signup successful") {
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("privacyStatus", "true");
                    window.location.href = '/SearchPage';
                }
            })
    };

    return (
        <div>
            <SigninupBar/>
            <div>Signup Page</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Confirm Password
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button data-testid={"signupbutton"} id="signup" type="submit">Sign Up</button>
            </form>
            <button id={"cancel"} data-testid = {"cancelbutton"} type="button" onClick={handleCancelClick}>Cancel</button>
            {showCancelModal && (
                <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px'}}>
                    <p>Are you sure you want to cancel?</p>
                    <button id={"confirm"} data-testid = {"confirm"} onClick={handleConfirmCancel}>Confirm</button>
                    <button id={"close"} data-testid = {"close"} onClick={handleCloseCancelModal}>Close</button>
                </div>
            )}
            {error ? <div><p id="information">{error}</p></div> : null}
        </div>
    );
}

export default SignupPage;
