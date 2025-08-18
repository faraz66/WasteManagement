import React, { useState } from 'react'
import { 
  Trophy, 
  Star, 
  Gift, 
  Zap, 
  Target, 
  Award,
  Crown,
  Gem,
  Coins,
  ShoppingBag,
  Calendar,
  TrendingUp
} from 'lucide-react'

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  type: 'discount' | 'product' | 'experience' | 'badge'
  image: string
  available: boolean
  category: string
}

interface UserLevel {
  current: number
  title: string
  pointsToNext: number
  totalPoints: number
  benefits: string[]
}

const RewardsSystem: React.FC = () => {
  const [userLevel] = useState<UserLevel>({
    current: 7,
    title: 'Eco Champion',
    pointsToNext: 580,
    totalPoints: 3420,
    benefits: ['20% marketplace discount', 'Priority support', 'Exclusive challenges']
  })

  const [availableRewards] = useState<Reward[]>([
    {
      id: '1',
      title: '50% Off Solar Panel Kit',
      description: 'Premium solar panel starter kit with installation guide',
      cost: 2000,
      type: 'discount',
      image: '🌞',
      available: true,
      category: 'energy'
    },
    {
      id: '2',
      title: 'Eco-Warrior Badge',
      description: 'Exclusive digital badge for your profile',
      cost: 500,
      type: 'badge',
      image: '🏆',
      available: true,
      category: 'achievement'
    },
    {
      id: '3',
      title: 'Tree Planting Experience',
      description: 'Join our community tree planting event',
      cost: 1500,
      type: 'experience',
      image: '🌳',
      available: true,
      category: 'experience'
    },
    {
      id: '4',
      title: 'Bamboo Utensil Set',
      description: 'Sustainable bamboo cutlery set with carrying case',
      cost: 800,
      type: 'product',
      image: '🥢',
      available: false,
      category: 'lifestyle'
    }
  ])

  const levels = [
    { level: 1, title: 'Eco Newbie', points: 0, color: 'text-gray-600' },
    { level: 2, title: 'Green Starter', points: 100, color: 'text-green-600' },
    { level: 3, title: 'Waste Warrior', points: 300, color: 'text-blue-600' },
    { level: 4, title: 'Sustainability Star', points: 600, color: 'text-purple-600' },
    { level: 5, title: 'Eco Expert', points: 1000, color: 'text-orange-600' },
    { level: 6, title: 'Green Guardian', points: 1500, color: 'text-red-600' },
    { level: 7, title: 'Eco Champion', points: 2500, color: 'text-emerald-600' },
    { level: 8, title: 'Planet Protector', points: 4000, color: 'text-indigo-600' },
  ]

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return <ShoppingBag className="h-6 w-6" />
      case 'product': return <Gift className="h-6 w-6" />
      case 'experience': return <Calendar className="h-6 w-6" />
      case 'badge': return <Award className="h-6 w-6" />
      default: return <Star className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            EcoRewards Store
          </h1>
          <p className="text-slate-600 text-lg">Turn your environmental impact into amazing rewards!</p>
        </div>

        {/* User Progress */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Current Level */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {userLevel.current}
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                  <Crown className="h-5 w-5 text-yellow-800" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{userLevel.title}</h3>
              <p className="text-slate-600">Level {userLevel.current}</p>
            </div>

            {/* Points Balance */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                <Coins className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{userLevel.totalPoints.toLocaleString()}</h3>
              <p className="text-slate-600">EcoPoints Available</p>
            </div>

            {/* Next Level Progress */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                <Target className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{userLevel.pointsToNext}</h3>
              <p className="text-slate-600">Points to Next Level</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Progress to Level {userLevel.current + 1}</span>
              <span>{Math.round((userLevel.totalPoints / (userLevel.totalPoints + userLevel.pointsToNext)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(userLevel.totalPoints / (userLevel.totalPoints + userLevel.pointsToNext)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Level Benefits */}
          <div className="mt-6">
            <h4 className="font-semibold text-slate-900 mb-3">Current Level Benefits:</h4>
            <div className="flex flex-wrap gap-2">
              {userLevel.benefits.map((benefit, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRewards.map((reward) => (
            <div key={reward.id} className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-xl ${
              reward.available 
                ? 'border-purple-200 hover:border-purple-400' 
                : 'border-gray-200 opacity-60'
            }`}>
              
              {/* Reward Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{reward.image}</div>
                <div className={`p-2 rounded-lg ${
                  reward.available ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {getRewardIcon(reward.type)}
                </div>
              </div>

              {/* Reward Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">{reward.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{reward.description}</p>

              {/* Cost and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gem className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-lg text-slate-900">{reward.cost.toLocaleString()}</span>
                  <span className="text-slate-600 text-sm">points</span>
                </div>
                
                <button 
                  disabled={!reward.available || userLevel.totalPoints < reward.cost}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    reward.available && userLevel.totalPoints >= reward.cost
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!reward.available ? 'Sold Out' : 
                   userLevel.totalPoints < reward.cost ? 'Not Enough Points' : 'Redeem'}
                </button>
              </div>

              {/* Availability Status */}
              {!reward.available && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-red-700 text-xs text-center">Currently unavailable</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Level Progression */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Level Progression</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {levels.map((level, index) => (
              <div key={level.level} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                level.level <= userLevel.current 
                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2 ${
                    level.level <= userLevel.current 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-gray-400'
                  }`}>
                    {level.level}
                  </div>
                  <h4 className={`font-semibold text-sm ${level.color}`}>{level.title}</h4>
                  <p className="text-xs text-slate-600">{level.points}+ pts</p>
                  {level.level <= userLevel.current && (
                    <div className="mt-2">
                      <Trophy className="h-4 w-4 text-yellow-500 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earning Points Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="text-center">
            <Zap className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Earn More Points!</h2>
            <p className="text-green-100 mb-6">Complete challenges and engage with the community to earn EcoPoints</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold">+50</div>
                <div className="text-sm text-green-100">Daily Login</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold">+100</div>
                <div className="text-sm text-green-100">Create Post</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold">+25</div>
                <div className="text-sm text-green-100">Like/Comment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardsSystem
