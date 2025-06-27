import { render, screen, fireEvent } from '@testing-library/react'
import LuxuryLayout, { LuxuryCard, LuxuryButton } from '@/components/LuxuryLayout'

describe('LuxuryLayout', () => {
  it('renders children correctly', () => {
    render(
      <LuxuryLayout>
        <div data-testid="test-content">Test Content</div>
      </LuxuryLayout>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('applies correct background classes', () => {
    const { rerender } = render(
      <LuxuryLayout background="gradient">
        <div>Content</div>
      </LuxuryLayout>
    )
    
    expect(document.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
    
    rerender(
      <LuxuryLayout background="solid">
        <div>Content</div>
      </LuxuryLayout>
    )
    
    expect(document.querySelector('.bg-slate-900')).toBeInTheDocument()
  })

  it('applies correct accent colors', () => {
    const { rerender } = render(
      <LuxuryLayout accent="gold">
        <div>Content</div>
      </LuxuryLayout>
    )
    
    expect(document.querySelector('.via-amber-400')).toBeInTheDocument()
    
    rerender(
      <LuxuryLayout accent="silver">
        <div>Content</div>
      </LuxuryLayout>
    )
    
    const layout = document.querySelector('[class*="bg-"]')
    expect(layout).toBeInTheDocument()
  })
})

describe('LuxuryCard', () => {
  it('renders children correctly', () => {
    render(
      <LuxuryCard>
        <div data-testid="card-content">Card Content</div>
      </LuxuryCard>
    )
    
    expect(screen.getByTestId('card-content')).toBeInTheDocument()
  })

  it('applies hover effects when enabled', () => {
    render(
      <LuxuryCard hover={true}>
        <div>Content</div>
      </LuxuryCard>
    )
    
    const card = document.querySelector('.transition-all')
    expect(card).toBeInTheDocument()
  })

  it('applies correct accent colors', () => {
    const { rerender } = render(
      <LuxuryCard accent="gold">
        <div>Content</div>
      </LuxuryCard>
    )
    
    expect(document.querySelector('.border-amber-400\\/20')).toBeInTheDocument()
    
    rerender(
      <LuxuryCard accent="platinum">
        <div>Content</div>
      </LuxuryCard>
    )
    
    expect(document.querySelector('.border-emerald-300\\/20')).toBeInTheDocument()
  })
})

describe('LuxuryButton', () => {
  it('renders children correctly', () => {
    render(
      <LuxuryButton>
        Click me
      </LuxuryButton>
    )
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    
    render(
      <LuxuryButton onClick={handleClick}>
        Click me
      </LuxuryButton>
    )
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <LuxuryButton variant="primary">
        Primary
      </LuxuryButton>
    )
    
    expect(document.querySelector('.bg-gradient-to-r')).toBeInTheDocument()
    
    rerender(
      <LuxuryButton variant="outline">
        Outline
      </LuxuryButton>
    )
    
    expect(document.querySelector('.border-2')).toBeInTheDocument()
  })

  it('disables button when disabled prop is true', () => {
    render(
      <LuxuryButton disabled={true}>
        Disabled
      </LuxuryButton>
    )
    
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-not-allowed')
  })

  it('applies correct accent colors', () => {
    const { rerender } = render(
      <LuxuryButton accent="gold">
        Gold
      </LuxuryButton>
    )
    
    expect(document.querySelector('.from-amber-400')).toBeInTheDocument()
    
    rerender(
      <LuxuryButton accent="platinum">
        Platinum
      </LuxuryButton>
    )
    
    expect(document.querySelector('.from-emerald-300')).toBeInTheDocument()
  })
}) 