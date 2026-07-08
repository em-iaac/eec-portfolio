// Guardrail (Session 4): a graph invariant throw inside the lazy EXPLORE
// chunk (or any render error in the scene) must degrade to a message on the
// carbon table, never a blank app. Class component: error boundaries have no
// hook equivalent. Links are redline-wire (interaction on dark ground).
import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

const WIRE_LINK =
  '-m-2 p-2 text-redline-wire underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline-wire'

export default class ExploreErrorBoundary extends Component<
  // `fallback` (Session 13): when the surface is EMBEDDED (the landing hero), a
  // chunk-load or scene throw must degrade to the static poster underneath, not
  // the full-screen carbon message. The full-page /explore route omits it and
  // keeps the message.
  { children: ReactNode; fallback?: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('EXPLORE failed to load:', error)
  }

  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback !== undefined) return this.props.fallback
    // Fallback wording approved Session 11 (rolling batch #1).
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-carbon px-6">
        <div
          role="alert"
          className="max-w-md font-mono text-[11px] leading-[2] tracking-[0.06em] text-ink-dark"
        >
          <p className="mb-4">
            THE NETWORK FAILED TO PLOT.
            <br />
            <span className="text-anno-dark">
              THE WORDS ARE FINE; THE MAP MISBEHAVED. READ MODE HAS EVERYTHING.
            </span>
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/notebook" className={WIRE_LINK}>
              OPEN THE NOTEBOOK &gt;
            </Link>
            <Link to="/" className={WIRE_LINK}>
              BACK HOME &gt;
            </Link>
          </p>
        </div>
      </div>
    )
  }
}
