import axios from 'axios';

// Create an instance of axios
const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in the headers
axiosSecure.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Returning the config to continue the request
    return config;
  },
  (error) => {
    // If any error occurs while adding the token, reject the request
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor to handle token expiration
axiosSecure.interceptors.response.use(
  (response) => {
    // If response is valid, simply return it
    return response;
  },
  async (error) => {
    // If the error is due to authorization (e.g., token expired), handle it
    if (error.response && error.response.status === 401) {
      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Attempt to refresh the access token using the refresh token
          const refreshResponse = await axios.post('http://localhost:3000/api/refresh-token', { refreshToken });

          // If refresh was successful, update the token in localStorage
          const newToken = refreshResponse.data.accessToken;
          localStorage.setItem('authToken', newToken);

          // Retry the original request with the new token
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(error.config); // Retry the failed request with the new token
        } catch {
          // If the refresh token also fails (e.g., expired or invalid), redirect to login
          console.error('Token refresh failed, redirecting to login');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Redirect to login page
        }
      } else {
        console.error('No refresh token available, redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login page if no refresh token is found
      }
    }

    // If the error is not related to authorization, just reject the promise
    return Promise.reject(error);
  }
);

export default axiosSecure;
