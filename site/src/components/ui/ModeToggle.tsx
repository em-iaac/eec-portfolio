// DESIGN LANGUAGE v2 primitive · ModeToggle (see /DESIGN-LANGUAGE.md §5 and
// the 2026-07-10 amendments). The round sun/moon control in the header pill:
// tapping it forces a mode by writing [data-theme] on <html> and persists the
// choice; index.html re-applies it before first paint. With no stored choice
// the site follows the OS. 44px circle (touch floor); the icon shows the mode
// you are IN, the label says what a tap does.
import { useEffect, useState } from 'react'

const KEY = 'eec-theme'
type Mode = 'light' | 'dark'

function resolvedMode(): Mode {
  if (typeof window === 'undefined') return 'light'
  const forced = document.documentElement.dataset.theme
  if (forced === 'light' || forced === 'dark') return forced
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.2 14.5A8.5 8.5 0 0 1 9.5 3.8 8.7 8.7 0 1 0 20.2 14.5Z" />
    </svg>
  )
}

export default function ModeToggle() {
  const [mode, setMode] = useState<Mode>(resolvedMode)
  const next: Mode = mode === 'dark' ? 'light' : 'dark'

  // While the visitor has no stored choice the site follows the OS, so the
  // icon must follow a live OS switch too.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setMode(resolvedMode())
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const flip = () => {
    const apply = () => {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem(KEY, next)
      } catch {
        // private browsing: the choice still applies, it just will not survive
      }
      setMode(next)
    }
    // The dark<->light flip rides the same soft crossfade as navigation
    // (language.css); no support or reduced motion = an instant swap.
    if (
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.startViewTransition(apply)
    } else {
      apply()
    }
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={`Switch to ${next} mode`}
      className="lang-glass-1 inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--r-pill)] text-[var(--lang-ink)] transition-colors hover:border-[var(--lang-ink-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
    >
      {mode === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
