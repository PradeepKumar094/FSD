import React from 'react';

const WeatherDisplay = ({ weatherData }) => {
  const { current, forecast } = weatherData;

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeatherEmoji = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('thunderstorm')) return '⛈️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    if (conditionLower.includes('haze')) return '🌫️';
    return '🌤️';
  };

  // Get next 5 days forecast (one per day)
  const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

  // Format location name to show coordinates if available
  const getLocationDisplay = () => {
    const { name, sys, coord } = current;
    let locationText = `${name}, ${sys.country}`;
    
    // If coordinates are available, show them for reference
    if (coord) {
      locationText += ` (${coord.lat.toFixed(4)}, ${coord.lon.toFixed(4)})`;
    }
    
    return locationText;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  // Clean Weather Icon Component - Just emojis, no boxes
  const WeatherIcon = ({ condition, size = 'medium', className = '' }) => {
    const emoji = getWeatherEmoji(condition);
    
    const sizeStyles = {
      small: { 
        fontSize: '3.5rem'
      },
      medium: { 
        fontSize: '5rem'
      },
      large: { 
        fontSize: '7rem'
      }
    };

    return (
      <div 
        className={`weather-icon ${className}`}
        style={{
          ...sizeStyles[size],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.2)';
          e.target.style.filter = 'drop-shadow(0 8px 25px rgba(0,0,0,0.4))';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.filter = 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))';
        }}
      >
        {emoji}
      </div>
    );
  };

  return (
    <div className="weather-display">
      {/* Current Weather */}
      <div className="current-weather">
        <div className="weather-main">
          <div className="temperature">
            {Math.round(current.main.temp)}°C
          </div>
          <div className="weather-info">
            <h2>📍 {getLocationDisplay()}</h2>
            <p>{getWeatherEmoji(current.weather[0].main)} {current.weather[0].description}</p>
            <p>🌡️ Feels like {Math.round(current.main.feels_like)}°C</p>
          </div>
          <WeatherIcon 
            condition={current.weather[0].main}
            size="large"
          />
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <h4>💧 Humidity</h4>
            <p>{current.main.humidity}%</p>
          </div>
          <div className="detail-item">
            <h4>💨 Wind Speed</h4>
            <p>{current.wind.speed} m/s</p>
            <small>{getWindDirection(current.wind.deg)} ({current.wind.deg}°)</small>
          </div>
          <div className="detail-item">
            <h4>🌡️ Pressure</h4>
            <p>{current.main.pressure} hPa</p>
          </div>
          <div className="detail-item">
            <h4>👁️ Visibility</h4>
            <p>{(current.visibility / 1000).toFixed(1)} km</p>
          </div>
          <div className="detail-item">
            <h4>🌅 Sunrise</h4>
            <p>{formatTime(current.sys.sunrise)}</p>
          </div>
          <div className="detail-item">
            <h4>🌇 Sunset</h4>
            <p>{formatTime(current.sys.sunset)}</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="forecast">
        <h3>📅 5-Day Forecast</h3>
        <div className="forecast-grid">
          {dailyForecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <h4>{index === 0 ? '🔥 Today' : formatDate(day.dt)}</h4>
              <WeatherIcon 
                condition={day.weather[0].main}
                size="small"
              />
              <div className="forecast-temp">
                {Math.round(day.main.temp)}°C
              </div>
              <p>{getWeatherEmoji(day.weather[0].main)} {day.weather[0].description}</p>
              <small>
                🔺 {Math.round(day.main.temp_max)}° 🔻 {Math.round(day.main.temp_min)}°
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;