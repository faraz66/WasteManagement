import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Filter, 
  Search, 
  TrendingUp, 
  MapPin, 
  Users, 
  Heart,
  RefreshCw,

  Plus,
  ChevronDown,
  X
} from 'lucide-react'
import PostCard from './PostCard'
import CreatePostModal from './CreatePostModal'
import { community } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

interface Post {
  id: number
  title: string
  content: string
  post_type: string
  category: string
  tags: string[]
  media_urls: string[]
  author_name: string
  author_type: string
  location_name?: string
  is_local_event: boolean
  event_date?: string
  difficulty_level?: string
  estimated_time?: string
  environmental_impact?: Record<string, string>
  is_featured: boolean
  is_verified: boolean
  likes_count: number
  comments_count: number
  shares_count: number
  views_count: number
  created_at: string
  score?: number
  user_interacted?: boolean
}

interface FeedFilters {
  feedType: 'personalized' | 'trending' | 'local' | 'following'
  category: string
  postType: string
  timeRange: string
  location: string
  sortBy: 'recent' | 'popular' | 'trending'
}

const CommunityFeed: React.FC = () => {
  const { } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<FeedFilters>({
    feedType: 'personalized',
    category: '',
    postType: '',
    timeRange: '',
    location: '',
    sortBy: 'recent'
  })

  const observerRef = useRef<IntersectionObserver>(null)
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts()
      }
    })
    if (node) observerRef.current.observe(node)
  }, [loadingMore, hasMore])

  const categories = [
    'recycling', 'composting', 'upcycling', 'renewable_energy', 
    'transportation', 'food_waste', 'plastic_reduction', 'gardening',
    'diy_projects', 'community_action', 'education', 'policy'
  ]

  const postTypes = [
    { value: 'general', label: 'General' },
    { value: 'tip', label: 'Eco Tips' },
    { value: 'project', label: 'DIY Projects' },
    { value: 'question', label: 'Questions' },
    { value: 'event', label: 'Events' },
    { value: 'news', label: 'News' },
    { value: 'achievement', label: 'Achievements' }
  ]

  const timeRanges = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ]

  const loadFeed = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(1)
        setError(null)
      }

      const params = {
        page: reset ? 1 : page,
        limit: 10,
        search: searchQuery,
        ...filters
      }

      let response
      try {
        switch (filters.feedType) {
          case 'trending':
            response = await community.getTrendingFeed(params)
            break
          case 'local':
            response = await community.getLocalFeed(params)
            break
          case 'following':
            response = await community.getFollowingFeed(params)
            break
          default:
            response = await community.getPersonalizedFeed(params)
        }
      } catch (apiError) {
        // If community API fails, provide mock data to prevent logout
        console.warn('Community API not available, using mock data:', apiError)
        response = {
          data: {
            posts: [
              {
                id: 1,
                title: "Welcome to the EcoCircle Community!",
                content: "This is a sample post. The community features are being set up. Stay tuned for more eco-friendly content!",
                post_type: "general",
                category: "community_action",
                tags: ["welcome", "community"],
                media_urls: [],
                author_name: "EcoCircle Team",
                author_type: "admin",
                is_local_event: false,
                is_featured: true,
                is_verified: true,
                likes_count: 42,
                comments_count: 8,
                shares_count: 5,
                views_count: 156,
                created_at: new Date().toISOString(),
                score: 95
              }
            ]
          }
        }
      }

      const newPosts = response.data.posts || []
      
      if (reset) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      setHasMore(newPosts.length === 10)
      if (!reset) {
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to load feed:', error)
      setError('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
    }
  }

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    setPage(prev => prev + 1)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      try {
        setLoading(true)
        const response = await community.searchPosts({
          query: query.trim(),
          category: filters.category,
          post_type: filters.postType,
          page: 1,
          limit: 10
        })
        setPosts(response.data.posts || [])
        setHasMore(false) // Search results don't paginate the same way
      } catch (error) {
        console.error('Search error:', error)
        setError('Search failed. Please try again.')
      } finally {
        setLoading(false)
      }
    } else {
      loadFeed(true)
    }
  }

  const handleFilterChange = (key: keyof FeedFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setShowFilters(false)
    loadFeed(true)
  }

  const clearFilters = () => {
    setFilters({
      feedType: 'personalized',
      category: '',
      postType: '',
      timeRange: '',
      location: '',
      sortBy: 'recent'
    })
    setSearchQuery('')
    loadFeed(true)
  }

  const handlePostInteraction = async (postId: number, type: string) => {
    try {
      await community.recordInteraction(String(postId), type)
      
      // Update local state optimistically
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const updated = { ...post }
          switch (type) {
            case 'like':
              updated.likes_count += post.user_interacted ? -1 : 1
              updated.user_interacted = !post.user_interacted
              break
            case 'share':
              updated.shares_count += 1
              break
            case 'view':
              updated.views_count += 1
              break
          }
          return updated
        }
        return post
      }))
    } catch (error) {
      console.error('Interaction error:', error)
    }
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
    setShowCreateModal(false)
  }

  const refreshFeed = () => {
    setRefreshing(true)
    loadFeed(true)
  }

  // Load initial feed
  useEffect(() => {
    loadFeed(true)
  }, [])

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadFeed(false)
    }
  }, [page])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Community Feed</h1>
            <p className="text-slate-600 mt-1">Connect with fellow eco-warriors and share your journey</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshFeed}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              title="Refresh feed"
            >
              <RefreshCw className={`h-5 w-5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Feed Type Tabs */}
        <div className="flex items-center space-x-1 mb-6">
          {[
            { key: 'personalized', label: 'For You', icon: Heart },
            { key: 'trending', label: 'Trending', icon: TrendingUp },
            { key: 'local', label: 'Local', icon: MapPin },
            { key: 'following', label: 'Following', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleFilterChange('feedType', key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filters.feedType === key
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search posts, topics, or users..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors duration-200 ${
              showFilters 
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Post Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Post Type</label>
                <select
                  value={filters.postType}
                  onChange={(e) => handleFilterChange('postType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {postTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Range Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Time Range</label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="text-sm text-slate-600 hover:text-slate-800 flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
              
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => {
              setError(null)
              loadFeed(true)
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && posts.length === 0 && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
          <p className="text-slate-600 mb-6">
            {searchQuery 
              ? 'No posts match your search criteria. Try different keywords or filters.'
              : 'Be the first to share your eco-friendly journey with the community!'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Post
            </button>
          )}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostElementRef : null}
          >
            <PostCard
              post={post}
              onInteraction={handlePostInteraction}
            />
          </div>
        ))}
      </div>

      {/* Load More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">You've reached the end of the feed! 🌟</p>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  )
}

export default CommunityFeed
