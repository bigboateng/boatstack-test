import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <p className="eyebrow">Boatstack test project</p>
      <h1>A small React starting point.</h1>
      <p className="description">
        This independent project gives Boatstack a compact build, test, and
        delivery surface to evolve against.
      </p>
      <section aria-label="Counter example" className="counter-card">
        <p>Interaction check</p>
        <output aria-live="polite">{count} {count === 1 ? 'step' : 'steps'}</output>
        <div className="counter-actions">
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Add a step
          </button>
          {count > 0 && (
            <button className="reset-button" type="button" onClick={() => setCount(0)}>
              Reset steps
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
