import React from 'react';

const NavigationBar = () => {
    return (
        <div style={styles.navBar}>
            <div><subheader>Let&apos;s Go Camping!<span style = {{marginRight : '20px'}}></span><teamnumber>35</teamnumber></subheader></div>
            <div style={styles.navItems}>
                <a href={"/LoginPage"} id={"logOutButton"} style={styles.navLink}>Logout</a>
                <a href={"/SearchPage"} id={"searchPageButton"} style={styles.navLink}>Search</a>
                <a href={"/FavoritePage"} id={"favoritePageButton"} style={styles.navLink}>Favorite</a>
                <a href={"/ComparePage"} id={"comparePageButton"} style={styles.navLink}>Compare</a>
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

export default NavigationBar;