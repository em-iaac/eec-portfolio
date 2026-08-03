// THE GALLERY (Session R2, re-skinned DL-2 2026-07-10) · /work. A uniform grid
// of every project where a visitor browses the work visually, then opens any
// card as a glass sheet lifted over the dimmed grid. This is the landing's
// proof path, so it must be excellent and fast.
//
// One data object drives it: WORK_ENTRIES (data/work.ts), the same object the
// printed book's INDEX page (R7) will reuse. The lens filter is an OPEN facet
// set (a new lens appears by itself). The overlay is URL-addressable at
// /work/:id so a single card is shareable and prerenderable (R9).
//
// DL-2: the page simply FOLLOWS the mode (the R2 dark lean retired at DL-1);
// faces are the glass Card primitive, the filter is FilterPill, the preview is
// the glass-2 sheet, and the card <-> sheet <-> page morphs ride the DL-1
// naming convention (lib/viewTransition.ts).
//
// Copy: all 11 deks were SIGNED by Emilie in the DL-2 copy pass (in chat,
// 2026-07-10; dekSigned in the content files); the page's intro line retired
// at G2 (no page intros, sitewide). New copy on this surface ships draftCopy
// until she signs it, as always (Section 14).
import { useEffect, useMemo, useRef, useState } from 'react'
// G1 (2026-07-10): the opened card IS the showcase now (WorkOverlay grew the
// signed spine; the Pen Table sheet tier retired, /sheets/* redirects here).
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import type { ReachSet } from '../components/reach/verbs'
import { LensMark } from '../components/ui/Pill'
import ThoughtIndexRows from '../components/ThoughtIndexRows'
import WorkCard from '../components/work/WorkCard'
import WorkGroundTools, { BookDownloadLink } from '../components/work/WorkPillTools'
import WorkOverlay from '../components/work/WorkOverlay'
import { LENSES, type Lens } from '../components/Lens'
import { travelTo } from '../lib/navIntent'
import { CORRELATIONS, thoughtIndexEntries } from '../data/registry'
import { WORK_ENTRIES, WORK_LENSES, workEntryById } from '../data/work'

// THE CROSS-GLOW (LOOK & ORDER, Emilie's gate 2026-07-18): hovering a thought
// row softly rings the work tiles it is correlated to, the mind-graph's braid
// made visible on the index. Derived once from the registry CORRELATIONS
// (idea lineage only); a thought with no honest thread glows nothing.
const WORK_IDS = new Set(WORK_ENTRIES.map((w) => w.id))
const GLOW_MAP: Record<string, readonly string[]> = (() => {
  const m: Record<string, string[]> = {}
  for (const [a, b] of CORRELATIONS) {
    if (WORK_IDS.has(b) && !WORK_IDS.has(a)) (m[a] ??= []).push(b)
    else if (WORK_IDS.has(a) && !WORK_IDS.has(b)) (m[b] ??= []).push(a)
  }
  return m
})()

// (The lens filter row + book link live in components/work/WorkToolbar:
// one filter, rendered by the lg+ docked row AND the mobile stacked header
// below. The round-4 full-width bar retired at the audit gate, 2026-07-19.)

export default function Work() {
  const { id } = useParams()
  const { hash } = useLocation()
  const navigate = useNavigate()

  const lens = (hash.replace('#', '') || null) as Lens | null
  const activeLens = lens && lens in LENSES ? lens : null

  const entries = activeLens ? WORK_ENTRIES.filter((w) => w.lens === activeLens) : WORK_ENTRIES

  // THE BOOK INDEX (REINDEX, Emilie's gate 2026-07-16): the featured/more-work
  // split retired for ONE uniform grid, every project the same size, like the
  // printed book's index page. The strongest still lead: WORK_ENTRIES carries
  // the featured-first order, and `featured` keeps steering eager loading.

  // The thoughts rows follow the same facet (a lens with no thoughts simply
  // shows none; the section hides rather than sitting empty).
  const thoughts = thoughtIndexEntries().filter((t) => !activeLens || t.lens === activeLens)

  const selected = id ? workEntryById(id) : undefined

  // WHAT YOU ARE IN THIS ROOM TO DO (the reach prototype, 2026-08-03): choose a
  // lens, and get back to the top of a 2260px grid. Those are the two things a
  // visitor does here repeatedly, and both currently live at y=88 or above, in
  // the stretch zone. The wording is the SHORT lens form components/Lens.tsx has
  // carried since July, with the long name as the accessible name: no new copy.
  const reachSet: ReachSet = useMemo(
    () => ({
      label: 'Filter by lens',
      handle: 'lens',
      verbs: [
        { id: 'all', label: 'All work', short: 'ALL', to: '/work', active: activeLens === null },
        ...WORK_LENSES.map((l) => ({
          id: l,
          label: LENSES[l].label,
          short: LENSES[l].short,
          to: `/work#${l}`,
          active: activeLens === l,
          mark: <LensMark lens={l} active={activeLens === l} />,
        })),
        // NO "BACK TO TOP" (2026-08-03). It was here for a bar at the foot of a
        // 2260px grid, and it is the only reason the row runs past the frame:
        // with it 426px against 390, without it 365px, so the row simply fits.
        // Once the filters are frozen in the header the case for it is thin
        // anyway, and both phone browsers already have scroll-to-top built into
        // the status bar, which is a gesture a visitor brought with them.
      ],
    }),
    [activeLens],
  )

  // #thoughts is a section anchor, not a lens facet (the facet parse above
  // ignores it): a note page's "ALL THOUGHTS" corridor lands on the list.
  useEffect(() => {
    if (hash === '#thoughts') {
      document.getElementById('thoughts')?.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }, [hash])

  // A bad /work/:id (renamed or typo'd) cleans itself back to the grid rather
  // than showing nothing; IDs are permanent so this is rare, never a 404.
  // On close (an open id -> no id), return focus to the card that opened the
  // preview: the navigate-driven unmount defeats <dialog>'s own focus return,
  // so restore it by hand (keyboard users land back where they were).
  const prevId = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (id && !selected) {
      navigate('/work', { replace: true })
      return
    }
    if (!id && prevId.current) {
      document.querySelector<HTMLElement>(`[data-work-card="${prevId.current}"]`)?.focus()
    }
    prevId.current = id
  }, [id, selected, navigate])

  // (S3: the title-follows-the-showcase effect retired; lib/routeHead.ts
  // sets the title from the /work/:id pathname, same single source.)

  // viewTransition: the card face morphs into the showcase sheet and back
  // (shared view-transition-name, lib/viewTransition.ts); browsers without
  // the API just swap.
  const open = (entryId: string) => navigate(travelTo(`/work/${entryId}${hash}`), { viewTransition: true })
  const close = () => navigate(travelTo(`/work${hash}`), { replace: true, viewTransition: true })

  // THE SHOWCASE ARRIVES FIRST (Emilie, 2026-08-02, phone pass; her report:
  // "there is a lag when I press on a project from the landing page, since it
  // triggers the animation of creating the work grid AND opens the card").
  // She is describing two things stacked on one tap. /work/:id renders THIS
  // page, so arriving straight at a showcase used to mount the whole gallery
  // first: 21 plates, 21 cover images, the thoughts rows, the full layout, all
  // of it underneath a dialog that covers it. Nobody sees any of that work.
  //
  // So when the route ARRIVES with an id (a link from the landing, a shared
  // card, a search result), the sheet paints alone and the gallery fills in
  // behind it on the next idle. Landing on /work normally is untouched: the
  // grid IS the page there, and this starts true. Once true it stays true, so
  // closing the showcase reveals a gallery that has been ready for a while.
  const [gridReady, setGridReady] = useState(() => !id)
  useEffect(() => {
    if (gridReady) return
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
      cancelIdleCallback?: (h: number) => void
    }
    const wake = () => setGridReady(true)
    // A timeout on the idle call and a plain timer where there is none: the
    // gallery must never depend on the browser finding a quiet moment.
    if (w.requestIdleCallback) {
      const h = w.requestIdleCallback(wake, { timeout: 800 })
      return () => w.cancelIdleCallback?.(h)
    }
    const t = setTimeout(wake, 300)
    return () => clearTimeout(t)
  }, [gridReady])

  // THE CROSS-GLOW state: the rail lifts the hovered thought id; the tiles it
  // correlates to wear data-glow (language.css draws the quiet ink ring).
  const [glowThought, setGlowThought] = useState<string | null>(null)
  const glowIds = glowThought ? new Set(GLOW_MAP[glowThought] ?? []) : null

  // One card in a list item; `priorityCount` eager-loads the first images
  // (they are above the fold). morphSource yields the entry's
  // view-transition-name to the open overlay (one element per name per state).
  // Every face is the PLATE now (the LOOK & ORDER gate, 2026-07-18).
  const cards = (list: typeof entries, priorityCount: number) =>
    list.map((entry, i) => (
      <li key={entry.id} className="flex" data-glow={glowIds?.has(entry.id) ? '' : undefined}>
        <WorkCard
          entry={entry}
          onOpen={() => open(entry.id)}
          priority={i < priorityCount}
          morphSource={selected?.id !== entry.id}
        />
      </li>
    ))

  const SECTION_LABEL =
    'font-mono text-label tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase'

  return (
    // TOOLS ON THE GROUND, ON THE SIDE (the design audit, Emilie's ruling
    // round 3, 2026-07-19): the nav pill is identical to every room's;
    // /work's tools ride the ground at the pill's line (pillTools ->
    // TitleBlock's slot; placement in .pill-tools, language.css). The grid
    // takes the full width, THE THOUGHTS close the page, and below lg the
    // stacked header returns (minus the retired kicker tier).
    <SheetPage
      wide
      pillTools={<WorkGroundTools active={activeLens} />}
      toolsKey="work"
      /* THE BOOK RIDES THE FOOTER FROM `sm` UP, and the stacked header keeps
         it below that. Not a whim: /work's footer is FROZEN, so anything added
         to it is paid on every screen. Measured at 375px, the three-part pill
         wraps to three rows and grows 112px -> 169px, which is 21% of the
         viewport permanently spent on chrome, on the page whose entire job is
         the grid. /cv can afford the same pill because ITS footer scrolls in
         flow. So the tool is hidden here at phone widths and the stacked
         header carries it there instead; the two never both show. */
      /* THE BOOK RIDES THE FOOTER AT EVERY WIDTH NOW (Emilie, 2026-08-02:
         "C, also the book pdf has to be in the footer"). It used to hide below
         sm and reappear beside the filters, because the frozen footer pill was
         a wrapping three-part row that grew 112 -> 169px at 375 and spent 21% of
         the viewport on chrome. That footer no longer exists: since the phone
         pass it is one compact row, credit left and marks right, and a tool
         simply joins the marks the way /cv's PDF does. Measured after: 74px on
         every page, with or without a tool. So the reason for the split is
         gone, and with it the split. */
      footerTools={<BookDownloadLink />}
      reach={reachSet}
    >
      {/* THE h1 IS sr-only AT EVERY SIZE NOW (Emilie's ruling 2026-08-02,
          board option C). It was already sr-only on lg for the exact reason it
          is here: the lit WORK door sits directly above it and says the same
          word. On a phone that repetition cost 61px, which is 7% of the screen
          spent restating the header. It is HIDDEN, not deleted: the document
          outline still opens with it and a screen reader still announces the
          room. */}
      <h1 id="work-heading" className="sr-only">
        Work
      </h1>
      {/* THE FILTERS LIE DOWN ON A PHONE (same ruling). Wrapped, four lenses
          plus the book link took three lines and 148px; on one scrolling row
          they take 52. It is the belt grammar this landing already uses, so a
          row that runs past the frame is a gesture the page has taught once.
          `-mx-5` cancels SheetPage's gutter so the row bleeds the full width and
          keeps that gutter as its own first inset, exactly like HorizontalBelt.
          THE BOOK IS GONE FROM HERE: it lives in the footer at every width now
          (see footerTools above), so this row is filters and nothing else. */}
      {/* THE PHONE'S FILTER ROW IS GONE FROM THE PAGE (her ruling 2026-08-03,
          after trying four reach shapes on her own phone: "let's go for the
          drawer, for both, the work and the cv"). The lenses now live in the
          LENS drawer on the right edge, which is what she judged, since the
          prototype hid this row whenever a shell was live.
          It buys back the whole block above the first tile and puts the control
          in the thumb arc instead of the stretch zone. From `lg` up nothing
          changes: the docked WorkGroundTools row in the header is still the
          desktop filter and the drawer is `lg:hidden`.
          ONE THING TO WATCH, and it is the honest cost of the choice: a filter
          behind a tab is a filter a first-time visitor has to find. The tab is
          labelled LENS rather than a bare glyph for exactly that reason. */}
      {/* An invisible announcer keeps the filter change audible for screen
          readers, in main so it lives in an always-rendered region. */}
      <p className="sr-only" aria-live="polite">
        {entries.length} {entries.length === 1 ? 'project' : 'projects'}
        {activeLens ? ` · ${LENSES[activeLens].label}` : ''}
      </p>

      {/* ONE uniform grid, filtered or not (the book index's manner): two
          per row on phones, the printed index's 7-across on xl (21 tiles =
          exactly 3 rows at 186px, the one-page fit with the bar above). */}
      <ul className="grid list-none grid-cols-2 gap-3 p-0 pb-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7">
        {gridReady ? cards(entries, 7) : null}
      </ul>

      {/* THE THOUGHTS (REINDEX, Emilie's IA gate 2026-07-16): the printed
          index's T-numbered contents rows, the site's one thoughts list.
          Round 4 (her pick of option B): they CLOSE the page below the grid,
          in three columns on xl so every title holds one line; the rail
          mechanic survives (ink + the verbatim opening + the cross-glow up
          onto the correlated tiles). */}
      {gridReady && thoughts.length > 0 && (
        // S5: pt/pb trimmed 4 -> 2 when the thoughts grew to 13 (T-111..113)
        // so the one-page promise holds at 1280x800 (was 14px over).
        <section id="thoughts" aria-labelledby="thoughts-list-heading" className="pt-1 pb-0">
          <h2 id="thoughts-list-heading" className={SECTION_LABEL}>
            The Thoughts
          </h2>
          <ThoughtIndexRows
            skin="screen"
            lens={activeLens}
            variant="wide"
            onThoughtHover={setGlowThought}
          />
        </section>
      )}

      {selected && <WorkOverlay key={selected.id} entry={selected} onClose={close} />}
    </SheetPage>
  )
}
