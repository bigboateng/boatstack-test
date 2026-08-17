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

function normalizedSearchQuery(searchQuery: string) {
  return searchQuery.trim().toLowerCase()
}

function todoMatchesSearch(todo: Todo, searchQuery: string) {
  const normalizedQuery = normalizedSearchQuery(searchQuery)

  if (normalizedQuery.length === 0) {
    return true
  }

  return todo.title.toLowerCase().includes(normalizedQuery)
    || todo.notes.toLowerCase().includes(normalizedQuery)
}

function visibleTodoOrder(
  todos: Todo[],
  searchQuery: string,
  showIncompleteOnly: boolean,
  isSortedByDueDate: boolean,
) {
  const matchingTodos = todos.filter((todo) => {
    return todoMatchesSearch(todo, searchQuery)
  })
  const visibleTodos = showIncompleteOnly
    ? matchingTodos.filter((todo) => {
        return !todo.completed
      })
    : matchingTodos

  if (!isSortedByDueDate) {
    return visibleTodos
  }

  return [...visibleTodos].sort((leftTodo, rightTodo) => {
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
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [selectedID, setSelectedID] = useState(initialTodos[0].id)
  const [isSortedByDueDate, setIsSortedByDueDate] = useState(false)
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [todoDraft, setTodoDraft] = useState<TodoDraft>(emptyTodoDraft)
  const [titleError, setTitleError] = useState('')
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLElement | null>(null)
  const titleInputRef = useRef<HTMLInputElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const pendingFocusIDRef = useRef<number | null>(null)
  const pendingSearchFocusRef = useRef(false)

  const visibleTodos = useMemo(
    () => visibleTodoOrder(todos, searchQuery, showIncompleteOnly, isSortedByDueDate),
    [isSortedByDueDate, searchQuery, showIncompleteOnly, todos],
  )
  const selectedTodo = visibleTodos.find((todo) => todo.id === selectedID) ?? null
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos])
  const isSearchActive = normalizedSearchQuery(searchQuery).length > 0

  useEffect(() => {
    if (selectedTodo) {
      return
    }

    setSelectedID(visibleTodos[0]?.id ?? 0)
  }, [selectedTodo, visibleTodos])

  useEffect(() => {
    if (pendingSearchFocusRef.current) {
      pendingSearchFocusRef.current = false
      searchInputRef.current?.focus()
      return
    }

    const pendingFocusID = pendingFocusIDRef.current

    if (pendingFocusID === null) {
      return
    }

    pendingFocusIDRef.current = null
    const focusTargetID = pendingFocusID === 0 ? 'show-incomplete-only' : `todo-row-${pendingFocusID}`
    document.getElementById(focusTargetID)?.focus()
  }, [selectedID, visibleTodos])

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

    const updatedTodos = todos.map((todo) => {
      return todo.id === selectedTodo.id ? { ...todo, ...changes } : todo
    })

    if (changes.completed === true && showIncompleteOnly) {
      const remainingVisible = visibleTodoOrder(
        updatedTodos,
        searchQuery,
        showIncompleteOnly,
        isSortedByDueDate,
      )
      const nextSelectedID = remainingVisible[0]?.id ?? 0
      pendingFocusIDRef.current = nextSelectedID
      setSelectedID(nextSelectedID)
    }

    const changesSearchableContent = changes.title !== undefined || changes.notes !== undefined

    if (changesSearchableContent && isSearchActive) {
      const updatedVisibleTodos = visibleTodoOrder(
        updatedTodos,
        searchQuery,
        showIncompleteOnly,
        isSortedByDueDate,
      )
      const selectedTodoRemainsVisible = updatedVisibleTodos.some((todo) => {
        return todo.id === selectedTodo.id
      })

      if (!selectedTodoRemainsVisible) {
        pendingSearchFocusRef.current = true
        setSelectedID(updatedVisibleTodos[0]?.id ?? 0)
      }
    }

    setTodos(updatedTodos)
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
    const remainingVisible = visibleTodoOrder(remaining, searchQuery, showIncompleteOnly, isSortedByDueDate)
    setTodos(remaining)
    setSelectedID(remainingVisible[0]?.id ?? 0)
  }

  function clearCompleted() {
    const remaining = todos.filter((todo) => !todo.completed)
    const selectedTodoRemains = remaining.some((todo) => todo.id === selectedID)
    const remainingVisible = visibleTodoOrder(remaining, searchQuery, showIncompleteOnly, isSortedByDueDate)

    setTodos(remaining)
    if (!selectedTodoRemains) {
      setSelectedID(remainingVisible[0]?.id ?? 0)
    }
  }

  function resetView() {
    setSearchQuery('')
    setShowIncompleteOnly(false)
    setIsSortedByDueDate(false)
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
              <div className="panel-title">
                <h2>Tasks</h2>
                <span className="todo-count">{todos.length} total</span>
              </div>
            </div>
            <div className="list-actions">
              <button type="button" disabled={completedCount === 0} onClick={clearCompleted}>Clear completed</button>
              <button className="add-button" type="button" onClick={openAddDialog}>Add task</button>
            </div>
          </div>

          <div className="list-controls">
            <label className="search-filter">
              <span>Search tasks</span>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <label className="list-filter">
              <input
                id="show-incomplete-only"
                type="checkbox"
                checked={showIncompleteOnly}
                onChange={(event) => setShowIncompleteOnly(event.target.checked)}
              />
              <span>Show incomplete only</span>
            </label>
            <label className="sort-toggle">
              <input
                type="checkbox"
                checked={isSortedByDueDate}
                onChange={(event) => setIsSortedByDueDate(event.target.checked)}
              />
              <span>Sort by due date</span>
            </label>
            <button
              className="reset-view-button"
              type="button"
              disabled={!isSearchActive && !showIncompleteOnly && !isSortedByDueDate}
              onClick={resetView}
            >
              Reset View
            </button>
          </div>

          {visibleTodos.length === 0 ? (
            <div className="empty-state">
              <p>{todos.length === 0 ? 'No tasks yet.' : isSearchActive ? 'No matching tasks' : 'No incomplete tasks.'}</p>
              {todos.length === 0 ? <button type="button" onClick={openAddDialog}>Create your first task</button> : null}
            </div>
          ) : (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <li key={todo.id}>
                  <button
                    id={`todo-row-${todo.id}`}
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
