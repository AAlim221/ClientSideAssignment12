import axios from 'axios';

// Create an instance of axios
const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000', // Make sure this matches your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in the headers
axiosSecure.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or sessionStorage)
    const token = localStorage.getItem('authToken'); // Change this if you're using a different storage method
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosSecure;
