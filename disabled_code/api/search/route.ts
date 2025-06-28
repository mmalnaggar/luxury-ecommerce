import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      AND: []
    }

    // Search query
    if (query) {
      where.AND.push({
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { brand: { name: { contains: query, mode: 'insensitive' } } },
          { category: { name: { contains: query, mode: 'insensitive' } } }
        ]
      })
    }

    // Category filter
    if (category) {
      where.AND.push({
        category: {
          name: { equals: category, mode: 'insensitive' }
        }
      })
    }

    // Brand filter
    if (brand) {
      where.AND.push({
        brand: {
          name: { equals: brand, mode: 'insensitive' }
        }
      })
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter: any = {}
      if (minPrice) priceFilter.gte = parseFloat(minPrice)
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice)
      where.AND.push({ price: priceFilter })
    }

    // Remove empty AND array if no filters
    if (where.AND.length === 0) {
      delete where.AND
    }

    // Build order by clause
    const orderBy: any = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder
    } else {
      orderBy.name = sortOrder
    }

    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Calculate average ratings
    const productsWithRating = products.map((product: any) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length
      }
    })

    // Get available filters
    const [categories, brands, priceRange] = await Promise.all([
      prisma.category.findMany({
        select: { name: true },
        orderBy: { name: 'asc' }
      }),
      prisma.brand.findMany({
        select: { name: true },
        orderBy: { name: 'asc' }
      }),
      prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true }
      })
    ])

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        categories: categories.map((c: any) => c.name),
        brands: brands.map((b: any) => b.name),
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 0
        }
      }
    })
  } catch (error) {
    console.error('Error in search:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 