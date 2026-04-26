import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyticsAPI = {
  getTopContent: () => apiClient.get('/analytics/top-content'),
  getTopPlatform: () => apiClient.get('/analytics/top-platform'),
  getTopAudience: () => apiClient.get('/analytics/top-audience'),
  getBestTime: () => apiClient.get('/analytics/best-time'),
  getTopBrands: () => apiClient.get('/analytics/top-brands'),
  getEngagementRate: () => apiClient.get('/analytics/engagement-rate'),
  getConversionRate: () => apiClient.get('/analytics/conversion-rate'),
};

export const insightsAPI = {
  getInsights: () => apiClient.get('/insights'),
};

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
};
