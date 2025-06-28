import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const brand = searchParams.get('brand')

    // Build where clause
    const where: any = {
      stock: { gt: 0 } // Only show products with stock
    }

    if (category && category !== 'all') {
      where.categories = {
        some: {
          slug: category
        }
      }
    }

    if (brand) {
      where.brand = {
        name: {
          contains: brand,
          mode: 'insensitive'
        }
      }
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          tags: {
            hasSome: [search.toLowerCase()]
          }
        }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: {
          select: {
            name: true
          }
        },
        categories: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 