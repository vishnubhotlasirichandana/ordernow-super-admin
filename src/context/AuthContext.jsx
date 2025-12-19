import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Calls POST /api/auth/admin/login
      const res = await api.post('/auth/admin/login', { email, password });
      
      // Save user info
      if (res.data?.data) {
        localStorage.setItem('adminData', JSON.stringify(res.data.data));
        setAdmin(res.data.data);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem('adminData');
      setAdmin(null);
      // Force redirect handled by ProtectedRoute or component
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};