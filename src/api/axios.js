import axios from 'axios';

// Create an axios instance
const api = axios.create({
  // Use the Environment Variable so it works on Vercel
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ FIX: Only redirect to login if we are NOT already on the login page
    // This prevents the "Invalid Credentials" error from refreshing the page
    if (error.response && error.response.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;