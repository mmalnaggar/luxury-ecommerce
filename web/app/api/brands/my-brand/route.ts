import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const brand = await prisma.brand.findFirst({
      where: { ownerId: session.user.id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            imageUrl: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
} 