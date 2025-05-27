// src/lib/api.js (or wherever your axios instance is)
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' // Direct to backend in development
    : "", // Use relative path in production (Vercel proxy)
  withCredentials: true,
});

export default api;