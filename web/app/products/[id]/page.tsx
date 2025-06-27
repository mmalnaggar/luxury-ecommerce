'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  stock: number
  imageUrl: string | null
  arAssetUrl: string | null
  features: Record<string, unknown>
  tags: string[]
  brand: {
    id: string
    name: string
    description: string | null
    logoUrl: string | null
  }
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  arAssets: Array<{
    id: string
    url: string
    type: string
    metadata: Record<string, unknown>
  }>
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
      name: string | null
      image: string | null
    }
  }>
  averageRating: number
  reviewCount: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/catalog/products/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Product not found')
      }
      
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id, fetchProduct])

  const addToCart = async () => {
    try {
      setAddingToCart(true)
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product?.id,
          quantity
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add to cart')
      }

      // Show success message or redirect to cart
      alert('Product added to cart!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-800">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

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
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            
            {/* AR Asset Button */}
            {product.arAssetUrl && (
              <div className="mt-4">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  View in AR
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1 mt-10 lg:mt-0">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <button className="p-2 text-gray-400 hover:text-red-500">
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Brand */}
            <div className="mt-2">
              <Link 
                href={`/brands/${product.brand.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {product.brand.name}
              </Link>
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      product.averageRating > rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="ml-3 text-sm text-gray-500">
                {product.averageRating} ({product.reviewCount} reviews)
              </p>
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="text-3xl font-bold text-gray-900">
                {product.currency} {product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Features</h3>
                <dl className="mt-2 text-sm text-gray-600">
                  {Object.entries(product.features).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <dt className="font-medium capitalize">{key}:</dt>
                      <dd>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-8">
              <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1"
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={addToCart}
                disabled={addingToCart || product.stock === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          {product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={`h-4 w-4 flex-shrink-0 ${
                              review.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="ml-2 text-sm text-gray-500">
                        by {review.user.name || 'Anonymous'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  )
} 