import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import './App.css'

type Todo = {
  id: number
  title: string
  notes: string
  dueDate: string
  completed: boolean
}

type TodoDraft = {
  title: string
  notes: string
  dueDate: string
}

const emptyTodoDraft: TodoDraft = {
  title: '',
  notes: '',
  dueDate: '',
}

const initialTodos: Todo[] = [
  { id: 1, title: 'Sketch the todo flow', notes: 'Keep the first pass deliberately small and useful.', dueDate: '2026-08-14', completed: false },
  { id: 2, title: 'Review the details panel', notes: 'Check editing, focus, and the mobile layout.', dueDate: '2026-08-16', completed: false },
  { id: 3, title: 'Ship the starting point', notes: 'A completed example keeps the state easy to read.', dueDate: '2026-08-12', completed: true },
]

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [selectedID, setSelectedID] = useState(initialTodos[0].id)
  const [isSortedByDueDate, setIsSortedByDueDate] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [todoDraft, setTodoDraft] = useState<TodoDraft>(emptyTodoDraft)
  const [titleError, setTitleError] = useState('')
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLElement | null>(null)
  const titleInputRef = useRef<HTMLInputElement | null>(null)

  const selectedTodo = todos.find((todo) => todo.id === selectedID) ?? null
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos])
  const visibleTodos = useMemo(() => {
    if (!isSortedByDueDate) {
      return todos
    }

    return [...todos].sort((leftTodo, rightTodo) => {
      if (leftTodo.dueDate.length === 0 && rightTodo.dueDate.length === 0) {
        return 0
      }

      if (leftTodo.dueDate.length === 0) {
        return 1
      }

      if (rightTodo.dueDate.length === 0) {
        return -1
      }

      return leftTodo.dueDate.localeCompare(rightTodo.dueDate)
    })
  }, [isSortedByDueDate, todos])

  useEffect(() => {
    if (!isAddDialogOpen) {
      return
    }

    titleInputRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeAddDialog()
      }

      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>('button, input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? [],
        )
        const firstFocusableElement = focusableElements[0]
        const lastFocusableElement = focusableElements[focusableElements.length - 1]

        if (!firstFocusableElement || !lastFocusableElement) {
          event.preventDefault()
          return
        }

        if (event.shiftKey && document.activeElement === firstFocusableElement) {
          event.preventDefault()
          lastFocusableElement.focus()
          return
        }

        if (!event.shiftKey && document.activeElement === lastFocusableElement) {
          event.preventDefault()
          firstFocusableElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAddDialogOpen])

  function updateSelected(changes: Partial<Todo>) {
    if (!selectedTodo) {
      return
    }

    setTodos((current) => current.map((todo) => todo.id === selectedTodo.id ? { ...todo, ...changes } : todo))
  }

  function openAddDialog(event: MouseEvent<HTMLButtonElement>) {
    dialogTriggerRef.current = event.currentTarget
    setTodoDraft(emptyTodoDraft)
    setTitleError('')
    setIsAddDialogOpen(true)
  }

  function closeAddDialog() {
    const dialogTrigger = dialogTriggerRef.current
    setIsAddDialogOpen(false)
    setTodoDraft(emptyTodoDraft)
    setTitleError('')
    dialogTrigger?.focus()
  }

  function createTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = todoDraft.title.trim()

    if (title.length === 0) {
      setTitleError('Enter a title containing at least one non-whitespace character.')
      titleInputRef.current?.focus()
      return
    }

    const id = Math.max(0, ...todos.map((todo) => todo.id)) + 1
    const todo: Todo = {
      id,
      title,
      notes: todoDraft.notes,
      dueDate: todoDraft.dueDate,
      completed: false,
    }

    setTodos((current) => [todo, ...current])
    setSelectedID(id)
    closeAddDialog()
  }

  function deleteSelected() {
    if (!selectedTodo) {
      return
    }

    const remaining = todos.filter((todo) => todo.id !== selectedTodo.id)
    setTodos(remaining)
    setSelectedID(remaining[0]?.id ?? 0)
  }

  function clearCompleted() {
    const remaining = todos.filter((todo) => !todo.completed)
    const selectedTodoRemains = remaining.some((todo) => todo.id === selectedID)

    setTodos(remaining)
    if (!selectedTodoRemains) {
      setSelectedID(remaining[0]?.id ?? 0)
    }
  }

  return (
    <main className="todo-app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Boatstack test project</p>
          <h1>Things worth finishing.</h1>
        </div>
        <p className="summary" aria-live="polite">{completedCount} of {todos.length} complete</p>
      </header>

      <section className="todo-workspace" aria-label="Todo workspace">
        <aside className="todo-list-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">My list</p>
              <h2>Tasks</h2>
            </div>
            <div className="list-actions">
              <button type="button" disabled={completedCount === 0} onClick={clearCompleted}>Clear completed</button>
              <button className="add-button" type="button" onClick={openAddDialog}>Add task</button>
            </div>
          </div>

          <label className="sort-toggle">
            <input
              type="checkbox"
              checked={isSortedByDueDate}
              onChange={(event) => setIsSortedByDueDate(event.target.checked)}
            />
            <span>Sort by due date</span>
          </label>

          {todos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet.</p>
              <button type="button" onClick={openAddDialog}>Create your first task</button>
            </div>
          ) : (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <li key={todo.id}>
                  <button
                    className={`todo-row${todo.id === selectedID ? ' selected' : ''}`}
                    type="button"
                    aria-pressed={todo.id === selectedID}
                    onClick={() => setSelectedID(todo.id)}
                  >
                    <span className={`completion-dot${todo.completed ? ' done' : ''}`} aria-hidden="true">{todo.completed ? '✓' : ''}</span>
                    <span className="todo-row-copy">
                      <strong>{todo.title || 'Untitled task'}</strong>
                      <small>{todo.dueDate ? `Due ${todo.dueDate}` : 'No due date'}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="details-panel" aria-label="Task details">
          {selectedTodo ? (
            <>
              <div className="details-heading">
                <div>
                  <p className="panel-kicker">Task details</p>
                  <h2>{selectedTodo.completed ? 'Completed task' : 'In progress'}</h2>
                </div>
                <button className="delete-button" type="button" onClick={deleteSelected}>Delete</button>
              </div>

              <label>
                <span>Title</span>
                <input aria-label="Title" value={selectedTodo.title} onChange={(event) => updateSelected({ title: event.target.value })} />
              </label>
              <label>
                <span>Notes</span>
                <textarea aria-label="Notes" rows={6} value={selectedTodo.notes} onChange={(event) => updateSelected({ notes: event.target.value })} placeholder="Add a little context…" />
              </label>
              <div className="detail-footer">
                <label>
                  <span>Due date</span>
                  <input aria-label="Due date" type="date" value={selectedTodo.dueDate} onChange={(event) => updateSelected({ dueDate: event.target.value })} />
                </label>
                <label className="completion-toggle">
                  <input aria-label="Mark complete" type="checkbox" checked={selectedTodo.completed} onChange={(event) => updateSelected({ completed: event.target.checked })} />
                  <span>Mark complete</span>
                </label>
              </div>
            </>
          ) : (
            <div className="empty-state details-empty">
              <p>Select a task to edit it.</p>
              <button type="button" onClick={openAddDialog}>Add task</button>
            </div>
          )}
        </section>
      </section>

      {isAddDialogOpen ? (
        <div className="dialog-backdrop">
          <section
            ref={dialogRef}
            className="add-task-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-task-dialog-title"
          >
            <div className="dialog-heading">
              <p className="panel-kicker">New task</p>
              <h2 id="add-task-dialog-title">Add a task</h2>
            </div>

            <form className="add-task-form" onSubmit={createTodo}>
              <label>
                <span>Title</span>
                <input
                  ref={titleInputRef}
                  aria-describedby={titleError ? 'add-task-title-error' : undefined}
                  aria-invalid={titleError ? 'true' : undefined}
                  value={todoDraft.title}
                  onChange={(event) => {
                    setTodoDraft((current) => ({ ...current, title: event.target.value }))
                    setTitleError('')
                  }}
                />
              </label>
              {titleError ? <p className="field-error" id="add-task-title-error">{titleError}</p> : null}
              <label>
                <span>Notes</span>
                <textarea
                  rows={5}
                  value={todoDraft.notes}
                  onChange={(event) => setTodoDraft((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Add a little context…"
                />
              </label>
              <label>
                <span>Due date</span>
                <input
                  type="date"
                  value={todoDraft.dueDate}
                  onChange={(event) => setTodoDraft((current) => ({ ...current, dueDate: event.target.value }))}
                />
              </label>
              <div className="dialog-actions">
                <button className="secondary-button" type="button" onClick={closeAddDialog}>Cancel</button>
                <button type="submit">Create</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default App
