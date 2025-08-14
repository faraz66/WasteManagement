import React, { useState } from 'react'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Award, 
  Search,
  Filter,
  Leaf,
  Recycle,
  Globe,
  Lightbulb
} from 'lucide-react'

const Education: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Topics')

  const categories = [
    'All Topics',
    'Waste Reduction',
    'Recycling',
    'Composting',
    'Sustainability',
    'Green Technology',
    'Environmental Impact'
  ]

  const courses = [
    {
      id: 1,
      title: 'Introduction to Waste Management',
      description: 'Learn the fundamentals of sustainable waste management and its environmental impact.',
      instructor: 'Dr. Sarah Green',
      duration: '2 hours',
      students: 1234,
      rating: 4.8,
      level: 'Beginner',
      category: 'Waste Reduction',
      image: '/api/placeholder/300/200',
      lessons: 8,
      certificate: true,
      free: true
    },
    {
      id: 2,
      title: 'Advanced Recycling Techniques',
      description: 'Explore cutting-edge recycling methods and technologies for different materials.',
      instructor: 'Prof. Michael Chen',
      duration: '4 hours',
      students: 856,
      rating: 4.9,
      level: 'Advanced',
      category: 'Recycling',
      image: '/api/placeholder/300/200',
      lessons: 12,
      certificate: true,
      free: false,
      price: 49.99
    },
    {
      id: 3,
      title: 'Home Composting Mastery',
      description: 'Master the art of composting at home and turn organic waste into nutrient-rich soil.',
      instructor: 'Emma Rodriguez',
      duration: '1.5 hours',
      students: 2341,
      rating: 4.7,
      level: 'Beginner',
      category: 'Composting',
      image: '/api/placeholder/300/200',
      lessons: 6,
      certificate: true,
      free: true
    },
    {
      id: 4,
      title: 'Sustainable Business Practices',
      description: 'Implement eco-friendly practices in your business to reduce environmental impact.',
      instructor: 'David Park',
      duration: '3 hours',
      students: 567,
      rating: 4.6,
      level: 'Intermediate',
      category: 'Sustainability',
      image: '/api/placeholder/300/200',
      lessons: 10,
      certificate: true,
      free: false,
      price: 79.99
    },
    {
      id: 5,
      title: 'Green Technology Innovations',
      description: 'Discover the latest innovations in green technology and renewable energy.',
      instructor: 'Dr. Lisa Wang',
      duration: '2.5 hours',
      students: 423,
      rating: 4.9,
      level: 'Advanced',
      category: 'Green Technology',
      image: '/api/placeholder/300/200',
      lessons: 9,
      certificate: true,
      free: false,
      price: 59.99
    },
    {
      id: 6,
      title: 'Environmental Impact Assessment',
      description: 'Learn how to assess and minimize environmental impact in various industries.',
      instructor: 'Prof. James Miller',
      duration: '5 hours',
      students: 234,
      rating: 4.8,
      level: 'Advanced',
      category: 'Environmental Impact',
      image: '/api/placeholder/300/200',
      lessons: 15,
      certificate: true,
      free: false,
      price: 99.99
    }
  ]

  const articles = [
    {
      id: 1,
      title: '10 Simple Ways to Reduce Waste at Home',
      excerpt: 'Practical tips for reducing household waste and living more sustainably.',
      readTime: '5 min read',
      category: 'Waste Reduction',
      author: 'Green Living Team',
      date: '2 days ago'
    },
    {
      id: 2,
      title: 'The Future of Plastic Recycling',
      excerpt: 'Exploring new technologies that are revolutionizing plastic waste processing.',
      readTime: '8 min read',
      category: 'Recycling',
      author: 'Tech Sustainability',
      date: '1 week ago'
    },
    {
      id: 3,
      title: 'Building a Circular Economy',
      excerpt: 'How businesses can transition from linear to circular economic models.',
      readTime: '12 min read',
      category: 'Sustainability',
      author: 'Business Green',
      date: '2 weeks ago'
    }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Topics' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Education Hub</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Expand your knowledge about sustainability, waste management, and environmental protection 
          through our comprehensive learning resources.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">50+</div>
          <div className="text-sm text-slate-600">Courses Available</div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">10K+</div>
          <div className="text-sm text-slate-600">Active Learners</div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">5K+</div>
          <div className="text-sm text-slate-600">Certificates Earned</div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
            <Globe className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">25+</div>
          <div className="text-sm text-slate-600">Countries Reached</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses and articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors duration-200">
            <Filter className="h-5 w-5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Featured Course */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured Course
              </span>
              <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">
                FREE
              </span>
            </div>
            <h2 className="text-3xl font-bold">Zero Waste Lifestyle Challenge</h2>
            <p className="text-primary-100 text-lg">
              Join thousands of learners in our 30-day challenge to reduce your environmental footprint 
              and adopt sustainable living practices.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>30 days</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>3,456 enrolled</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Certificate included</span>
              </div>
            </div>
            <button className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
              Start Challenge
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <Lightbulb className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Available Courses</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Rating</option>
              <option>Duration</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card group hover:shadow-2xl transition-all duration-300">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-slate-200 rounded-xl overflow-hidden mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-slate-400" />
                  </div>
                </div>
                
                {course.free && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    FREE
                  </div>
                )}
                
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700">
                  {course.level}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>by {course.instructor}</span>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-slate-300'
                          }`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                  {course.certificate && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Award className="h-4 w-4" />
                      <span className="text-xs">Certificate</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  {course.free ? (
                    <span className="text-lg font-bold text-green-600">Free</span>
                  ) : (
                    <span className="text-lg font-bold text-slate-900">${course.price}</span>
                  )}
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    {course.free ? 'Start Learning' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="card group hover:shadow-lg transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500">{article.readTime}</span>
                </div>
                
                <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors duration-200">
                  {article.title}
                </h3>
                
                <p className="text-sm text-slate-600">{article.excerpt}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
                  <span>by {article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Education
