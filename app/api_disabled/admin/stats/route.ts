import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin (you can add admin role to your User model)
    // For now, we'll allow any authenticated user to access admin stats
    // In production, you should implement proper role-based access control

    // Get total products
    const totalProducts = await prisma.product.count()

    // Get total orders
    const totalOrders = await prisma.order.count()

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get total revenue (sum of all paid orders)
    const revenueResult = await prisma.order.aggregate({
      where: {
        status: 'PAID'
      },
      _sum: {
        total: true
      }
    })

    const totalRevenue = revenueResult._sum.total || 0

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
} 