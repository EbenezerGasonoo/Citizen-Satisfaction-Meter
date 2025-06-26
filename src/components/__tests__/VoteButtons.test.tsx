import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import VoteButtons from '../VoteButtons'

// Mock fetch
global.fetch = jest.fn()

describe('VoteButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders vote buttons', () => {
    render(<VoteButtons ministerId={1} />)
    
    expect(screen.getByText('Satisfied')).toBeInTheDocument()
    expect(screen.getByText('Not Satisfied')).toBeInTheDocument()
  })

  it('handles satisfied vote', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<VoteButtons ministerId={1} />)
    
    const satisfiedButton = screen.getByText('Satisfied')
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
    
    const notSatisfiedButton = screen.getByText('Not Satisfied')
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
    
    const satisfiedButton = screen.getByText('Satisfied')
    fireEvent.click(satisfiedButton)

    await waitFor(() => {
      expect(satisfiedButton).toHaveClass('bg-green-100')
      expect(screen.getByText('Not Satisfied')).toBeDisabled()
    })
  })
}) 