import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            description: true,
            logoUrl: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        arAssets: {
          select: {
            id: true,
            url: true,
            type: true,
            metadata: true
          }
        },
        reviews: {
          where: {
            status: 'APPROVED'
          },
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            reviews: {
              where: {
                status: 'APPROVED'
              }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const reviews = product.reviews
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
      : 0

    const productWithRating = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: product._count.reviews
    }

    return NextResponse.json(productWithRating)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
} 