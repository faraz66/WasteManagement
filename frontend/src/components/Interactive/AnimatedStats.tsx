import { useState, useEffect, useRef } from 'react'
import { 
  BuildingOfficeIcon,
  TruckIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface StatItem {
  icon: any
  value: number
  suffix: string
  label: string
  color: string
  prefix?: string
}

const stats: StatItem[] = [
  {
    icon: BuildingOfficeIcon,
    value: 2500,
    suffix: '+',
    label: 'Companies Trust Us',
    color: 'from-emerald-500 to-teal-600',
    prefix: ''
  },
  {
    icon: TruckIcon,
    value: 15000,
    suffix: '+',
    label: 'Vehicles Tracked',
    color: 'from-blue-500 to-cyan-600',
    prefix: ''
  },
  {
    icon: GlobeAltIcon,
    value: 98,
    suffix: '%',
    label: 'Uptime Guarantee',
    color: 'from-purple-500 to-pink-600',
    prefix: ''
  },
  {
    icon: ChartBarIcon,
    value: 45,
    suffix: 'M',
    label: 'Tons Processed',
    color: 'from-orange-500 to-red-600',
    prefix: '$'
  }
]

const AnimatedStats = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0))
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          animateCounters()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = stat.value / steps
      let current = 0
      let step = 0

      const timer = setInterval(() => {
        step++
        current = Math.min(stat.value, Math.floor(increment * step))
        
        setAnimatedValues(prev => {
          const newValues = [...prev]
          newValues[index] = current
          return newValues
        })

        if (step >= steps) {
          clearInterval(timer)
        }
      }, duration / steps)
    })
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Industry Leaders Worldwide
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join thousands of organizations transforming their waste management operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 group-hover:transform group-hover:scale-105">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                {/* Value */}
                <div className="mb-4">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 font-mono">
                    {stat.prefix}
                    <span className="tabular-nums">
                      {animatedValues[index].toLocaleString()}
                    </span>
                    {stat.suffix}
                  </div>
                  <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
                </div>

                {/* Label */}
                <div className="text-slate-300 font-medium text-lg">
                  {stat.label}
                </div>

                {/* Animated Progress Bar */}
                <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-2000 ease-out`}
                    style={{ 
                      width: isVisible ? '100%' : '0%',
                      transitionDelay: `${index * 200}ms`
                    }}
                  />
                </div>

                {/* Floating Particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: `${index * 500}ms` }} />
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: `${index * 300}ms` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-white">
              <div className="text-lg font-semibold mb-1">Ready to join them?</div>
              <div className="text-slate-300">Start your transformation today</div>
            </div>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-2">
              <span>Get Started</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  )
}

export default AnimatedStats
