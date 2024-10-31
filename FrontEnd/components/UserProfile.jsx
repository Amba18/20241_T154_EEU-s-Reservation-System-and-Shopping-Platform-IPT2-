import React from "react";
import './indexUser.css';

function UserProfile() {
    return (
        <div>
            <div className="upper-navbar">
                <div className="eeu">
                    <h3>EEU</h3>
                </div>
                <div className="search">
                    <input type="text" placeholder="Search....." className="search-bar" />                    
                </div>
                <button className="search-button">Search</button>
                <header className="upper-navbar-a">
                    <ul>Cart</ul>
                    <ul>Notification</ul>
                    <ul>Profile</ul>
                </header>

            </div>

            <div className="side-navbar">  
                <h5>Japet Enoy</h5>
                              
                <ul className="side-navbar-a">
                    <li>Account</li>
                    <li>Purchase</li>
                    <li>Notification</li>
                </ul>
            </div>

            <div className="content">
                <div className="content-1">
                    <h3>My Profile</h3>
                    <p>Username:</p>
                    <p>Email:</p>
                    <p>Password:</p>
                </div>
                <button>Logout</button>                
            </div>

            <div className="content-2">
                <p>Japet Enoy</p>
                <p>22011093131@student.up.edu.ph</p>
                <p>japetdapogi</p>
            </div>

        </div>

    );
}

export default UserProfile;