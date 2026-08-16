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

  it('disables clearing when no todos are completed', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /ship the starting point/i }))
    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))

    expect(screen.getByRole('button', { name: 'Clear completed' })).toBeDisabled()
  })

  it('removes every completed todo in one action', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /review the details panel/i }))
    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))
    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(screen.queryByRole('button', { name: /review the details panel/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /ship the starting point/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toBeInTheDocument()
  })

  it('keeps the current selection when the selected todo remains', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Sketch the todo flow')
  })

  it('selects the first remaining todo when clearing removes the selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /ship the starting point/i }))
    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Sketch the todo flow')
  })

  it('updates the completion summary after clearing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(screen.getByText('0 of 2 complete')).toBeInTheDocument()
  })

  it('uses the empty selection state after clearing all completed todos', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))
    await user.click(screen.getByRole('button', { name: /review the details panel/i }))
    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))
    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(screen.getByText('0 of 0 complete')).toBeInTheDocument()
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
    expect(screen.getByText('Select a task to edit it.')).toBeInTheDocument()
  })

  it('shows only incomplete todos when filtering is enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('checkbox', { name: 'Show incomplete only' }))

    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /review the details panel/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /ship the starting point/i })).not.toBeInTheDocument()
    expect(screen.getByText('1 of 3 complete')).toBeInTheDocument()
  })

  it('selects the first visible todo when filtering hides the selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /ship the starting point/i }))
    await user.click(screen.getByRole('checkbox', { name: 'Show incomplete only' }))

    expect(screen.getByRole('button', { name: /sketch the todo flow/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Sketch the todo flow')
  })

  it('uses the empty selection state when no incomplete todos remain', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('checkbox', { name: 'Show incomplete only' }))
    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))
    await user.click(screen.getByRole('checkbox', { name: /mark complete/i }))

    expect(screen.getByText('No incomplete tasks.')).toBeInTheDocument()
    expect(screen.getByText('Select a task to edit it.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /ship the starting point/i })).not.toBeInTheDocument()
  })

  it('restores the full list without losing edits', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /ship the starting point/i }))
    const title = screen.getByRole('textbox', { name: 'Title' })
    await user.clear(title)
    await user.type(title, 'Ship the polished starting point')
    await user.click(screen.getByRole('checkbox', { name: 'Show incomplete only' }))
    await user.click(screen.getByRole('checkbox', { name: 'Show incomplete only' }))

    await user.click(screen.getByRole('button', { name: /ship the polished starting point/i }))
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Ship the polished starting point')
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

  it('keeps keyboard focus inside the dialog', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add task' }))
    const dialog = screen.getByRole('dialog')
    const title = within(dialog).getByRole('textbox', { name: 'Title' })
    const createButton = within(dialog).getByRole('button', { name: 'Create' })

    expect(title).toHaveFocus()
    await user.tab({ shift: true })
    expect(createButton).toHaveFocus()
    await user.tab()
    expect(title).toHaveFocus()
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
