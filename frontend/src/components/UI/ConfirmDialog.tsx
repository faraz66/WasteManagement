import React from 'react'
import { AlertTriangle, Trash2, Save, LogOut, RefreshCw } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  icon?: 'delete' | 'save' | 'logout' | 'refresh' | 'warning'
  loading?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  icon = 'warning',
  loading = false
}) => {
  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose()
    }
  }

  const variantConfig = {
    danger: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      buttonColor: 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
    },
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-500',
      buttonColor: 'bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      buttonColor: 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
    }
  }

  const iconComponents = {
    delete: Trash2,
    save: Save,
    logout: LogOut,
    refresh: RefreshCw,
    warning: AlertTriangle
  }

  const config = variantConfig[variant]
  const IconComponent = iconComponents[icon]

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className={`flex items-center gap-4 p-6 ${config.bgColor} ${config.borderColor} border-b rounded-t-2xl`}>
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <IconComponent size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${config.buttonColor}`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
