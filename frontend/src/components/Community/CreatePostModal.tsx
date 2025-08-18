import React, { useState, useRef } from 'react'
import { 
  X, 
  Image, 
  MapPin, 
  Calendar, 
  Clock, 
  Leaf, 
  Tag,
  Upload,
  AlertCircle,
  Lightbulb,
  Hammer,
  HelpCircle,
  CalendarDays,
  Newspaper,
  Trophy
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { community } from '../../services/api'

interface CreatePostModalProps {
  onClose: () => void
  onPostCreated: (post: any) => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'general',
    category: '',
    tags: [] as string[],
    location_name: '',
    is_local_event: false,
    event_date: '',
    difficulty_level: '',
    estimated_time: '',
    environmental_impact: {} as Record<string, string>
  })
  
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [impactScore, setImpactScore] = useState(0)
  const [showAiHelper, setShowAiHelper] = useState(false)

  const postTypes = [
    { value: 'general', label: 'General', icon: '📝', description: 'Share thoughts and updates', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { value: 'tip', label: 'Eco Tip', icon: '💡', description: 'Share sustainability tips', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    { value: 'project', label: 'DIY Project', icon: '🔨', description: 'Share your eco projects', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { value: 'question', label: 'Question', icon: '❓', description: 'Ask the community', color: 'bg-green-50 border-green-200 text-green-800' },
    { value: 'event', label: 'Local Event', icon: '📅', description: 'Promote eco events', color: 'bg-orange-50 border-orange-200 text-orange-800' },
    { value: 'news', label: 'News', icon: '📰', description: 'Share environmental news', color: 'bg-red-50 border-red-200 text-red-800' },
    { value: 'achievement', label: 'Achievement', icon: '🏆', description: 'Celebrate eco wins', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' }
  ]

  const categories = [
    'recycling', 'composting', 'upcycling', 'renewable_energy', 
    'transportation', 'food_waste', 'plastic_reduction', 'gardening',
    'diy_projects', 'community_action', 'education', 'policy'
  ]

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      setErrors(prev => ({ 
        ...prev, 
        media: 'Some files were skipped. Only images and videos under 10MB are allowed.' 
      }))
    }

    setMediaFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
    setMediaPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const addEnvironmentalImpact = (key: string, value: string) => {
    if (key && value) {
      handleInputChange('environmental_impact', {
        ...formData.environmental_impact,
        [key]: value
      })
    }
  }

  const removeEnvironmentalImpact = (key: string) => {
    const newImpact = { ...formData.environmental_impact }
    delete newImpact[key]
    handleInputChange('environmental_impact', newImpact)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (formData.is_local_event && !formData.event_date) {
      newErrors.event_date = 'Event date is required for events'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'object') {
          submitData.append(key, JSON.stringify(value))
        } else {
          submitData.append(key, value.toString())
        }
      })

      // Add media files
      mediaFiles.forEach((file, index) => {
        submitData.append(`media_${index}`, file)
      })

      const response = await community.createPost(submitData)
      onPostCreated(response.data.post)
      
    } catch (error: any) {
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to create post. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Post Type</label>
            <div className="grid grid-cols-2 gap-3">
              {postTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('post_type', type.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                    formData.post_type === type.value
                      ? `${type.color} border-2 shadow-lg`
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-900">{type.label}</div>
                      <div className="text-sm text-slate-600">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What's your post about?"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Share your thoughts, tips, or experiences..."
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.content ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.content}</span>
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.category ? 'border-red-300' : 'border-slate-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.category}</span>
              </p>
            )}
          </div>

          {/* Event Details (if event type) */}
          {formData.post_type === 'event' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-800">
                <CalendarDays className="h-4 w-4" />
                <span className="font-medium">Event Details</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_local_event"
                  checked={formData.is_local_event}
                  onChange={(e) => handleInputChange('is_local_event', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="is_local_event" className="text-sm text-slate-700">
                  This is a local community event
                </label>
              </div>

              {formData.is_local_event && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={(e) => handleInputChange('event_date', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location_name}
                      onChange={(e) => handleInputChange('location_name', e.target.value)}
                      placeholder="Event location or address"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Project Details (if project type) */}
          {formData.post_type === 'project' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <Hammer className="h-4 w-4" />
                <span className="font-medium">Project Details</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select difficulty</option>
                    {difficultyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Time</label>
                  <input
                    type="text"
                    value={formData.estimated_time}
                    onChange={(e) => handleInputChange('estimated_time', e.target.value)}
                    placeholder="e.g., 2 hours, 1 week"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Environmental Impact */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Environmental Impact</label>
                <div className="space-y-2">
                  {Object.entries(formData.environmental_impact).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={key}
                        readOnly
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      />
                      <input
                        type="text"
                        value={value}
                        readOnly
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => removeEnvironmentalImpact(key)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Impact type (e.g., CO2 saved)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          const nextInput = target.nextElementSibling as HTMLInputElement
                          if (nextInput) nextInput.focus()
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Amount (e.g., 5kg)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          const prevInput = target.previousElementSibling as HTMLInputElement
                          if (prevInput && target.value) {
                            addEnvironmentalImpact(prevInput.value, target.value)
                            prevInput.value = ''
                            target.value = ''
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (press Enter)"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Tag className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Media (Optional)</label>
            <div className="space-y-3">
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary-500 transition-colors duration-200 flex items-center justify-center space-x-2 text-slate-600 hover:text-primary-600"
              >
                <Upload className="h-5 w-5" />
                <span>Click to upload images or videos (max 5 files, 10MB each)</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Media Previews */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.media && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.media}</span>
                </p>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.submit}</span>
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Post</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal
