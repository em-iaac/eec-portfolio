// THE LANDING (Session R1; THE SCROLL, Emilie's gate 2026-07-27).
//
// It used to be a fixed, non-scrolling frame with the mind-graph filling it.
// It read beautifully in two minutes and said almost nothing in ten seconds,
// which is the only budget a recruiter gives it: the initial portfolio scan is
// 6 to 10 seconds, 57% of viewing time is spent above the fold, and the thing
// that has to land in that window is role, then work. Three of those were
// missing outright. The job title existed only in the <title> tag and the
// /work footer; the MaCAD award appeared nowhere on the landing at all; and
// there was no piece of proof, only a drawing of where the proof lives.
//
// SO THE LANDING SCROLLS NOW, in four movements:
//   1. the identity + the two hover STRIPS (landing/Strips.tsx)
//   2. a flat SELECTION of the work, the accessible path to the same tiles
//   3. the THOUGHTS index rows
//   4. the BIO and, closing the page, the mind-graph
//
// THE MIND-GRAPH MOVED, it did not go. Emilie's call at the gate: it belongs
// at the end, beside the bio, "where a reader arrives at it" instead of a
// stranger being asked to decode it before they know who drew it. It is the
// same artwork, the same lazy chunk, the same error boundary.
//
// /work AND /thoughts STAY PAGES. The landing's job is a ten-second yes; the
// browse room's job is browsing, and the 21-tile grid is already good at it.
// Merging them made the top of the page stop feeling like an answer.
//
// Copy: ADJECTIVES / VOICE / WINK were SIGNED at G4 (2026-07-12). ROLE is the
// title the site already declared to search engines, said out loud. BIO
// is NEW and UNSIGNED (see identity.ts).
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ExploreErrorBoundary from '../components/ExploreErrorBoundary'
import Footer from '../components/Footer'
import Footline from '../components/Footline'
import Img from '../components/Img'
import LogoMark from '../components/LogoMark'
import TitleBlock from '../components/TitleBlock'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import MindGraphSrNav from './MindGraphSrNav'
import Strips, { HorizontalBelt, PauseToggle, STRIP_PROJECTS, StripTile, ThoughtTile } from './Strips'
import { MIND, nodeRoute, starPath } from './mindGraph'
import { assertPaletteMatchesTheme } from './palette'
import { RED_LINK } from '../lib/linkStyles'
import { LensMark } from '../components/ui/Pill'
import { vtName } from '../lib/viewTransition'
import type { Lens } from '../components/Lens'
import { ENTRIES, thoughtIndexEntries } from '../data/registry'

// The artwork is split out of the entry chunk (LCP, 2026-07-12): the honest
// DOM hero paints without it. Now that it closes the page rather than filling
// it, the split matters more, not less. The chunk failing to load degrades
// through the same error boundary as a render throw.
const MindGraph = lazy(() => import('./MindGraphView'))

// SIGNED (G4, 2026-07-12) + the 2026-07-27 additions. See identity.ts.
import { ADJECTIVES, BIO, VOICE, WINK } from './identity'

// Top-page doors. WORK and THOUGHTS still open their rooms; ABOUT is the
// contact sheet ("Say hi"), which is a different thing from the bio that now
// closes this page, so both survive and neither repeats the other.
const DOORS: { label: string; to: string }[] = [
  { label: 'WORK', to: '/work' },
  { label: 'THOUGHTS', to: '/thoughts' },
  { label: 'CV', to: '/cv' },
  { label: 'CONTACT', to: '/contact' },
]

// THE PROOF (2026-07-27). Sensi: the award-winning project, and the only one
// whose award the landing names. Everything here is READ FROM THE RECORD, not
// re-typed: the award wording is the registry award entry's own title (minus
// its "(Sensi)" disambiguator, since the project is named right beside it), so
// the landing can never drift from the CV, the showcase or the book.
// NeuroSpace's live demo is deliberately NOT the proof: its Rhino Compute
// server is dead and the site already says so honestly.
const PROOF_ID = 'sensi'
const PROOF = ENTRIES.find((e) => e.id === PROOF_ID)
const PROOF_AWARD = ENTRIES.find((e) => e.kind === 'award' && e.refId === PROOF_ID)
// "MaCAD Awards 2026 · Design Copilots · winner (Sensi)" ->
// "MaCAD Awards 2026 · winner". The middle segment (the category) and the
// parenthetical (the project, which the card names anyway) are what a card
// face has no room for. Uppercased by CSS, which is how every other mono
// label on the site reaches its final form.
const AWARD_SHORT = (() => {
  const parts = PROOF_AWARD?.title.replace(/\s*\([^)]*\)\s*$/, '').split('·').map((s) => s.trim())
  if (!parts?.length) return ''
  return parts.length > 1 ? `${parts[0]} · ${parts[parts.length - 1]}` : parts[0]!
})()

const THOUGHTS = thoughtIndexEntries()
const THOUGHT_COUNT = THOUGHTS.length

const KICKER = 'block font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase'

// The ✦ recognition, in ink, never red, never a box (REDESIGN-SPEC §1: awards
// read as recognition, not a stamp). It rides the WORK now, not the biography
// (Emilie's cut, 2026-07-27), so it is short enough to sit on a card face: the
// registry title's first and last segments only, which is exactly the wording
// family the rest of the site uses ("MACAD AWARDS 2026 · WINNER"). Derived, not
// re-typed, so the record stays the one source.
function AwardMark({ className = '' }: { className?: string }) {
  if (!AWARD_SHORT) return null
  return (
    <span
      className={`flex items-center gap-1.5 font-mono text-micro tracking-[0.11em] text-[var(--lang-ink)] uppercase ${className}`}
    >
      <span aria-hidden="true" className="shrink-0">
        ✦
      </span>
      {AWARD_SHORT}
    </span>
  )
}

// The mark legend, rendered as REAL 1:1 marks (not glyphs) so the key matches the
// field exactly. Ink only, never a lens colour (shape-tick + label rule). It
// travels with the graph to the foot of the page: a key belongs beside the
// drawing it explains, not on the first screen where there is nothing to read.
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
// even though a project, a thought and four tags carry the word.
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

function JumpBar({
  autoFocus = false,
  onFocused,
}: {
  /** set when the collapsed "/" button opened the header: the field takes the
   *  cursor once it is actually visible, so the shortcut costs one press. */
  autoFocus?: boolean
  onFocused?: () => void
} = {}) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoFocus) return
    inputRef.current?.focus()
    onFocused?.()
  }, [autoFocus, onFocused])
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

// THE SEARCH, IN THE HEADER (Emilie's pick E2, 2026-07-27). It used to sit in
// the identity column beside a mode toggle. On a page that scrolls, a site-wide
// search belongs with the site-wide nav: it rides the pill's `tools` slot, the
// same slot /work uses for its filter row, so no new furniture is invented.
// It hides below sm, where 250px of search would eat the whole header line and
// the phone's way in is the proof card and the doors, not a text field.
//
// COLLAPSED it becomes the "/" alone, which is the same key that focuses it
// from anywhere on the page: the affordance shrinks to its own keyboard
// shortcut rather than to a magnifying glass borrowed from another design
// language. Pressing it opens the header and puts the cursor in the field, so
// the compact state never costs a step.
function LandingSearch({ collapsed, onExpand }: { collapsed: boolean; onExpand: () => void }) {
  const [focusOnOpen, setFocusOnOpen] = useState(false)
  return (
    <div className="hidden items-center sm:flex">
      <button
        type="button"
        onClick={() => {
          setFocusOnOpen(true)
          onExpand()
        }}
        inert={!collapsed}
        className={`lang-glass-1 flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--r-pill)] font-mono text-nav text-[var(--lang-ink-muted)] transition-[max-width,opacity] duration-300 ease-[var(--ease-soft)] hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] motion-reduce:transition-none ${
          collapsed ? 'max-w-11 opacity-100' : 'max-w-0 border-0 opacity-0'
        }`}
      >
        <span className="sr-only">Search this site</span>
        <span aria-hidden="true">/</span>
      </button>
      {/* OVERFLOW IS CONDITIONAL, and that is a bug fix, not a flourish
          (2026-07-27). The max-width collapse needs the overflow clipped to
          hide the field as it shrinks — but the results list hangs BELOW the
          input at top-12, outside this 44px box, so a permanent overflow-hidden
          swallowed every search result. Typing did nothing at all. Clipped
          while collapsed, visible once open; the 300ms in between is only the
          field itself sliding, which has nothing to spill. */}
      <div
        inert={collapsed}
        className={`transition-[max-width,opacity] duration-300 ease-[var(--ease-soft)] motion-reduce:transition-none ${
          collapsed ? 'max-w-0 overflow-hidden opacity-0' : 'max-w-[280px] overflow-visible opacity-100'
        }`}
      >
        <div className="w-[240px] lg:w-[280px]">
          <JumpBar autoFocus={focusOnOpen && !collapsed} onFocused={() => setFocusOnOpen(false)} />
        </div>
      </div>
    </div>
  )
}

// THE PHONE'S PROOF. There is no hover on a touch screen, so there are no
// strips there: the award-winning project simply LEADS, cover showing, with
// four plates under it. Everything the ten-second scan needs — name, role,
// award, and one piece of work with its interface visible — sits above 844px
// at 390 wide without scrolling.
function PhoneProof() {
  if (!PROOF?.image) return null
  return (
    <div className="lg:hidden">
      <Link
        to={`/work/${PROOF_ID}`}
        viewTransition
        // The phone's morph source. Safe alongside the belt's copy of the same
        // name: the belts are display:none below lg and an unrendered element
        // takes no part in a view transition, so exactly one claimant exists at
        // any width.
        style={{ viewTransitionName: vtName(`/work/${PROOF_ID}`) }}
        className="lang-glass-1 lang-lift block overflow-hidden rounded-[var(--r-card)] no-underline transition-colors hover:border-[var(--lang-ink-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        <Img
          slug={PROOF.image.slug}
          name={PROOF.image.name}
          alt={PROOF.image.alt}
          priority
          still
          sizes="(max-width: 1024px) 100vw, 600px"
          className="block aspect-video w-full object-cover object-top"
        />
        {/* THE AWARD, ON THE CARD (Emilie's direction, 2026-07-27). It sits
            above the name, on the piece it recognises, which is the whole
            point of moving it off the identity column: a recruiter reads the
            claim and sees the evidence in one glance instead of two. */}
        <span className="flex flex-col gap-1 px-3.5 py-3">
          <AwardMark />
          <span className="text-body leading-tight font-semibold text-[var(--lang-ink)]">{PROOF.title}</span>
          <span className="font-mono text-micro tracking-[0.1em] text-[var(--lang-ink-muted)] uppercase">
            Open the project &gt;
          </span>
        </span>
      </Link>
      {/* THE PHONE GETS THE BELTS TOO (Emilie, 2026-07-27), lying down and
          driven by the thumb. The four-tile grid that used to sit here showed
          four of twenty-one and stopped; these carry the whole record, in the
          same tiles, in the same order, and the row running off the right edge
          is its own invitation to push it. */}
      <div className="mt-3 space-y-2.5">
        {/* Sensi is NOT in this belt, for two reasons that happen to agree: it
            is the card directly above, so a tile would be the same project
            twice in one screen; and both would claim the `page-work-sensi`
            morph name, which makes the browser abandon the entire transition
            rather than pick one. */}
        <HorizontalBelt label={`The work · ${STRIP_PROJECTS.length} projects`}>
          {STRIP_PROJECTS.filter((p) => p.id !== PROOF_ID).map((p) => (
            <li key={p.id} className="w-[168px] shrink-0 snap-start">
              <StripTile project={p} tabbable />
            </li>
          ))}
        </HorizontalBelt>
        <HorizontalBelt label={`The thoughts · ${THOUGHT_COUNT} notes`}>
          {THOUGHTS.map((t) => (
            <li key={t.id} className="w-[228px] shrink-0 snap-start">
              <ThoughtTile
                id={t.id}
                title={t.title}
                route={t.note?.route ?? '/thoughts'}
                date={t.date}
                tabbable
              />
            </li>
          ))}
        </HorizontalBelt>
      </div>
    </div>
  )
}

// THE HEADER THAT READS THE SCROLL (Emilie, 2026-07-27). Down collapses it to
// the mark and the "/", up opens it again. Two things keep it honest:
//   · REDUCED MOTION NEVER COLLAPSES. The pill simply stays open. A header
//     that resizes itself as you read is motion, and the floor is that reduced
//     motion rests calm.
//   · It is always open near the top, so the first screen is never met by a
//     stub, and always open on focus (see onFocusCapture below), because
//     "scroll up" is not a gesture a keyboard has.
// A 6px dead band stops a trackpad's jitter from flickering it open and shut.
function useHeaderCollapse(): [boolean, (v: boolean) => void] {
  const prm = usePrefersReducedMotion()
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    if (prm) {
      setCollapsed(false)
      return
    }
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y < 140) setCollapsed(false)
      else if (y > last + 6) setCollapsed(true)
      else if (y < last - 6) setCollapsed(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [prm])
  return [collapsed, setCollapsed]
}

export default function LandingCover() {
  // (THE OVERTURE RETIRED at Emilie's cut, 2026-07-27: see index.css. The
  // column's tiers now simply arrive.)
  const [collapsed, setCollapsed] = useHeaderCollapse()
  const [beltsPaused, setBeltsPaused] = useState(false)

  useEffect(() => {
    assertPaletteMatchesTheme()
  }, [])

  return (
    // THE LANDMARKS SIT OUTSIDE MAIN (accessibility audit, 2026-07-27). The
    // whole page used to be one <main>, with the header pill and the footer
    // nested inside it. A <header> or <footer> inside <main> is NOT a banner or
    // contentinfo landmark, so the landing was the one page on the site
    // offering neither, while every interior page (SheetPage puts them outside)
    // offers both. A screen-reader user's landmark list simply lost the way in
    // and the way out. They are siblings of <main> now, matching SheetPage.
    <>
      {/* THE HEADER (Emilie's call, 2026-07-27). The landing was the ONE page
          without the site's floating pill, because it was a fixed frame with
          nowhere to go. A scrolling page needs persistent nav: without it the
          bio and the graph at the foot are two screens from any way out. So
          the landing adopts the SAME TitleBlock every interior page carries,
          pixel-identical, and it STICKS. The jump bar rides the pill's tools
          slot, which is where a site-wide search belongs on a long page.
          Note the pill lights no door here: activeDoor('/') is -1 by design,
          and the cube mark is already the way home. */}
      {/* pointer-events-none on the STICKY WRAPPER, not just on TitleBlock's
          own strip: the wrapper is a full-width band that content scrolls
          under, and without this it eats every hover and click in the ~70px
          it covers. The pill and the search re-enable their own events. */}
      {/* THE SKIP LINK. Every interior page gets one from SheetPage; the
          landing does not use SheetPage and never needed one, because it was a
          fixed frame with about ten tab stops. Making the belts focusable took
          it to fifty-two, thirty-five of them tiles, which means a keyboard
          user would tab every project and every note before reaching the bio.
          This jumps the belts. It is the standard sr-only-until-focused
          pattern, worded for what it actually does. */}
      <a
        href="#doors-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[var(--r-pill)] focus:bg-[var(--lang-interaction)] focus:px-4 focus:py-2 focus:font-mono focus:text-nav focus:text-[var(--lang-ground)]"
      >
        {/* Worded for BOTH layouts: there are no columns on a phone, so
            "skip the columns" would be a promise about furniture that is not
            there. Naming the destination works everywhere. */}
        Skip to the rooms
      </a>

      {/* THE FADE UNDER THE HEADER (Emilie, 2026-07-27: "the header pill
          sticks but it should not overlap the actual content, so the content
          should fade so the header stays clean"). A fixed wash of the ground,
          full width, sitting BETWEEN the content and the pill: content
          dissolves into the page as it travels under the header instead of
          sliding behind a floating object. It is decorative and inert
          (pointer-events-none), so nothing underneath loses a click, and it
          never animates, so reduced motion sees exactly the same thing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[104px]"
        style={{
          background:
            'linear-gradient(to bottom, var(--lang-ground) 0%, color-mix(in srgb, var(--lang-ground) 88%, transparent) 46%, transparent 100%)',
        }}
      />
      {/* onFocusCapture opens the pill whenever focus lands anywhere inside it:
          a keyboard user cannot "scroll up" to get their nav back. */}
      <div
        className="pointer-events-none sticky top-0 z-40"
        onFocusCapture={() => setCollapsed(false)}
      >
        <TitleBlock
          collapsed={collapsed}
          tools={<LandingSearch collapsed={collapsed} onExpand={() => setCollapsed(false)} />}
          toolsKey="landing"
        />
      </div>

      <main
        id="main"
        tabIndex={-1}
        aria-label="Emilie El Chidiac, Design Technology Architect"
        className="bg-[var(--lang-ground)] text-[var(--lang-ink)] outline-none"
      >
      {/* ============ ONE · THE IDENTITY AND THE STRIPS ============
          Identity left, the two hover columns right. On anything without a
          hover (below lg) the columns are replaced by the phone's proof
          block: a strip is a pointer mechanic and pretending otherwise on a
          touch screen ships an affordance nobody can reach.
          THE AIR (Emilie, 2026-07-27: "use more white space, let the page
          breathe"). The gutter between column and belts opens 48 -> 80px, the
          belts inset from the right, and the tiles shrink (see Strips.tsx).
          The name and the hand line grow to fill the room that buys. */}
      {/* THE INSET IS THE SAME ON BOTH SIDES (Emilie, 2026-07-27: "the name
          should be a bit more to the right, the inset should be the same from
          both sides"). It was 56px on the left against ~107px on the right,
          because the belts were capped and centred inside their half while the
          name sat on the section's own padding. Now the padding IS the inset
          on both edges (80px at lg, 96px at xl) and the belts run to the right
          edge of it with ml-auto, so the two margins are one number. */}
      <section className="relative flex min-h-[calc(100svh-4.25rem)] flex-col px-6 pt-2 pb-10 lg:flex-row lg:items-stretch lg:gap-16 lg:px-20 lg:pt-0 lg:pb-20 xl:gap-20 xl:px-24">
        {/* THE NAME SITS LOW (Emilie, 2026-07-27: "maybe the name would go down
            instead of the middle, hinting at the scrolling"). The identity
            block is bottom-anchored on lg, so the air stacks ABOVE it and the
            eye is left with somewhere to go. Centring it made the column look
            finished; low, it reads as the start of something. */}
        <div className="flex shrink-0 flex-col lg:w-[470px] lg:justify-end lg:pb-[12vh] xl:w-[500px]">
          <header className="flex flex-col">
            {/* TIER 1 — name. THE NAME, ON THE WIDTH AXIS (Emilie,
                2026-07-26; DL amendment 24): a round size condensed to
                --wdth-fit rather than a fit-by-trial decimal. */}
            <div className="flex items-center gap-3">
              <LogoMark size={40} className="shrink-0 lg:size-[46px]" />
              <h1
                className="font-display text-[30px] font-semibold leading-[0.98] tracking-[0.01em] whitespace-nowrap text-[var(--lang-ink)] sm:text-[45px] lg:text-[46px]"
                style={{ fontStretch: 'var(--wdth-fit)' }}
              >
                Emilie El Chidiac
              </h1>
            </div>

            {/* TIER 2a — the role adjectives (signed G4; full ink since the
                S2 council gate, ARCHIVO condensed since the width-axis gate).
                THE ROLE LINE RETIRED here (Emilie's cut, 2026-07-27): the
                title "Design Technology Architect" shipped above this row for
                one build and she took it out, keeping the four adjectives as
                the whole claim. It still names the site in the <title> tag and
                on the /work footer. The council's ruling holds: this row rides
                FULL INK, because at muted it read as decoration before
                information. */}
            <p
              className="mt-5 font-display text-[12px] leading-relaxed tracking-[0.04em] text-[var(--lang-ink)] lowercase sm:text-[14px]"
              style={{ fontStretch: 'var(--wdth-fit)' }}
            >
              {ADJECTIVES}
            </p>

            {/* TIER 2b — the positioning voice line, a warm-ink HANDWRITTEN
                note (Emilie, 2026-07-09). It grows to 33px on lg: the doors
                and the search left this column for the header, and the air
                they freed is spent on the sentence, not left as a hole. */}
            <p className="mt-3 font-hand text-[21px] leading-tight text-[var(--lang-hand-warm)] sm:whitespace-nowrap sm:text-[30.97px] lg:text-[33px]">
              {VOICE}
            </p>

            {/* (THE RECOGNITION LINE RETIRED from the identity column at the
                same cut. Her direction: "remove the MaCAD Awards 2026 line, if
                anything make it more obvious in the card." So the award now
                rides the WORK ITSELF — the phone's proof card and Sensi's tile
                in the strip — where it is attached to the thing it recognises
                instead of floating in the biography.)

                (THE DOORS AND THE SEARCH LEFT TOO, 2026-07-27: they are the
                sticky header's job now. The identity column is PURE IDENTITY,
                which is why the hairline rule that used to separate the two
                went with them: there is nothing left to separate.) */}
          </header>

          {/* The phone's proof rides INSIDE the identity column so the whole
              first screen is one measure at 390. */}
          <div className="mt-7 lg:mt-0">
            <PhoneProof />
          </div>

        </div>

        {/* THE STRIPS · lg+ only, and pointer-only by design (Strips.tsx).
            The height is EXPLICIT (the viewport less the header band and the
            section's own bottom padding), not inherited: the track holds 42
            tiles, so a column with no definite height simply grows to
            forty-two tiles tall and takes the whole page with it. This is the
            frame the mask and the loop are measured against. */}
        {/* THE BELTS COME OFF THE RIGHT EDGE (Emilie, 2026-07-27). Flush right
            put them directly under the header's search pill, so the page had no
            air beneath "/ jump to anything". They now stop a gutter short, and
            THE PAUSE LIVES IN THAT GUTTER: right beside the belts, bottom
            aligned, which is both what she asked for and what makes the gutter
            read as a deliberate margin rather than a gap. */}
        {/* pr-12/pr-20 pulls the whole belt block further off the right edge
            (Emilie, 2026-07-27, second pass), so the air under "/ jump to
            anything" is unmistakably deliberate. The pause travels with it. */}
        {/* min-w-0 IS LOad-BEARING, not tidiness: a flex item defaults to
            min-width:auto, so without it this region refuses to shrink below
            its belts' min-content width and pushes the whole page sideways.
            Measured at 1024 before the fix: scrollWidth 1147 against a 1009
            viewport, i.e. 138px of horizontal scroll on the landing.
            THE RIGHT PADDING steps up with the width (Emilie: keep the belts
            clear of the header search). It can only step up where there is
            room: at 1280 the belts are still being squeezed by the identity
            column, so the big inset waits for 2xl, where they are capped at
            500px and the padding costs them nothing. */}
        <div className="hidden min-h-0 min-w-0 flex-1 gap-4 lg:flex lg:h-[calc(100svh-9.25rem)] lg:pr-8 xl:pr-16 2xl:pr-44">
          {/* THE PAUSE COMES FIRST IN THE DOM, and `order` puts it back on the
              right (accessibility audit, 2026-07-27). It was reachable only
              after all thirty-six belt links: a keyboard user had to tab
              through the moving content to reach the control that stops it,
              which is the wrong way round for WCAG 2.2.2. `order` moves the
              picture, never the tab sequence, so the control now precedes what
              it governs and still sits in the corner Emilie put it in.
              (:focus-within already halts the belts the moment focus lands in
              them, so this is belt-and-braces rather than the only stop.) */}
          <div className="order-2 flex w-11 shrink-0 flex-col justify-end pb-1">
            <PauseToggle paused={beltsPaused} onToggle={() => setBeltsPaused((p) => !p)} />
          </div>
          <div className="order-1 min-w-0 flex-1">
            <Strips awardProjectId={PROOF_ID} awardLabel={AWARD_SHORT} paused={beltsPaused} />
          </div>
        </div>

        {/* THE SCROLL CUE, CENTRED AT THE FOOT (Emilie, 2026-07-27: "the
            projects and notes hint would be nicer in the middle"). It spans the
            whole first screen rather than the identity column, so it belongs to
            the page and not to the biography. It is a LINK, not an ornament: a
            keyboard user gets the shortcut a scroll wheel gives everyone else,
            and it says how much there is so the scroll is an informed one. */}
        <a
          href="#doors-heading"
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 px-4 py-3 font-mono text-micro tracking-[0.14em] whitespace-nowrap text-[var(--lang-ink-muted)] uppercase no-underline hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] lg:inline-flex"
        >
          <span>
            {STRIP_PROJECTS.length} projects · {THOUGHT_COUNT} notes
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
            <path d="M6 1v9M2.5 6.5 6 10l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* ============ TWO · THE TWO DOORS ============
          THE DUPLICATE GRIDS ARE GONE (Emilie, 2026-07-27). The work appeared
          THREE times on this page: in the belts, in a flat grid below them, and
          on the phone inside the proof block as well. The grid existed only
          because the belts were aria-hidden pointer decoration and something
          had to carry the keyboard path. The belts stop on :focus-within now,
          so they hold focus safely and ARE that path, and the grid became pure
          repetition. What is left here is navigation rather than a second copy:
          two large doors that finally have something to offer a visitor who has
          seen the belts. */}
      <nav
        aria-labelledby="doors-heading"
        className="mx-auto w-full max-w-[1100px] px-6 pt-4 pb-2 lg:px-14"
      >
        <h2 id="doors-heading" className="sr-only">
          The rooms
        </h2>
        <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
          {[
            { to: '/work', name: 'The work', count: `${STRIP_PROJECTS.length} projects`, line: 'Copilots, models and the things they were built to answer.' },
            { to: '/thoughts', name: 'The thoughts', count: `${THOUGHT_COUNT} notes`, line: 'The questions underneath the work, written as they came.' },
          ].map((d) => (
            <li key={d.to} className="flex">
              <Link
                to={d.to}
                viewTransition
                className="lang-glass-1 lang-lift flex w-full flex-col justify-between gap-6 rounded-[var(--r-card)] px-6 py-6 no-underline transition-colors hover:border-[var(--lang-ink-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
              >
                <span className={KICKER}>{d.count}</span>
                <span className="flex items-end justify-between gap-4">
                  <span className="text-title font-semibold tracking-[-0.01em] text-[var(--lang-ink)]">
                    {d.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-micro tracking-[0.13em] text-[var(--lang-interaction)] uppercase"
                  >
                    Open &gt;
                  </span>
                </span>
                <span className="font-serif text-nav leading-relaxed text-[var(--lang-ink-muted)]">
                  {d.line}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ============ FOUR · THE BIO, ON THE MIND-GRAPH ============
          THE GRAPH IS THE GROUND NOW (Emilie, 2026-07-27: "the mind graph
          should be in the background, not in its own box, and should appear
          with the scrolling and take a bit more space"). It fills the closing
          section full bleed, the bio reads on top of it, and it FADES IN when
          the section comes into view rather than being there all along. That
          is the whole argument for moving it off the first screen: as a cover
          it demanded to be decoded, as a ground it is the thing the bio is
          written on.
          The wink comes with it: the one decorative line that is actually
          voice, and beside the drawing it finally has something to point at. */}
      <MindSection />
      </main>
      {/* inFlow: this footer scrolls, so it must not claim the frozen frame's
          `page-foot` name (see Footer). Outside <main> so it is a real
          contentinfo landmark, as on every interior page. */}
      <Footer inFlow />
      {/* The ownership line, scrolling with the footer it belongs to (rights
          pass round 2, 2026-07-30). The landing does not use SheetPage, so it
          wires its own, exactly as it does for the Footer above. */}
      <Footline />
    </>
  )
}

// The closing section, split out because it owns the arrival trigger.
function MindSection() {
  const [lit, setLit] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const prm = usePrefersReducedMotion()

  // THE ARRIVAL, BELT AND BRACES, AND BOTH ARE LOAD-BEARING.
  // The observer is the right tool and it is not sufficient on its own:
  // everything driven by the rendering pipeline (IntersectionObserver
  // callbacks AND scroll events alike) is suspended in a page the browser is
  // not painting. Measured 2026-07-27: scrollY moved 0 -> 1221 and the window
  // dispatched exactly zero scroll events, while a hand-rolled observer on
  // this section returned nothing with the section fully in view.
  // The backstop used to be a blind 1.2s timer. That became WRONG the moment
  // the graph started MOUNTING on arrival to get its draw-in: a blind timer
  // mounts it while it is still off screen and plays the whole ceremony to an
  // empty room, which is the exact bug this is meant to fix. So the backstop
  // polls the RECT instead. Reading a bounding box needs no compositor and no
  // events, it just asks where the box is — so it is both reliable and honest
  // about what it is waiting for.
  useEffect(() => {
    const el = ref.current
    // Reduced motion skips straight to lit: no transition, nothing to observe.
    // (MindGraphView renders the identical final composition instantly there,
    // so mounting it early costs nothing and hides nothing.)
    if (!el || prm) {
      setLit(true)
      return
    }
    // WHERE THE TRIGGER SITS IS THE WHOLE DESIGN. Mounting starts a 3.4s
    // ceremony that cannot be paused or rewound, so it must not start until
    // the drawing is genuinely on screen. This section is the LAST thing on the
    // page: fire it as the top edge crosses the fold and the entire animation
    // plays while the graph is a sliver at the bottom of the screen, finishing
    // before it is ever properly in view. That is what "no animation" looked
    // like. Half a viewport in, the graph is a real presence and the visitor is
    // plainly on their way here.
    const arrived = () => el.getBoundingClientRect().top < window.innerHeight * 0.5
    if (arrived()) {
      setLit(true)
      return
    }
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => entry?.isIntersecting && setLit(true), {
            threshold: 0.18,
          })
    io?.observe(el)
    const poll = window.setInterval(() => {
      if (arrived()) setLit(true)
    }, 350)
    return () => {
      io?.disconnect()
      window.clearInterval(poll)
    }
  }, [prm])

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="bio-heading"
      // lg:justify-center drops the prose to the middle of the section so it
      // sits with the drawing rather than above it (Emilie, 2026-07-27: "the
      // about text should be a bit lower so it centres better with the mind
      // graph"). Only the in-flow children move; the graph and its ground are
      // absolute and stay where they are.
      className="relative isolate mt-14 min-h-[86svh] overflow-hidden px-6 pt-16 pb-20 lg:mt-20 lg:flex lg:flex-col lg:justify-center lg:px-20 lg:pt-20 lg:pb-20 xl:px-24"
    >
      {/* THE GROUND. Full bleed behind everything in this section, no box, no
          border. It MOUNTS when the section is half a viewport in, and mounting
          is what starts MindGraphView's own 3.4s choreography: threads sweep in
          one by one, the marks land on them, the labels settle. The same
          ceremony the old cover ran on load, now run on arrival.
          (A scroll-scrubbed version of this was built and removed the same day:
          Emilie wanted the drawing to play itself when you get here, not to be
          tied to the scroll wheel, and not at the cost of a page you keep
          scrolling through.)
          A throw degrades to no-graph (MindGraphSrNav still lists every node)
          while the bio over it stays painted. */}
      {/* THE GRAPH IS FULL BLEED AGAIN (Emilie, 2026-07-27, third pass). It was
          pushed to the right half to stop it colliding with the prose, and that
          cure was worse: a half-width box makes `slice` crop HORIZONTALLY
          instead of vertically, so most of the threads were cut away entirely.
          Back to inset-0, where the container is wider than the drawing's own
          ratio and the crop is a shallow vertical trim.
          THE OVERLAP IS WANTED — her words: the drawing may run under the left
          column. What was NOT wanted is the drawing being unreachable there, so
          the prose is POINTER-TRANSPARENT (below) and every mark stays
          pressable straight through the text. */}
      <div
        className={`pointer-events-auto absolute inset-0 -z-10 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          lit ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {lit && (
          <ExploreErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <MindGraph />
            </Suspense>
          </ExploreErrorBoundary>
        )}
      </div>

      {/* The ground under the words. Strong enough to be a surface rather than
          a veil, so the prose never reads as faded, and narrow enough that it
          only covers the column the prose actually occupies. Never animates,
          never intercepts a pointer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 lg:hidden"
        style={{ background: 'color-mix(in srgb, var(--lang-ground) 86%, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, var(--lang-ground) 0px, var(--lang-ground) 420px, color-mix(in srgb, var(--lang-ground) 55%, transparent) 560px, transparent 700px)',
        }}
      />

      {/* POINTER-TRANSPARENT PROSE. The drawing runs underneath by design, and
          a paragraph with no background still swallows every click inside its
          box, which would make the marks under the bio unpressable. The block
          lets pointers through and each interactive child takes its own back.
          The cost is that this prose cannot be drag-selected; the marks being
          reachable is worth more on a surface whose whole point is touching
          them. */}
      <div className="pointer-events-none relative lg:w-[400px] xl:w-[440px]">
        <h2 id="bio-heading" className={KICKER}>
          About
        </h2>
        {/* draftCopy: NEW, UNSIGNED (identity.ts). */}
        {BIO.map((para, i) => (
          <p
            key={i}
            className="prose-rag mt-4 font-serif text-[17px] leading-relaxed text-[var(--lang-ink)] tall:text-[19px]"
          >
            {para}
          </p>
        ))}
        <p className="mt-6 font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase">
          This is what&apos;s on my mind ·{' '}
          <Link to="/contact" viewTransition className={`pointer-events-auto ${RED_LINK}`}>
            What&apos;s in yours? &gt;
          </Link>
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
          <span aria-hidden="true" className="flex items-center gap-x-4">
            <LegendMarks />
          </span>
        </div>
      </div>

      {/* The navigable list of every node, travelling in all modes. */}
      <MindGraphSrNav />

      {/* The wink leaves the centred column and corners itself on lg. In the
          flow it was a second block for justify-center to balance, which pushed
          the prose ~57px above the section's middle and so above the drawing's
          middle too. Out of flow, the bio centres on its own. */}
      <p
        className="pointer-events-none relative mt-12 max-w-[30ch] -rotate-1 font-hand text-[16px] leading-snug sm:text-[18px] lg:absolute lg:right-20 lg:bottom-12 lg:mt-0 lg:-rotate-2 lg:text-right xl:right-24"
        style={{ color: 'color-mix(in srgb, var(--lang-ink) 55%, var(--lang-ink-muted))' }}
      >
        <span className="text-[var(--lang-interaction)]">n.b.</span> {WINK}
      </p>
    </section>
  )
}
