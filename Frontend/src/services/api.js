import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const verifyToken = async (token) => {
  const response = await api.get('/auth/verify', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Risk endpoints
export const getRisks = async (params) => {
  const response = await api.get('/api/risks', { params });
  return response.data;
};

export const getRiskById = async (id) => {
  const response = await api.get(`/api/risks/${id}`);
  return response.data;
};

export const createRisk = async (riskData) => {
  const response = await api.post('/api/risks', riskData);
  return response.data;
};

export const updateRisk = async (id, riskData) => {
  const response = await api.put(`/api/risks/${id}`, riskData);
  return response.data;
};

export const deleteRisk = async (id) => {
  const response = await api.delete(`/api/risks/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/api/stats');
  return response.data;
};

export const exportCSV = async () => {
  const response = await api.get('/api/export/csv', { responseType: 'blob' });
  return response.data;
};

// AI endpoints (through backend)
export const getAIDescription = async (riskId) => {
  const response = await api.post(`/api/risks/${riskId}/ai/describe`);
  return response.data;
};

export const getAIRecommendations = async (riskId) => {
  const response = await api.post(`/api/risks/${riskId}/ai/recommend`);
  return response.data;
};

export const askAIQuery = async (riskId, question) => {
  const response = await api.post(`/api/risks/${riskId}/ai/query`, { question });
  return response.data;
};

export const getStreamingReport = (params) => {
  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}/api/reports/stream?${new URLSearchParams(params)}`;
  return new EventSource(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default api;