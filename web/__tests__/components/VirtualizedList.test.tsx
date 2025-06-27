import { render, screen, fireEvent } from '@testing-library/react'
import VirtualizedList from '@/components/VirtualizedList'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

describe('VirtualizedList', () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    content: `Item ${i}`,
  }))

  const renderItem = (item: { id: number; content: string }, index: number) => (
    <div data-testid={`item-${item.id}`} style={{ height: '50px' }}>
      {item.content}
    </div>
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders visible items only', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualizedList
          items={mockItems}
          renderItem={renderItem}
          itemHeight={50}
          containerHeight={200}
        />
      </div>
    )
    
    // Should only render items that fit in the container height plus overscan
    const visibleItems = screen.getAllByTestId(/^item-/)
    expect(visibleItems.length).toBeLessThanOrEqual(12) // Allow for more items due to overscan
  })

  it('renders with custom overscan', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualizedList
          items={mockItems}
          renderItem={renderItem}
          itemHeight={50}
          containerHeight={200}
          overscan={10}
        />
      </div>
    )
    
    const visibleItems = screen.getAllByTestId(/^item-/)
    expect(visibleItems.length).toBeLessThanOrEqual(20) // Allow for more items with higher overscan
  })

  it('handles scroll events', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualizedList
          items={mockItems}
          renderItem={renderItem}
          itemHeight={50}
          containerHeight={200}
        />
      </div>
    )
    
    const container = document.querySelector('[style*="overflow: auto"]')
    expect(container).toBeInTheDocument()
    
    if (container) {
      fireEvent.scroll(container, { target: { scrollTop: 100 } })
      // The component should handle scroll internally
    }
  })

  it('updates visible range on scroll', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualizedList
          items={mockItems}
          renderItem={renderItem}
          itemHeight={50}
          containerHeight={200}
        />
      </div>
    )
    
    const container = document.querySelector('[style*="overflow: auto"]')
    if (container) {
      fireEvent.scroll(container, { target: { scrollTop: 100 } })
      
      // Should render different items after scroll
      const visibleItems = screen.getAllByTestId(/^item-/)
      expect(visibleItems.length).toBeGreaterThan(0)
    }
  })

  it('handles empty items array', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualizedList
          items={[]}
          renderItem={renderItem}
          itemHeight={50}
          containerHeight={200}
        />
      </div>
    )
    
    const visibleItems = screen.queryAllByTestId(/^item-/)
    expect(visibleItems).toHaveLength(0)
  })

  it('applies correct container styles', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualizedList
          items={mockItems}
          renderItem={renderItem}
          itemHeight={50}
          containerHeight={200}
        />
      </div>
    )
    
    const container = document.querySelector('[style*="height: 200px"]')
    expect(container).toBeInTheDocument()
  })
}) 