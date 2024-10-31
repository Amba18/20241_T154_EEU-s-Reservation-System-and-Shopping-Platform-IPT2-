import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login.jsx';
import Signup from './components/Singup.jsx';

const App = () => {
  const [Customer, setCustomer] = useState([]);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/Customer");
      if (!response.ok) {
        throw new Error('Network response was not okay');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  return (
    <Router>
      <div className="container text-center" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="mb-4">Welcome to Economic Enterprise Unit</h1>
        <p className="mb-4">Sign up now or log in to browse such amazing products</p>
        <div>
          <Link to="/signup">
            <button className="btn btn-primary m-2">Signup</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-secondary m-2">Login</button>
          </Link>
        </div>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
