// THE LANDING (Session R1; one-mode since DL-1, 2026-07-10): the full-bleed
// mind-graph cover. It FOLLOWS the mode like every surface (carbon "mind at
// night" in dark, cool-white "mind on paper" in light; the old dark pin
// retired). The honest DOM hero (name, adjectives, positioning line, nav,
// jump bar) is real text that paints in the first second regardless of the
// artwork; the mind-graph is progressive enhancement layered under it.
// Non-scrolling on tablet/desktop
// (the cover is one frame); on phones the text band sits above an interactive
// field so the first-glance read and the tap-to-bloom both stay first-class.
//
// Copy: the adjective line, the positioning line, and the margin wink were all
// SIGNED by Emilie at G4 (2026-07-12). The "Behavior Information Modeling"
// spine is LOCKED content (reachable via the graph's nodes).
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ExploreErrorBoundary from '../components/ExploreErrorBoundary'
import LogoMark from '../components/LogoMark'
import ModeToggle from '../components/ui/ModeToggle'
import MindGraphSrNav from './MindGraphSrNav'
import { MIND, nodeRoute, starPath } from './mindGraph'
import { assertPaletteMatchesTheme } from './palette'
import { RED_LINK } from '../lib/linkStyles'
import { hasOvertured, markOvertured } from '../lib/develop'
import LensGroup from '../components/ui/LensGroup'
import { LensMark } from '../components/ui/Pill'
import type { Lens } from '../components/Lens'
import { ENTRIES } from '../data/registry'

// The artwork is split out of the entry chunk (LCP, 2026-07-12): the honest
// DOM hero paints without it, and the draw-in work stays out of the first
// paint's window. The chunk failing to load degrades through the same error
// boundary as a render throw: the no-graph state, hero intact.
const MindGraph = lazy(() => import('./MindGraphView'))

// SIGNED (G4, 2026-07-12). The role adjectives; the positioning line whose
// "minds" carries the niche; the margin wink. Moved to landing/identity.ts
// at G5 so the printed book's cover quotes the same source.
import { ADJECTIVES, VOICE, WINK } from './identity'

// Top-page doors. S4a (Emilie, 2026-07-13): WORK's emphasised red underline
// retired here too, matching the header ruling — every door reads the same,
// and /work's featured tier now carries the proof-path job. THOUGHTS opens
// the neural world (the whole record since the meta build).
const DOORS: { label: string; to: string }[] = [
  { label: 'WORK', to: '/work' },
  { label: 'THOUGHTS', to: '/thoughts' },
  { label: 'CV', to: '/cv' },
  { label: 'ABOUT', to: '/about' },
]

// The mark legend, rendered as REAL 1:1 marks (not glyphs) so the key matches the
// field exactly. Ink only, never a lens colour (shape-tick + label rule).
function LegendMarks() {
  const marks: [string, ReactNode][] = [
    ['PROJECT', <circle key="p" cx="7" cy="7" r="4" fill="var(--lang-ink)" />],
    [
      'THOUGHT',
      <circle key="t" cx="7" cy="7" r="3.4" fill="none" stroke="var(--lang-ink)" strokeWidth="1.4" />,
    ],
    [
      'AWARD',
      <path
        key="a"
        d={starPath(7, 7, 5.5)}
        fill="var(--lang-ink)"
        style={{ filter: 'drop-shadow(0 0 2px color-mix(in srgb, var(--lang-ink) 55%, transparent))' }}
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
          <span className="font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase">{label}</span>
        </span>
      ))}
    </>
  )
}

// The jump index: every project/thought (deep nodes the nav can't list) plus the
// top pages. R9 extends this to the full site content index; R1 ships a real,
// lean typeahead so the affordance is never a dead mock.
// THE JUMP BAR'S INDEX. It used to be labels only, so "comfort" found nothing
// even though a project, a thought and four tags carry the word. It is also the
// PHONE's main way in, since the phone camera (DL §10) frames only part of the
// drawing, so what it can reach matters more there than anywhere.
//
// tags + lens are FREE: registry.ts is already in the entry bundle (mindGraph
// reads it). DEKS ARE NOT: they live in data/work.ts, a 129kB chunk the landing
// must never pull, so they are lazy-loaded on first FOCUS of the bar and merged
// in when they land. Nobody pays for search text until they reach for search.
type JumpItem = { label: string; hint: string; to: string; lens?: Lens; tags: string[]; dek?: string }

const TAGS_BY_ID = new Map(ENTRIES.map((e) => [e.id, e.tags]))
const LENS_BY_ID = new Map(ENTRIES.map((e) => [e.id, e.lens]))

const JUMP_ITEMS: JumpItem[] = [
  ...MIND.nodes.map((n) => ({
    label: n.label,
    hint: n.kind,
    to: nodeRoute(n),
    lens: LENS_BY_ID.get(n.id),
    tags: TAGS_BY_ID.get(n.id) ?? [],
  })),
  ...DOORS.map((d) => ({ label: d.label, hint: 'page', to: d.to, tags: [] })),
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
  // route -> dek, filled on first focus (see JUMP_ITEMS above)
  const [deks, setDeks] = useState<Record<string, string>>({})
  const warmed = useRef(false)
  const warmDeks = () => {
    if (warmed.current) return
    warmed.current = true
    import('../data/work')
      .then((m) => {
        const next: Record<string, string> = {}
        m.WORK_ENTRIES.forEach((w) => {
          next[`/work/${w.id}`] = w.dek
        })
        setDeks(next)
      })
      .catch(() => {
        warmed.current = false
      })
  }

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    // A prefix of "project(s)" / "thought(s)" (>= 3 letters, so "pro" -> projects,
    // "tho" -> thoughts) shows that whole KIND, not a label match. 3+ letters keeps
    // short strings like "th" free to fuzzy-match labels (THE HUDDLE, heritage...).
    if (q.length >= 3 && 'projects'.startsWith(q)) return JUMP_ITEMS.filter((i) => i.hint === 'project')
    if (q.length >= 3 && 'thoughts'.startsWith(q)) return JUMP_ITEMS.filter((i) => i.hint === 'thought')
    // A LABEL match always outranks a tag or dek match: +5000 keeps the whole
    // secondary tier below the worst subsequence hit, so typing a name never
    // buries the thing you named under things that merely mention it.
    return JUMP_ITEMS.map((i) => {
      const byLabel = fuzzyScore(q, i.label)
      if (byLabel !== null) return { i, score: byLabel }
      const dek = deks[i.to]
      const hay = [...i.tags, dek ?? ''].join(' ').toLowerCase()
      const at = hay.indexOf(q)
      return { i, score: at === -1 ? null : 5000 + at }
    })
      .filter((x): x is { i: JumpItem; score: number } => x.score !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 7)
      .map((x) => x.i)
  }, [query, deks])

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
    navigate(to, { viewTransition: true })
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
        onFocus={() => {
          setOpen(true)
          warmDeks()
        }}
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
        className="lang-glass-1 h-11 w-full rounded-[var(--r-pill)] px-4 font-mono text-nav tracking-[0.06em] text-[var(--lang-ink)] placeholder:text-[var(--lang-ink-muted)] focus:border-[var(--lang-interaction)] focus:outline-none"
      />
      {open && matches.length > 0 && (
        <ul
          id="jump-list"
          role="listbox"
          className="lang-glass-2 absolute left-0 top-12 z-20 max-h-[280px] w-full overflow-y-auto rounded-[var(--r-control)] py-1"
        >
          {matches.map((m, i) => (
            <li key={m.to + m.label} role="option" aria-selected={false}>
              <Link
                id={`jump-opt-${i}`}
                to={m.to}
                onClick={() => go(m.to)}
                className="flex items-center justify-between gap-3 px-3 py-2 font-mono text-label tracking-[0.06em] text-[var(--lang-ink)] hover:bg-[color-mix(in_srgb,var(--lang-ink)_10%,transparent)] focus:bg-[color-mix(in_srgb,var(--lang-ink)_10%,transparent)] focus:outline-none"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {m.lens && <LensMark lens={m.lens} />}
                  <span className="truncate">{m.label}</span>
                </span>
                {deks[m.to] && (
                  <span className="hidden min-w-0 flex-1 truncate font-serif text-micro normal-case tracking-normal text-[var(--lang-ink-muted)] sm:block">
                    {deks[m.to]}
                  </span>
                )}
                <span className="shrink-0 text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase">{m.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function LandingCover() {
  // THE OVERTURE (DL amendment 30). The identity column enters in READING
  // ORDER over ~1.1s. Once per visit, like the draw-in.
  const [overture] = useState(() => !hasOvertured())
  useEffect(() => {
    markOvertured()
  }, [])

  useEffect(() => {
    assertPaletteMatchesTheme()
    // (The html-background patch that used to live here is GONE: it existed
    // only because `body` painted --color-mylar, a different white from the
    // --lang-ground every surface uses. body joins the one system now.)
  }, [])

  return (
    <main
      id="main"
      tabIndex={-1}
      aria-label="Emilie El Chidiac, the mind graph of her projects and thoughts"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--lang-ground)] text-[var(--lang-ink)] outline-none sm:fixed sm:inset-0 sm:block sm:min-h-0"
    >
      {/* Hero copy FIRST in the DOM so screen readers and keyboard users reach the
          name + positioning before the graph's node list; z-10 keeps it above the
          artwork and scrim. One fixed-measure stack, vertically centered on sm+. */}
      <div
        className={`relative z-10 flex flex-col px-6 pt-9 pb-5 sm:absolute sm:inset-y-0 sm:left-0 sm:w-[548px] sm:justify-center sm:px-14 sm:py-12${
          overture ? ' ov' : ''
        }`}
      >
        <header className="flex flex-col">
          {/* TIER 1 — name */}
          <div className="ov-t1 flex items-center gap-3">
            <LogoMark size={40} className="shrink-0" />
            {/* THE NAME, ON THE WIDTH AXIS (Emilie, 2026-07-26; DL amendment 24).
                It was 41.83px, a fit-by-trial number: it rendered 388.8px into
                exactly 389px of space beside the mark, 0.2px of slack, tuned to a
                hundredth of a pixel and guaranteed to break the day the mark, the
                column or the name changed. It is `whitespace-nowrap`, so an
                overflow does not wrap, it pushes out of the column.
                Now a round size, condensed to --wdth-fit: 45px renders 376.7px,
                7.6% larger with 12.3px of slack (sixty times today's). 46px was
                considered and rejected at 4px of slack; 47px overflows.
                PHONE: 30px at the same width renders 251px, which is EXACTLY
                today's rendered width, so the lockup is unmoved and the type is
                11% bigger. Both faces here are preloaded (index.html), so
                whichever element ends up carrying LCP, its font is already there. */}
            <h1
              className="font-display text-[30px] font-semibold leading-[0.98] tracking-[0.01em] whitespace-nowrap text-[var(--lang-ink)] sm:text-[45px]"
              style={{ fontStretch: 'var(--wdth-fit)' }}
            >
              EMILIE EL CHIDIAC
            </h1>
          </div>

          {/* TIER 2a — the role adjectives (signed).
              S2 (2026-07-26, the /llm-council landing gate): this row now rides FULL INK
              instead of --lang-hero-muted. The council's finding was that the words were
              never the whole problem: at 11px muted the row read "as decoration before
              information", so swapping a word inside it changed nothing about whether a
              stranger stopped to read it. Ink is what turns the same sentence from a
              flourish into a claim, and it costs zero height.
              SIZE AND FACE RESOLVED (Emilie's pick C, 2026-07-26, the width-axis gate).
              The row was 562px of Martian Mono inside a 436px column, so it wrapped to two
              lines on desktop. Mono cannot be made to fit at any setting: 547px at zero
              tracking, 511px even at 10px. So the row had to leave mono or lose a signed
              word, and it keeps all four words.
              It is now ARCHIVO, and it is CONDENSED to --wdth-fit. That is the whole
              argument for the width axis in one measurement: 14px is 465px at width 100
              (wraps) and 420px at width 87.5 (fits, 16px of slack). Without the axis the
              ceiling for one line is 12px. So the axis buys a whole type step, and the
              step is what answers the council's finding that the row read as decoration
              before information: it is now 27% larger AND full ink.
              The face change is deliberate: mono read as a technical tag, Archivo reads as
              a subtitle. PHONE: 12px, because every option wraps to two lines at 390 anyway
              and 14px there would cost ~9px of a page already 22px past the fold. */}
          <p
            className="ov-t2 mt-5 font-display text-[12px] leading-relaxed tracking-[0.04em] text-[var(--lang-ink)] lowercase sm:text-[14px]"
            style={{ fontStretch: 'var(--wdth-fit)' }}
          >
            {ADJECTIVES}
          </p>

          {/* TIER 2b — the positioning voice line, set as a warm-ink HANDWRITTEN
              note (Emilie, 2026-07-09; reads as a personal aside, and keeps the
              red pen for interaction only). One line on the 360px measure on sm+;
              wraps calmly on phones. (Caveat sized past the usual margin-note cap
              here is a sanctioned redesign departure from the old rule 8.) */}
          <p className="ov-t3 mt-3 font-hand text-[21px] leading-tight text-[var(--lang-hand-warm)] sm:whitespace-nowrap sm:text-[30.97px]">
            {VOICE}
          </p>

          {/* The rule that marks where the identity ends and the pressable
              controls begin (Emilie, 2026-07-09). Full measure, hairline ink. */}
          <div aria-hidden="true" className="mt-8 h-px w-full bg-[var(--lang-hairline)]" />

          {/* TIER 3 — the doors, spanning the same measure as the pill below.
              The magnifier lens rides them too (round 3, Emilie's pick): the
              same four doors as the header pill, the same glass under the
              pointer, one nav feel sitewide. */}
          <nav aria-label="Primary" className="ov-t4 mt-6 font-mono text-nav tracking-[0.08em]">
            <LensGroup className="flex justify-between">
              {DOORS.map((d) => (
                <Link
                  key={d.label}
                  to={d.to}
                  viewTransition
                  className="-m-1.5 p-1.5 text-[var(--lang-ink)] hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
                >
                  {d.label}
                </Link>
              ))}
            </LensGroup>
          </nav>

          {/* TIER 3 — the jump pill + the mode toggle (G4, Emilie's option b:
              the cover gains the same 44px control every room carries, in the
              pressable-controls tier; no layout, motion, or copy changes). */}
          <div className="ov-t5 mt-4 flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <JumpBar />
            </div>
            <ModeToggle />
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
            'radial-gradient(56% 60% at 22% 50%, color-mix(in srgb, var(--lang-ground) 85%, transparent) 0%, color-mix(in srgb, var(--lang-ground) 60%, transparent) 38%, color-mix(in srgb, var(--lang-ground) 26%, transparent) 66%, transparent 100%)',
        }}
      />

      {/* The artwork: phone gives it the lower field (flex-1); sm+ it fills the
          frame behind the text. A throw degrades to no-graph (the SR nav below
          still lists everything) while the honest hero above stays painted. */}
      <div className="relative z-0 min-h-[46svh] flex-1 sm:absolute sm:inset-0 sm:min-h-0">
        <ExploreErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <MindGraph />
          </Suspense>
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

      <div className="pointer-events-none mt-3 px-6 text-center font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] sm:absolute sm:bottom-8 sm:left-14 sm:z-10 sm:mt-0 sm:px-0 sm:text-left">
        THIS IS WHAT'S ON MY MIND ·{' '}
        <Link
          to="/about"
          className={`pointer-events-auto ${RED_LINK}`}
        >
          WHAT'S IN YOURS? &gt;
        </Link>
      </div>

      <p
        className="mx-auto mt-4 mb-6 max-w-[30ch] -rotate-1 px-6 text-center font-hand text-[16px] leading-snug sm:absolute sm:right-14 sm:bottom-[3.75rem] sm:z-10 sm:mx-0 sm:mt-0 sm:mb-0 sm:max-w-[26ch] sm:-rotate-2 sm:px-0 sm:text-right sm:text-[18px]"
        style={{ color: 'color-mix(in srgb, var(--lang-ink) 55%, var(--lang-ink-muted))' }}
      >
        <span className="text-[var(--lang-interaction)]">n.b.</span> {WINK}
      </p>
    </main>
  )
}
