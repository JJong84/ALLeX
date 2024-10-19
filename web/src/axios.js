import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // Adjust this to your FastAPI server's base URL
});

export default instance;
