import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Paymob API configuration
const PAYMOB_API_URL = 'https://accept.paymob.com/api'
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID

/*
if (!PAYMOB_API_KEY) {
  throw new Error('PAYMOB_API_KEY is not set in environment variables')
}

if (!PAYMOB_INTEGRATION_ID) {
  throw new Error('PAYMOB_INTEGRATION_ID is not set in environment variables')
}
*/

// TEMPORARY: Disable Paymob integration for build
export async function POST(req: Request) {
  return new Response(JSON.stringify({ error: 'Paymob integration is temporarily disabled for deployment. Set PAYMOB_API_KEY and re-enable this route to use.' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  })
}

// To re-enable, restore the original handler and ensure PAYMOB_API_KEY is set in your .env file.

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
    
    const { orderId, amount, currency = 'EGP' } = await request.json()
    
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
      include: { 
        user: true, 
        products: { include: { product: true } } 
      },
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
    
    // Step 1: Get authentication token
    const authToken = await getPaymobAuthToken()
    
    // Step 2: Create order in Paymob
    const paymobOrder = await createPaymobOrder(authToken, {
      amount: Math.round(amount * 100), // Convert to piasters
      currency: currency,
      merchant_order_id: orderId,
    })
    
    // Step 3: Get payment key
    const paymentKey = await getPaymentKey(authToken, {
      amount: Math.round(amount * 100),
      currency: currency,
      order_id: paymobOrder.id,
      billing_data: {
        email: session.user.email || '',
        first_name: session.user.name?.split(' ')[0] || '',
        last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
        phone_number: '+20xxxxxxxxxx', // You might want to collect this from user
        country: 'EG',
        city: 'Cairo',
        state: 'Cairo',
        apartment: 'NA',
        floor: 'NA',
        street: 'NA',
        building: 'NA',
        postal_code: '11111',
      },
    })
    
    // Update order with Paymob order ID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: paymobOrder.id.toString() },
    })
    
    return NextResponse.json({
      paymentKey: paymentKey,
      paymobOrderId: paymobOrder.id,
      amount: paymobOrder.amount_cents,
      currency: paymobOrder.currency,
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_INTEGRATION_ID}?payment_token=${paymentKey}`,
    })
  } catch (error) {
    console.error('Error creating Paymob payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

async function getPaymobAuthToken(): Promise<string> {
  const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: PAYMOB_API_KEY,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to get Paymob auth token')
  }
  
  const data = await response.json()
  return data.token
}

async function createPaymobOrder(authToken: string, orderData: {
  amount: number
  currency: string
  merchant_order_id: string
}): Promise<any> {
  const response = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: 'false',
      amount_cents: orderData.amount,
      currency: orderData.currency,
      merchant_order_id: orderData.merchant_order_id,
      items: [],
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create Paymob order')
  }
  
  return await response.json()
}

async function getPaymentKey(authToken: string, paymentData: {
  amount: number
  currency: string
  order_id: number
  billing_data: any
}): Promise<string> {
  const response = await fetch(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: paymentData.amount,
      expiration: 3600,
      order_id: paymentData.order_id,
      billing_data: paymentData.billing_data,
      currency: paymentData.currency,
      integration_id: PAYMOB_INTEGRATION_ID,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to get payment key')
  }
  
  const data = await response.json()
  return data.token
}
*/ 