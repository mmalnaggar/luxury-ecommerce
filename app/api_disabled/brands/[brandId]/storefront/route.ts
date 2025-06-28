import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// Verify the user has permission to update this brand
async function verifyBrandAccess(userId: string, brandId: string): Promise<boolean> {
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { ownerId: true },
  })
  return brand?.ownerId === userId
}

// PATCH to update storefront customization
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ brandId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { brandId } = await params
  const hasAccess = await verifyBrandAccess(session.user.id, brandId)
  if (!hasAccess) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()
    const { bannerImageUrl, featuredProductIds } = body

    // Update the brand with customization data
    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        customization: {
          bannerImageUrl,
          featuredProductIds,
        },
      },
    })

    return NextResponse.json(updatedBrand)
  } catch (error) {
    console.error('Storefront update error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// GET storefront customization
export async function GET(
  request: Request,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const { brandId } = await params
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        products: {
          where: { stock: { gt: 0 } },
          include: {
            categories: true
          }
        },
        categories: {
          where: { parentId: null }
        }
      }
    })

    if (!brand) {
      return new NextResponse('Brand not found', { status: 404 })
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Storefront fetch error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 