// axiosClient.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or use Redux if needed

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
