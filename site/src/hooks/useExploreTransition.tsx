// The mode toggle: "the light table switches off." A fixed carbon overlay
// fades in while the page content lifts, then we navigate to EXPLORE.
// Reduced motion navigates immediately. The timings are shared with the
// EXPLORE side so both directions of the toggle stay symmetric.
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
import { preloadExplore } from '../explore/preload'

export const MODE_FADE_MS = 550
export const MODE_NAVIGATE_MS = 650

export function useExploreTransition() {
  const navigate = useNavigate()
  const prm = usePrefersReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // target defaults to the unfocused network; the landing hero (Session 13)
  // passes /explore/:id so clicking a word dives straight to that focused word
  // through the same carbon-flood ceremony (landing > focused word > EXPLORE).
  function beginExit(e?: MouseEvent, target = '/explore') {
    e?.preventDefault()
    preloadExplore()
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
    <Link
      to="/explore"
      onClick={beginExit ?? undefined}
      onPointerEnter={() => preloadExplore()}
      onTouchStart={() => preloadExplore()}
      onFocus={() => preloadExplore()}
      className={className}
    >
      {children}
    </Link>
  )
}
