import React from 'react'
import { 
  TrendingUp, 
  Recycle, 
  DollarSign, 
  Users, 
  BarChart3,
  Leaf,
  ShoppingCart,
  Award
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Waste Processed',
      value: '2,847 kg',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Recycle,
      color: 'bg-green-500'
    },
    {
      name: 'Revenue Generated',
      value: '$18,420',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Users',
      value: '1,234',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'CO₂ Saved',
      value: '4.2 tons',
      change: '+22.1%',
      changeType: 'positive' as const,
      icon: Leaf,
      color: 'bg-emerald-500'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'processing',
      title: 'Plastic waste batch processed',
      description: '150kg of plastic waste converted to reusable materials',
      time: '2 hours ago',
      icon: Recycle,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 2,
      type: 'sale',
      title: 'Product sold on marketplace',
      description: 'Recycled furniture set sold for $450',
      time: '4 hours ago',
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Sustainability milestone reached',
      description: 'Processed 1000kg of waste this month',
      time: '1 day ago',
      icon: Award,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Your EcoWaste Dashboard</h1>
            <p className="text-primary-100 text-lg">
              Track your environmental impact and manage your waste processing activities
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-sm text-slate-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Waste Processing Trends</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg">
                  7 days
                </button>
                <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900">
                  30 days
                </button>
                <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900">
                  90 days
                </button>
              </div>
            </div>
            
            {/* Placeholder for chart */}
            <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Chart visualization will be here</p>
                <p className="text-sm text-slate-500">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 rounded-lg transition-colors duration-200">
            View All Activities
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
            <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg">
              <Recycle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Process Waste</p>
              <p className="text-sm text-slate-600">Start new processing batch</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
            <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Add Product</p>
              <p className="text-sm text-slate-600">List item on marketplace</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
            <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">View Reports</p>
              <p className="text-sm text-slate-600">Detailed analytics</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
