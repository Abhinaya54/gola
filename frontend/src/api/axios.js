import axios from 'axios';

const API = axios.create({
  // Prefer environment variable. When not set, default to deployed backend
  // and include the /api prefix so routes resolve correctly.
  baseURL:
    process.env.REACT_APP_API_URL || 'https://backend-care-ten.vercel.app/api' || 'http://localhost:5000/api',
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
