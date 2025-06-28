import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const arType = formData.get('arType') as string
    const description = formData.get('description') as string

    if (!file || !productId || !arType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['model/gltf+json', 'model/gltf-binary', 'application/octet-stream']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only GLTF/GLB files are allowed.' },
        { status: 400 }
      )
    }

    // In a real implementation, you would upload the file to a cloud storage service
    // For now, we'll just store the file information
    const fileName = `${Date.now()}-${file.name}`
    const fileUrl = `/uploads/ar/${fileName}` // This would be the actual cloud storage URL

    // Create AR asset record
    const arAsset = await prisma.aRAsset.create({
      data: {
        productId,
        url: fileUrl,
        type: arType,
        metadata: description ? { description } : undefined
      }
    })

    return NextResponse.json({
      success: true,
      arAsset
    })
  } catch (error) {
    console.error('Error uploading AR asset:', error)
    return NextResponse.json(
      { error: 'Failed to upload AR asset' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const arAssets = await prisma.aRAsset.findMany({
      where: {
        productId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(arAssets)
  } catch (error) {
    console.error('Error fetching AR assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AR assets' },
      { status: 500 }
    )
  }
} 