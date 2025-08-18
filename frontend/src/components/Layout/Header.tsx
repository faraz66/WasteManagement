import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Header: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path.startsWith('/marketplace')) return 'Marketplace'
    if (path === '/education') return 'Education Hub'
    if (path === '/profile') return 'Profile'
    return 'EcoWaste'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
          <p className="text-sm text-slate-600 mt-1">
            {getGreeting()}, {user?.name}! {getCurrentDate()}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200">
              <Calendar className="h-5 w-5" />
            </button>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Avatar */}
          <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
