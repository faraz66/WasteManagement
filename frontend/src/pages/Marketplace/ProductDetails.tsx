import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  Leaf, 
  Recycle,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react'

const ProductDetails: React.FC = () => {
  useParams<{ id: string }>()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock product data - in real app, fetch based on id
  const product = {
    id: 1,
    name: 'Recycled Plastic Chairs',
    description: 'These comfortable outdoor chairs are crafted from 100% recycled plastic bottles, making them both environmentally friendly and incredibly durable. Perfect for patios, gardens, and outdoor dining areas.',
    longDescription: 'Our recycled plastic chairs represent the perfect fusion of sustainability and comfort. Each chair is made from approximately 25 recycled plastic bottles, diverted from landfills and transformed into beautiful, functional furniture. The weather-resistant material ensures these chairs will last for years, making them a smart investment for your outdoor space.',
    price: 89.99,
    originalPrice: 120.00,
    rating: 4.8,
    reviews: 24,
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    seller: {
      name: 'EcoFurniture Co.',
      rating: 4.9,
      reviews: 156,
      verified: true
    },
    category: 'Furniture',
    sustainability: 95,
    tags: ['Recycled', 'Outdoor', 'Durable'],
    specifications: {
      'Material': '100% Recycled Plastic',
      'Dimensions': '24" W x 22" D x 32" H',
      'Weight': '8.5 lbs',
      'Weight Capacity': '300 lbs',
      'Weather Resistant': 'Yes',
      'Assembly Required': 'Minimal'
    },
    features: [
      'Made from 25+ recycled plastic bottles',
      'UV-resistant and fade-proof',
      'Easy to clean and maintain',
      'Stackable for easy storage',
      'Available in multiple colors'
    ],
    inStock: true,
    stockCount: 15
  }

  const reviews = [
    {
      id: 1,
      user: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Absolutely love these chairs! They\'re comfortable, look great, and I feel good knowing they\'re made from recycled materials.',
      verified: true
    },
    {
      id: 2,
      user: 'Mike R.',
      rating: 4,
      date: '1 month ago',
      comment: 'Great quality and very sturdy. Perfect for our outdoor dining set. Delivery was fast too!',
      verified: true
    },
    {
      id: 3,
      user: 'Jennifer L.',
      rating: 5,
      date: '1 month ago',
      comment: 'These chairs have held up beautifully through rain and sun. Highly recommend for anyone looking for sustainable furniture.',
      verified: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/marketplace" className="flex items-center space-x-1 text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-600">{product.category}</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-12 bg-slate-200 rounded-2xl overflow-hidden">
            <div className="w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <Recycle className="h-24 w-24 text-slate-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-16 aspect-h-12 bg-slate-200 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary-500' : 'border-transparent'
                }`}
              >
                <div className="w-full h-20 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <Recycle className="h-8 w-8 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors duration-200">
                <Heart className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">({product.reviews} reviews)</span>
              </div>
              
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Leaf className="h-4 w-4" />
                <span>{product.sustainability}% Sustainable</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-slate-900">${product.price}</span>
            <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-sm font-semibold">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
            <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">{product.seller.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-900">{product.seller.name}</span>
                {product.seller.verified && (
                  <Shield className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-slate-600">{product.seller.rating} ({product.seller.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-slate-700">Quantity:</label>
              <div className="flex items-center border border-slate-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-slate-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-slate-600">
                {product.stockCount} available
              </span>
            </div>

            <div className="flex space-x-4">
              <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button className="btn-secondary px-6">
                Buy Now
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Truck className="h-6 w-6 text-green-600" />
              <span className="text-sm text-slate-600">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <RotateCcw className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-slate-600">30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-slate-600">2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="card">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 border-primary-500 text-primary-600 font-semibold">
              Description
            </button>
            <button className="py-4 px-1 text-slate-600 hover:text-slate-900">
              Specifications
            </button>
            <button className="py-4 px-1 text-slate-600 hover:text-slate-900">
              Reviews ({product.reviews})
            </button>
          </nav>
        </div>

        <div className="py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Product Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.longDescription}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Customer Reviews</h3>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-slate-900">{review.user}</span>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-500">{review.date}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
