import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('q')
    const brandId = searchParams.get('brand')
    const categoryId = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    
    // Build filter conditions
    const where: any = {}
    
    // Text search
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }
    
    // Brand filter
    if (brandId) {
      where.brandId = brandId
    }
    
    // Category filter
    if (categoryId) {
      where.categories = {
        some: {
          id: categoryId
        }
      }
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice)
      }
    }
    
    // Get products with filters
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Catalog fetch error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 