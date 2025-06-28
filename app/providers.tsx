'use client'

import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from './contexts/CartContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // Temporarily disabled - authentication not available without database
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
} 