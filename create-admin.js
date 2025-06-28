const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@luxury.com'
      }
    })

    if (existingAdmin) {
      console.log('Admin user already exists!')
      console.log('Email: admin@luxury.com')
      console.log('Password: admin123')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@luxury.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Admin user created successfully!')
    console.log('Email: admin@luxury.com')
    console.log('Password: admin123')
    console.log('User ID:', adminUser.id)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser() 