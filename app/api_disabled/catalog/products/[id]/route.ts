import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
            logoUrl: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!product) {
      return new NextResponse('Product not found', { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 