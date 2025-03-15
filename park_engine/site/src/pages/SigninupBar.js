import React from 'react';

const SigninupBar = () => {
    return (
        <div style={styles.navBar}>
            <div><header>Let&apos;s Go Camping!<span style = {{marginRight : '20px'}}></span><teamnumber>35</teamnumber></header></div>
            <div style={styles.navItems}>
                <a href={"/LoginPage"} id={"logInPageButton"} style={styles.navLink}>Log in</a>
                <a href={"/SignupPage"} id={"signUpPageButton"} style={styles.navLink}>Sign up</a>
            </div>
        </div>
    );
};

const styles = {
    navBar: {
        backgroundColor: 'green',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navItems: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Allow items to wrap to the next line
    },
    navLink: {
        marginLeft: '1rem',
        color: 'white',
        textDecoration: 'none',
    },
};

export default SigninupBar;