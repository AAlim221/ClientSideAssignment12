import axios from 'axios';

// Create an instance of axios
const AxiosSecure = axios.create({
  baseURL: 'http://localhost:3000', // Your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});
export default AxiosSecure;