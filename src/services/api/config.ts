// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const API_ENDPOINTS = {
  assets: {
    base: '/assets',
    getAll: '/assets',
    getById: (id: string) => `/assets/${id}`,
    create: '/assets',
    update: (id: string) => `/assets/${id}`,
    delete: (id: string) => `/assets/${id}`
  },
  documents: {
    base: '/documents',
    getAll: '/documents',
    getById: (id: string) => `/documents/${id}`,
    create: '/documents',
    update: (id: string) => `/documents/${id}`,
    delete: (id: string) => `/documents/${id}`,
    getByAsset: (assetId: string) => `/documents/asset/${assetId}`
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me'
  }
};