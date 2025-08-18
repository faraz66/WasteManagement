import React from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
}

const Alert: React.FC<AlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false
}) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      buttonColor: 'bg-amber-600 hover:bg-amber-700'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    }
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
      
      {/* Alert */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 animate-in zoom-in-95 fade-in duration-200">
        {/* Header with Icon */}
        <div className={`flex items-center gap-4 p-6 ${config.bgColor} ${config.borderColor} border-b rounded-t-2xl`}>
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <IconComponent size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <p className="text-slate-600 mb-6 leading-relaxed">
              {message}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            {showCancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg font-medium transition-colors duration-200"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${config.buttonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert
