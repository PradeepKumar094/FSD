import React, { useState, useEffect } from 'react';
import './App.css';
import './backgrounds.css';
import WeatherDisplay from './components/WeatherDisplay';
import LocationInput from './components/LocationInput';
import axios from 'axios';
import backgroundImage from './assets/weather-bg.png';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationInfo, setLocationInfo] = useState(null);
  const [backgroundTheme, setBackgroundTheme] = useState('bg-clear-sky');

  const getWeatherBackground = (weatherCondition) => {
    if (!weatherCondition) return 'bg-clear-sky';
    
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes('clear')) return 'weather-clear';
    if (condition.includes('cloud')) return 'weather-clouds';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'weather-rain';
    if (condition.includes('snow')) return 'weather-snow';
    if (condition.includes('thunderstorm')) return 'weather-thunderstorm';
    if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'weather-mist';
    
    return 'bg-clear-sky';
  };

  const fetchWeatherByLocation = async (location) => {
    setLoading(true);
    setError('');
    setLocationInfo(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/weather/${location}`);
      setWeatherData(response.data);
      
      // Update background based on weather
      const weatherCondition = response.data.current.weather[0].main;
      setBackgroundTheme(getWeatherBackground(weatherCondition));
    } catch (err) {
      setError('Failed to fetch weather data. Please check the location and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      // Store the detected coordinates
      setLocationInfo({
        detectedLat: lat,
        detectedLon: lon,
        source: 'Browser Geolocation API'
      });
      
      const response = await axios.get(`http://localhost:5000/api/weather/coords/${lat}/${lon}`);
      setWeatherData(response.data);
      
      // Update background based on weather
      const weatherCondition = response.data.current.weather[0].main;
      setBackgroundTheme(getWeatherBackground(weatherCondition));
    } catch (err) {
      setError('Failed to fetch weather data for your location.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      console.log('Requesting location with high accuracy...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Location detected:', {
            latitude,
            longitude,
            accuracy: accuracy + ' meters',
            timestamp: new Date(position.timestamp).toLocaleString()
          });
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to retrieve your location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access was denied.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
              break;
          }
          setError(errorMessage + ' Please enter a city manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    // Try to get user's location on app load
    getCurrentLocation();
  }, []);

  // Inline style for background image
  const appStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    position: 'relative'
  };

  return (
    <div className={`App ${backgroundTheme}`} style={appStyle}>
      <header className="App-header">
        <h1>Weather Forecast</h1>
        <LocationInput 
          onLocationSubmit={fetchWeatherByLocation}
          onLocationDetect={getCurrentLocation}
          loading={loading}
        />
        {error && <div className="error-message">{error}</div>}
        {locationInfo && (
          <div className="location-debug" style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '10px',
            borderRadius: '10px',
            margin: '10px 0',
            fontSize: '14px'
          }}>
            <strong>🔍 Detected Coordinates:</strong><br/>
            Latitude: {locationInfo.detectedLat}<br/>
            Longitude: {locationInfo.detectedLon}<br/>
            Source: {locationInfo.source}
          </div>
        )}
        {weatherData && <WeatherDisplay weatherData={weatherData} />}
      </header>
    </div>
  );
}

export default App;
