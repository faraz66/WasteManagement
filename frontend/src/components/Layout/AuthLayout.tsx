import React from 'react'
import { Outlet } from 'react-router-dom'
import { Recycle, Leaf, Globe } from 'lucide-react'

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-slate-50 to-primary-100 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Recycle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">EcoCircle</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Transform Waste into
            <span className="block text-accent-300">Sustainable Solutions</span>
          </h2>
          
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Join our community of eco-warriors and businesses working together to create a cleaner, 
            more sustainable future through innovative waste management solutions.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Recycle className="h-5 w-5" />
              </div>
              <span className="text-lg">Smart Waste Processing</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Globe className="h-5 w-5" />
              </div>
              <span className="text-lg">Sustainable Marketplace</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-lg">Environmental Education</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="p-3 bg-primary-600 rounded-2xl">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">EcoCircle</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
