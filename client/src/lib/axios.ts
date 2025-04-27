import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // or your static API base URL
    withCredentials: true, // 👈 IMPORTANT for cookies to work
});

export default instance;
