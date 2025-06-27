import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchFilters from '../../components/SearchFilters'

// Mock fetch
global.fetch = jest.fn()

describe('SearchFilters', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        { name: 'Electronics' },
        { name: 'Clothing' }
      ]
    })
  })

  it('renders search input and filter options', async () => {
    render(<SearchFilters onSearch={mockOnSearch} />)

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument()
    expect(screen.getByText('Search & Filters')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('Brands')).toBeInTheDocument()
      expect(screen.getByText('Price Range')).toBeInTheDocument()
    })
  })

  it('calls onSearch when search button is clicked', async () => {
    render(<SearchFilters onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText('Search products...')
    const searchButton = screen.getByText('Search')

    fireEvent.change(searchInput, { target: { value: 'test query' } })
    fireEvent.click(searchButton)

    expect(mockOnSearch).toHaveBeenCalledWith('test query', {
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 1000,
    })
  })

  it('clears filters when clear button is clicked', async () => {
    render(<SearchFilters onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText('Search products...')
    const clearButton = screen.getByText('Clear')

    fireEvent.change(searchInput, { target: { value: 'test query' } })
    fireEvent.click(clearButton)

    expect(searchInput).toHaveValue('')
  })

  it('handles category selection', async () => {
    render(<SearchFilters onSearch={mockOnSearch} />)

    await waitFor(() => {
      const electronicsCheckbox = screen.getByLabelText('Electronics')
      fireEvent.click(electronicsCheckbox)
    })

    const searchButton = screen.getByText('Search')
    fireEvent.click(searchButton)

    expect(mockOnSearch).toHaveBeenCalledWith('', {
      categories: ['Electronics'],
      brands: [],
      minPrice: 0,
      maxPrice: 1000,
    })
  })
}) 