'use client'

import { useState } from 'react'
import { useCart } from '@/app/contexts/CartContext'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    currency: string
    imageUrl?: string | null
    stock: number
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (product.stock <= 0) return
    
    setIsAdding(true)
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl || undefined
    })
    
    setIsAdding(false)
  }

  if (product.stock <= 0) {
    return (
      <button
        disabled
        style={{
          width: '100%',
          backgroundColor: '#9ca3af',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'not-allowed',
          border: 'none'
        }}
      >
        Out of Stock
      </button>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      style={{
        width: '100%',
        backgroundColor: isAdding ? '#4f46e5' : '#4f46e5',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: isAdding ? 'not-allowed' : 'pointer',
        opacity: isAdding ? 0.5 : 1,
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!isAdding) {
          e.currentTarget.style.backgroundColor = '#4338ca'
        }
      }}
      onMouseLeave={(e) => {
        if (!isAdding) {
          e.currentTarget.style.backgroundColor = '#4f46e5'
        }
      }}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
} 