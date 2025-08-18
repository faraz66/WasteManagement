import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Leaf, 
  Recycle,
  BarChart3,
  Calendar,
  MapPin,
  Star,
  Trophy,
  Zap,
  ChevronRight,
  Plus
} from 'lucide-react'

interface DashboardStats {
  totalImpact: number
  communityRank: number
  streakDays: number
  pointsEarned: number
  postsCreated: number
  engagementRate: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  category: string
}

interface Challenge {
  id: string
  title: string
  description: string
  reward: number
  deadline: string
  progress: number
  maxProgress: number
  type: 'daily' | 'weekly' | 'monthly'
}

const PremiumDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalImpact: 1250,
    communityRank: 47,
    streakDays: 12,
    pointsEarned: 3420,
    postsCreated: 28,
    engagementRate: 87
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Eco Warrior',
      description: 'Create 25 eco-friendly posts',
      icon: '🌱',
      unlocked: true,
      progress: 28,
      maxProgress: 25,
      category: 'content'
    },
    {
      id: '2',
      title: 'Community Leader',
      description: 'Get 100 likes on your posts',
      icon: '👑',
      unlocked: false,
      progress: 73,
      maxProgress: 100,
      category: 'engagement'
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintain 30-day activity streak',
      icon: '🔥',
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      category: 'consistency'
    }
  ])

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Daily Green Action',
      description: 'Share one eco-tip today',
      reward: 50,
      deadline: '2025-08-18',
      progress: 0,
      maxProgress: 1,
      type: 'daily'
    },
    {
      id: '2',
      title: 'Weekly Recycling Hero',
      description: 'Post 3 recycling projects this week',
      reward: 200,
      deadline: '2025-08-24',
      progress: 1,
      maxProgress: 3,
      type: 'weekly'
    }
  ])

  const impactMetrics = [
    { label: 'CO₂ Saved', value: '2.4 tons', icon: '🌍', color: 'text-green-600' },
    { label: 'Waste Diverted', value: '156 kg', icon: '♻️', color: 'text-blue-600' },
    { label: 'Trees Planted', value: '12', icon: '🌳', color: 'text-emerald-600' },
    { label: 'Water Saved', value: '890L', icon: '💧', color: 'text-cyan-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, Eco Champion! 🌟</h1>
            <p className="text-slate-600 mt-2">Your sustainable journey continues to inspire others</p>
          </div>
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>New Action</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Impact Score</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalImpact}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Community Rank</p>
                <p className="text-3xl font-bold text-blue-600">#{stats.communityRank}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Users className="h-4 w-4 mr-1" />
              <span>Top 5% globally</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Streak Days</p>
                <p className="text-3xl font-bold text-orange-600">{stats.streakDays}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <Target className="h-4 w-4 mr-1" />
              <span>18 days to milestone</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">EcoPoints</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pointsEarned}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <Award className="h-4 w-4 mr-1" />
              <span>580 to next level</span>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Environmental Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{metric.icon}</div>
                <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-sm text-slate-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Achievements */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
              <button className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-xl border-2 ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                        <p className="text-sm text-slate-600">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-green-600">
                        <Award className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  
                  {!achievement.unlocked && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Challenges */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Active Challenges</h2>
              <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <span>Browse More</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{challenge.title}</h3>
                      <p className="text-sm text-slate-600">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Reward</div>
                      <div className="font-bold text-blue-600">{challenge.reward} pts</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                    <span>Progress: {challenge.progress}/{challenge.maxProgress}</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {challenge.deadline}
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Community Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Posted eco-tip about composting', time: '2 hours ago', points: '+25 pts' },
              { action: 'Completed recycling challenge', time: '1 day ago', points: '+100 pts' },
              { action: 'Shared DIY solar panel project', time: '3 days ago', points: '+75 pts' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-900">{activity.action}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600">{activity.time}</span>
                  <span className="text-sm font-semibold text-green-600">{activity.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumDashboard
