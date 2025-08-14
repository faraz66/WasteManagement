import { useState, useCallback } from 'react'

interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClose?: () => void
}

interface AlertState {
  isOpen: boolean
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
}

interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  icon?: 'delete' | 'save' | 'logout' | 'refresh' | 'warning'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
}

interface LoadingState {
  isOpen: boolean
  message?: string
  progress?: number
  showProgress?: boolean
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false
  })

  const openModal = useCallback((config: Omit<ModalState, 'isOpen'>) => {
    setModalState({ ...config, isOpen: true })
  }, [])

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
    // Call custom onClose if provided
    if (modalState.onClose) {
      modalState.onClose()
    }
  }, [modalState.onClose])

  return {
    modalState,
    openModal,
    closeModal
  }
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: ''
  })

  const showAlert = useCallback((config: Omit<AlertState, 'isOpen'>) => {
    setAlertState({ ...config, isOpen: true })
  }, [])

  const closeAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const showSuccess = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'success', onConfirm })
  }, [showAlert])

  const showError = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'error', onConfirm })
  }, [showAlert])

  const showWarning = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'warning', onConfirm })
  }, [showAlert])

  const showInfo = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'info', onConfirm })
  }, [showAlert])

  return {
    alertState,
    showAlert,
    closeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: ''
  })

  const showConfirm = useCallback((config: Omit<ConfirmState, 'isOpen'>) => {
    setConfirmState({ ...config, isOpen: true })
  }, [])

  const closeConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false, loading: false }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setConfirmState(prev => ({ ...prev, loading }))
  }, [])

  // Convenience methods for common confirmation types
  const confirmDelete = useCallback((
    itemName: string, 
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void
  ) => {
    showConfirm({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      variant: 'danger',
      icon: 'delete',
      confirmText: 'Delete',
      onConfirm: async () => {
        setLoading(true)
        try {
          await onConfirm()
          closeConfirm()
        } catch (error) {
          setLoading(false)
          throw error
        }
      },
      onCancel
    })
  }, [showConfirm, setLoading, closeConfirm])

  const confirmSave = useCallback((
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void
  ) => {
    showConfirm({
      title: 'Save Changes',
      message: 'Do you want to save your changes?',
      variant: 'success',
      icon: 'save',
      confirmText: 'Save',
      onConfirm: async () => {
        setLoading(true)
        try {
          await onConfirm()
          closeConfirm()
        } catch (error) {
          setLoading(false)
          throw error
        }
      },
      onCancel
    })
  }, [showConfirm, setLoading, closeConfirm])

  const confirmLogout = useCallback((
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void
  ) => {
    showConfirm({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      variant: 'warning',
      icon: 'logout',
      confirmText: 'Sign Out',
      onConfirm: async () => {
        setLoading(true)
        try {
          await onConfirm()
          closeConfirm()
        } catch (error) {
          setLoading(false)
          throw error
        }
      },
      onCancel
    })
  }, [showConfirm, setLoading, closeConfirm])

  return {
    confirmState,
    showConfirm,
    closeConfirm,
    setLoading,
    confirmDelete,
    confirmSave,
    confirmLogout
  }
}

export const useLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isOpen: false
  })

  const showLoading = useCallback((config?: Omit<LoadingState, 'isOpen'>) => {
    setLoadingState({ ...config, isOpen: true })
  }, [])

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const updateProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({ ...prev, progress, showProgress: true }))
  }, [])

  const updateMessage = useCallback((message: string) => {
    setLoadingState(prev => ({ ...prev, message }))
  }, [])

  return {
    loadingState,
    showLoading,
    hideLoading,
    updateProgress,
    updateMessage
  }
}
