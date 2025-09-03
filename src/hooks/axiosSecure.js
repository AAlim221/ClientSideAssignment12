import axios from 'axios';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000', // Ensure this matches your backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosSecure;
