import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { itemId, quantity } = await request.json()

    if (!itemId || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid item ID or quantity' },
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

    // Get cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: user.id
        }
      },
      include: {
        product: true
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item
      await prisma.cartItem.delete({
        where: { id: itemId }
      })
    } else {
      // Check stock
      if (quantity > cartItem.product.stock) {
        return NextResponse.json(
          { error: 'Not enough stock available' },
          { status: 400 }
        )
      }

      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity }
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
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
} 