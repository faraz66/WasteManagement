import React, { createContext, useState, useEffect, type ReactNode } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Check if token is expired before making API call
          const tokenPayload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Date.now() / 1000
          
          if (tokenPayload.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('token')
            setUser(null)
            setLoading(false)
            return
          }
          
          const response = await authAPI.getProfile()
          const backendUser = response.data.user || response.data
          
          // Map backend user structure to frontend structure
          const userData: User = {
            id: backendUser.id,
            name: backendUser.username || backendUser.name, // Handle both possible field names
            email: backendUser.email,
            role: backendUser.user_type || backendUser.role // Handle both possible field names
          }
          
          setUser(userData)
        } catch (error) {
          localStorage.removeItem('token')
          setUser(null)
          console.error('Auth initialization failed:', error)
          // Don't show error toast during initialization
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    initAuth()
    
    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          setUser(null)
        } else {
          // Token was added/changed, re-initialize
          initAuth()
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authAPI.login(email, password)
      const { token, user: backendUser } = response.data
      
      // Map backend user structure to frontend structure
      const userData: User = {
        id: backendUser.id,
        name: backendUser.username, // Backend sends 'username', frontend expects 'name'
        email: backendUser.email,
        role: backendUser.user_type // Backend sends 'user_type', frontend expects 'role'
      }
      
      localStorage.setItem('token', token)
      setUser(userData)
      toast.success(`Welcome back, ${userData.name}!`)
      return true
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: { name: string; email: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true)
      // Map frontend data to backend structure
      const backendUserData = {
        username: userData.name, // Frontend sends 'name', backend expects 'username'
        email: userData.email,
        password: userData.password,
        user_type: 'user' // Default role
      }
      
      const response = await authAPI.register(backendUserData)
      const { token, user: backendUser } = response.data
      
      // Map backend response to frontend structure
      const newUser: User = {
        id: backendUser.id,
        name: backendUser.username, // Backend sends 'username', frontend expects 'name'
        email: backendUser.email,
        role: backendUser.user_type // Backend sends 'user_type', frontend expects 'role'
      }
      
      localStorage.setItem('token', token)
      setUser(newUser)
      return true
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully')
    // Redirect to landing page after logout
    window.location.href = '/'
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
