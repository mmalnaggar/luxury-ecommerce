import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          reports: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' },
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      reviews,
      currentPage: page,
      totalPages,
      total,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const body = await request.json()
    const { reviewId, status } = body

    if (!reviewId || !status) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED',
        moderatedBy: session.user.id,
        moderatedAt: new Date(),
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 