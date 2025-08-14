import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | undefined>(undefined)

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true)
      calculatePosition()
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    let x = 0
    let y = 0

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.top - tooltipRect.height - 8
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.bottom + 8
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      case 'right':
        x = triggerRect.right + 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
    }

    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8))
    y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8))

    setTooltipPosition({ x, y })
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-slate-800 transform rotate-45"
    
    switch (position) {
      case 'top':
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`
      case 'bottom':
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`
      case 'left':
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`
      case 'right':
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`
      default:
        return baseClasses
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-50 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg
            animate-in fade-in zoom-in-95 duration-200
            max-w-xs break-words
            ${className}
          `}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
          role="tooltip"
        >
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </>
  )
}

export default Tooltip
