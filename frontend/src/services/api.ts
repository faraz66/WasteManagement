import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ecocircle.in/api"

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
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/profile'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  validateResetToken: (token: string) => 
    api.post('/auth/validate-reset-token', { token })
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data)
}

// Marketplace API - Use the same server
const marketplaceAPI = axios.create({
  baseURL: API_BASE_URL,
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
  getProducts: (params?: any) => marketplaceAPI.get('/marketplace/products', { params }),
  getProduct: (id: string) => marketplaceAPI.get(`/marketplace/products/${id}`),
  getCart: () => marketplaceAPI.get('/marketplace/cart'),
  addToCart: (productId: string, quantity: number) =>
    marketplaceAPI.post('/marketplace/cart', { productId, quantity }),
  updateCartItem: (itemId: string, quantity: number) =>
    marketplaceAPI.put(`/marketplace/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: string) => marketplaceAPI.delete(`/marketplace/cart/${itemId}`)
}

// Education API - Use the same server
const educationAPI = axios.create({
  baseURL: API_BASE_URL,
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
  getContent: (params?: any) => educationAPI.get('/education/content', { params }),
  getContentById: (id: string) => educationAPI.get(`/education/content/${id}`)
}

// Community API - Use the main API base URL
const communityAPI = axios.create({
  baseURL: API_BASE_URL,
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
  getPersonalizedFeed: (params: Record<string, any>) => communityAPI.get('/feed/personalized', { params }),
  getTrendingFeed: (params: Record<string, any>) => communityAPI.get('/feed/trending', { params }),
  getLocalFeed: (params: Record<string, any>) => communityAPI.get('/feed/local', { params }),
  getFollowingFeed: (params: Record<string, any>) => communityAPI.get('/feed/following', { params }),
  getCategoryFeed: (category: string, params: Record<string, any>) => communityAPI.get(`/feed/category/${category}`, { params }),
  createPost: (data: FormData) => communityAPI.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  searchPosts: (params: Record<string, any>) => communityAPI.get('/feed/search', { params }),
  recordInteraction: (postId: string, type: string) => communityAPI.post(`/posts/${postId}/interactions`, { type }),
  getRecommendations: () => communityAPI.get('/users/recommendations'),
  updatePreferences: (data: any) => communityAPI.put('/users/preferences', data),
  getFeedAnalytics: () => communityAPI.get('/feed/analytics')
}

export default api
