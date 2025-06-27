'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to Egyptian E-commerce Platform
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Modern e-commerce platform for Egyptian fashion brands with AR try-on capabilities
          </p>
        </div>

        {/* Authentication Status */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Authentication Status
          </h3>
          
          {session ? (
            <div className="space-y-2">
              <p className="text-green-600">✓ You are signed in</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Role:</strong> {(session.user as { role?: string })?.role}</p>
              <p><strong>User ID:</strong> {(session.user as { id?: string })?.id}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-yellow-600">! You are not signed in</p>
              <p className="text-sm text-gray-600">
                You can still browse products and use guest checkout
              </p>
            </div>
          )}
        </div>

        {/* Feature Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Browse Products
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Explore our collection of Egyptian fashion brands
            </p>
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View Products →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Brand Dashboard
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Manage your brand and products {!session ? '(requires brand account)' : ''}
            </p>
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Go to Dashboard →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Shopping Cart
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              View your cart and proceed to checkout
            </p>
            <Link
              href="/cart"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View Cart →
            </Link>
          </div>
        </div>

        {/* Test Accounts Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            Test Accounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-900">Brand Owner</p>
              <p className="text-blue-700">Email: brand@example.com</p>
              <p className="text-blue-700">Password: brand123</p>
            </div>
            <div>
              <p className="font-medium text-blue-900">Shopper</p>
              <p className="text-blue-700">Email: shopper@example.com</p>
              <p className="text-blue-700">Password: shopper123</p>
            </div>
            <div>
              <p className="font-medium text-blue-900">Admin</p>
              <p className="text-blue-700">Email: admin@example.com</p>
              <p className="text-blue-700">Password: admin123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
