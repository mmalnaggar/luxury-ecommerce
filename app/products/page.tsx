'use client'

import React from 'react'
import Link from 'next/link'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Product catalog will be available once database is connected
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Database Features Disabled
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The product catalog requires database connectivity. Once the database is set up and connected, 
                  this page will display the full Egyptian fashion product catalog with features like:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Product browsing and search</li>
                  <li>Category filtering</li>
                  <li>AR try-on capabilities</li>
                  <li>Brand information</li>
                  <li>Shopping cart functionality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Product Image</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Egyptian Brand</span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sample Product {item}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  This is a placeholder for Egyptian fashion products that will be available once the database is connected.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-400">
                    EGP 0.00
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 text-sm font-medium cursor-not-allowed">
                      Try AR
                    </button>
                    <button className="text-gray-400 text-sm font-medium cursor-not-allowed">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Links */}
        <div className="mt-12 text-center">
          <div className="space-x-4">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              ← Back to Home
            </Link>
            <Link
              href="/simple"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View Simple Test Page
            </Link>
            <Link
              href="/minimal"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View Minimal Test Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 