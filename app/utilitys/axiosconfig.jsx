import axios from 'axios';

const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:5000",
withCredentials: true,
});

export default api