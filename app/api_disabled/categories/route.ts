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

    // Get the user's brand
    const brand = await prisma.brand.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true }
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Get categories for the user's brand
    const categories = await prisma.category.findMany({
      where: { brandId: brand.id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Get the user's brand
    const brand = await prisma.brand.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true }
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
        brandId: brand.id
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 