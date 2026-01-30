const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Weather API endpoint
app.get('/api/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const API_KEY = process.env.WEATHER_API_KEY;
    
    console.log(`Fetching weather for: ${location}`);
    
    if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
      return res.status(400).json({ 
        error: 'API key not configured. Please add your OpenWeatherMap API key to the .env file.' 
      });
    }
    
    // Using OpenWeatherMap API
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    );
    
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
    );

    res.json({
      current: weatherResponse.data,
      forecast: forecastResponse.data
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
    
    let errorMessage = 'Failed to fetch weather data';
    if (error.response?.status === 401) {
      errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
    } else if (error.response?.status === 404) {
      errorMessage = 'City not found. Please check the spelling and try again.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.response?.data?.message || error.message
    });
  }
});

// Weather by coordinates endpoint
app.get('/api/weather/coords/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const API_KEY = process.env.WEATHER_API_KEY;
    
    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
    
    if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
      return res.status(400).json({ 
        error: 'API key not configured. Please add your OpenWeatherMap API key to the .env file.' 
      });
    }
    
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    res.json({
      current: weatherResponse.data,
      forecast: forecastResponse.data
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
    
    let errorMessage = 'Failed to fetch weather data';
    if (error.response?.status === 401) {
      errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.response?.data?.message || error.message
    });
  }
});

// Test endpoint to check API key
app.get('/api/test', (req, res) => {
  const API_KEY = process.env.WEATHER_API_KEY;
  res.json({
    message: 'Server is running',
    apiKeyConfigured: !!API_KEY && API_KEY !== 'your_openweathermap_api_key_here',
    apiKeyPreview: API_KEY ? API_KEY.substring(0, 8) + '...' : 'Not set'
  });
});

// Reverse geocoding endpoint to get location name from coordinates
app.get('/api/location/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const API_KEY = process.env.WEATHER_API_KEY;
    
    console.log(`Getting location name for coordinates: ${lat}, ${lon}`);
    
    if (!API_KEY) {
      return res.status(400).json({ error: 'API key not configured' });
    }
    
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ error: 'Failed to get location name' });
  }
});

// Debug endpoint to check coordinates
app.get('/api/debug/coords/:lat/:lon', (req, res) => {
  const { lat, lon } = req.params;
  const vizLat = 18.1167;
  const vizLon = 83.4167;
  const vepadaLat = 18.2;
  const vepadaLon = 83.5;
  
  const vizDistance = Math.sqrt(Math.pow(parseFloat(lat) - vizLat, 2) + Math.pow(parseFloat(lon) - vizLon, 2));
  const vepadaDistance = Math.sqrt(Math.pow(parseFloat(lat) - vepadaLat, 2) + Math.pow(parseFloat(lon) - vepadaLon, 2));
  
  res.json({
    inputCoordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
    distances: {
      toVizianagaram: vizDistance,
      toVepada: vepadaDistance
    },
    estimatedLocation: vepadaDistance < 0.3 ? 'Vepada area' : vizDistance < 1.0 ? 'Vizianagaram district' : 'Outside known area',
    note: 'This is based on approximate coordinates for Vepada'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API key configured: ${process.env.WEATHER_API_KEY ? 'Yes' : 'No'}`);
});
