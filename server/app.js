import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import customerRoute from './routes/customerRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Set 3000 as default

// CORS options
const corsOptions = {
    origin: "http://localhost:3001", // Allow requests from your frontend
    credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions)); // Use the CORS middleware with options

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/Customer', customerRoute); // Correct route to match your controller

// MongoDB Connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB); // No options needed
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

// MongoDB Event Listeners
mongoose.connection.on('disconnected', () => {
    console.log("Disconnected from MongoDB");
});

// Start Server and Connect to MongoDB
app.listen(port, () => {
    connect(); // Connect to MongoDB when server starts
    console.log(`Server running on PORT ${port}`);
});
