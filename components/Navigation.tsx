'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function Navigation() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">E-Commerce AR</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/products" 
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
              <Link 
                href="/luxury" 
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Luxury Collection
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Categories
              </Link>
              <Link 
                href="/brands" 
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Brands
              </Link>
            </div>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <Link 
                href="/search"
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Search
              </Link>
            </div>

            {/* User menu */}
            {session ? (
              <div className="flex items-center space-x-4">
                {/* Wishlist */}
                <Link 
                  href="/wishlist"
                  className="text-gray-900 hover:text-gray-500 p-2 rounded-md"
                  title="Wishlist"
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>

                {/* Cart */}
                <Link 
                  href="/cart"
                  className="text-gray-900 hover:text-gray-500 p-2 rounded-md relative"
                  title="Shopping Cart"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {/* Cart badge would go here */}
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    {session.user?.name || 'Account'}
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link 
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link 
                        href="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Wishlist
                      </Link>
                      
                      {/* Admin links - you might want to add role-based access control */}
                      <div className="border-t border-gray-100">
                        <Link 
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <CogIcon className="h-4 w-4 inline mr-2" />
                          Admin Dashboard
                        </Link>
                        <Link 
                          href="/analytics"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ChartBarIcon className="h-4 w-4 inline mr-2" />
                          Analytics
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            signOut()
                            setIsMenuOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/signin"
                  className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-900 hover:text-gray-500 p-2 rounded-md"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link 
              href="/products"
              className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/luxury"
              className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Luxury Collection
            </Link>
            <Link 
              href="/categories"
              className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/brands"
              className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>
            <Link 
              href="/search"
              className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            
            {session && (
              <>
                <Link 
                  href="/wishlist"
                  className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link 
                  href="/cart"
                  className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                </Link>
                <Link 
                  href="/profile"
                  className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  href="/orders"
                  className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link 
                  href="/admin"
                  className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link 
                  href="/analytics"
                  className="text-gray-900 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analytics
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                  className="text-gray-900 hover:text-gray-500 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 