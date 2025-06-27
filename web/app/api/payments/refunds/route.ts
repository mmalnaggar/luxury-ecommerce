import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

/*
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
})
*/

// TEMPORARY: Disable Stripe refunds integration for build
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe refunds integration is temporarily disabled for deployment. Set STRIPE_SECRET_KEY and re-enable this route to use.' },
    { status: 503 }
  )
}

// To re-enable, restore the original handler below and ensure STRIPE_SECRET_KEY is set in your .env file.

/*
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { orderId, amount, reason } = await request.json()
    
    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
        { status: 400 }
      )
    }
    
    // Verify the order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Check if user has permission to refund (order owner, brand owner, or admin)
    const isOrderOwner = order.userId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'
    
    // For brand owners, we need to check if they own any of the products in the order
    let isBrandOwner = false
    if (session.user.role === 'BRAND') {
      const brand = await prisma.brand.findFirst({
        where: { ownerId: session.user.id },
        include: {
          products: {
            select: { id: true }
          }
        }
      })
      
      if (brand && brand.products) {
        const orderProducts = await prisma.orderProduct.findMany({
          where: { orderId: orderId },
          select: { productId: true }
        })
        
        const brandProductIds = brand.products.map((p: { id: string }) => p.id)
        isBrandOwner = orderProducts.some((op: { productId: string }) => brandProductIds.includes(op.productId))
      }
    }
    
    if (!isOrderOwner && !isBrandOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to refund this order' },
        { status: 403 }
      )
    }
    
    // Check if order is paid
    if (order.status !== 'PAID') {
      return NextResponse.json(
        { error: 'Order must be paid before it can be refunded' },
        { status: 400 }
      )
    }
    
    if (!order.paymentId) {
      return NextResponse.json(
        { error: 'No payment ID found for this order' },
        { status: 400 }
      )
    }
    
    // Calculate refund amount
    const refundAmount = amount || order.total
    
    if (refundAmount > order.total) {
      return NextResponse.json(
        { error: 'Refund amount cannot exceed order total' },
        { status: 400 }
      )
    }
    
    let refund
    let refundId
    
    // Try to process refund with Stripe first (if payment was made with Stripe)
    try {
      // Attempt to retrieve the payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentId)
      
      if (paymentIntent) {
        // This is a Stripe payment, process refund through Stripe
        refund = await stripe.refunds.create({
          payment_intent: order.paymentId,
          amount: Math.round(refundAmount * 100), // Convert to smallest currency unit
          reason: reason || 'requested_by_customer',
          metadata: {
            orderId: orderId,
            refundedBy: session.user.id,
          },
        })
        
        refundId = refund.id
      }
    } catch (stripeError: any) {
      // If Stripe fails, it might be a Paymob payment
      if (stripeError.code === 'resource_missing') {
        // This is likely a Paymob payment, handle accordingly
        console.log('Processing Paymob refund for order:', orderId)
        // In a real implementation, you would call Paymob's refund API here
        refundId = `paymob_refund_${Date.now()}`
      } else {
        console.error('Stripe refund error:', stripeError)
        return NextResponse.json(
          { error: `Refund failed: ${stripeError.message}` },
          { status: 400 }
        )
      }
    }
    
    // Update order status
    const isPartialRefund = refundAmount < order.total
    const newStatus = isPartialRefund ? 'PARTIALLY_REFUNDED' : 'REFUNDED'
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: newStatus,
        // You might want to add a refunds field to track multiple refunds
      },
    })
    
    // Log the refund (you might want to create a separate Refund model)
    console.log(`Refund processed for order ${orderId}: ${refundAmount} EGP (Refund ID: ${refundId})`)
    
    return NextResponse.json({
      success: true,
      refundId: refundId,
      amount: refundAmount,
      orderStatus: newStatus,
      message: isPartialRefund 
        ? `Partial refund of ${refundAmount} EGP processed successfully`
        : `Full refund of ${refundAmount} EGP processed successfully`,
    })
  } catch (error) {
    console.error('Error processing refund:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Refund processing error: ${error.message}` },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
*/

// TEMPORARY: Disable Stripe refunds integration for build
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe refunds integration is temporarily disabled for deployment. Set STRIPE_SECRET_KEY and re-enable this route to use.' },
    { status: 503 }
  )
}

// To re-enable, restore the original GET handler below and ensure STRIPE_SECRET_KEY is set in your .env file.

/*
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      )
    }
    
    // Verify the order exists and user has permission
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    const isOrderOwner = order.userId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'
    
    if (!isOrderOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view refund status for this order' },
        { status: 403 }
      )
    }
    
    // If this was a Stripe payment, get refund details from Stripe
    let refundDetails = null
    
    if (order.paymentId) {
      try {
        // Try to get refunds for this payment intent
        const refunds = await stripe.refunds.list({
          payment_intent: order.paymentId,
          limit: 10,
        })
        
        if (refunds.data.length > 0) {
          refundDetails = refunds.data.map((refund) => ({
            id: refund.id,
            amount: refund.amount / 100, // Convert from smallest currency unit
            status: refund.status,
            reason: refund.reason,
            created: new Date(refund.created * 1000).toISOString(),
          }))
        }
      } catch (error) {
        console.error('Error fetching refund details:', error)
        // Continue without refund details for non-Stripe payments
      }
    }
    
    return NextResponse.json({
      orderId: order.id,
      orderStatus: order.status,
      orderTotal: order.total,
      paymentId: order.paymentId,
      refunds: refundDetails || [],
      canRefund: order.status === 'PAID',
    })
  } catch (error) {
    console.error('Error fetching refund status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch refund status' },
      { status: 500 }
    )
  }
}
*/ 