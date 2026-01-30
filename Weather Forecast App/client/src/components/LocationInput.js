import React, { useState } from 'react';

const LocationInput = ({ onLocationSubmit, onLocationDetect, loading }) => {
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onLocationSubmit(location.trim());
    }
  };

  return (
    <div className="location-input">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name (e.g., London, New York)"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !location.trim()}
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
      </form>
      
      <button 
        onClick={onLocationDetect}
        className="btn btn-secondary"
        disabled={loading}
      >
        📍 Use My Location
      </button>
    </div>
  );
};

export default LocationInput;