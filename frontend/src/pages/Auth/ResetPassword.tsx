import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import Modal from '../../components/UI/Modal'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setTokenValid(false)
      return
    }

    const validateToken = async () => {
      try {
        await authAPI.validateResetToken(token)
        setTokenValid(true)
      } catch {
        setTokenValid(false)
      }
    }

    validateToken()
  }, [token])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await authAPI.resetPassword(token!, formData.password)
      
      setShowSuccessModal(true)
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to reset password. Please try again.'
      setErrors({ password: message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    navigate('/auth/login')
  }

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Validating Reset Link</h2>
          <p className="text-slate-600">Please wait while we verify your password reset link...</p>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid Reset Link</h2>
          <p className="text-slate-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="space-y-3">
            <Link
              to="/auth/forgot-password"
              className="btn-primary inline-block"
            >
              Request New Reset Link
            </Link>
            <div>
              <Link
                to="/auth/login"
                className="text-slate-600 hover:text-slate-800 transition-colors duration-200"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Reset Your Password</h2>
          <p className="text-slate-600">
            Enter your new password below. Make sure it's strong and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field pl-12 pr-12 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-900 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span>At least 8 characters long</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span>Contains both uppercase and lowercase letters</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span>Contains at least one number</span>
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Resetting password...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Password Reset Successful!"
        size="md"
        closeOnOverlayClick={false}
        showCloseButton={false}
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">
              All Set!
            </h3>
            <p className="text-slate-600">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <button
            onClick={handleSuccessModalClose}
            className="btn-primary w-full"
          >
            Continue to Sign In
          </button>
        </div>
      </Modal>
    </>
  )
}

export default ResetPassword
