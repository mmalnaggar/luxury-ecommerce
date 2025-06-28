import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { reviewId, reason, details } = await request.json()

    // Validate required fields
    if (!reviewId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: reviewId and reason are required' },
        { status: 400 }
      )
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Create the report
    const report = await prisma.reviewReport.create({
      data: {
        reviewId,
        userId: session.user.id,
        reason,
        details: details || null
      }
    })

    // Update review status to FLAGGED
    await prisma.review.update({
      where: { id: reviewId },
      data: { status: 'FLAGGED' }
    })

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        reviewId: report.reviewId,
        reason: report.reason,
        details: report.details,
        createdAt: report.createdAt
      }
    })

  } catch (error) {
    console.error('Error reporting review:', error)
    return NextResponse.json(
      { error: 'Failed to report review' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can view reports' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')

    const where = reviewId ? { reviewId } : {}

    const reports = await prisma.reviewReport.findMany({
      where,
      include: {
        review: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      reports: reports.map(report => ({
        id: report.id,
        reviewId: report.reviewId,
        reason: report.reason,
        details: report.details,
        createdAt: report.createdAt,
        review: {
          id: report.review.id,
          rating: report.review.rating,
          comment: report.review.comment,
          status: report.review.status,
          user: report.review.user
        }
      }))
    })

  } catch (error) {
    console.error('Error fetching review reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review reports' },
      { status: 500 }
    )
  }
} 