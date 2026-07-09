// THE LANDING (Session R1): the all-dark, full-bleed mind-graph cover. The
// honest DOM hero (name, adjectives, positioning line, nav, jump bar) is real
// text that paints in the first second regardless of the artwork; the mind-graph
// is progressive enhancement layered under it. Non-scrolling on tablet/desktop
// (the cover is one frame); on phones the text band sits above an interactive
// field so the ten-second scan and the tap-to-bloom both stay first-class.
//
// Copy in Emilie's voice ships draftCopy until she signs it: the adjective line,
// the positioning line, and the margin wink are drafts. The "Behavior Information
// Modeling" spine is LOCKED content (reachable via the graph's nodes).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ExploreErrorBoundary from '../components/ExploreErrorBoundary'
import LogoMark from '../components/LogoMark'
import MindGraph from './MindGraphView'
import MindGraphSrNav from './MindGraphSrNav'
import { MIND, nodeRoute, starPath } from './mindGraph'
import { assertPaletteMatchesTheme } from './palette'

// draftCopy — pending Emilie's sign-off. The role adjectives (Emilie's example
// set); the positioning line whose "minds" carries the red pen.
const ADJECTIVES = 'architect · writer · researcher · creative technologist'
const VOICE = 'I work with design, technology and minds.'
const WINK = 'this whole mess is my head. touch a piece of it.'

// Top-page doors. WORK is the emphasized proof path (the recruiter's one clear
// route into the work): it opens the R2 gallery at /work. THOUGHTS points at the
// notebook (the running record that lists the notes) until a dedicated /thoughts
// index ships as its own session.
const DOORS: { label: string; to: string; primary?: boolean }[] = [
  { label: 'WORK', to: '/work', primary: true },
  { label: 'THOUGHTS', to: '/notebook' },
  { label: 'NOTEBOOK', to: '/notebook' },
  { label: 'CV', to: '/cv' },
  { label: 'ABOUT', to: '/about' },
]

// The mark legend, rendered as REAL 1:1 marks (not glyphs) so the key matches the
// field exactly. Ink only, never a lens colour (shape-tick + label rule).
function LegendMarks() {
  const marks: [string, ReactNode][] = [
    ['PROJECT', <circle key="p" cx="7" cy="7" r="4" fill="var(--color-ink-dark)" />],
    [
      'THOUGHT',
      <circle key="t" cx="7" cy="7" r="3.4" fill="none" stroke="var(--color-ink-dark)" strokeWidth="1.4" />,
    ],
    [
      'AWARD',
      <path
        key="a"
        d={starPath(7, 7, 5.5)}
        fill="var(--color-ink-dark)"
        style={{ filter: 'drop-shadow(0 0 2px rgba(232,234,237,0.55))' }}
      />,
    ],
  ]
  return (
    <>
      {marks.map(([label, mark]) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="overflow-visible">
            {mark}
          </svg>
          <span className="font-mono text-[9px] tracking-[0.14em] text-anno-dark uppercase">{label}</span>
        </span>
      ))}
    </>
  )
}

// The jump index: every project/thought (deep nodes the nav can't list) plus the
// top pages. R9 extends this to the full site content index; R1 ships a real,
// lean typeahead so the affordance is never a dead mock.
type JumpItem = { label: string; hint: string; to: string }
const JUMP_ITEMS: JumpItem[] = [
  ...MIND.nodes.map((n) => ({ label: n.label, hint: n.kind, to: nodeRoute(n) })),
  ...DOORS.map((d) => ({ label: d.label, hint: 'page', to: d.to })),
]

// Subsequence match: every character of the query must appear in the label IN
// ORDER (so "pro" -> "project", "nsp" -> "NeuroSpace"). Returns null when it is
// not a subsequence (so "test" with no match shows nothing), else a score where
// LOWER is better: an exact substring beats a spread-out match, and a tighter,
// earlier match beats a looser, later one.
function fuzzyScore(q: string, label: string): number | null {
  const s = label.toLowerCase()
  const sub = s.indexOf(q)
  if (sub !== -1) return sub // substring: best band (0..N), ranked by position
  let si = 0
  let first = -1
  let prev = -1
  let gaps = 0
  for (const ch of q) {
    const idx = s.indexOf(ch, si)
    if (idx === -1) return null
    if (first === -1) first = idx
    if (prev !== -1) gaps += idx - prev - 1
    prev = idx
    si = idx + 1
  }
  // +1000 keeps every subsequence match ranked below any substring match.
  return 1000 + gaps * 4 + first
}

function JumpBar() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    // A prefix of "project(s)" / "thought(s)" (>= 3 letters, so "pro" -> projects,
    // "tho" -> thoughts) shows that whole KIND, not a label match. 3+ letters keeps
    // short strings like "th" free to fuzzy-match labels (THE HUDDLE, heritage...).
    if (q.length >= 3 && 'projects'.startsWith(q)) return JUMP_ITEMS.filter((i) => i.hint === 'project')
    if (q.length >= 3 && 'thoughts'.startsWith(q)) return JUMP_ITEMS.filter((i) => i.hint === 'thought')
    return JUMP_ITEMS.map((i) => ({ i, score: fuzzyScore(q, i.label) }))
      .filter((x): x is { i: JumpItem; score: number } => x.score !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 7)
      .map((x) => x.i)
  }, [query])

  // "/" focuses the bar from anywhere on the cover (unless already typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function go(to: string) {
    setQuery('')
    setOpen(false)
    navigate(to)
  }

  return (
    <div
      className="relative w-full"
      // Close only when focus leaves the whole combobox (input + options), so
      // ArrowDown/Tab into an option doesn't unmount the option under it.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setQuery('')
            setOpen(false)
            inputRef.current?.blur()
          }
          if (e.key === 'Enter' && matches[0]) go(matches[0].to)
          if (e.key === 'ArrowDown' && matches.length) {
            e.preventDefault()
            const first = document.getElementById('jump-opt-0')
            first?.focus()
          }
        }}
        placeholder="/  jump to anything"
        aria-label="Jump to any project or thought"
        aria-expanded={open && matches.length > 0}
        aria-controls="jump-list"
        role="combobox"
        className="h-10 w-full rounded-full border border-[#565b63] bg-carbon/60 px-4 font-mono text-[12px] tracking-[0.06em] text-ink-dark placeholder:text-anno-dark focus:border-redline-wire focus:outline-none"
      />
      {open && matches.length > 0 && (
        <ul
          id="jump-list"
          role="listbox"
          className="absolute left-0 top-11 z-20 max-h-[280px] w-full overflow-y-auto rounded-lg border border-[#565b63] bg-carbon/95 py-1 backdrop-blur-sm"
        >
          {matches.map((m, i) => (
            <li key={m.to + m.label} role="option" aria-selected={false}>
              <Link
                id={`jump-opt-${i}`}
                to={m.to}
                onClick={() => go(m.to)}
                className="flex items-center justify-between gap-3 px-3 py-2 font-mono text-[10px] tracking-[0.06em] text-ink-dark hover:bg-ink-dark/10 focus:bg-ink-dark/10 focus:outline-none"
              >
                <span className="truncate">{m.label}</span>
                <span className="shrink-0 text-[8px] tracking-[0.14em] text-anno-dark uppercase">{m.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function LandingCover() {
  useEffect(() => {
    document.title = 'Emilie El Chidiac | Design Technology Architect'
    assertPaletteMatchesTheme()
    // Paint the whole document carbon so any overscroll/rubber-band matches the
    // cover (the app's default ground is mylar).
    const html = document.documentElement
    const prev = html.style.background
    html.style.background = 'var(--color-carbon)'
    return () => {
      html.style.background = prev
    }
  }, [])

  return (
    <main
      id="main"
      tabIndex={-1}
      aria-label="Emilie El Chidiac, the mind graph of her projects and thoughts"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-carbon text-ink-dark outline-none sm:fixed sm:inset-0 sm:block sm:min-h-0"
    >
      {/* Hero copy FIRST in the DOM so screen readers and keyboard users reach the
          name + positioning before the graph's node list; z-10 keeps it above the
          artwork and scrim. One fixed-measure stack, vertically centered on sm+. */}
      <div className="relative z-10 flex flex-col px-6 pt-9 pb-5 sm:absolute sm:inset-y-0 sm:left-0 sm:w-[548px] sm:justify-center sm:px-14 sm:py-12">
        <header className="flex flex-col">
          {/* TIER 1 — name */}
          <div className="flex items-center gap-3">
            <LogoMark size={40} tone="wire" className="shrink-0" />
            <h1 className="font-display text-[27px] font-semibold leading-[0.98] tracking-[0.01em] whitespace-nowrap text-ink-dark sm:text-[41.83px]">
              EMILIE EL CHIDIAC
            </h1>
          </div>

          {/* TIER 2a — the role adjectives (draftCopy). One line on the name-row
              measure on sm+ (10px keeps all four inside it); wraps calmly on phones. */}
          <p className="mt-5 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-ink-bright lowercase sm:whitespace-nowrap sm:text-[11px] sm:tracking-[0.02em]">
            {ADJECTIVES}
          </p>

          {/* TIER 2b — the positioning voice line, set as a warm-ink HANDWRITTEN
              note (Emilie, 2026-07-09; reads as a personal aside, and keeps the
              red pen for interaction only). One line on the 360px measure on sm+;
              wraps calmly on phones. (Caveat sized past the usual margin-note cap
              here is a sanctioned redesign departure from the old rule 8.) */}
          <p className="mt-3 font-hand text-[21px] leading-tight text-[#d8d2c4] sm:whitespace-nowrap sm:text-[30.97px]">
            {VOICE}
          </p>

          {/* The rule that marks where the identity ends and the pressable
              controls begin (Emilie, 2026-07-09). Full measure, hairline ink. */}
          <div aria-hidden="true" className="mt-8 h-px w-full bg-ink-dark/15" />

          {/* TIER 3 — the doors, spanning the same measure as the pill below */}
          <nav aria-label="Primary" className="mt-6 flex justify-between font-mono text-[12px] tracking-[0.08em]">
            {DOORS.map((d) => (
              <Link
                key={d.label}
                to={d.to}
                viewTransition
                className={
                  d.primary
                    ? '-m-1.5 p-1.5 font-semibold text-ink-dark underline decoration-redline-wire decoration-2 underline-offset-[6px] hover:decoration-[3px] focus-visible:outline-2 focus-visible:outline-redline-wire'
                    : '-m-1.5 p-1.5 text-ink-dark hover:text-redline-wire focus-visible:outline-2 focus-visible:outline-redline-wire'
                }
              >
                {d.label}
              </Link>
            ))}
          </nav>

          {/* TIER 3 — the jump pill, full measure */}
          <div className="mt-4">
            <JumpBar />
          </div>
        </header>
      </div>

      {/* Legibility scrim (sm+ only, PRM-safe): a soft carbon wash under the text
          column, clearing toward the open field on the right. Load-bearing over
          the AI rise into the sensi hub, so do not weaken it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] hidden sm:block"
        style={{
          background:
            'radial-gradient(56% 60% at 22% 50%, rgba(11,14,19,0.85) 0%, rgba(11,14,19,0.6) 38%, rgba(11,14,19,0.26) 66%, rgba(11,14,19,0) 100%)',
        }}
      />

      {/* The artwork: phone gives it the lower field (flex-1); sm+ it fills the
          frame behind the text. A throw degrades to no-graph (the SR nav below
          still lists everything) while the honest hero above stays painted. */}
      <div className="relative z-0 min-h-[46svh] flex-1 sm:absolute sm:inset-0 sm:min-h-0">
        <ExploreErrorBoundary fallback={null}>
          <MindGraph />
        </ExploreErrorBoundary>
      </div>

      {/* The navigable list of every node, travelling in all modes. */}
      <MindGraphSrNav />

      {/* Footer rail. Phone: a centered flow stack in job order (legend, caption,
          note) below the field. Desktop: caption bottom-LEFT on the same baseline
          as the legend bottom-RIGHT, with the n.b. wink tucked just above the
          legend on the right. */}
      <div
        aria-hidden="true"
        className="mt-4 flex items-center justify-center gap-x-4 px-6 sm:absolute sm:right-14 sm:bottom-8 sm:z-10 sm:mt-0 sm:justify-start sm:px-0"
      >
        <LegendMarks />
      </div>

      <div className="pointer-events-none mt-3 px-6 text-center font-mono text-[9px] tracking-[0.14em] text-anno-dark sm:absolute sm:bottom-8 sm:left-14 sm:z-10 sm:mt-0 sm:px-0 sm:text-left">
        THIS IS WHAT'S ON MY MIND ·{' '}
        <Link
          to="/about"
          className="pointer-events-auto text-redline-wire underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline-wire"
        >
          WHAT'S IN YOURS? &gt;
        </Link>
      </div>

      <p
        className="mx-auto mt-4 mb-6 max-w-[30ch] -rotate-1 px-6 text-center font-hand text-[16px] leading-snug sm:absolute sm:right-14 sm:bottom-[3.75rem] sm:z-10 sm:mx-0 sm:mt-0 sm:mb-0 sm:max-w-[26ch] sm:-rotate-2 sm:px-0 sm:text-right sm:text-[18px]"
        style={{ color: 'color-mix(in srgb, var(--color-ink-dark) 55%, var(--color-anno-dark))' }}
      >
        <span className="text-redline-wire">n.b.</span> {WINK}
      </p>
    </main>
  )
}
