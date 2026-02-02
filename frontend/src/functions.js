/**
 * NoirQR - БАЗОВЫЕ ФУНКЦИИ
 * Центральное хранилище для всех утилит, API вызовов, хуков и хелперов
 * Используется во всех компонентах проекта
 */

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================
// 1. API SERVICE - ФУНКЦИИ ДЛЯ РАБОТЫ С СЕРВЕРОМ
// ============================================

/**
 * Создать новое заведение
 */
export const createVenue = async (venueData) => {
  try {
    const response = await axios.post(`${API_URL}/api/admin/venue`, venueData, {
      headers: { 'x-admin-token': 'test-admin-123' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

/**
 * Получить все заведения пользователя
 */
export const fetchVenues = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/venues`);
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

/**
 * Получить конкретное заведение
 */
export const fetchVenue = async (venueSlug) => {
  try {
    const response = await axios.get(`${API_URL}/api/venue/${venueSlug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching venue:', error);
    throw error;
  }
};

/**
 * Обновить заведение
 */
export const updateVenue = async (venueId, venueData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/admin/venue/${venueId}`,
      venueData,
      { headers: { 'x-admin-token': 'test-admin-123' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating venue:', error);
    throw error;
  }
};

/**
 * Удалить заведение
 */
export const deleteVenue = async (venueId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/admin/venue/${venueId}`,
      { headers: { 'x-admin-token': 'test-admin-123' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting venue:', error);
    throw error;
  }
};

/**
 * Получить меню заведения
 */
export const fetchMenu = async (venueId) => {
  try {
    const response = await axios.get(`${API_URL}/venues/${venueId}/menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};

/**
 * Получить меню по slug (для публичного просмотра)
 */
export const fetchMenuBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/menu/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu by slug:', error);
    throw error;
  }
};

/**
 * Обновить меню
 */
export const updateMenu = async (venueId, menuData) => {
  try {
    const response = await axios.put(`${API_URL}/venues/${venueId}/menu`, menuData);
    return response.data;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
};

/**
 * Добавить категорию в меню
 */
export const addCategory = async (venueId, categoryName) => {
  try {
    const response = await axios.post(`${API_URL}/venues/${venueId}/categories`, {
      name: categoryName,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Удалить категорию
 */
export const deleteCategory = async (venueId, categoryId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/venues/${venueId}/categories/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

/**
 * Добавить блюдо в меню
 */
export const addMenuItem = async (venueId, categoryId, itemData) => {
  try {
    const response = await axios.post(
      `${API_URL}/venues/${venueId}/categories/${categoryId}/items`,
      itemData
    );
    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

/**
 * Обновить блюдо
 */
export const updateMenuItem = async (venueId, categoryId, itemId, itemData) => {
  try {
    const response = await axios.put(
      `${API_URL}/venues/${venueId}/categories/${categoryId}/items/${itemId}`,
      itemData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

/**
 * Удалить блюдо
 */
export const deleteMenuItem = async (venueId, categoryId, itemId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/venues/${venueId}/categories/${categoryId}/items/${itemId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

/**
 * Получить QR код заведения
 */
export const fetchQRCode = async (venueId) => {
  try {
    const response = await axios.get(`${API_URL}/venues/${venueId}/qr`);
    return response.data;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    throw error;
  }
};

/**
 * Создать заказ
 */
export const createOrder = async (venueSlug, orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders/${venueSlug}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// ============================================
// 2. CUSTOM HOOKS - РЕАКТ ХУКИ ДЛЯ СОСТОЯНИЯ
// ============================================

/**
 * Хук для управления логин/регистрацией
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('noirqr_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('noirqr_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('noirqr_user');
  }, []);

  const isAuthenticated = !!user;

  return { user, login, logout, isAuthenticated };
};

/**
 * Хук для асинхронных запросов
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction(...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error.message || 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { loading, error, data, execute };
};

/**
 * Хук для управления заведениями пользователя
 */
export const useVenues = (userId) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVenues = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await fetchVenues(userId);
      setVenues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadVenues();
  }, [userId, loadVenues]);

  const addVenue = useCallback(
    async (venueData) => {
      try {
        const newVenue = await createVenue({ ...venueData, userId });
        setVenues((prev) => [...prev, newVenue]);
        return newVenue;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  const updateVenueData = useCallback(async (venueId, data) => {
    try {
      const updated = await updateVenue(venueId, data);
      setVenues((prev) =>
        prev.map((v) => (v.id === venueId ? updated : v))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const removeVenue = useCallback(async (venueId) => {
    try {
      await deleteVenue(venueId);
      setVenues((prev) => prev.filter((v) => v.id !== venueId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    venues,
    loading,
    error,
    addVenue,
    updateVenueData,
    removeVenue,
    reload: loadVenues,
  };
};

/**
 * Хук для управления меню
 */
export const useMenuManager = (venueId) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMenu = useCallback(async () => {
    if (!venueId) return;
    try {
      setLoading(true);
      const data = await fetchMenu(venueId);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    loadMenu();
  }, [venueId, loadMenu]);

  const addCategoryLocal = useCallback((categoryName) => {
    const newCategory = {
      id: generateId(),
      name: categoryName,
      items: [],
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, []);

  const removeCategoryLocal = useCallback((categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  }, []);

  const addItemToCategory = useCallback((categoryId, itemData) => {
    const newItem = {
      id: generateId(),
      ...itemData,
    };
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, newItem] }
          : cat
      )
    );
    return newItem;
  }, []);

  const removeItemFromCategory = useCallback((categoryId, itemId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
          : cat
      )
    );
  }, []);

  const updateItemInCategory = useCallback((categoryId, itemId, updates) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((i) =>
                i.id === itemId ? { ...i, ...updates } : i
              ),
            }
          : cat
      )
    );
  }, []);

  const saveMenuToServer = useCallback(async () => {
    if (!venueId) return;
    try {
      await updateMenu(venueId, { categories });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [venueId, categories]);

  return {
    categories,
    loading,
    error,
    addCategoryLocal,
    removeCategoryLocal,
    addItemToCategory,
    removeItemFromCategory,
    updateItemInCategory,
    saveMenuToServer,
    reload: loadMenu,
  };
};

/**
 * Хук для управления корзиной заказов (для публичного меню)
 */
export const useCart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prev) => prev.filter((x) => x.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((x) => (x.id === itemId ? { ...x, quantity } : x))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    itemCount: cart.length,
  };
};

// ============================================
// 3. УТИЛИТЫ - ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * Генерировать уникальный ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Создать URL slug из названия
 */
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Форматировать цену
 */
export const formatPrice = (price, currency = '₽') => {
  return `${parseFloat(price).toFixed(2)} ${currency}`;
};

/**
 * Проверить валидность email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Проверить мощность пароля
 */
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  return strength;
};

/**
 * Сгенерировать QR код URL
 */
export const generateQRCodeUrl = (venueSlug) => {
  const menuUrl = `${window.location.origin}/menu/${venueSlug}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    menuUrl
  )}`;
};

/**
 * Скопировать текст в буфер обмена
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Скачать изображение
 */
export const downloadImage = (imageUrl, filename) => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename || 'qr-code.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Форматировать дату
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Форматировать время
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Debounce функция
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle функция
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================
// 4. MOCK DATA - ТЕСТОВЫЕ ДАННЫЕ
// ============================================

/**
 * Создать mock заведение
 */
export const createMockVenue = (overrides = {}) => {
  return {
    id: generateId(),
    name: 'Кафе Льдинка',
    slug: 'icecafe',
    description: 'Лучшее кафе в городе с мороженым и кофе',
    address: 'ул. Пушкина, 42',
    phone: '+7 (999) 123-45-67',
    email: 'owner@icecafe.ru',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Создать mock категорию
 */
export const createMockCategory = (overrides = {}) => {
  return {
    id: generateId(),
    name: 'Напитки',
    items: [],
    ...overrides,
  };
};

/**
 * Создать mock блюдо
 */
export const createMockMenuItem = (overrides = {}) => {
  return {
    id: generateId(),
    name: 'Капучино',
    price: 150,
    description: 'Классический итальянский кофе с молочной пеной',
    imageUrl:
      'https://via.placeholder.com/300x200?text=Cappuccino',
    available: true,
    ...overrides,
  };
};

/**
 * Создать mock меню с категориями
 */
export const createMockMenu = () => {
  const drinksCategory = {
    ...createMockCategory({ name: '☕ Напитки' }),
    items: [
      createMockMenuItem({ name: 'Капучино', price: 150 }),
      createMockMenuItem({ name: 'Эспрессо', price: 100 }),
      createMockMenuItem({ name: 'Латте', price: 160 }),
    ],
  };

  const dessertCategory = {
    ...createMockCategory({ name: '🍰 Десерты' }),
    items: [
      createMockMenuItem({ name: 'Тирамису', price: 220 }),
      createMockMenuItem({ name: 'Панна-котта', price: 210 }),
    ],
  };

  return {
    categories: [drinksCategory, dessertCategory],
  };
};

/**
 * Создать mock пользователя
 */
export const createMockUser = (overrides = {}) => {
  return {
    id: generateId(),
    name: 'Иван Петров',
    email: 'ivan@example.com',
    role: 'owner',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Получить mock заказ
 */
export const createMockOrder = (overrides = {}) => {
  return {
    id: generateId(),
    items: [
      { name: 'Капучино', quantity: 2, price: 150 },
      { name: 'Тирамису', quantity: 1, price: 220 },
    ],
    totalPrice: 520,
    status: 'pending',
    customerName: 'Анон',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

// ============================================
// 5. ВАЛИДАЦИЯ - ФУНКЦИИ ДЛЯ ПРОВЕРКИ ДАННЫХ
// ============================================

/**
 * Валидировать данные заведения
 */
export const validateVenueData = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Название заведения обязательно';
  }
  if (!data.slug?.trim()) {
    errors.slug = 'URL slug обязателен';
  }
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug может содержать только буквы, цифры и дефисы';
  }
  if (!data.description?.trim()) {
    errors.description = 'Описание обязательно';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Валидировать данные блюда
 */
export const validateMenuItemData = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Название блюда обязательно';
  }
  if (!data.price || data.price <= 0) {
    errors.price = 'Цена должна быть больше 0';
  }
  if (!data.description?.trim()) {
    errors.description = 'Описание блюда обязательно';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Валидировать данные аутентификации
 */
export const validateAuthData = (email, password) => {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = 'Некорректный email адрес';
  }
  if (!password || password.length < 6) {
    errors.password = 'Пароль должен быть минимум 6 символов';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export default {
  // API
  createVenue,
  fetchVenues,
  fetchVenue,
  updateVenue,
  deleteVenue,
  fetchMenu,
  fetchMenuBySlug,
  updateMenu,
  addCategory,
  deleteCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchQRCode,
  createOrder,

  // Hooks
  useAuth,
  useAsync,
  useVenues,
  useMenuManager,
  useCart,

  // Utils
  generateId,
  createSlug,
  formatPrice,
  isValidEmail,
  getPasswordStrength,
  generateQRCodeUrl,
  copyToClipboard,
  downloadImage,
  formatDate,
  formatTime,
  debounce,
  throttle,

  // Mock Data
  createMockVenue,
  createMockCategory,
  createMockMenuItem,
  createMockMenu,
  createMockUser,
  createMockOrder,

  // Validation
  validateVenueData,
  validateMenuItemData,
  validateAuthData,
};
