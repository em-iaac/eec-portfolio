// Guardrail (Session 4): a graph invariant throw inside the lazy mind-graph
// chunk (or any render error in the scene) must degrade quietly, never to a
// blank app. Class component: error boundaries have no hook equivalent.
//
// #20 sweep, 2026-07-26: the full-screen carbon message was removed. It was
// unreachable — the only consumer, LandingCover, passes `fallback={null}` —
// and it was the last thing on the site using --color-anno, text-ink-dark,
// bg-carbon and text-redline-wire. `fallback` is now required, so a future
// consumer has to decide what a failure looks like rather than inheriting a
// screen nobody has seen since Session 13.
import { Component, type ReactNode } from 'react'

export default class ExploreErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('the mind-graph failed to plot:', error)
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children
  }
}
