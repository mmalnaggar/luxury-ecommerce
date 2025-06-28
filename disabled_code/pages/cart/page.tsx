'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrashIcon } from '@heroicons/react/24/outline'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    currency: string
    imageUrl: string | null
    stock: number
  }
}

interface Cart {
  id: string
  items: CartItem[]
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart')
      
      if (response.status === 401) {
        // Redirect to sign in
        window.location.href = '/auth/signin'
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }
      
      const data = await response.json()
      setCart(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setUpdating(itemId)
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          quantity
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update cart')
      }

      // Refresh cart
      await fetchCart()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update cart')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId)
      const response = await fetch(`/api/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove item')
      }

      // Refresh cart
      await fetchCart()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove item')
    } finally {
      setUpdating(null)
    }
  }

  const calculateTotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Cart</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="px-6 py-4">
                    <div className="flex items-center">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link 
                                href={`/products/${item.product.id}`}
                                className="hover:text-blue-600"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="text-gray-600">
                              {item.product.currency} {item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">
                              {item.product.currency} {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-700">
                              Quantity:
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                              disabled={updating === item.id}
                              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            >
                              {[...Array(Math.min(10, item.product.stock))].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    EGP {calculateTotal().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">
                      EGP {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/products"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 