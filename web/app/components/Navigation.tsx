'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { data: session } = useSession()
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
              
              {session && (session.user as any)?.role === 'BRAND' && (
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              
              {session && (
                <Link
                  href="/cart"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/cart')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Cart
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {(session.user as any)?.role || 'SHOPPER'}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 