import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('supports adding, editing, completing, selecting, and deleting todos', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: /things worth finishing/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /add task/i }))
    const title = screen.getByRole('textbox', { name: 'Title' })
    await user.clear(title)
    await user.type(title, 'Write component tests')
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'Cover the complete workflow.')
    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))

    expect(screen.getByRole('button', { name: /write component tests/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('2 of 4 complete')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /review the details panel/i }))
    expect(title).toHaveValue('Review the details panel')

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.queryByRole('button', { name: /review the details panel/i })).not.toBeInTheDocument()
  })
})
