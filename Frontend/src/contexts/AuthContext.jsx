import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, verifyToken } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      verifyToken(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login with API URL:', import.meta.env.VITE_API_URL);
      const response = await loginApi(credentials);
      console.log('✅ Login response received:', response);
      const { token, ...userData } = response;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('❌ Login failed - Full error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Message:', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!token, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};