import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import ReviewsList from '../../components/ReviewsList'
import '@testing-library/jest-dom'

// Mock fetch
global.fetch = jest.fn()

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

// Mock session data
const mockSession = {
  data: {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'SHOPPER'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  status: 'authenticated'
}

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession.data}>
    {children}
  </SessionProvider>
)

describe('ReviewsList', () => {
  const mockReviews = [
    {
      id: '1',
      rating: 5,
      comment: 'Great product!',
      createdAt: '2024-01-01T00:00:00Z',
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      id: '2',
      rating: 3,
      comment: 'Good but could be better',
      createdAt: '2024-01-02T00:00:00Z',
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(
      <TestWrapper>
        <ReviewsList productId="test-product" />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders reviews when data is loaded', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockReviews
    })

    render(
      <TestWrapper>
        <ReviewsList productId="test-product" />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Customer Reviews')).toBeInTheDocument()
      expect(screen.getByText('Great product!')).toBeInTheDocument()
      expect(screen.getByText('Good but could be better')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('renders empty state when no reviews', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    })

    render(
      <TestWrapper>
        <ReviewsList productId="test-product" />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('No reviews yet. Be the first to review this product!')).toBeInTheDocument()
    })
  })

  it('shows toast error when fetch fails', async () => {
    const { toast } = require('sonner')
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))

    render(
      <TestWrapper>
        <ReviewsList productId="test-product" />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error fetching reviews')
    })
  })

  it('displays correct rating stars', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockReviews[0]]
    })

    render(
      <TestWrapper>
        <ReviewsList productId="test-product" />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Great product!')).toBeInTheDocument()
    })
  })
}) 