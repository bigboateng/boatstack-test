import { useMemo, useState } from 'react'
import './App.css'

type Todo = {
  id: number
  title: string
  notes: string
  dueDate: string
  completed: boolean
}

const initialTodos: Todo[] = [
  { id: 1, title: 'Sketch the todo flow', notes: 'Keep the first pass deliberately small and useful.', dueDate: '2026-08-14', completed: false },
  { id: 2, title: 'Review the details panel', notes: 'Check editing, focus, and the mobile layout.', dueDate: '2026-08-16', completed: false },
  { id: 3, title: 'Ship the starting point', notes: 'A completed example keeps the state easy to read.', dueDate: '2026-08-12', completed: true },
]

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [selectedId, setSelectedId] = useState(initialTodos[0].id)

  const selectedTodo = todos.find((todo) => todo.id === selectedId) ?? null
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos])

  function updateSelected(changes: Partial<Todo>) {
    if (!selectedTodo) return
    setTodos((current) => current.map((todo) => todo.id === selectedTodo.id ? { ...todo, ...changes } : todo))
  }

  function addTodo() {
    const id = Math.max(0, ...todos.map((todo) => todo.id)) + 1
    const todo = { id, title: 'Untitled task', notes: '', dueDate: '', completed: false }
    setTodos((current) => [todo, ...current])
    setSelectedId(id)
  }

  function deleteSelected() {
    if (!selectedTodo) return
    const remaining = todos.filter((todo) => todo.id !== selectedTodo.id)
    setTodos(remaining)
    setSelectedId(remaining[0]?.id ?? 0)
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
            <button className="add-button" type="button" onClick={addTodo}>Add task</button>
          </div>

          {todos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet.</p>
              <button type="button" onClick={addTodo}>Create your first task</button>
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id}>
                  <button
                    className={`todo-row${todo.id === selectedId ? ' selected' : ''}`}
                    type="button"
                    aria-pressed={todo.id === selectedId}
                    onClick={() => setSelectedId(todo.id)}
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
              <button type="button" onClick={addTodo}>Add task</button>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
