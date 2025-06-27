import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get user's wishlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        products: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                logoUrl: true
              }
            },
            categories: {
              select: {
                id: true,
                name: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate average ratings
    const wishlistWithRating = wishlist.map((item: any) => {
      const avgRating = item.products.length > 0
        ? item.products.reduce((sum: number, product: any) => sum + product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0), 0) / item.products.length
        : 0

      return {
        ...item,
        products: item.products.map((product: any) => ({
          ...product,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: product.reviews.length
        }))
      }
    })

    return NextResponse.json(wishlistWithRating)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// Add product to wishlist
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if already in wishlist
    const existingWishlist = await prisma.wishlist.findFirst({
      where: { userId: user.id },
      include: { products: true }
    })
    if (existingWishlist && existingWishlist.products.some((p: any) => p.id === productId)) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      )
    }

    // Add to wishlist (create if not exists, otherwise update)
    let wishlistItem
    if (existingWishlist) {
      wishlistItem = await prisma.wishlist.update({
        where: { id: existingWishlist.id },
        data: {
          products: {
            connect: { id: productId }
          }
        },
        include: {
          products: {
            include: {
              brand: { select: { id: true, name: true, logoUrl: true } },
              categories: { select: { id: true, name: true } }
            }
          }
        }
      })
    } else {
      wishlistItem = await prisma.wishlist.create({
        data: {
          userId: user.id,
          products: {
            connect: { id: productId }
          }
        },
        include: {
          products: {
            include: {
              brand: { select: { id: true, name: true, logoUrl: true } },
              categories: { select: { id: true, name: true } }
            }
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      wishlistItem
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

// Remove product from wishlist
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Find the user's wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId: user.id }
    })

    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      )
    }

    // Remove from wishlist
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: {
          disconnect: { id: productId }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist'
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
} 