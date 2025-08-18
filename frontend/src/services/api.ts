import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Redirect to correct auth login path
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  register: (userData: {
    username: string
    email: string
    password: string
    user_type?: string
  }) => api.post('/api/auth/register', userData),
  
  logout: () => api.post('/api/auth/logout'),
  
  getProfile: () => api.get('/api/users/profile'),
  
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/api/auth/reset-password', { token, password }),
  
  validateResetToken: (token: string) =>
    api.post('/api/auth/validate-reset-token', { token }),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/api/users/profile', data),
  getUsers: () => api.get('/api/users'),
}

// Marketplace API (assuming marketplace service runs on port 3002)
const marketplaceAPI = axios.create({
  baseURL: 'http://localhost:3002/api',
  headers: { 'Content-Type': 'application/json' },
})

marketplaceAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const marketplace = {
  getProducts: () => marketplaceAPI.get('/products'),
  getProduct: (id: string) => marketplaceAPI.get(`/products/${id}`),
  createProduct: (data: Record<string, unknown>) => marketplaceAPI.post('/products', data),
  updateProduct: (id: string, data: Record<string, unknown>) => marketplaceAPI.put(`/products/${id}`, data),
  deleteProduct: (id: string) => marketplaceAPI.delete(`/products/${id}`),
  
  getCart: () => marketplaceAPI.get('/cart'),
  addToCart: (productId: string, quantity: number) =>
    marketplaceAPI.post('/cart', { productId, quantity }),
  updateCartItem: (itemId: string, quantity: number) =>
    marketplaceAPI.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: string) => marketplaceAPI.delete(`/cart/${itemId}`),
}

// Education API (assuming education service runs on port 3003)
const educationAPI = axios.create({
  baseURL: 'http://localhost:3003/api',
  headers: { 'Content-Type': 'application/json' },
})

educationAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const education = {
  getContent: () => educationAPI.get('/content'),
  getContentById: (id: string) => educationAPI.get(`/content/${id}`),
  createContent: (data: Record<string, unknown>) => educationAPI.post('/content', data),
}

// Community API - Using user service for now since community service may not be running
const communityAPI = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

communityAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

communityAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export const community = {
  // Feed endpoints
  getPersonalizedFeed: (params: Record<string, any>) => communityAPI.get('/feed/personalized', { params }),
  getTrendingFeed: (params: Record<string, any>) => communityAPI.get('/feed/trending', { params }),
  getLocalFeed: (params: Record<string, any>) => communityAPI.get('/feed/local', { params }),
  getFollowingFeed: (params: Record<string, any>) => communityAPI.get('/feed/following', { params }),
  getCategoryFeed: (category: string, params: Record<string, any>) => communityAPI.get(`/feed/category/${category}`, { params }),
  
  // Post endpoints
  createPost: (data: FormData) => communityAPI.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  searchPosts: (params: Record<string, any>) => communityAPI.get('/feed/search', { params }),
  
  // Interaction endpoints
  recordInteraction: (postId: number, type: string) => communityAPI.post(`/posts/${postId}/interactions`, { type }),
  
  // User endpoints
  getRecommendations: () => communityAPI.get('/users/recommendations'),
  updatePreferences: (preferences: Record<string, any>) => communityAPI.put('/users/preferences', preferences),
  
  // Analytics endpoints
  getFeedAnalytics: () => communityAPI.get('/feed/analytics'),
}

export default api
