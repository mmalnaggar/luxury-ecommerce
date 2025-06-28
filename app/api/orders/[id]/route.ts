import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              include: {
                brand: true,
                categories: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to view this order
    if (session?.user?.role !== 'ADMIN' && order.userId !== session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    const body = await request.json()
    
    const { status, paymentId } = body

    // Only admins can update order status
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentId: paymentId || undefined
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                brand: true,
                categories: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update order', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 