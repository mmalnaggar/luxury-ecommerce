'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Egyptian E-commerce
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/products"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/products')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Products
              </Link>
              
              <Link
                href="/simple"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/simple')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Simple
              </Link>
              
              <Link
                href="/minimal"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/minimal')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Minimal
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 bg-yellow-100 px-3 py-1 rounded">
              Database Offline
            </div>
            <div className="text-xs text-gray-500">
              Authentication disabled
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 