import React, { useState } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MapPin, 
  Clock, 
  Leaf,
  Award,
  Calendar,
  Users,
  ExternalLink,
  MoreHorizontal,
  Flag,
  Eye
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

interface PostCardProps {
  post: Post
  onInteraction: (postId: number, type: string) => void
}

const PostCard: React.FC<PostCardProps> = ({ post, onInteraction }) => {
  const [isLiked, setIsLiked] = useState(post.user_interacted || false)
  const [isSaved, setIsSaved] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onInteraction(post.id, 'like')
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onInteraction(post.id, 'save')
  }

  const handleShare = () => {
    onInteraction(post.id, 'share')
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.href
      })
    }
  }

  const handleComment = () => {
    onInteraction(post.id, 'comment')
    // Navigate to post detail or open comment modal
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'tip': return '💡'
      case 'project': return '🔨'
      case 'question': return '❓'
      case 'event': return '📅'
      case 'news': return '📰'
      case 'achievement': return '🏆'
      default: return '📝'
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'tip': return 'bg-blue-100 text-blue-800'
      case 'project': return 'bg-green-100 text-green-800'
      case 'question': return 'bg-purple-100 text-purple-800'
      case 'event': return 'bg-orange-100 text-orange-800'
      case 'news': return 'bg-red-100 text-red-800'
      case 'achievement': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isUpcoming = date > now
    
    return {
      formatted: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isUpcoming
    }
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Author Avatar */}
            <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {post.author_name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-900">{post.author_name}</span>
                {post.author_type === 'expert' && (
                  <Award className="h-4 w-4 text-yellow-500" title="Verified Expert" />
                )}
                {post.is_verified && (
                  <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                {post.location_name && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{post.location_name}</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views_count}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2">
                  <Flag className="h-4 w-4" />
                  <span>Report Post</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Open in New Tab</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Type and Category */}
        <div className="flex items-center space-x-2 mt-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
            <span className="mr-1">{getPostTypeIcon(post.post_type)}</span>
            {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
          </span>
          
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            #{post.category}
          </span>
          
          {post.is_featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
          {post.title}
        </h2>
        
        <div className="text-slate-700 leading-relaxed">
          {showFullContent ? (
            <div className="whitespace-pre-wrap">{post.content}</div>
          ) : (
            <div className="whitespace-pre-wrap">{truncateContent(post.content)}</div>
          )}
          
          {post.content.length > 300 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary-600 hover:text-primary-700 font-medium mt-2 text-sm"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Event Information */}
        {post.is_local_event && post.event_date && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-800">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Event Details</span>
            </div>
            <div className="mt-1 text-sm text-blue-700">
              {(() => {
                const eventInfo = formatEventDate(post.event_date)
                return (
                  <span className={eventInfo.isUpcoming ? 'font-medium' : 'opacity-75'}>
                    {eventInfo.formatted}
                    {eventInfo.isUpcoming ? ' (Upcoming)' : ' (Past Event)'}
                  </span>
                )
              })()}
            </div>
          </div>
        )}

        {/* Project Details */}
        {(post.difficulty_level || post.estimated_time) && (
          <div className="mt-4 flex items-center space-x-4 text-sm">
            {post.difficulty_level && (
              <div className="flex items-center space-x-1">
                <span className="text-slate-500">Difficulty:</span>
                <span className={`font-medium ${getDifficultyColor(post.difficulty_level)}`}>
                  {post.difficulty_level.charAt(0).toUpperCase() + post.difficulty_level.slice(1)}
                </span>
              </div>
            )}
            
            {post.estimated_time && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{post.estimated_time}</span>
              </div>
            )}
          </div>
        )}

        {/* Environmental Impact */}
        {post.environmental_impact && Object.keys(post.environmental_impact).length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 text-green-800 mb-2">
              <Leaf className="h-4 w-4" />
              <span className="font-medium text-sm">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(post.environmental_impact).map(([key, value]) => (
                <div key={key} className="text-green-700">
                  <span className="capitalize">{key.replace('_', ' ')}: </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2">
              {post.media_urls.slice(0, 4).map((url, index) => (
                <div key={index} className="aspect-w-16 aspect-h-10 bg-slate-200 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                  />
                  {index === 3 && post.media_urls.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium">+{post.media_urls.length - 4} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isLiked 
                  ? 'text-red-600' 
                  : 'text-slate-500 hover:text-red-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes_count}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleComment}
              className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-slate-500 hover:text-green-600 transition-colors duration-200"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">{post.shares_count}</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isSaved 
                ? 'text-yellow-600 bg-yellow-50' 
                : 'text-slate-400 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
