# Weather Forecast Website

A modern weather forecast web application built with React.js and Node.js that provides real-time weather data and 5-day forecasts.

## Features

- 🌤️ Real-time weather data
- 📅 5-day weather forecast
- 📍 Automatic location detection
- 🔍 Manual location search
- 📱 Responsive design
- 🎨 Modern UI with glassmorphism effects

## Tech Stack

- **Frontend**: React.js, CSS3
- **Backend**: Node.js, Express.js
- **API**: OpenWeatherMap API
- **HTTP Client**: Axios

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free at https://openweathermap.org/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-forecast-app.git
   cd weather-forecast-app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   - Copy `.env.example` to `.env` and add your OpenWeatherMap API key:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` file:
   ```
   WEATHER_API_KEY=your_openweathermap_api_key_here
   PORT=5000
   ```

5. **Get your API key**
   - Visit https://openweathermap.org/api
   - Sign up for a free account
   - Generate an API key
   - Replace `your_openweathermap_api_key_here` in the `.env` file

### Running the Application

#### Development Mode (Recommended)

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- React frontend on http://localhost:3000

#### Production Mode

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

### Individual Commands

- **Backend only**: `npm run server`
- **Frontend only**: `npm run client`
- **Build frontend**: `npm run build`

## API Endpoints

- `GET /api/weather/:location` - Get weather by city name
- `GET /api/weather/coords/:lat/:lon` - Get weather by coordinates

## Usage

1. **Automatic Location**: Click "Use My Location" to get weather for your current location
2. **Manual Search**: Enter a city name and click "Get Weather"
3. **View Data**: See current weather conditions and 5-day forecast

## Project Structure

```
weather-forecast-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LocationInput.js
│   │   │   └── WeatherDisplay.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── server.js              # Express backend
├── package.json           # Backend dependencies
├── .env                   # Environment variables
└── README.md
```

## Features Explained

### Location Detection
- Uses browser's Geolocation API
- Fallback to manual input if location access denied
- Supports both city names and coordinates

### Weather Display
- Current temperature and conditions
- Detailed metrics (humidity, wind, pressure, visibility)
- 5-day forecast with daily highs and lows
- Weather icons from OpenWeatherMap

### Responsive Design
- Mobile-friendly interface
- Glassmorphism UI effects
- Smooth animations and transitions

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your OpenWeatherMap API key is valid and added to `.env`
2. **Location Access Denied**: Use manual city input instead
3. **CORS Issues**: Ensure backend is running on port 5000
4. **City Not Found**: Try different spelling or include country code (e.g., "London,UK")

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use this project for learning and development purposes.