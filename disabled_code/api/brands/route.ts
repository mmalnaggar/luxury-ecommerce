import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(brands)
  } catch (error) {
    console.error('Brands fetch error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 