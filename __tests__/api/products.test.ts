import { NextRequest } from 'next/server'
import { GET } from '../../app/api/catalog/products/route'

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    product: {
      findMany: jest.fn(),
    },
  })),
}))

describe('/api/catalog/products', () => {
  it('returns products successfully', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        imageUrl: 'test.jpg',
        brand: { name: 'Test Brand' },
      },
    ]

    const { PrismaClient } = require('@prisma/client')
    const mockPrisma = new PrismaClient()
    mockPrisma.product.findMany.mockResolvedValue(mockProducts)

    const request = new NextRequest('http://localhost:3000/api/catalog/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockProducts)
  })

  it('handles database errors', async () => {
    const { PrismaClient } = require('@prisma/client')
    const mockPrisma = new PrismaClient()
    mockPrisma.product.findMany.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/catalog/products')
    const response = await GET(request)

    expect(response.status).toBe(500)
  })
}) 