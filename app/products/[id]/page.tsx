'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li>
              <span className="text-gray-900">Product {params.id}</span>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <div className="flex items-center justify-center h-64">
                <span className="text-gray-500">Product Image Placeholder</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1 mt-10 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">Sample Product {params.id}</h1>
            
            <div className="mt-4">
              <p className="text-gray-600">Egyptian Brand</p>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-gray-900">EGP 0.00</p>
            </div>

            <div className="mt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800">
                  Database Features Disabled
                </h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Product details, pricing, and shopping cart functionality will be available once the database is connected.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">
                This is a placeholder for a detailed product description. Once the database is connected, 
                this page will display real product information including:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>Detailed product specifications</li>
                <li>High-quality product images</li>
                <li>Customer reviews and ratings</li>
                <li>AR try-on capabilities</li>
                <li>Add to cart functionality</li>
                <li>Brand information</li>
              </ul>
            </div>

            <div className="mt-8 flex space-x-4">
              <button 
                disabled
                className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Add to Cart (Disabled)
              </button>
              <button 
                disabled
                className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Try AR (Disabled)
              </button>
            </div>

            <div className="mt-6">
              <Link 
                href="/products"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 