import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

const prisma = new PrismaClient()

/*
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
})
*/

// TEMPORARY: Disable Stripe payment intent creation for build
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe payment integration is temporarily disabled for deployment. Set STRIPE_SECRET_KEY and re-enable this route to use.' },
    { status: 503 }
  )
}

// To re-enable, restore the original handler below and ensure STRIPE_SECRET_KEY is set in your .env file.

/*
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { orderId, amount, currency = 'EGP', paymentMethod = 'stripe' } = await request.json()
    
    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and amount are required' },
        { status: 400 }
      )
    }
    
    // Verify the order exists and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, products: { include: { product: true } } },
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only pay for your own orders' },
        { status: 403 }
      )
    }
    
    // Check if order is already paid
    if (order.status === 'PAID') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      )
    }
    
    // Validate amount matches order total
    if (Math.abs(amount - order.total) > 0.01) {
      return NextResponse.json(
        { error: 'Amount does not match order total' },
        { status: 400 }
      )
    }
    
    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (piasters for EGP)
      currency: currency.toLowerCase(),
      metadata: {
        orderId: orderId,
        userId: session.user.id,
        paymentMethod: paymentMethod,
        userEmail: session.user.email || '',
      },
      description: `Payment for order ${orderId}`,
      receipt_email: session.user.email || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: paymentIntent.id },
    })
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment processing error: ${error.message}` },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
*/ 