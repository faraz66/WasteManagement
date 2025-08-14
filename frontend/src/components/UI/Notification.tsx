import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  onClose,
  action
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      accentColor: 'border-l-green-500'
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      accentColor: 'border-l-red-500'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      accentColor: 'border-l-amber-500'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      accentColor: 'border-l-blue-500'
    }
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div className={`
      relative w-full max-w-sm bg-white rounded-xl shadow-lg border ${config.borderColor} border-l-4 ${config.accentColor}
      animate-in slide-in-from-right duration-300
      hover:shadow-xl transition-shadow duration-200
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <IconComponent size={20} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            )}

            {/* Action Button */}
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => onClose(id)}
            className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notification
