import React, { createContext, useContext, useState, useCallback } from 'react'
import Notification from './Notification'

interface NotificationData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, 'id'>) => void
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showWarning: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const showNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    const duration = notification.duration || 5000
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }, [removeNotification])

  const showSuccess = useCallback((title: string, message?: string) => {
    showNotification({ type: 'success', title, message })
  }, [showNotification])

  const showError = useCallback((title: string, message?: string) => {
    showNotification({ type: 'error', title, message, duration: 7000 })
  }, [showNotification])

  const showWarning = useCallback((title: string, message?: string) => {
    showNotification({ type: 'warning', title, message })
  }, [showNotification])

  const showInfo = useCallback((title: string, message?: string) => {
    showNotification({ type: 'info', title, message })
  }, [showNotification])

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
