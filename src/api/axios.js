import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // MATCHES YOUR BACKEND .ENV PORT
  withCredentials: true, // MANDATORY: Sends the HttpOnly cookie for auth
});

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized, backend cookie is likely invalid/expired
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;