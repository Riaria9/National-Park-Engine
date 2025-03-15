import React, {useEffect, useState} from "react";
import SigninupBar from './SigninupBar';


function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [fetchResponse, handleFetchResponse] = useState('');

    useEffect(() => {
        // Your code to run when the component is mounted
        sessionStorage.clear();
        // You can perform any action here, such as fetching data or setting state
    }, []); // empty dependency array ensures the effect runs only once

    const handleSubmit = async (e) => {
        e.preventDefault();

        fetch("/login", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                username: username, password: password
            })
        })
            .then((response) => response.json())
            .then((response) => {
                handleFetchResponse(response.message);
                if (response.message === "Login successful") {
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("privacyStatus", response.privacyStatus);
                    window.location.href = '/SearchPage';
                }
            })
    }

    return (<div>
        <SigninupBar/>
        <div>Login Page</div>
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
            <button id="Login" type="submit" data-testid="login-button">Login</button>
        </form>
        {fetchResponse ? <div><p id="information">{fetchResponse}</p></div> : null}
        {/*<a href={"/SignupPage"}>Sign Up</a>*/}
    </div>);
}

export default LoginPage;