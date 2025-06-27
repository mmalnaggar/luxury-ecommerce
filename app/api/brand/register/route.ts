import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  const session = await auth()

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return new NextResponse('Brand name is required', { status: 400 })
    }

    const userId = session.user.id

    const brand = await prisma.brand.create({
      data: {
        name,
        description,
        ownerId: userId,
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'BRAND' },
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Brand registration error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 