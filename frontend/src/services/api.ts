import axios from 'axios';
import { getApiConfig } from '../config/api';

// Get API configuration based on environment
const config = getApiConfig();

// Create axios instance with default configuration
const api = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Note: localStorage doesn't work in React Native
    // You'll need to use AsyncStorage or another storage solution
    // For now, we'll skip token handling
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Note: localStorage doesn't work in React Native
      console.log('Unauthorized access detected');
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  register: async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
};

// Chat API calls
export const chatAPI = {
  sendMessage: async (payload: { message: string; location?: any }, userId: string) => {
    const response = await api.post(`/memory/ask?userId=${userId}`, payload);
    return { message: response.data };
  },
  
  getHistory: async (userId: string) => {
    const response = await api.get(`/memory/chats?userId=${userId}`);
    return { messages: response.data };
  },
};

// Reminder API calls
export const reminderAPI = {
  createReminder: async (reminder: any) => {
    const response = await api.post('/reminders', reminder);
    return response.data;
  },
  
  getReminders: async (userId: string) => {
    const response = await api.get(`/reminders?userId=${userId}`);
    return response.data;
  },
  
  updateReminder: async (reminderId: string, updates: any) => {
    const response = await api.put(`/reminders/${reminderId}`, updates);
    return response.data;
  },
  
  deleteReminder: async (reminderId: string) => {
    const response = await api.delete(`/reminders/${reminderId}`);
    return response.data;
  },
};

export default api; 