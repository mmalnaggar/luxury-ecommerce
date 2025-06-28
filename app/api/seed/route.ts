import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // First, get or create a system user
    let systemUser = await prisma.user.findFirst({
      where: { email: 'system@luxury.com' }
    })

    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          email: 'system@luxury.com',
          name: 'System User',
          password: 'system-password-hash', // This won't be used for login
          role: 'ADMIN'
        }
      })
    }

    // Create a sample brand
    const brand = await prisma.brand.create({
      data: {
        name: 'Luxury Fashion House',
        description: 'Premium fashion brand offering exclusive luxury items',
        logoUrl: '/images/brand-logo.png',
        customization: JSON.stringify({ theme: 'luxury', colors: ['gold', 'black'] }),
        ownerId: systemUser.id
      }
    })

    // Create sample categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Luxury Bags',
          description: 'Exclusive designer handbags',
          slug: 'luxury-bags',
          imageUrl: '/images/categories/bags.jpg',
          brandId: brand.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Premium Watches',
          description: 'Luxury timepieces',
          slug: 'premium-watches',
          imageUrl: '/images/categories/watches.jpg',
          brandId: brand.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Designer Clothing',
          description: 'High-end fashion apparel',
          slug: 'designer-clothing',
          imageUrl: '/images/categories/clothing.jpg',
          brandId: brand.id
        }
      })
    ])

    // Create sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Luxury Leather Handbag',
          description: 'Handcrafted premium leather handbag with gold hardware',
          price: 2500.00,
          currency: 'EGP',
          brandId: brand.id,
          categories: { connect: [{ id: categories[0].id }] },
          stock: 10,
          imageUrl: '/images/products/luxury-bag-1.jpg',
          features: JSON.stringify({
            material: 'Premium Leather',
            hardware: 'Gold-plated',
            dimensions: '30cm x 20cm x 10cm',
            warranty: '2 years'
          }),
          tags: 'luxury,handbag,leather,gold'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Swiss Luxury Watch',
          description: 'Precision Swiss timepiece with diamond accents',
          price: 15000.00,
          currency: 'EGP',
          brandId: brand.id,
          categories: { connect: [{ id: categories[1].id }] },
          stock: 5,
          imageUrl: '/images/products/luxury-watch-1.jpg',
          features: JSON.stringify({
            movement: 'Swiss Automatic',
            case: '18K Gold',
            crystal: 'Sapphire',
            waterResistance: '100m'
          }),
          tags: 'luxury,watch,swiss,gold,diamond'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Designer Silk Dress',
          description: 'Elegant silk dress with hand-embroidered details',
          price: 3500.00,
          currency: 'EGP',
          brandId: brand.id,
          categories: { connect: [{ id: categories[2].id }] },
          stock: 15,
          imageUrl: '/images/products/silk-dress-1.jpg',
          features: JSON.stringify({
            material: 'Pure Silk',
            embroidery: 'Hand-crafted',
            fit: 'Custom tailored',
            care: 'Dry clean only'
          }),
          tags: 'luxury,dress,silk,embroidery'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        brand: brand.id,
        categories: categories.length,
        products: products.length
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 