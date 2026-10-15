import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shopping-backend-te3w.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Bearer token to all outgoing requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('velora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
