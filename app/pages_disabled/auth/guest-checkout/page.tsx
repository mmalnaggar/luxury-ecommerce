'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GuestCheckout() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Continue as Guest
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Shop without creating an account
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Guest Shopping Features
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Browse all products and brands</li>
              <li>• Add items to cart</li>
              <li>• Complete checkout process</li>
              <li>• Receive order confirmation via email</li>
            </ul>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Missing Features (Guest Mode)
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Order history</li>
              <li>• Wishlist functionality</li>
              <li>• Product reviews</li>
              <li>• Saved addresses and payment methods</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You can create an account at any time to unlock these features
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping as Guest
          </button>

          <div className="text-center">
            <Link
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create an account instead
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 