// axiosConfig.js
import axios from 'axios';

// Retrieve the token from localStorage
const jwtToken = localStorage.getItem('jwtToken');

// Set up the default Authorization header for axios
if (jwtToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
}

export default axios;
