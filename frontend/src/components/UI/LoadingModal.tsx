import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingModalProps {
  isOpen: boolean
  message?: string
  progress?: number
  showProgress?: boolean
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = 'Loading...',
  progress,
  showProgress = false
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
      
      {/* Loading Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 animate-in zoom-in-95 fade-in duration-200 min-w-[300px]">
        <div className="flex flex-col items-center text-center">
          {/* Spinner */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
            <Loader2 className="absolute inset-0 m-auto text-primary-600 animate-spin" size={24} />
          </div>

          {/* Message */}
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {message}
          </h3>

          {/* Progress Bar */}
          {showProgress && progress !== undefined && (
            <div className="w-full mt-4">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}

          {/* Subtle animation dots */}
          <div className="flex space-x-1 mt-4">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingModal
