import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, serviceArea) =>
    api.post('/auth/register', { name, email, password, serviceArea }),
  getMe: () => api.get('/auth/me'),
};

export const ticketAPI = {
  powerAlert: (deviceId, location, lat, lng) =>
    api.get('/ticket/poweralert', { params: { deviceId, location, lat, lng } }),
  startWork: (ticketId) => api.post('/ticket/start', { ticketId }),
  stopWork: (ticketId) => api.post('/ticket/stop', { ticketId }),
  resolveTicket: (ticketId, notes) => api.post('/ticket/resolve', { ticketId, notes }),
  getAssignedTickets: () => api.get('/ticket/assigned'),
  getTicketDetail: (ticketId) => api.get(`/ticket/detail/${ticketId}`),
  getAllTickets: (status, page, limit) =>
    api.get('/ticket/all', { params: { status, page, limit } }),
};

export const adminAPI = {
  createUser: (name, email, password, role, serviceArea) =>
    api.post('/admin/create-user', { name, email, password, role, serviceArea }),
  getTechnicians: () => api.get('/admin/technicians'),
  getAnalytics: () => api.get('/admin/analytics'),
  getLogs: () => api.get('/admin/logs'),
  getUserStats: () => api.get('/admin/stats'),
};

export default api;
