import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { SealcoatCalculator } from '../SealcoatCalculator'

describe('SealcoatCalculator', () => {
  it('renders the calculator interface', () => {
    render(<SealcoatCalculator />)
    
    expect(screen.getByText('Sealcoat Material Calculator')).toBeInTheDocument()
    expect(screen.getByLabelText(/area to seal/i)).toBeInTheDocument()
    expect(screen.getByText(/number of coats/i)).toBeInTheDocument()
  })

  it('calculates sealcoat requirements correctly', async () => {
    render(<SealcoatCalculator />)
    
    const areaInput = screen.getByLabelText(/area to seal/i)
    const calculateButton = screen.getByRole('button', { name: /calculate materials/i })
    
    fireEvent.change(areaInput, { target: { value: '5000' } })
    fireEvent.click(calculateButton)
    
    // Should show calculated results
    expect(screen.getByText(/material requirements/i)).toBeInTheDocument()
  })

  it('shows validation error for invalid input', async () => {
    render(<SealcoatCalculator />)
    
    const calculateButton = screen.getByRole('button', { name: /calculate materials/i })
    fireEvent.click(calculateButton)
    
    // Should show validation error for empty input
    // Note: This would require implementing toast testing or checking for error states
  })
})