# 🌐 EcoWaste Management Frontend API Integration

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Axios](https://img.shields.io/badge/Axios-1.11+-green.svg)](https://axios-http.com/)

> **Complete guide for frontend API integration with EcoWaste Management backend services, including service layers, hooks, and TypeScript interfaces.**

## 📋 Table of Contents

- [🔧 API Configuration](#-api-configuration)
- [🏗️ Service Architecture](#️-service-architecture)
- [🔐 Authentication Service](#-authentication-service)
- [👤 User Service](#-user-service)
- [🛒 Marketplace Service](#-marketplace-service)
- [📚 Educational Service](#-educational-service)
- [🎣 Custom Hooks](#-custom-hooks)
- [📝 TypeScript Interfaces](#-typescript-interfaces)
- [⚠️ Error Handling](#️-error-handling)

## 🔧 API Configuration

### Base API Client Setup

```typescript
// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: {
    code: string
    message: string
    details?: any[]
  }
}

const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
      return Promise.reject(error)
    }
  )

  return client
}

// API Clients
export const userApi = createApiClient(import.meta.env.VITE_USER_SERVICE_URL)
export const marketplaceApi = createApiClient(import.meta.env.VITE_MARKETPLACE_SERVICE_URL)
export const educationApi = createApiClient(import.meta.env.VITE_EDUCATION_SERVICE_URL)
```

## 🏗️ Service Architecture

### Service Layer Pattern

```typescript
// src/services/baseService.ts
import { AxiosInstance, AxiosResponse } from 'axios'

export abstract class BaseService {
  protected api: AxiosInstance

  constructor(apiClient: AxiosInstance) {
    this.api = apiClient
  }

  protected async handleRequest<T>(
    request: Promise<AxiosResponse<ApiResponse<T>>>
  ): Promise<T> {
    try {
      const response = await request
      if (response.data.success) {
        return response.data.data as T
      }
      throw new Error(response.data.error?.message || 'Request failed')
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message)
      }
      throw error
    }
  }
}
```

## 🔐 Authentication Service

```typescript
// src/services/authService.ts
import { userApi } from './api'
import { BaseService } from './baseService'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: string
}

class AuthService extends BaseService {
  constructor() {
    super(userApi)
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.handleRequest(
      this.api.post('/auth/login', credentials)
    )
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.handleRequest(
      this.api.post('/auth/register', userData)
    )
  }

  async refreshToken(): Promise<{ token: string; expiresIn: string }> {
    return this.handleRequest(
      this.api.post('/auth/refresh')
    )
  }

  async logout(): Promise<void> {
    return this.handleRequest(
      this.api.post('/auth/logout')
    )
  }

  async forgotPassword(email: string): Promise<void> {
    return this.handleRequest(
      this.api.post('/auth/forgot-password', { email })
    )
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.handleRequest(
      this.api.post('/auth/reset-password', { token, newPassword })
    )
  }
}

export const authService = new AuthService()
```

## 👤 User Service

```typescript
// src/services/userService.ts
import { userApi } from './api'
import { BaseService } from './baseService'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  emailVerified: boolean
  profile?: UserProfile
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  phone?: string
  address?: string
  city?: string
  country?: string
  avatarUrl?: string
  bio?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  bio?: string
}

class UserService extends BaseService {
  constructor() {
    super(userApi)
  }

  async getCurrentUser(): Promise<User> {
    return this.handleRequest(
      this.api.get('/users/profile')
    )
  }

  async updateProfile(data: UpdateUserData): Promise<User> {
    return this.handleRequest(
      this.api.put('/users/profile', data)
    )
  }

  async getUserById(id: number): Promise<User> {
    return this.handleRequest(
      this.api.get(`/users/${id}`)
    )
  }

  async getAllUsers(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<{ users: User[]; pagination: PaginationInfo }> {
    return this.handleRequest(
      this.api.get('/users', { params })
    )
  }

  async deleteUser(id: number): Promise<void> {
    return this.handleRequest(
      this.api.delete(`/users/${id}`)
    )
  }
}

export const userService = new UserService()
```

## 🛒 Marketplace Service

```typescript
// src/services/marketplaceService.ts
import { marketplaceApi } from './api'
import { BaseService } from './baseService'

export interface Product {
  id: number
  title: string
  description: string
  price: number
  condition: 'new' | 'used' | 'refurbished'
  location: string
  images: string[]
  category: Category
  seller: {
    id: number
    firstName: string
    lastName: string
  }
  status: 'active' | 'sold' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description: string
  icon: string
  productCount?: number
}

export interface CreateProductData {
  title: string
  description: string
  price: number
  condition: string
  location: string
  categoryId: number
  images: string[]
}

export interface ProductFilters {
  page?: number
  limit?: number
  category?: number
  search?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  location?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

class MarketplaceService extends BaseService {
  constructor() {
    super(marketplaceApi)
  }

  async getProducts(filters?: ProductFilters): Promise<{
    products: Product[]
    pagination: PaginationInfo
  }> {
    return this.handleRequest(
      this.api.get('/products', { params: filters })
    )
  }

  async getProductById(id: number): Promise<Product> {
    return this.handleRequest(
      this.api.get(`/products/${id}`)
    )
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    return this.handleRequest(
      this.api.post('/products', data)
    )
  }

  async updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    return this.handleRequest(
      this.api.put(`/products/${id}`, data)
    )
  }

  async deleteProduct(id: number): Promise<void> {
    return this.handleRequest(
      this.api.delete(`/products/${id}`)
    )
  }

  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>): Promise<{
    products: Product[]
    totalResults: number
    searchQuery: string
  }> {
    return this.handleRequest(
      this.api.get('/products/search', { params: { q: query, ...filters } })
    )
  }

  async getCategories(): Promise<Category[]> {
    return this.handleRequest(
      this.api.get('/categories')
    )
  }

  async createCategory(data: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
    return this.handleRequest(
      this.api.post('/categories', data)
    )
  }

  async getTransactions(params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }): Promise<{ transactions: Transaction[]; pagination: PaginationInfo }> {
    return this.handleRequest(
      this.api.get('/transactions', { params })
    )
  }

  async createTransaction(productId: number, amount: number): Promise<Transaction> {
    return this.handleRequest(
      this.api.post('/transactions', { productId, amount })
    )
  }
}

export const marketplaceService = new MarketplaceService()
```

## 📚 Educational Service

```typescript
// src/services/educationService.ts
import { educationApi } from './api'
import { BaseService } from './baseService'

export interface Course {
  id: number
  title: string
  description: string
  instructor: string
  durationHours: number
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  thumbnailUrl: string
  lessonsCount?: number
  enrolledCount?: number
  rating?: number
  isPublished: boolean
  lessons?: Lesson[]
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: number
  title: string
  content?: string
  videoUrl?: string
  durationMinutes: number
  orderIndex: number
  courseId: number
}

export interface UserProgress {
  courseId: number
  courseTitle: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  lastAccessedAt: string
}

class EducationService extends BaseService {
  constructor() {
    super(educationApi)
  }

  async getCourses(params?: {
    page?: number
    limit?: number
    difficulty?: string
    published?: boolean
  }): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    return this.handleRequest(
      this.api.get('/courses', { params })
    )
  }

  async getCourseById(id: number): Promise<Course> {
    return this.handleRequest(
      this.api.get(`/courses/${id}`)
    )
  }

  async createCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    return this.handleRequest(
      this.api.post('/courses', data)
    )
  }

  async getLessonById(id: number): Promise<Lesson> {
    return this.handleRequest(
      this.api.get(`/lessons/${id}`)
    )
  }

  async createLesson(data: Omit<Lesson, 'id'>): Promise<Lesson> {
    return this.handleRequest(
      this.api.post('/lessons', data)
    )
  }

  async getUserProgress(): Promise<{
    progress: UserProgress[]
    overallStats: {
      totalCoursesEnrolled: number
      totalCoursesCompleted: number
      totalHoursLearned: number
    }
  }> {
    return this.handleRequest(
      this.api.get('/progress')
    )
  }

  async updateProgress(lessonId: number, data: {
    completed: boolean
    progressPercentage: number
  }): Promise<void> {
    return this.handleRequest(
      this.api.post('/progress', { lessonId, ...data })
    )
  }

  async getCourseProgress(courseId: number): Promise<UserProgress> {
    return this.handleRequest(
      this.api.get(`/progress/course/${courseId}`)
    )
  }
}

export const educationService = new EducationService()
```

## 🎣 Custom Hooks

### Authentication Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { authService, LoginCredentials, RegisterData } from '../services/authService'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  const { user, token, setUser, setToken, loading, setLoading } = context

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('authToken', response.token)
      toast.success('Login successful!')
      return response
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    try {
      const response = await authService.register(userData)
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('authToken', response.token)
      toast.success('Registration successful!')
      return response
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('authToken')
      toast.success('Logged out successfully')
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  }
}
```

### API Hook

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react'

interface UseApiOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export const useApi = <T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { immediate = false, onSuccess, onError } = options

  const execute = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate])

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  }
}
```

## 📝 TypeScript Interfaces

### Common Interfaces

```typescript
// src/types/api.ts
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface ApiError {
  code: string
  message: string
  details?: Array<{
    field: string
    message: string
  }>
}

export interface Transaction {
  id: number
  productId: number
  buyerId: number
  sellerId: number
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  product?: {
    title: string
    images: string[]
  }
  createdAt: string
  completedAt?: string
}

// Form interfaces
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface ProductFormData {
  title: string
  description: string
  price: number
  condition: string
  location: string
  categoryId: number
  images: File[]
}
```

## ⚠️ Error Handling

### Global Error Handler

```typescript
// src/utils/errorHandler.ts
import toast from 'react-hot-toast'

export const handleApiError = (error: any) => {
  if (error.response?.data?.error) {
    const apiError = error.response.data.error
    
    if (apiError.details && Array.isArray(apiError.details)) {
      // Validation errors
      apiError.details.forEach((detail: any) => {
        toast.error(`${detail.field}: ${detail.message}`)
      })
    } else {
      toast.error(apiError.message)
    }
  } else if (error.message) {
    toast.error(error.message)
  } else {
    toast.error('An unexpected error occurred')
  }
}

export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}
```

### Error Boundary Component

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

<div align="center">

**🌐 EcoWaste Management Frontend API Integration**

[Main README](../README.md) • [Frontend README](./README_Frontend.md) • [Backend API](../backend/API.md)

</div>
