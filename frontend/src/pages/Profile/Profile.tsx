import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Award,
  TrendingUp,
  Recycle,
  Leaf
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate about sustainable living and environmental conservation. Working towards a zero-waste lifestyle.',
    company: 'EcoTech Solutions',
    website: 'www.ecotech-solutions.com'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false)
    // toast.success('Profile updated successfully!')
  }

  const stats = [
    {
      label: 'Waste Processed',
      value: '2,847 kg',
      change: '+12.5%',
      icon: Recycle,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'CO₂ Saved',
      value: '4.2 tons',
      change: '+22.1%',
      icon: Leaf,
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      label: 'Products Sold',
      value: '156',
      change: '+8.3%',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Courses Completed',
      value: '12',
      change: '+3',
      icon: Award,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Eco Warrior',
      description: 'Processed over 1000kg of waste',
      icon: '🌱',
      earned: true,
      date: '2 months ago'
    },
    {
      id: 2,
      title: 'Marketplace Master',
      description: 'Sold 100+ products on marketplace',
      icon: '🏆',
      earned: true,
      date: '1 month ago'
    },
    {
      id: 3,
      title: 'Learning Champion',
      description: 'Completed 10 sustainability courses',
      icon: '📚',
      earned: true,
      date: '3 weeks ago'
    },
    {
      id: 4,
      title: 'Carbon Neutral',
      description: 'Offset 5 tons of CO₂ emissions',
      icon: '🌍',
      earned: false,
      progress: 84
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'processing',
      title: 'Processed plastic waste batch',
      description: '150kg of plastic waste converted',
      time: '2 hours ago',
      icon: Recycle
    },
    {
      id: 2,
      type: 'course',
      title: 'Completed "Advanced Recycling"',
      description: 'Earned certificate with 95% score',
      time: '1 day ago',
      icon: Award
    },
    {
      id: 3,
      type: 'sale',
      title: 'Sold recycled furniture set',
      description: 'Earned $450 from marketplace sale',
      time: '3 days ago',
      icon: TrendingUp
    }
  ]

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 p-2 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 transition-colors duration-200">
              <Camera className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field text-xl font-bold"
                  placeholder="Your name"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Tell us about yourself"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{formData.name}</h1>
                <p className="text-slate-600 mt-1">{formData.bio}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined March 2024</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">{formData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">{formData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">{formData.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">{formData.company}</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <activity.icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{activity.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-xl border-2 ${
                achievement.earned 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      achievement.earned ? 'text-green-800' : 'text-slate-700'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      achievement.earned ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <p className="text-xs text-green-500 mt-2">
                        Earned {achievement.date}
                      </p>
                    ) : (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
