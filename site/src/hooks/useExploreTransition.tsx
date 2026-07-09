// "The light table switches off": a fixed carbon overlay fades in while the page
// content lifts, then we navigate to the landing (the all-dark mind graph). Read
// pages use this to cross into the dark cover; reduced motion navigates
// immediately. R1: the target is now `/` (the landing IS the network; the
// separate /explore surface retired). Naming kept for now — a rename to the
// neutral "cover"/"dark" vocabulary is queued for the R10 hygiene sweep.
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export const MODE_FADE_MS = 550
export const MODE_NAVIGATE_MS = 650

export function useExploreTransition() {
  const navigate = useNavigate()
  const prm = usePrefersReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Target defaults to the landing (the mind graph). Callers may still pass a
  // specific route to run the same carbon-flood ceremony into it.
  function beginExit(e?: MouseEvent, target = '/') {
    e?.preventDefault()
    if (prm) {
      navigate(target)
      return
    }
    if (leaving) return
    setLeaving(true)
    timer.current = window.setTimeout(() => navigate(target), MODE_NAVIGATE_MS)
  }

  return { leaving, beginExit }
}

export function ExploreOverlay({ leaving }: { leaving: boolean }) {
  const prm = usePrefersReducedMotion()
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] bg-carbon"
      style={{
        opacity: leaving ? 1 : 0,
        transition: prm ? 'none' : `opacity ${MODE_FADE_MS}ms ease`,
      }}
    />
  )
}

// Applied by page shells to their content wrapper while leaving.
export function liftStyle(leaving: boolean, prm: boolean) {
  return {
    transform: leaving && !prm ? 'translateY(-8px) scale(1.005)' : undefined,
    transition: prm ? undefined : `transform ${MODE_FADE_MS}ms ease`,
  }
}

// Page shells provide their beginExit so any nested link can run the same
// ceremony instead of a bare navigation.
export const ExploreExitContext = createContext<
  ((e?: MouseEvent, target?: string) => void) | null
>(null)

export function ExploreExitLink({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const beginExit = useContext(ExploreExitContext)
  return (
    <Link to="/" onClick={beginExit ?? undefined} className={className}>
      {children}
    </Link>
  )
}
