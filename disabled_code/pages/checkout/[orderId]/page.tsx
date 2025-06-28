'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OrderProduct {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    brand: {
      name: string
    }
  }
}

interface Order {
  id: string
  status: string
  total: number
  products: OrderProduct[]
}

interface PaymentMethod {
  id: string
  type: string
  lastFour?: string
  expiryDate?: string
}

interface CheckoutPageProps {
  params: Promise<{ orderId: string }>
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string>('')

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const getOrderId = async () => {
      const { orderId: id } = await params
      setOrderId(id)
    }
    getOrderId()
  }, [params])

  const fetchOrder = useCallback(async () => {
    if (!orderId) return
    
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }
      const orderData = await response.json()
      setOrder(orderData)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await fetch('/api/payment-methods')
      if (response.ok) {
        const methods = await response.json()
        setSavedPaymentMethods(methods)
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    }
  }, [])

  useEffect(() => {
    if (orderId) {
      fetchOrder()
      fetchPaymentMethods()
    }
  }, [orderId, fetchOrder, fetchPaymentMethods])

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !order) return

    setPaymentProcessing(true)
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethodId: selectedPaymentMethod.id,
        }),
      })

      if (response.ok) {
        toast.success('Payment processed successfully!')
        router.push(`/orders/${order.id}`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed')
    } finally {
      setPaymentProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Order not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          {/* Order Summary */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              <p className="mt-1 text-sm text-gray-500">Order #{order.id}</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {order.products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt className="text-sm font-medium text-gray-500">
                      {item.product.name}
                      <p className="text-xs text-gray-400">by {item.product.brand.name}</p>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </dd>
                  </div>
                ))}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                    ${order.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white shadow sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              {savedPaymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {savedPaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        selectedPaymentMethod?.id === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {method.type === 'CREDIT_CARD' ? 'Credit Card' : 'PayPal'}
                        </p>
                        {method.type === 'CREDIT_CARD' && (
                          <p className="text-sm text-gray-500">
                            •••• {method.lastFour} | Expires {method.expiryDate}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <input
                          type="radio"
                          checked={selectedPaymentMethod?.id === method.id}
                          onChange={() => setSelectedPaymentMethod(method)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No saved payment methods</p>
                  <button
                    onClick={() => router.push('/account/payment-methods/new')}
                    className="mt-2 text-blue-600 hover:text-blue-500"
                  >
                    Add a payment method
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-end">
            <button
              onClick={handlePayment}
              disabled={paymentProcessing || order.status !== 'PENDING' || !selectedPaymentMethod}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                paymentProcessing || order.status !== 'PENDING' || !selectedPaymentMethod
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {paymentProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 