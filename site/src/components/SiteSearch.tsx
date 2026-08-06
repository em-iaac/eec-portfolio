// THE SEARCH, SITEWIDE (Emilie's ruling 2026-08-06, the last pass).
//
// It was born on the landing and lived there alone for ten days: one page of
// ten, and hidden below 640px, so it was a tool most visits could not reach.
// The final walk put it up for a cut and she ruled the other way, which is the
// better answer: "let's have it on all main pages, same place. it can be very
// useful to find things around the site."
//
// SO IT IS CHROME NOW, not a landing feature. It lives here beside TitleBlock
// rather than inside LandingCover, and TitleBlock decides where it appears, so
// no page wires it and no page can put it somewhere else.
//
// WHERE · FLUSH RIGHT, ALWAYS (her pick A from a drawn board, three options).
// It is the LAST child of .pill-tools, which is `margin-left:auto` +
// `justify-content:flex-end`, so it takes the top-right corner in every room
// and a room's own tools sit to its left. Measured at 1440 before the ruling:
// the pill is 409px and the free run on the header line is 568px on /work,
// 858px on /thoughts, 1007px on /cv and /contact, so 280px lands everywhere.
// The one thing that moves is /work's filter row, 292px to the left, and she
// was shown that and took it.
//
// WHICH ROOMS · exactly the five she named. The reading rooms are deliberately
// out: /work/:id is a modal sheet over /work (so the header behind it keeps the
// search and nothing flickers on open or close), while a thought leaf already
// carries 653px of its own meta and verbs on that line and has nowhere to put
// another 280.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LensMark } from './ui/Pill'
import type { Lens } from './Lens'
import { ENTRIES } from '../data/registry'
import { MIND, nodeRoute } from '../landing/mindGraph'

// The four doors, so typing "cv" finds the page and not only its contents.
const DOORS: { label: string; to: string }[] = [
  { label: 'WORK', to: '/work' },
  { label: 'THOUGHTS', to: '/thoughts' },
  { label: 'CV', to: '/cv' },
  { label: 'CONTACT', to: '/contact' },
]

// THE JUMP BAR'S INDEX. It used to be labels only, so "comfort" found nothing
// even though a project, a thought and four tags carry the word.
//
// tags + lens are FREE: registry.ts is already in the entry bundle (mindGraph
// reads it, and the landing is eager, so both are loaded on every route
// already; moving this module out of LandingCover costs no page a byte).
// DEKS ARE NOT: they live in data/work.ts, a 129kB chunk the landing must never
// pull, so they are lazy-loaded on first FOCUS of the bar and merged in when
// they land. Nobody pays for search text until they reach for search.
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

// THE ROOMS THAT CARRY IT. Exact paths, plus /work/:id because that route
// renders /work behind a dialog: matching it keeps the header identical while a
// project is open, so the search does not vanish and reappear around the sheet.
export function hasSiteSearch(pathname: string): boolean {
  if (pathname === '/' || pathname === '/cv' || pathname === '/contact') return true
  if (pathname === '/work' || pathname.startsWith('/work/')) return true
  // A THOUGHT LEAF JOINED THEM (Emilie, 2026-08-06: "we can also have the jump
  // bar here as well"). It was excluded on 2026-08-06 for a reason that stopped
  // being true the same day: its header line carried 653px of meta AND four nav
  // verbs, with nowhere to put 280 more. Those verbs moved into the drawer at
  // her ruling, so the line now holds ~250px of meta and has the room.
  return pathname === '/thoughts' || pathname.startsWith('/thoughts/')
}

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
  const warmDeks = useCallback(() => {
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
  }, [])

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

  // "/" focuses the bar from anywhere in the room (unless already typing).
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
          className="lang-glass-2 absolute top-12 left-0 z-20 max-h-[280px] w-full overflow-y-auto rounded-[var(--r-control)] py-1"
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
                  <span className="hidden min-w-0 flex-1 truncate font-serif text-micro tracking-normal normal-case text-[var(--lang-ink-muted)] sm:block">
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
// It hides on narrow screens, where 250px of search would eat the whole header
// line and the way in is the doors and the belts, not a text field. The exact
// step is arithmetic, not taste: see the note above the className below.
//
// COLLAPSED it becomes the "/" alone, which is the same key that focuses it
// from anywhere on the page: the affordance shrinks to its own keyboard
// shortcut rather than to a magnifying glass borrowed from another design
// language. Pressing it opens the header and puts the cursor in the field, so
// the compact state never costs a step.
export default function SiteSearch({
  collapsed = false,
  onExpand,
}: {
  collapsed?: boolean
  onExpand?: () => void
}) {
  const { pathname } = useLocation()
  const [focusOnOpen, setFocusOnOpen] = useState(false)
  if (!hasSiteSearch(pathname)) return null

  // WHERE IT APPEARS IS ARITHMETIC, NOT TASTE. The header is one wrapping flex
  // line, so the moment pill + room tools + search exceed the viewport the
  // WHOLE tools box drops below the pill and the header grows 76 -> 120px.
  // Measured live: header padding 12+12, pill 409, search 282, /work's filter
  // row 439, /thoughts' WATCH IT GROW 149. So the minimum width that holds one
  // line is 715px in a room with no tools of its own, 864 on /thoughts (whose
  // button is itself lg+, so it is never the binding case) and 1154 on /work.
  //
  // Two named steps clear those, with headroom so a future tool cannot silently
  // re-break the line: md (768) everywhere, xl (1280) on /work. The old `sm`
  // was already 35px short of its own threshold, which is why the landing's
  // header has been quietly two rows tall between 640 and 675px.
  const roomHasTools = pathname === '/work' || pathname.startsWith('/work/')

  return (
    // ml-2.5 is the gap to a room's own tools when it has any (/work's filter
    // row, /thoughts' WATCH IT GROW). .pill-tools sets no column gap, and on the
    // rooms with nothing to its left the margin is absorbed by `margin-left:auto`.
    <div
      className={
        roomHasTools
          ? 'hidden items-center xl:ml-2.5 xl:flex'
          : 'hidden items-center md:ml-2.5 md:flex'
      }
    >
      <button
        type="button"
        onClick={() => {
          setFocusOnOpen(true)
          onExpand?.()
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
