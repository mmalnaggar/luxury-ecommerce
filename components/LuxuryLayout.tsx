'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LuxuryLayoutProps {
  children: ReactNode
  background?: 'gradient' | 'solid'
  accent?: 'gold' | 'silver' | 'platinum'
  className?: string
}

interface LuxuryCardProps {
  children: ReactNode
  hover?: boolean
  accent?: 'gold' | 'silver' | 'platinum'
  className?: string
}

interface LuxuryButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  accent?: 'gold' | 'silver' | 'platinum'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export default function LuxuryLayout({
  children,
  background = 'gradient',
  className = '',
}: LuxuryLayoutProps) {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    solid: 'bg-slate-900',
  }

  return (
    <div className={`min-h-screen ${backgroundClasses[background]} ${className}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Luxury accent elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
    </div>
  )
}

export function LuxuryCard({
  children,
  hover = false,
  accent = 'gold',
  className = '',
}: LuxuryCardProps) {
  const baseClasses = 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6'
  const hoverClasses = hover ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl' : ''
  
  const accentClasses = {
    gold: 'border-amber-400/20 hover:border-amber-400/40',
    silver: 'border-slate-300/20 hover:border-slate-300/40',
    platinum: 'border-emerald-300/20 hover:border-emerald-300/40',
  }

  return (
    <div className={`${baseClasses} ${hoverClasses} ${accentClasses[accent]} ${className}`}>
      {children}
    </div>
  )
}

export function LuxuryButton({
  children,
  variant = 'primary',
  accent = 'gold',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}: LuxuryButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800'
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary: {
      gold: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 focus:ring-amber-400',
      silver: 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 hover:from-slate-400 hover:to-slate-500 focus:ring-slate-300',
      platinum: 'bg-gradient-to-r from-emerald-300 to-teal-400 text-slate-900 hover:from-emerald-400 hover:to-teal-500 focus:ring-emerald-300',
    },
    outline: {
      gold: 'border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 focus:ring-amber-400',
      silver: 'border-2 border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-slate-900 focus:ring-slate-300',
      platinum: 'border-2 border-emerald-300 text-emerald-300 hover:bg-emerald-300 hover:text-slate-900 focus:ring-emerald-300',
    },
    ghost: {
      gold: 'text-amber-400 hover:bg-amber-400/10 focus:ring-amber-400',
      silver: 'text-slate-300 hover:bg-slate-300/10 focus:ring-slate-300',
      platinum: 'text-emerald-300 hover:bg-emerald-300/10 focus:ring-emerald-300',
    },
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant][accent]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
} 