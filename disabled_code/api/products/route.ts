import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { NextResponse } from 'next/server'

async function getBrandIdForUser(userId: string) {
  const brand = await prisma.brand.findFirst({
    where: { ownerId: userId },
    select: { id: true },
  })
  return brand?.id
}

// GET all products for the logged-in brand
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId')
    const skip = (page - 1) * limit

    const where: any = {
      brand: {
        ownerId: session.user.id
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (categoryId) {
      where.categories = {
        some: { id: categoryId }
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categories: true,
          brand: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST new product
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, categoryIds, stock, imageUrl, arAssetUrl } = body

    // Get user's brand
    const brand = await prisma.brand.findFirst({
      where: { ownerId: session.user.id }
    })

    if (!brand) {
      return new NextResponse('Brand not found', { status: 404 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        arAssetUrl,
        brandId: brand.id,
        categories: {
          connect: categoryIds?.map((id: string) => ({ id })) || []
        }
      },
      include: {
        categories: true,
        brand: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 