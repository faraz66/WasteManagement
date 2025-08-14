import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  ShoppingCart,
  Heart,
  Leaf,
  Recycle
} from 'lucide-react'

const Marketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for products
  const products = [
    {
      id: 1,
      name: 'Recycled Plastic Chairs',
      description: 'Comfortable outdoor chairs made from 100% recycled plastic bottles',
      price: 89.99,
      originalPrice: 120.00,
      rating: 4.8,
      reviews: 24,
      image: '/api/placeholder/300/200',
      seller: 'EcoFurniture Co.',
      category: 'Furniture',
      sustainability: 95,
      tags: ['Recycled', 'Outdoor', 'Durable']
    },
    {
      id: 2,
      name: 'Upcycled Wooden Table',
      description: 'Beautiful dining table crafted from reclaimed wood materials',
      price: 299.99,
      originalPrice: 450.00,
      rating: 4.9,
      reviews: 18,
      image: '/api/placeholder/300/200',
      seller: 'WoodCraft Renewals',
      category: 'Furniture',
      sustainability: 98,
      tags: ['Upcycled', 'Handmade', 'Premium']
    },
    {
      id: 3,
      name: 'Recycled Paper Notebooks',
      description: 'Set of 5 notebooks made from 100% recycled paper with eco-friendly binding',
      price: 24.99,
      originalPrice: 35.00,
      rating: 4.7,
      reviews: 56,
      image: '/api/placeholder/300/200',
      seller: 'Green Stationery',
      category: 'Office Supplies',
      sustainability: 92,
      tags: ['Paper', 'Office', 'Bulk']
    },
    {
      id: 4,
      name: 'Solar-Powered LED Lights',
      description: 'Energy-efficient outdoor lighting made from recycled aluminum',
      price: 149.99,
      originalPrice: 200.00,
      rating: 4.6,
      reviews: 31,
      image: '/api/placeholder/300/200',
      seller: 'SolarTech Solutions',
      category: 'Electronics',
      sustainability: 88,
      tags: ['Solar', 'LED', 'Outdoor']
    },
    {
      id: 5,
      name: 'Organic Compost Bags',
      description: 'Premium organic compost made from processed food waste',
      price: 19.99,
      originalPrice: 25.00,
      rating: 4.9,
      reviews: 42,
      image: '/api/placeholder/300/200',
      seller: 'CompostCorp',
      category: 'Garden',
      sustainability: 100,
      tags: ['Organic', 'Garden', 'Natural']
    },
    {
      id: 6,
      name: 'Recycled Glass Vases',
      description: 'Elegant decorative vases crafted from recycled glass bottles',
      price: 34.99,
      originalPrice: 50.00,
      rating: 4.8,
      reviews: 19,
      image: '/api/placeholder/300/200',
      seller: 'Glass Artisans',
      category: 'Home Decor',
      sustainability: 94,
      tags: ['Glass', 'Decorative', 'Handcrafted']
    }
  ]

  const categories = [
    'All Categories',
    'Furniture',
    'Electronics',
    'Office Supplies',
    'Garden',
    'Home Decor',
    'Clothing',
    'Tools'
  ]

  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sustainable Marketplace</h1>
          <p className="text-slate-600 mt-1">Discover eco-friendly products made from recycled materials</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="h-5 w-5" />
          </button>
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
            placeholder="Search products..."
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
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating</option>
          <option>Newest</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="card group hover:shadow-2xl transition-all duration-300">
            <div className="relative">
              <div className="aspect-w-16 aspect-h-10 bg-slate-200 rounded-xl overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <Recycle className="h-12 w-12 text-slate-400" />
                </div>
              </div>
              
              {/* Sustainability Badge */}
              <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                <Leaf className="h-3 w-3" />
                <span>{product.sustainability}%</span>
              </div>
              
              {/* Favorite Button */}
              <button className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 group-hover:scale-110">
                <Heart className="h-4 w-4 text-slate-400 hover:text-red-500" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-200">
                  <Link to={`/marketplace/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-slate-600">{product.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center space-x-2 mb-3">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-slate-900">${product.price}</span>
                  <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                </div>
                <span className="text-xs text-slate-500">{product.reviews} reviews</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">by {product.seller}</span>
                <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-secondary">
          Load More Products
        </button>
      </div>
    </div>
  )
}

export default Marketplace
