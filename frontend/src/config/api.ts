// API Configuration
export const API_CONFIG = {
  // Development - Use your computer's IP address for mobile devices
  development: {
    baseURL: 'http://192.168.1.131:8080',
    timeout: 30000,
  },
  
  // Production (update this with your actual production URL)
  production: {
    baseURL: 'https://your-production-api.com',
    timeout: 15000,
  },
  
  // Testing
  test: {
    baseURL: 'http://localhost:8080',
    timeout: 5000,
  },
};

// Get current environment
const getEnvironment = () => {
  if (__DEV__) {
    return 'development';
  }
  // Add logic to detect production environment
  return 'development';
};

export const getApiConfig = () => {
  const env = getEnvironment();
  return API_CONFIG[env as keyof typeof API_CONFIG] || API_CONFIG.development;
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  CHAT: {
    SEND: '/chat/send',
    HISTORY: '/chat/history',
  },
  REMINDERS: {
    CREATE: '/reminders/create',
    GET_ALL: '/reminders',
    UPDATE: '/reminders',
    DELETE: '/reminders',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
};

export default {
  API_CONFIG,
  getApiConfig,
  ENDPOINTS,
}; 