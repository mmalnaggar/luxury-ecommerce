import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/wishlists - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get or create user's wishlist
    let wishlist = await prisma.wishlist.findFirst({
      where: { userId: session.user.id },
      include: {
        products: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
              },
            },
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            reviews: {
              where: { status: 'APPROVED' },
              select: {
                rating: true,
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.user.id },
        include: {
          products: {
            include: {
              brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
              categories: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              reviews: {
                where: { status: 'APPROVED' },
                select: {
                  rating: true,
                },
              },
            },
          },
        },
      });
    }

    // Calculate average rating for each product
    const productsWithRatings = wishlist.products.map((product: any) => ({
      ...product,
      averageRating: product.reviews.length > 0 
        ? Number((product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length).toFixed(1))
        : 0,
      reviewCount: product.reviews.length,
    }));

    const totalProducts = await prisma.wishlist.findFirst({
      where: { userId: session.user.id },
      select: {
        products: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json({
      wishlist: {
        ...wishlist,
        products: productsWithRatings,
      },
      totalProducts: totalProducts?.products.length || 0,
      currentPage: page,
      totalPages: Math.ceil((totalProducts?.products.length || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlists - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get or create user's wishlist
    let wishlist = await prisma.wishlist.findFirst({
      where: { userId: session.user.id },
      include: { products: true },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.user.id },
        include: { products: true },
      });
    }

    // Check if product is already in wishlist
    const isAlreadyInWishlist = wishlist.products.some((p: any) => p.id === productId);

    if (isAlreadyInWishlist) {
      return NextResponse.json(
        { error: 'Product is already in wishlist' },
        { status: 400 }
      );
    }

    // Add product to wishlist
    const updatedWishlist = await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: {
          connect: { id: productId },
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

    return NextResponse.json(updatedWishlist, { status: 201 });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
} 