import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Import node-fetch for server-side HTTP requests
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import helmet from 'helmet';
import { dbconnect } from './config/database.config.js';
import path, { dirname } from 'path';
dbconnect();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ACCUWEATHER_API_KEY, ACCUWEATHER_LOCATION_KEY } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(helmet({
  crossOriginOpenerPolicy: {
    policy: 'same-origin', // Adjust this as per your needs. 'same-origin' is the most restrictive
  },
  crossOriginEmbedderPolicy: {
    policy: 'require-corp', // This setting allows cross-origin requests with proper headers
  },
}));

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// Weather Proxy Route
app.get('/api/weather', async (req, res) => {
  try {
    // Construct the URL to AccuWeather's API
    const weatherUrl = `http://api.accuweather.com/currentconditions/v1/${ACCUWEATHER_LOCATION_KEY}?apikey=${ACCUWEATHER_API_KEY}`;

    // Make the request to AccuWeather
    const weatherResponse = await fetch(weatherUrl);

    // Check if the response is successful
    if (!weatherResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch weather data from AccuWeather' });
    }

    // Parse the response as JSON
    const weatherData = await weatherResponse.json();

    // Send the weather data to the client
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Server error fetching weather data' });
  }
});

// Serve static files
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

app.get('*', (req, res) => {
  const indexFilePath = path.join(publicFolder, 'index.html');
  res.sendFile(indexFilePath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
