import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// DELETE /api/wishlists/[productId] - Remove product from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get user's wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId: session.user.id },
      include: { products: true },
    });

    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Check if product is in wishlist
    const isInWishlist = wishlist.products.some((p: any) => p.id === productId);

    if (!isInWishlist) {
      return NextResponse.json(
        { error: 'Product not in wishlist' },
        { status: 400 }
      );
    }

    // Remove product from wishlist
    const updatedWishlist = await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
      include: {
        products: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedWishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
} 