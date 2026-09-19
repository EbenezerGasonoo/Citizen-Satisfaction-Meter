import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import VoteButtons from '../VoteButtons'

// Mock fetch
global.fetch = jest.fn()

describe('VoteButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders vote buttons', () => {
    render(<VoteButtons ministerId={1} />)
    
    expect(screen.getByRole('button', { name: /^🇬🇭 Satisfied$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Not Satisfied/i })).toBeInTheDocument()
  })

  it('handles satisfied vote', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<VoteButtons ministerId={1} />)
    
    const satisfiedButton = screen.getByRole('button', { name: /^🇬🇭 Satisfied$/i })
    fireEvent.click(satisfiedButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/ministers/1/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positive: true }),
      })
    })
  })

  it('handles not satisfied vote', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<VoteButtons ministerId={1} />)
    
    const notSatisfiedButton = screen.getByRole('button', { name: /Not Satisfied/i })
    fireEvent.click(notSatisfiedButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/ministers/1/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positive: false }),
      })
    })
  })

  it('disables buttons after voting', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<VoteButtons ministerId={1} />)
    
    const satisfiedButton = screen.getByRole('button', { name: /^🇬🇭 Satisfied$/i })
    fireEvent.click(satisfiedButton)

    await waitFor(() => {
      expect(satisfiedButton).toBeDisabled()
      expect(screen.getByRole('button', { name: /Not Satisfied/i })).toBeDisabled()
    })
  })
}) 