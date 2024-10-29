import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Adjust the import based on your file structure

const container = document.getElementById('root'); // Ensure this matches your HTML
const root = createRoot(container); // Create a root.

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
