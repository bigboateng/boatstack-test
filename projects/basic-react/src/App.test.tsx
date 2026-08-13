import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('increments and resets its counter', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: /small react starting point/i })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('0 steps')
    expect(screen.queryByRole('button', { name: /reset steps/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /add a step/i }))

    expect(screen.getByRole('status')).toHaveTextContent('1 step')
    await user.click(screen.getByRole('button', { name: /reset steps/i }))

    expect(screen.getByRole('status')).toHaveTextContent('0 steps')
    expect(screen.queryByRole('button', { name: /reset steps/i })).not.toBeInTheDocument()
  })
})
