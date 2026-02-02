/**
 * NoirQR - API Client
 * Все API вызовы в одном месте
 */

import axios from 'axios';

// Используем переменную окружения, fallback на localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ADMIN_TOKEN = 'test-admin-123';

console.log('API_URL:', API_URL);

// Настройка axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Добавляем auth token в заголовки если он есть
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ AUTH ============

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error.response?.data || error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.response?.data || error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await api.post('/api/auth/verify', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error.response?.data || error;
  }
};

// ============ VENUES ============

// GET user's venues (authenticated)
export const getUserVenues = async () => {
  try {
    const response = await api.get('/api/admin/venues');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user venues:', error);
    return [];
  }
};

export const getVenues = async () => {
  try {
    const response = await api.get('/api/venues');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
};

export const getVenueBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/venue/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching venue:', error);
    throw error;
  }
};

export const createVenue = async (data) => {
  try {
    const response = await api.post('/api/admin/venue', data, {
      headers: { 'x-admin-token': ADMIN_TOKEN },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

export const updateVenue = async (venueId, data) => {
  try {
    const response = await api.put(
      `/api/admin/venue/${venueId}`,
      data,
      { headers: { 'x-admin-token': ADMIN_TOKEN } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating venue:', error);
    throw error;
  }
};

export const deleteVenue = async (venueId) => {
  try {
    const response = await api.delete(
      `/api/admin/venue/${venueId}`,
      { headers: { 'x-admin-token': ADMIN_TOKEN } }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting venue:', error);
    throw error;
  }
};

// ============ MENU ITEMS ============

export const getMenuItems = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/api/venue/${slug}/menu`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const createMenuItem = async (venueId, data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/venue/${venueId}/menu-item`,
      data,
      { headers: { 'x-admin-token': ADMIN_TOKEN } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (itemId, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/admin/menu-item/${itemId}`,
      data,
      { headers: { 'x-admin-token': ADMIN_TOKEN } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (venueId, itemId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/admin/menu-item/${venueId}/${itemId}`,
      { headers: { 'x-admin-token': ADMIN_TOKEN } }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// ============ QR CODE ============

export const getQRCode = async (venueId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/venue/${venueId}/qr`,
      { headers: { 'x-admin-token': ADMIN_TOKEN } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    throw error;
  }
};

// ============ ORDERS ============

export const createOrder = async (slug, orderData) => {
  try {
    const response = await axios.post(`${API_URL}/api/order`, {
      slug,
      ...orderData,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/orders`, {
      headers: { 'x-admin-token': ADMIN_TOKEN },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const getVenueOrders = async (venueId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/venue/${venueId}/orders`,
      { headers: { 'x-admin-token': ADMIN_TOKEN } }
    );
    return response.data || [];
  } catch (error) {
    console.error('Error fetching venue orders:', error);
    return [];
  }
};

// ============ FILE UPLOAD ============

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error.response?.data || error;
  }
};
