import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Filter,
  Search,
  Sparkles,
  Award,
  Zap,
  Eye,
  ChevronDown,
  Star,
  Crown
} from 'lucide-react'

interface EnhancedPost {
  id: number
  title: string
  content: string
  author: {
    name: string
    avatar: string
    badge: 'eco-warrior' | 'community-leader' | 'verified' | null
    reputation: number
  }
  metrics: {
    likes: number
    comments: number
    shares: number
    views: number
    impactScore: number
  }
  engagement: {
    isLiked: boolean
    isBookmarked: boolean
    hasCommented: boolean
  }
  post_type: string
  category: string
  created_at: string
  trending: boolean
  featured: boolean
}

const EnhancedCommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<EnhancedPost[]>([
    {
      id: 1,
      title: "Revolutionary Composting Method Reduces Waste by 90%",
      content: "I've been experimenting with bokashi composting for 6 months and the results are incredible! This Japanese fermentation technique has completely transformed how I handle organic waste...",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        badge: "eco-warrior",
        reputation: 2450
      },
      metrics: {
        likes: 234,
        comments: 45,
        shares: 23,
        views: 1200,
        impactScore: 95
      },
      engagement: {
        isLiked: false,
        isBookmarked: true,
        hasCommented: false
      },
      post_type: "tip",
      category: "composting",
      created_at: "2 hours ago",
      trending: true,
      featured: true
    },
    {
      id: 2,
      title: "DIY Solar Water Heater from Recycled Materials",
      content: "Built this amazing solar water heater using old plastic bottles and some basic materials. Total cost: $15. Savings on electricity: $40/month!",
      author: {
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        badge: "community-leader",
        reputation: 1890
      },
      metrics: {
        likes: 189,
        comments: 32,
        shares: 67,
        views: 890,
        impactScore: 88
      },
      engagement: {
        isLiked: true,
        isBookmarked: false,
        hasCommented: true
      },
      post_type: "project",
      category: "diy_projects",
      created_at: "5 hours ago",
      trending: false,
      featured: false
    }
  ])

  const [activeFilter, setActiveFilter] = useState('trending')
  // const [showFilters, setShowFilters] = useState(false)

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case 'eco-warrior':
        return <Award className="h-4 w-4 text-green-600" />
      case 'community-leader':
        return <Crown className="h-4 w-4 text-purple-600" />
      case 'verified':
        return <Star className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'eco-warrior':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'community-leader':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'verified':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleEngagement = (postId: number, type: 'like' | 'bookmark' | 'share') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedPost = { ...post }
        switch (type) {
          case 'like':
            updatedPost.engagement.isLiked = !updatedPost.engagement.isLiked
            updatedPost.metrics.likes += updatedPost.engagement.isLiked ? 1 : -1
            break
          case 'bookmark':
            updatedPost.engagement.isBookmarked = !updatedPost.engagement.isBookmarked
            break
          case 'share':
            updatedPost.metrics.shares += 1
            break
        }
        return updatedPost
      }
      return post
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Community Feed
              </h1>
              <p className="text-slate-600 mt-2">Connect with fellow eco-warriors and share your journey</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-semibold">1,247 Active Now</span>
              </div>
            </div>
          </div>

          {/* Premium Filter Tabs */}
          <div className="flex items-center space-x-4 mb-6">
            {[
              { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-orange-600' },
              { id: 'following', label: 'Following', icon: Users, color: 'text-blue-600' },
              { id: 'local', label: 'Local', icon: MapPin, color: 'text-green-600' },
              { id: 'featured', label: 'Featured', icon: Star, color: 'text-purple-600' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <filter.icon className={`h-4 w-4 ${activeFilter === filter.id ? 'text-white' : filter.color}`} />
                <span className="font-medium">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Enhanced Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts, topics, or users..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-green-100"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900">{post.author.name}</h3>
                        {post.author.badge && (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getBadgeColor(post.author.badge)}`}>
                            {getBadgeIcon(post.author.badge)}
                            <span className="capitalize">{post.author.badge.replace('-', ' ')}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <span>{post.created_at}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3 text-orange-500" />
                          <span>{post.author.reputation} reputation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.trending && (
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Trending</span>
                      </div>
                    )}
                    {post.featured && (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <h2 className="text-xl font-bold text-slate-900 mb-3 hover:text-green-600 cursor-pointer transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Impact Score */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <div className="h-5 w-5 bg-green-600 rounded-full" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-800">Environmental Impact Score</div>
                        <div className="text-xs text-green-600">Based on community engagement and content quality</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{post.metrics.impactScore}</div>
                      <div className="text-xs text-green-600">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Engagement Bar */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleEngagement(post.id, 'like')}
                      className={`flex items-center space-x-2 transition-all duration-200 ${
                        post.engagement.isLiked 
                          ? 'text-red-600' 
                          : 'text-slate-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.engagement.isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{post.metrics.likes}</span>
                    </button>

                    <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{post.metrics.comments}</span>
                    </button>

                    <button
                      onClick={() => handleEngagement(post.id, 'share')}
                      className="flex items-center space-x-2 text-slate-600 hover:text-green-600 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="font-medium">{post.metrics.shares}</span>
                    </button>

                    <div className="flex items-center space-x-2 text-slate-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{post.metrics.views}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEngagement(post.id, 'bookmark')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      post.engagement.isBookmarked
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${post.engagement.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto">
            <span>Load More Posts</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCommunityFeed
