import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Homepage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
        } else {
            // Retrieve user data (for simplicity, just using localStorage here)
            const userData = JSON.parse(localStorage.getItem('user')); // Assuming you saved user data as a JSON string
            if (userData) {
                setUser(userData); // Set user data if it exists
            }
        }
    }, [navigate]);

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#191E4C' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="path_to_logo.png" alt="Logo" style={{ height: '40px' }} /> {/* Replace with your logo path */}
                    </a>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav" 
                        aria-controls="navbarNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <form className="d-flex mx-auto" style={{ width: '50%' }}>
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Search" 
                                aria-label="Search" 
                            />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Cart</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Notifications</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Profile</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {user ? (
                <h1>Welcome, {user.firstName}!</h1> // Display the user's first name
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={() => {
                localStorage.removeItem('token'); // Log out by removing the token
                localStorage.removeItem('user'); // Also remove user data on logout
                navigate('/login');
            }}>
                Log Out
            </button>
        </div>
    );
}

export default Homepage;
