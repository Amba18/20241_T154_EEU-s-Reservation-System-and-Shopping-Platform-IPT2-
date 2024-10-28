import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const userData = {
            email,
            password,
        };
        try {
            const response = await fetch('http://localhost:3000/api/Customer', { // Ensure this matches your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });                     

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed.'); 
            }
            const data = await response.json();
            setSuccess('Login successful');
            console.log('Login successful:', data);

            // Navigate to Homepage on successful login
            navigate('/Homepage.jsx'); // Change this to your actual homepage route

        } catch (err) {
            console.error('Error during login:', err);
            setError(err.message || 'An error occurred. Please try again.');
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default Login;
