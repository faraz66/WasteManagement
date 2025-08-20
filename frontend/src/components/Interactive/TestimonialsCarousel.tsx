import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
  stats: {
    wasteReduced: string
    costSaved: string
    efficiency: string
  }
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Sustainability Director",
    company: "GreenTech Industries",
    content: "EcoCircle transformed our waste management completely. We've reduced costs by 40% while improving our environmental impact. The real-time tracking and analytics are game-changing.",
    rating: 5,
    avatar: "SC",
    stats: {
      wasteReduced: "65%",
      costSaved: "$2.4M",
      efficiency: "92%"
    }
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Operations Manager",
    company: "Urban Waste Solutions",
    content: "The platform's AI-driven route optimization has revolutionized our operations. Our drivers are happier, customers are satisfied, and our bottom line has never looked better.",
    rating: 5,
    avatar: "MR",
    stats: {
      wasteReduced: "58%",
      costSaved: "$1.8M",
      efficiency: "89%"
    }
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    role: "Environmental Scientist",
    company: "EcoCity Municipality",
    content: "EcoCircle's comprehensive approach to waste management has helped us achieve our sustainability goals ahead of schedule. The data insights are invaluable for policy making.",
    rating: 5,
    avatar: "EW",
    stats: {
      wasteReduced: "72%",
      costSaved: "$3.2M",
      efficiency: "95%"
    }
  },
  {
    id: 4,
    name: "James Park",
    role: "CEO",
    company: "RecycleTech Corp",
    content: "The marketplace feature connected us with new suppliers and buyers we never would have found otherwise. It's like having a business development team working 24/7.",
    rating: 5,
    avatar: "JP",
    stats: {
      wasteReduced: "61%",
      costSaved: "$2.1M",
      efficiency: "87%"
    }
  }
]

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            See how organizations worldwide are transforming their waste management with EcoCircle
          </p>
        </div>

        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Testimonial */}
              <div className="space-y-6">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-white leading-relaxed font-medium">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {currentTestimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-emerald-200">
                      {currentTestimonial.role}
                    </div>
                    <div className="text-emerald-300 font-medium">
                      {currentTestimonial.company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Waste Reduced', value: currentTestimonial.stats.wasteReduced, color: 'from-green-400 to-emerald-500' },
                  { label: 'Cost Saved', value: currentTestimonial.stats.costSaved, color: 'from-blue-400 to-cyan-500' },
                  { label: 'Efficiency', value: currentTestimonial.stats.efficiency, color: 'from-purple-400 to-pink-500' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <div className="text-emerald-100 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-emerald-400 w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isAutoPlaying
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/10 text-white/60 border border-white/20'
            }`}
          >
            {isAutoPlaying ? '⏸ Pause Auto-play' : '▶ Resume Auto-play'}
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  )
}

export default TestimonialsCarousel
