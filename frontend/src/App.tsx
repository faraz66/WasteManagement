import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { NotificationProvider } from './components/UI'

// Layout Components
import Layout from './components/Layout/Layout'
import AuthLayout from './components/Layout/AuthLayout'

// Page Components
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import Dashboard from './pages/Dashboard/Dashboard'
import Marketplace from './pages/Marketplace/Marketplace'
import ProductDetails from './pages/Marketplace/ProductDetails'
import Community from './pages/Community/Community'
import Education from './pages/Education/Education'
import Profile from './pages/Profile/Profile'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<Landing />} />

              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
              </Route>

              {/* Protected Routes */}
              <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="marketplace/:id" element={<ProductDetails />} />
                <Route path="community" element={<Community />} />
                <Route path="education" element={<Education />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Enhanced Toast with EcoCircle styling */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#1e293b',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  style: {
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderLeft: '4px solid #22c55e',
                    color: '#15803d',
                  },
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#f0fdf4',
                  },
                },
                error: {
                  style: {
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    borderLeft: '4px solid #ef4444',
                    color: '#dc2626',
                  },
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fef2f2',
                  },
                },
              }}
            />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
