// Simple test script to verify the weather API endpoints
const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('Testing weather API...');
    
    // Test with a demo city
    const response = await axios.get('http://localhost:5000/api/weather/London');
    console.log('✅ API Response received');
    console.log('Current weather:', response.data.current.weather[0].description);
    console.log('Temperature:', Math.round(response.data.current.main.temp) + '°C');
    console.log('Location:', response.data.current.name);
    
  } catch (error) {
    console.log('❌ API Test failed:', error.message);
    console.log('Make sure:');
    console.log('1. Server is running (npm run server)');
    console.log('2. API key is set in .env file');
    console.log('3. Internet connection is available');
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;