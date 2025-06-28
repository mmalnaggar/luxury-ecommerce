import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  
  console.log('Admin user created:', admin.email)
  
  // Create brand user
  const brandPassword = await bcrypt.hash('brand123', 10)
  const brandUser = await prisma.user.upsert({
    where: { email: 'brand@example.com' },
    update: {},
    create: {
      email: 'brand@example.com',
      name: 'Brand Manager',
      password: brandPassword,
      role: 'BRAND',
    },
  })
  
  console.log('Brand user created:', brandUser.email)
  
  // Create shopper user
  const shopperPassword = await bcrypt.hash('shopper123', 10)
  const shopperUser = await prisma.user.upsert({
    where: { email: 'shopper@example.com' },
    update: {},
    create: {
      email: 'shopper@example.com',
      name: 'Regular Shopper',
      password: shopperPassword,
      role: 'SHOPPER',
    },
  })
  
  console.log('Shopper user created:', shopperUser.email)
  
  // Create a brand
  const fashionBrand = await prisma.brand.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Fashion Forward',
      description: 'Trendy and affordable fashion for everyone',
      logoUrl: 'https://via.placeholder.com/150',
      ownerId: brandUser.id,
      customization: {
        primaryColor: '#3B82F6',
        bannerUrl: 'https://via.placeholder.com/1200x400',
        featuredProducts: []
      }
    },
  })
  
  console.log('Brand created:', fashionBrand.name)
  
  // Create categories
  const categories = [
    {
      name: 'Shirts',
      slug: 'shirts',
      description: 'Casual and formal shirts',
      brandId: fashionBrand.id
    },
    {
      name: 'Pants',
      slug: 'pants',
      description: 'Jeans, trousers, and more',
      brandId: fashionBrand.id
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Belts, hats, and jewelry',
      brandId: fashionBrand.id
    }
  ]
  
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    console.log('Category created:', createdCategory.name)
  }
  
  // Get created categories
  const shirtCategory = await prisma.category.findUnique({
    where: { slug: 'shirts' }
  })
  
  const pantsCategory = await prisma.category.findUnique({
    where: { slug: 'pants' }
  })
  
  const accessoriesCategory = await prisma.category.findUnique({
    where: { slug: 'accessories' }
  })
  
  if (!shirtCategory || !pantsCategory || !accessoriesCategory) {
    throw new Error('Categories were not created properly')
  }
  
  // Create products
  const products = [
    {
      name: 'Classic White Shirt',
      description: 'A timeless white button-up shirt that goes with everything',
      price: 39.99,
      stock: 100,
      imageUrl: 'https://via.placeholder.com/500?text=White+Shirt',
      arAssetUrl: 'https://example.com/ar/white-shirt.glb',
      brandId: fashionBrand.id,
      features: {
        material: '100% Cotton',
        fit: 'Regular',
        care: 'Machine wash cold'
      },
      tags: ['shirt', 'white', 'classic', 'formal'],
      categories: {
        connect: [{ id: shirtCategory.id }]
      }
    },
    {
      name: 'Blue Denim Jeans',
      description: 'Comfortable blue jeans with a modern fit',
      price: 59.99,
      stock: 75,
      imageUrl: 'https://via.placeholder.com/500?text=Blue+Jeans',
      arAssetUrl: 'https://example.com/ar/blue-jeans.glb',
      brandId: fashionBrand.id,
      features: {
        material: '98% Cotton, 2% Elastane',
        fit: 'Slim',
        care: 'Machine wash cold, tumble dry low'
      },
      tags: ['jeans', 'denim', 'blue', 'casual'],
      categories: {
        connect: [{ id: pantsCategory.id }]
      }
    },
    {
      name: 'Leather Belt',
      description: 'Genuine leather belt with metal buckle',
      price: 29.99,
      stock: 50,
      imageUrl: 'https://via.placeholder.com/500?text=Leather+Belt',
      brandId: fashionBrand.id,
      features: {
        material: 'Genuine Leather',
        color: 'Brown',
        buckle: 'Stainless Steel'
      },
      tags: ['belt', 'leather', 'accessory'],
      categories: {
        connect: [{ id: accessoriesCategory.id }]
      }
    },
    {
      name: 'Striped T-Shirt',
      description: 'Casual striped t-shirt for everyday wear',
      price: 24.99,
      stock: 120,
      imageUrl: 'https://via.placeholder.com/500?text=Striped+Tshirt',
      arAssetUrl: 'https://example.com/ar/striped-tshirt.glb',
      brandId: fashionBrand.id,
      features: {
        material: '100% Cotton',
        fit: 'Regular',
        pattern: 'Striped'
      },
      tags: ['tshirt', 'striped', 'casual'],
      categories: {
        connect: [{ id: shirtCategory.id }]
      }
    },
    {
      name: 'Chino Pants',
      description: 'Versatile chino pants for work or casual occasions',
      price: 49.99,
      stock: 60,
      imageUrl: 'https://via.placeholder.com/500?text=Chino+Pants',
      arAssetUrl: 'https://example.com/ar/chino-pants.glb',
      brandId: fashionBrand.id,
      features: {
        material: '97% Cotton, 3% Elastane',
        fit: 'Straight',
        care: 'Machine wash cold'
      },
      tags: ['pants', 'chino', 'casual', 'formal'],
      categories: {
        connect: [{ id: pantsCategory.id }]
      }
    }
  ]
  
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product
    })
    console.log('Product created:', createdProduct.name)
  }
  
  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 