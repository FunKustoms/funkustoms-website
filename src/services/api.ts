import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getUsers: () => api.get('/auth/admin/users'),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (data: unknown) => api.post('/products', data),
};

export const ordersAPI = {
  create: (data: unknown) => api.post('/orders', data),
  getUserOrders: (userId: string) => api.get(`/orders/user/${userId}`),
  getAllOrders: () => api.get('/orders/admin/all'),
  updateOrder: (id: string, data: unknown) => api.put(`/orders/${id}`, data),
};

export const customizationsAPI = {
  create: (data: unknown) => api.post('/customizations', data),
  getUserCustomizations: (userId: string) => api.get(`/customizations/user/${userId}`),
  getAllCustomizations: () => api.get('/customizations/admin/all'),
  updateCustomization: (id: string, data: unknown) => api.put(`/customizations/${id}`, data),
};

export const usersAPI = {
  getAll: () => api.get('/auth/admin/users'),
};

export default api;
