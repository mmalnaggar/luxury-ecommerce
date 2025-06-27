'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LuxuryLayout, { LuxuryCard, LuxuryButton } from '@/components/LuxuryLayout'
import LazyImage from '@/components/LazyImage'
import { 
  SparklesIcon, 
  StarIcon, 
  HeartIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  brand: string
  rating: number
}

const luxuryProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Luxury Watch',
    price: 25000,
    imageUrl: '/api/placeholder/400/400',
    brand: 'LuxuryBrand',
    rating: 5
  },
  {
    id: '2',
    name: 'Designer Handbag',
    price: 15000,
    imageUrl: '/api/placeholder/400/400',
    brand: 'EliteDesign',
    rating: 5
  },
  {
    id: '3',
    name: 'Diamond Necklace',
    price: 50000,
    imageUrl: '/api/placeholder/400/400',
    brand: 'RoyalJewels',
    rating: 5
  },
  {
    id: '4',
    name: 'Luxury Perfume',
    price: 8000,
    imageUrl: '/api/placeholder/400/400',
    brand: 'ExclusiveScents',
    rating: 5
  }
]

export default function LuxuryHomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <LuxuryLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
          />
        </div>
      </LuxuryLayout>
    )
  }

  return (
    <LuxuryLayout background="gradient" accent="gold">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-amber-400/20 to-slate-900 animate-pulse"></div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <SparklesIcon className="w-16 h-16 text-amber-400 mx-auto mb-6 animate-bounce" />
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Luxury
              </span>
              <br />
              <span className="text-slate-200">Redefined</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Experience the pinnacle of elegance and sophistication with our curated collection of premium products
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <LuxuryButton variant="primary" size="lg">
              Explore Collection
            </LuxuryButton>
            <LuxuryButton variant="outline" size="lg">
              View Awards
            </LuxuryButton>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Featured
              </span>
              <span className="text-slate-200"> Collections</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover our most prestigious offerings, crafted with unparalleled attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {luxuryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <LuxuryCard hover accent="gold">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <LazyImage
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
                        <HeartIcon className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 text-amber-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                    <p className="text-slate-400 mb-4">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-400">$12,500</span>
                      <LuxuryButton size="sm">
                        <ShoppingBagIcon className="w-4 h-4 mr-2" />
                        Add to Cart
                      </LuxuryButton>
                    </div>
                  </div>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              The Luxury
            </span>
            <span className="text-slate-200"> Experience</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto">
            Every product tells a story of excellence, craftsmanship, and uncompromising quality
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LuxuryCard accent="gold" className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-3">Premium Quality</h3>
              <p className="text-slate-400">
                Only the finest materials and most skilled artisans create our luxury products
              </p>
            </LuxuryCard>
            
            <LuxuryCard accent="platinum" className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-3">Award Winning</h3>
              <p className="text-slate-400">
                Recognized globally for excellence in design, craftsmanship, and innovation
              </p>
            </LuxuryCard>
            
            <LuxuryCard accent="gold" className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-3">Exclusive Access</h3>
              <p className="text-slate-400">
                Limited editions and bespoke services for the most discerning clientele
              </p>
            </LuxuryCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              {" "}True Luxury?
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join the elite circle of connoisseurs who appreciate the finest things in life
          </p>
          <LuxuryButton variant="primary" size="lg">
            <ArrowRightIcon className="w-6 h-6 mr-2" />
            Begin Your Journey
          </LuxuryButton>
        </div>
      </section>
    </LuxuryLayout>
  )
} 