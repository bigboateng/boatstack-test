import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
})

describe('App', () => {
  it('supports adding, editing, completing, selecting, and deleting todos', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: /things worth finishing/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /add task/i }))
    const dialog = screen.getByRole('dialog', { name: /add a task/i })
    await user.type(within(dialog).getByRole('textbox', { name: 'Title' }), 'Write component tests')
    await user.type(within(dialog).getByRole('textbox', { name: 'Notes' }), 'Cover the complete workflow.')
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    const title = screen.getByRole('textbox', { name: 'Title' })
    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))

    expect(screen.getByRole('button', { name: /write component tests/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('2 of 4 complete')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /review the details panel/i }))
    expect(title).toHaveValue('Review the details panel')

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.queryByRole('button', { name: /review the details panel/i })).not.toBeInTheDocument()
  })

  it('opens the dialog without changing tasks or selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(screen.getByRole('dialog', { name: /add a task/i })).toBeInTheDocument()
    expect(screen.getByText('1 of 3 complete')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('creates and selects a task from valid dialog values', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add task' }))
    const dialog = screen.getByRole('dialog', { name: /add a task/i })
    await user.type(within(dialog).getByRole('textbox', { name: 'Title' }), 'Plan release')
    await user.type(within(dialog).getByRole('textbox', { name: 'Notes' }), 'Confirm the delivery details.')
    await user.type(within(dialog).getByLabelText('Due date'), '2026-08-30')
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /plan release/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Plan release')
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('Confirm the delivery details.')
    expect(screen.getByLabelText('Due date')).toHaveValue('2026-08-30')
  })

  it('cancels without creating a task', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add task' }))
    const dialog = screen.getByRole('dialog', { name: /add a task/i })
    await user.type(within(dialog).getByRole('textbox', { name: 'Title' }), 'Discarded task')
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /discarded task/i })).not.toBeInTheDocument()
    expect(screen.getByText('1 of 3 complete')).toBeInTheDocument()
  })

  it('requires a title containing non-whitespace characters', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add task' }))
    const dialog = screen.getByRole('dialog', { name: /add a task/i })
    const title = within(dialog).getByRole('textbox', { name: 'Title' })
    await user.type(title, '   ')
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    expect(dialog).toBeInTheDocument()
    expect(title).toHaveFocus()
    expect(title).toHaveAttribute('aria-invalid', 'true')
    expect(within(dialog).getByText(/at least one non-whitespace character/i)).toBeInTheDocument()
  })

  it('closes with Escape without creating a task', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add task' }))
    await user.type(within(screen.getByRole('dialog')).getByRole('textbox', { name: 'Title' }), 'Discarded task')
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /discarded task/i })).not.toBeInTheDocument()
  })

  it('restores focus to the exact control that opened the dialog', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Add task' })

    await user.click(trigger)
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }))

    expect(trigger).toHaveFocus()
  })

  it('reopens with clean draft values', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Add task' })

    await user.click(trigger)
    const firstDialog = screen.getByRole('dialog')
    await user.type(within(firstDialog).getByRole('textbox', { name: 'Title' }), 'Discarded task')
    await user.type(within(firstDialog).getByRole('textbox', { name: 'Notes' }), 'Discarded notes')
    await user.click(within(firstDialog).getByRole('button', { name: 'Cancel' }))
    await user.click(trigger)

    const reopenedDialog = screen.getByRole('dialog')
    expect(within(reopenedDialog).getByRole('textbox', { name: 'Title' })).toHaveValue('')
    expect(within(reopenedDialog).getByRole('textbox', { name: 'Notes' })).toHaveValue('')
    expect(within(reopenedDialog).getByLabelText('Due date')).toHaveValue('')
  })
})
