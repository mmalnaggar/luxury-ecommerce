import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

// Cart API route for adding items to cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid product ID or quantity' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item: any) => item.productId === productId)

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                currency: true,
                imageUrl: true,
                stock: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
} 