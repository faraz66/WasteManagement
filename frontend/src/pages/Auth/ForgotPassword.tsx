import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import Modal from '../../components/UI/Modal'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})

    // Validate email
    if (!email.trim()) {
      setErrors({ email: 'Email address is required' })
      return
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)

    try {
      await authAPI.forgotPassword(email)
      
      // Add 3 second delay before showing success modal for better UX
      setTimeout(() => {
        setIsLoading(false)
        setShowSuccessModal(true)
      }, 3000)
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send reset email. Please try again.'
      setErrors({ email: message })
      toast.error(message)
      setIsLoading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setEmail('')
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
          <p className="text-slate-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }))
                  }
                }}
                className={`input-field pl-12 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Enter your email address"
                required
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending reset link...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center space-y-4">
          <Link
            to="/auth/login"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
          
          <div className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign up here
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal - Modern Premium Design */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title=""
        size="md"
        closeOnOverlayClick={false}
        showCloseButton={false}
      >
        <div className="relative overflow-hidden">
          {/* Premium Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 opacity-60"></div>
          
          <div className="relative text-center space-y-8 p-2">
            {/* Success Icon with Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <CheckCircle className="w-10 h-10 text-white drop-shadow-sm" />
                </div>
                {/* Animated Ring */}
                <div className="absolute inset-0 w-20 h-20 border-2 border-emerald-300 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-0 w-20 h-20 border border-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Title and Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Reset Link Sent!
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                  We've sent a password reset link to
                </p>
                <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 rounded-full">
                  <Mail className="w-4 h-4 text-slate-500 mr-2" />
                  <span className="font-medium text-slate-700 text-sm">{email}</span>
                </div>
              </div>
            </div>

            {/* Premium Info Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-amber-900 text-sm mb-1">Security Notice</p>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    The reset link expires in <strong>15 minutes</strong>. Check your spam folder if you don't see it.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSuccessModalClose}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50 transform hover:scale-[1.02] transition-all duration-200 ease-out"
              >
                <span className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Got it, thanks!</span>
                </span>
              </button>
              
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
                }}
                className="w-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all duration-200 ease-out border border-transparent hover:border-slate-200"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Didn't receive the email? Resend</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ForgotPassword
