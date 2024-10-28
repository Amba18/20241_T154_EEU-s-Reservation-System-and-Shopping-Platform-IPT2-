import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
        } else {
            // Optional: fetch user data using the token or set a placeholder
            setUser({ username: "Sample User" }); // Set a placeholder user for now
        }
    }, [navigate]);

    return (
        <div>
            {user ? (
                <h1>Welcome, {user.username}!</h1>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={() => {
                localStorage.removeItem('token'); // Log out by removing the token
                navigate('/login');
            }}>
                Log Out
            </button>
        </div>
    );
}

export default Homepage;
