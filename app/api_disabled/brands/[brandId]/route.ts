import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET a brand's details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const { brandId } = await params
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
          }
        }
      }
    })

    if (!brand) {
      return new NextResponse('Brand not found', { status: 404 })
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Brand fetch error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 