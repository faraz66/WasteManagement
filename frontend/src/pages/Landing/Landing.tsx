import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRightIcon, 
  ArrowPathIcon, 
  TruckIcon, 
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CogIcon,
  PlayIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import InteractiveDemo from '../../components/Interactive/InteractiveDemo'
import ParticleBackground from '../../components/Interactive/ParticleBackground'
import TestimonialsCarousel from '../../components/Interactive/TestimonialsCarousel'
import AnimatedStats from '../../components/Interactive/AnimatedStats'

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      <ParticleBackground />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  EcoCircle
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Home</a>
              <div className="relative group">
                <button className="text-gray-700 hover:text-emerald-600 transition-colors font-medium flex items-center">
                  We Serve
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-emerald-600 transition-colors font-medium flex items-center">
                  Solutions
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <a href="#network" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Network</a>
              <Link to="/app/marketplace" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Visit Marketplace</Link>
              <a href="#downloads" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Downloads</a>
              <div className="relative group">
                <button className="text-gray-700 hover:text-emerald-600 transition-colors font-medium flex items-center">
                  Language
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth/login" 
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                to="/auth/register" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-300"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-2xl z-40">
            <div className="px-4 py-6 space-y-4">
              <a href="#home" className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">Home</a>
              <a href="#services" className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">We Serve</a>
              <a href="#solutions" className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">Solutions</a>
              <a href="#network" className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">Network</a>
              <Link to="/app/marketplace" className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">Visit Marketplace</Link>
              <a href="#downloads" className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">Downloads</a>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link 
                  to="/auth/login" 
                  className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                >
                  Login
                </Link>
                <Link 
                  to="/auth/register" 
                  className="block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full text-center font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${-scrollY * 0.2}px)`, animationDelay: '1s' }}
          />
          <div 
            className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)`, animationDelay: '2s' }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  World Of{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Waste Management
                  </span>{' '}
                  In Your Palm
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  EcoCircle connects, empowers trade, & simplifies the supply chain – all in your palm. 
                  We're a platform purposed for waste collectors, recycling processors, industrial buyers 
                  & logistics players for everything sustainable.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/auth/register"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center group"
                >
                  Start Your Journey
                  <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-full hover:bg-emerald-50 transition-all duration-300 font-semibold text-lg flex items-center justify-center">
                  <PlayIcon className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Content - Circular Design */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Main Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  {/* Inner Content */}
                  <div className="w-4/5 h-4/5 bg-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Dashboard Preview */}
                    <div className="w-3/4 h-3/4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto flex items-center justify-center">
                          <ChartBarIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-emerald-200 rounded w-20 mx-auto"></div>
                          <div className="h-2 bg-teal-200 rounded w-16 mx-auto"></div>
                          <div className="h-2 bg-emerald-200 rounded w-24 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg flex items-center justify-center animate-bounce">
                  <ArrowPathIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center animate-pulse">
                  <TruckIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-1/4 -right-8 w-12 h-12 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full shadow-lg flex items-center justify-center animate-ping">
                  <GlobeAltIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              All-in-one Waste Management Platform for
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions connecting every stakeholder in the waste management ecosystem
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ArrowPathIcon,
                title: "Waste Collection",
                description: "Smart collection routes, real-time tracking, and optimized scheduling for maximum efficiency.",
                gradient: "from-emerald-500 to-teal-600"
              },
              {
                icon: CogIcon,
                title: "Processing Solutions",
                description: "Advanced sorting, treatment, and recycling technologies for various waste streams.",
                gradient: "from-teal-500 to-cyan-600"
              },
              {
                icon: ChartBarIcon,
                title: "Analytics & Insights",
                description: "Data-driven decisions with comprehensive reporting and performance metrics.",
                gradient: "from-cyan-500 to-blue-600"
              },
              {
                icon: GlobeAltIcon,
                title: "Network Management",
                description: "Connect with collectors, processors, and buyers in your regional network.",
                gradient: "from-blue-500 to-indigo-600"
              },
              {
                icon: ShieldCheckIcon,
                title: "Compliance & Safety",
                description: "Ensure regulatory compliance and maintain safety standards across operations.",
                gradient: "from-indigo-500 to-purple-600"
              },
              {
                icon: TruckIcon,
                title: "Logistics Integration",
                description: "Seamless transportation coordination and supply chain optimization.",
                gradient: "from-purple-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Experience the Platform{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Live
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Interact with our real-time dashboard, track fleet operations, and explore powerful analytics
            </p>
          </div>
          <InteractiveDemo />
        </div>
      </section>

      {/* Animated Statistics */}
      <AnimatedStats />

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Waste Management?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join thousands of organizations already using EcoCircle to optimize their waste management operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth/register"
              className="bg-white text-emerald-600 px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center group"
            >
              Get Started Today
              <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-emerald-600 transition-all duration-300 font-semibold text-lg">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EcoCircle</span>
              </div>
              <p className="text-gray-400">
                Transforming waste management through innovative technology and sustainable solutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Network</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Waste Collection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recycling</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Industrial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Logistics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoCircle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
