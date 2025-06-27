import { render, screen, waitFor } from '@testing-library/react'
import LazyImage from '@/components/LazyImage'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

describe('LazyImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with placeholder initially', () => {
    render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )
    
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'))
  })

  it('shows loading state initially', () => {
    render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('loads image when priority is true', async () => {
    render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        priority={true}
      />
    )
    
    await waitFor(() => {
      const img = screen.getByAltText('Test image')
      // Next.js optimizes images, so we check for the optimized URL pattern
      expect(img).toHaveAttribute('src', expect.stringContaining('/_next/image'))
    })
  })

  it('applies custom className', () => {
    render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        className="custom-class"
      />
    )
    
    const container = document.querySelector('.custom-class')
    expect(container).toBeInTheDocument()
  })

  it('sets correct width and height attributes', () => {
    render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )
    
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('width', '300')
    expect(img).toHaveAttribute('height', '200')
  })
}) 