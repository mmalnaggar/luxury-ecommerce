import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Handler for GET requests - Fetch AR assets for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await auth()
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        arAssets: true,
      },
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product.arAssets)
  } catch (error) {
    console.error('Error fetching AR assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AR assets' },
      { status: 500 }
    )
  }
}

// Handler for POST requests - Upload a new AR asset for a product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await auth()
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is a brand or admin
    const userRole = session.user.role
    if (userRole !== 'BRAND' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only brands and admins can upload AR assets' },
        { status: 403 }
      )
    }
    
    // Check if product exists and belongs to the user's brand (if user is a brand)
    const product = await prisma.product.findUnique({
      where: { id },
      include: { brand: true },
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // If user is a brand, check if they own this product
    if (userRole === 'BRAND') {
      const userBrand = await prisma.brand.findFirst({
        where: { ownerId: session.user.id },
      })
      
      if (!userBrand || userBrand.id !== product.brandId) {
        return NextResponse.json(
          { error: 'Forbidden: You can only upload AR assets for your own products' },
          { status: 403 }
        )
      }
    }
    
    // Parse the request body
    const { assetUrl, assetType, metadata } = await request.json()
    
    // Validate required fields
    if (!assetUrl || !assetType) {
      return NextResponse.json(
        { error: 'Missing required fields: assetUrl and assetType are required' },
        { status: 400 }
      )
    }
    
    // Create a new AR asset
    const arAsset = await prisma.aRAsset.create({
      data: {
        url: assetUrl,
        type: assetType,
        metadata: metadata || {},
        product: {
          connect: { id },
        },
      },
    })
    
    // Update the product's arAssetUrl if this is the first AR asset
    if (!product.arAssetUrl) {
      await prisma.product.update({
        where: { id },
        data: { arAssetUrl: assetUrl },
      })
    }
    
    return NextResponse.json(arAsset, { status: 201 })
  } catch (error) {
    console.error('Error uploading AR asset:', error)
    return NextResponse.json(
      { error: 'Failed to upload AR asset' },
      { status: 500 }
    )
  }
}

// Handler for DELETE requests - Remove an AR asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await auth()
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get the asset ID from the query parameters
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId')
    
    if (!assetId) {
      return NextResponse.json(
        { error: 'Missing assetId parameter' },
        { status: 400 }
      )
    }
    
    // Check if the asset exists and is associated with the product
    const asset = await prisma.aRAsset.findUnique({
      where: { id: assetId },
      include: { product: { include: { brand: true } } },
    })
    
    if (!asset || asset.product.id !== id) {
      return NextResponse.json(
        { error: 'Asset not found or not associated with this product' },
        { status: 404 }
      )
    }
    
    // Check if user has permission (brand owner or admin)
    const userRole = session.user.role
    
    if (userRole === 'BRAND') {
      const userBrand = await prisma.brand.findFirst({
        where: { ownerId: session.user.id },
      })
      
      if (!userBrand || userBrand.id !== asset.product.brandId) {
        return NextResponse.json(
          { error: 'Forbidden: You can only delete AR assets for your own products' },
          { status: 403 }
        )
      }
    } else if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only brands and admins can delete AR assets' },
        { status: 403 }
      )
    }
    
    // Delete the asset
    await prisma.aRAsset.delete({
      where: { id: assetId },
    })
    
    // If this was the primary AR asset (used in product.arAssetUrl),
    // update the product to use another asset or set to null
    if (asset.product.arAssetUrl === asset.url) {
      const remainingAssets = await prisma.aRAsset.findMany({
        where: { productId: id },
        orderBy: { createdAt: 'desc' },
        take: 1,
      })
      
      await prisma.product.update({
        where: { id },
        data: {
          arAssetUrl: remainingAssets.length > 0 ? remainingAssets[0].url : null,
        },
      })
    }
    
    return NextResponse.json(
      { message: 'AR asset deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting AR asset:', error)
    return NextResponse.json(
      { error: 'Failed to delete AR asset' },
      { status: 500 }
    )
  }
} 