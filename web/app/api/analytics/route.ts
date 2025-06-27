import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get basic stats
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts,
      salesByDay,
      categoryStats
    ] = await Promise.all([
      // Total products
      prisma.product.count(),
      
      // Total orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Total users
      prisma.user.count(),
      
      // Total revenue
      prisma.order.aggregate({
        where: {
          status: 'PAID',
          createdAt: {
            gte: startDate
          }
        },
        _sum: {
          total: true
        }
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      
      // Top selling products
      prisma.orderProduct.groupBy({
        by: ['productId'],
        where: {
          order: {
            status: 'PAID',
            createdAt: {
              gte: startDate
            }
          }
        },
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }),
      
      // Sales by day
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          status: 'PAID',
          createdAt: {
            gte: startDate
          }
        },
        _sum: {
          total: true
        },
        _count: {
          id: true
        }
      }),
      
      // Category statistics - simplified since it's a many-to-many relationship
      prisma.category.findMany({
        select: {
          name: true,
          _count: {
            select: {
              products: true
            }
          }
        }
      })
    ])

    // Get product details for top products
    const topProductIds = topProducts.map((p: any) => p.productId)
    const topProductDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds
        }
      },
      include: {
        brand: {
          select: {
            name: true
          }
        }
      }
    })

    // Combine top products with their sales data
    const topProductsWithDetails = topProducts.map((product: any) => {
      const productDetail = topProductDetails.find((p: any) => p.id === product.productId)
      return {
        productId: product.productId,
        name: productDetail?.name || 'Unknown Product',
        brand: productDetail?.brand?.name || 'Unknown Brand',
        totalSold: product._sum.quantity || 0
      }
    })

    // Process sales by day data
    const salesByDayProcessed = salesByDay.map((day: any) => ({
      date: day.createdAt.toISOString().split('T')[0],
      revenue: day._sum.total || 0,
      orders: day._count.id || 0
    }))

    // Process category statistics
    const categoryStatsProcessed = categoryStats.map((cat: any) => ({
      category: cat.name || 'Unknown',
      productCount: cat._count.products || 0
    }))

    return NextResponse.json({
      overview: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue._sum.total || 0
      },
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        customer: {
          name: order.user.name,
          email: order.user.email
        }
      })),
      topProducts: topProductsWithDetails,
      salesByDay: salesByDayProcessed,
      categoryStats: categoryStatsProcessed,
      period: parseInt(period)
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 