import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  User,
  Users,
  Recycle,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Marketplace', href: '/app/marketplace', icon: ShoppingBag },
  { name: 'Community', href: '/app/community', icon: Users },
  { name: 'Education', href: '/app/education', icon: BookOpen },
  { name: 'Profile', href: '/app/profile', icon: User },
]

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="w-64 bg-white shadow-xl border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl">
            <Recycle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">EcoWaste</h1>
            <p className="text-xs text-slate-500">Sustainable Solutions</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm border border-primary-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5',
                isActive ? 'text-primary-600' : 'text-slate-400'
              )} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-50 mb-3">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <button className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 w-full transition-colors duration-200">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 w-full transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
