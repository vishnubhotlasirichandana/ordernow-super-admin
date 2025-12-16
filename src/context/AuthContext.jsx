import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have user data persisted (The actual auth check happens via cookie on API calls)
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Calls POST /api/auth/admin/login
      const res = await api.post('/auth/admin/login', { email, password });
      
      // Save non-sensitive user info
      localStorage.setItem('adminData', JSON.stringify(res.data.data));
      setAdmin(res.data.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Clear backend cookie
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem('adminData');
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};