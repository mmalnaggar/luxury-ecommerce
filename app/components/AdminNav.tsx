'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function AdminNav() {
  const { data: session } = useSession()

  // Only show admin nav if user is admin
  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '12px 0',
      borderBottom: '1px solid #374151'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        <span style={{ fontWeight: 'bold' }}>Admin Panel</span>
        <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link href="/admin/orders" style={{ color: 'white', textDecoration: 'none' }}>
          Orders
        </Link>
        <Link href="/products" style={{ color: 'white', textDecoration: 'none' }}>
          Products
        </Link>
      </div>
    </div>
  )
} 