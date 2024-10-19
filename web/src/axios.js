import axios from 'axios';

// Function to retrieve cookies by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null; // Return null if the cookie is not found
}

// Create axios instance with custom configuration
const client = axios.create({
  baseURL: 'http://localhost:8000',  // Set this to your FastAPI server URL
  withCredentials: true,  // Include credentials in requests (useful for cookies or sessions)
  headers: {
    'Access-Control-Allow-Credentials': true,  // Allow credentials to be passed in cross-origin requests
    'ngrok-skip-browser-warning': true,  // Custom header for bypassing ngrok warning
    Authorization: `Bearer ${getCookie('accessToken')}`,  // Set Bearer token using a cookie value
  },
});

// Export the axios instance for use in API requests
export default client;
