import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

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
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    username: string
    email: string
    password: string
    user_type?: string
  }) => api.post('/auth/register', userData),
  
  logout: () => api.post('/auth/logout'),
  
  getProfile: () => api.get('/users/profile'),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getUsers: () => api.get('/users'),
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
  createProduct: (data: any) => marketplaceAPI.post('/products', data),
  updateProduct: (id: string, data: any) => marketplaceAPI.put(`/products/${id}`, data),
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
  createContent: (data: any) => educationAPI.post('/content', data),
}

export default api
