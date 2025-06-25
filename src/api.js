import axios from 'axios';

// Get the API base URL from environment variables, with a fallback for local development
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Create an Axios instance with the base URL configured
const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
