import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TruckIcon, 
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface WasteData {
  collected: number
  processed: number
  recycled: number
  efficiency: number
}

interface TruckLocation {
  id: string
  lat: number
  lng: number
  status: 'collecting' | 'full' | 'returning'
  capacity: number
}

const InteractiveDemo = () => {
  const [wasteData, setWasteData] = useState<WasteData>({
    collected: 1250,
    processed: 980,
    recycled: 756,
    efficiency: 78
  })
  
  const [trucks, setTrucks] = useState<TruckLocation[]>([
    { id: 'T001', lat: 40.7128, lng: -74.0060, status: 'collecting', capacity: 65 },
    { id: 'T002', lat: 40.7589, lng: -73.9851, status: 'full', capacity: 95 },
    { id: 'T003', lat: 40.6892, lng: -74.0445, status: 'returning', capacity: 30 }
  ])

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracking' | 'analytics'>('dashboard')
  const [isAnimating, setIsAnimating] = useState(false)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWasteData(prev => ({
        collected: prev.collected + Math.floor(Math.random() * 10),
        processed: prev.processed + Math.floor(Math.random() * 8),
        recycled: prev.recycled + Math.floor(Math.random() * 6),
        efficiency: Math.min(95, prev.efficiency + (Math.random() - 0.5) * 2)
      }))
      
      setTrucks(prev => prev.map(truck => ({
        ...truck,
        capacity: Math.max(0, Math.min(100, truck.capacity + (Math.random() - 0.5) * 10))
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleTabChange = (tab: typeof activeTab) => {
    setIsAnimating(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsAnimating(false)
    }, 150)
  }

  const StatCard = ({ icon: Icon, label, value, unit, color }: {
    icon: any
    label: string
    value: number
    unit: string
    color: string
  }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 counter-animation">
            {value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">{unit}</div>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(100, (value / 2000) * 100)}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="relative">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {[
            { key: 'dashboard', label: 'Live Dashboard', icon: ChartBarIcon },
            { key: 'tracking', label: 'Fleet Tracking', icon: TruckIcon },
            { key: 'analytics', label: 'Analytics', icon: MapPinIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key as typeof activeTab)}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {activeTab === key && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 opacity-20 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Content */}
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {activeTab === 'dashboard' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={ChartBarIcon}
              label="Waste Collected"
              value={wasteData.collected}
              unit="tons today"
              color="bg-gradient-to-r from-emerald-500 to-teal-600"
            />
            <StatCard
              icon={CheckCircleIcon}
              label="Processed"
              value={wasteData.processed}
              unit="tons today"
              color="bg-gradient-to-r from-blue-500 to-cyan-600"
            />
            <StatCard
              icon={TruckIcon}
              label="Recycled"
              value={wasteData.recycled}
              unit="tons today"
              color="bg-gradient-to-r from-purple-500 to-pink-600"
            />
            <StatCard
              icon={ExclamationTriangleIcon}
              label="Efficiency"
              value={Math.round(wasteData.efficiency)}
              unit="% rate"
              color="bg-gradient-to-r from-orange-500 to-red-600"
            />
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TruckIcon className="w-8 h-8 text-emerald-600 mr-3" />
              Live Fleet Tracking
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {trucks.map((truck) => (
                <div key={truck.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        truck.status === 'collecting' ? 'bg-green-500 animate-pulse' :
                        truck.status === 'full' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <span className="font-bold text-gray-900">{truck.id}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      truck.status === 'collecting' ? 'bg-green-100 text-green-800' :
                      truck.status === 'full' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {truck.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Capacity</span>
                        <span className="font-medium">{Math.round(truck.capacity)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${
                            truck.capacity > 80 ? 'bg-red-500' : 
                            truck.capacity > 60 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${truck.capacity}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {truck.lat.toFixed(4)}, {truck.lng.toFixed(4)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Last update: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Weekly Collection Trend</h4>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const value = Math.random() * 100
                    return (
                      <div key={day} className="flex items-center space-x-4">
                        <span className="w-8 text-sm font-medium text-gray-600">{day}</span>
                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${value}%`,
                              animationDelay: `${index * 100}ms`
                            }}
                          />
                        </div>
                        <span className="w-12 text-sm font-medium text-gray-900">
                          {Math.round(value)}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Route Efficiency</h4>
                <div className="space-y-4">
                  {[
                    { route: 'Route A', efficiency: 92, color: 'from-green-500 to-emerald-600' },
                    { route: 'Route B', efficiency: 87, color: 'from-blue-500 to-cyan-600' },
                    { route: 'Route C', efficiency: 94, color: 'from-purple-500 to-pink-600' },
                    { route: 'Route D', efficiency: 89, color: 'from-orange-500 to-red-600' }
                  ].map((route, index) => (
                    <div key={route.route} className="flex items-center space-x-4">
                      <span className="w-16 text-sm font-medium text-gray-600">{route.route}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${route.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ 
                            width: `${route.efficiency}%`,
                            animationDelay: `${index * 150}ms`
                          }}
                        />
                      </div>
                      <span className="w-12 text-sm font-bold text-gray-900">
                        {route.efficiency}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
            3
          </div>
        </button>
      </div>

      <style>{`
        @keyframes counter {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .counter-animation {
          animation: counter 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

export default InteractiveDemo
