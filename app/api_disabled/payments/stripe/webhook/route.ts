import { NextRequest, NextResponse } from 'next/server'
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

// TEMPORARY: Disable Stripe webhook integration for build
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe webhook integration is temporarily disabled for deployment. Set STRIPE_SECRET_KEY and re-enable this route to use.' },
    { status: 503 }
  )
}

// To re-enable, restore the original handler below and ensure STRIPE_SECRET_KEY is set in your .env file.

/*
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }
    
    let event: Stripe.Event
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId
    
    if (!orderId) {
      console.error('No orderId found in payment intent metadata')
      return
    }
    
    // Update order status to PAID
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: 'PAID',
        paymentId: paymentIntent.id,
      },
    })
    
    console.log(`Order ${orderId} marked as PAID`)
    
    // Here you could add additional logic like:
    // - Send confirmation email
    // - Update inventory
    // - Trigger fulfillment process
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId
    
    if (!orderId) {
      console.error('No orderId found in payment intent metadata')
      return
    }
    
    // Update order status back to PENDING or CANCELLED
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: 'PENDING',
        paymentId: paymentIntent.id,
      },
    })
    
    console.log(`Order ${orderId} payment failed`)
    
    // Here you could add additional logic like:
    // - Send payment failure notification
    // - Log the failure reason
    
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId
    
    if (!orderId) {
      console.error('No orderId found in payment intent metadata')
      return
    }
    
    // Update order status to CANCELLED
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: 'CANCELLED',
        paymentId: paymentIntent.id,
      },
    })
    
    console.log(`Order ${orderId} payment canceled`)
    
  } catch (error) {
    console.error('Error handling payment canceled:', error)
  }
}
*/ 