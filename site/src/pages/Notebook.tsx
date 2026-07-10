// THE NOTEBOOK (rebuilt G2, 2026-07-10, Emilie's rulings in-session): the
// TIME room of the two-room model. The career drawn as its literal commit
// graph (REDESIGN-SPEC §6, the locked hybrid form): a real drawn graph on
// the left (main line B.Arch › NOW, branches for the employers and schools,
// ONE live red tip on the self-employed line), fully readable diary rows on
// the right. The rows ARE the record and carry every link (44px targets,
// keyboard-first); the drawing is the structure and the dots are its
// pointer-hover garnish (aria-hidden, mirrored by the rows). A glass-2
// field card answers any hovered/focused row. At narrow widths the rail
// COMPRESSES (~84px, labels off), it never hides.
//
// Emilie's G2 rulings carried here: kind FACETS not lenses (the thoughts
// facet is her "commit-graph lens on the thinking": the record DIMS, nothing
// reflows); no intro paragraph (titles are self-explanatory, sitewide); the
// h1 line is draftCopy until she signs it. Old /notebook#<lens> URLs land as
// ALL (unknown hash = no facet). Branch spans are presentation config from
// cv.ts facts; entries assign by id override, then by date (MaCAD era wins
// after 2025-10).
import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import KindMark, { LOG_KINDS } from '../components/KindMark'
import { FilterPill } from '../components/ui/Pill'
import { timelineEntries, type RegistryEntry } from '../data/registry'
import { PROJECTS_BY_SLUG } from '../data/projects'
import { THOUGHT_OPENINGS } from '../thoughts/openings'
import { collapseSheetIssues, type LogItem } from '../lib/collapseSheets'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const RED_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

// ---- Branches (presentation config; facts from cv.ts + the registry) -------

type BranchId = 'main' | 'self' | 'bim' | 'soma' | 'dyn' | 'macad'

const BRANCH_LABEL: Record<BranchId, string> = {
  main: 'B.ARCH · LAU · 2018 › NOW',
  self: 'SELF-EMPLOYED · 2022 › NOW',
  bim: 'BIM INTL · 2023',
  soma: 'SOMA · DUBAI · 2023 › 2024',
  dyn: 'DYNAMIC SOLUTION · KUWAIT · 2024 › NOW',
  macad: 'MACAD @ IAAC · 2025 › NOW',
}

const BRANCH_NAME: Record<BranchId, string> = {
  main: 'the main line',
  self: 'Self-employed · live',
  bim: 'BIM International',
  soma: 'SOMA · Dubai',
  dyn: 'Dynamic Solution · Kuwait',
  macad: 'MaCAD @ IAAC',
}

// Entries that do NOT follow the date rule (the date rule: MaCAD era after
// 2025-10, everything else the main line). Projects ride the branch they
// were made on; awards/press ride the branch of the work they recognise.
const BRANCH_OF: Record<string, BranchId> = {
  soma: 'soma',
  mars: 'self',
  'mars-top50': 'self',
  biennale: 'self',
  cemetery: 'self',
}

// A departure milestone sits ON the main line and forks its branch off.
const FORKS: Record<string, BranchId> = {
  'self-open': 'self',
  'soma-start': 'soma',
  'dynamic-start': 'dyn',
  'macad-start': 'macad',
}

function branchOf(e: RegistryEntry): BranchId {
  return BRANCH_OF[e.id] ?? (e.date >= '2025-10' ? 'macad' : 'main')
}

function itemBranch(it: LogItem): BranchId {
  return it.type === 'entry' ? branchOf(it.e) : 'macad'
}

// ---- Facets (kinds, not lenses: the G2 model) ------------------------------

type Facet = 'projects' | 'thoughts' | 'milestones'

const FACET_MATCH: Record<Facet, Set<RegistryEntry['kind']>> = {
  projects: new Set(['project', 'sheet']),
  thoughts: new Set(['thought']),
  milestones: new Set(['milestone', 'award', 'press', 'talk']),
}

function itemMatches(it: LogItem, facet: Facet | null): boolean {
  if (!facet) return true
  if (it.type === 'sheetGroup') return facet === 'projects'
  return FACET_MATCH[facet].has(it.e.kind)
}

// ---- The drawn graph -------------------------------------------------------

const LANES_WIDE: Record<BranchId, number> = { main: 60, self: 96, bim: 132, soma: 168, dyn: 204, macad: 240 }
const LANES_SLIM: Record<BranchId, number> = { main: 12, self: 25, bim: 38, soma: 51, dyn: 64, macad: 77 }
const TIP_Y: Record<'self' | 'main' | 'macad' | 'dyn', number> = { self: 26, main: 40, macad: 40, dyn: 54 }

interface Geom {
  narrow: boolean
  width: number
  height: number
  ys: number[]
  years: { y: number; label: string }[]
  paths: Record<BranchId, string>
  labelAt: Record<BranchId, { x: number; y: number }>
  bimDotY: number
}

function curve(x1: number, y1: number, x2: number, y2: number): string {
  const k = Math.min(28, Math.max(12, Math.abs(y1 - y2) * 0.6))
  return `C ${x1} ${y1 - k} ${x2} ${y2 + k} ${x2} ${y2} `
}

function buildGeom(stage: HTMLElement, rowEls: HTMLElement[], items: LogItem[]): Geom | null {
  const narrow = window.innerWidth < 768
  const L = narrow ? LANES_SLIM : LANES_WIDE
  const sTop = stage.getBoundingClientRect().top
  const ys = rowEls.map((el) => {
    const r = el.getBoundingClientRect()
    return Math.round(r.top - sTop + r.height / 2)
  })
  if (ys.length === 0) return null

  const Y = (i: number): number => ys[i] ?? 0

  const at = (id: string) =>
    items.findIndex((it) => it.type === 'entry' && it.e.id === id)
  const iSelf = at('self-open')
  const iSoma = at('soma-start')
  const iDyn = at('dynamic-start')
  const iMacad = at('macad-start')
  const iBarch = at('barch-grad')
  if ([iSelf, iSoma, iDyn, iMacad, iBarch].some((i) => i < 0)) return null

  const yEnd = Y(ys.length - 1) + 44
  const yMerge = Y(iDyn) + Math.round((Y(iSoma) - Y(iDyn)) * 0.3)
  const bimTop = Y(iSoma) + 18
  const bimBot = Y(iBarch) - 6
  const bimDotY = Math.round((bimTop + bimBot) / 2)

  const paths: Record<BranchId, string> = {
    main: `M ${L.main} ${TIP_Y.main} L ${L.main} ${yEnd}`,
    self: `M ${L.main} ${Y(iSelf) + 30} ${curve(L.main, Y(iSelf) + 30, L.self, Y(iSelf))}L ${L.self} ${TIP_Y.self + 8}`,
    bim: `M ${L.main} ${bimBot + 22} ${curve(L.main, bimBot + 22, L.bim, bimBot)}L ${L.bim} ${bimTop} ${curve(L.bim, bimTop, L.main, bimTop - 26)}`,
    soma: `M ${L.main} ${Y(iSoma) + 30} ${curve(L.main, Y(iSoma) + 30, L.soma, Y(iSoma))}L ${L.soma} ${yMerge + 24} ${curve(L.soma, yMerge + 24, L.main, yMerge)}`,
    dyn: `M ${L.main} ${Y(iDyn) + 30} ${curve(L.main, Y(iDyn) + 30, L.dyn, Y(iDyn))}L ${L.dyn} ${TIP_Y.dyn}`,
    macad: `M ${L.main} ${Y(iMacad) + 30} ${curve(L.main, Y(iMacad) + 30, L.macad, Y(iMacad))}L ${L.macad} ${TIP_Y.macad}`,
  }

  const labelAt: Record<BranchId, { x: number; y: number }> = {
    main: { x: L.main - 8, y: yEnd - 14 },
    self: { x: L.self + 10, y: Y(iSelf) - 40 },
    bim: { x: L.bim + 10, y: bimDotY },
    soma: { x: L.soma + 10, y: Y(iSoma) - 36 },
    dyn: { x: L.dyn + 10, y: Y(iDyn) - 64 },
    macad: { x: L.macad + 10, y: Y(iMacad) - 48 },
  }

  const years: { y: number; label: string }[] = []
  const seen = new Set<string>()
  items.forEach((it, i) => {
    const yr = (it.type === 'entry' ? it.e.date : it.date).slice(0, 4)
    if (seen.has(yr)) return
    seen.add(yr)
    years.push({ y: Y(i), label: yr })
  })

  return {
    narrow,
    width: narrow ? 84 : 250,
    height: Math.round(stage.offsetHeight),
    ys,
    years,
    paths,
    labelAt,
    bimDotY,
  }
}

const BRANCH_IDS: BranchId[] = ['main', 'self', 'bim', 'soma', 'dyn', 'macad']
const DRAW_DELAY: Record<BranchId, string> = {
  main: '0ms', self: '80ms', bim: '140ms', soma: '200ms', dyn: '260ms', macad: '320ms',
}

function CommitGraph({
  geom,
  items,
  facet,
  litBranches,
  drawIn,
  onDotHover,
  onLeave,
}: {
  geom: Geom
  items: LogItem[]
  facet: Facet | null
  litBranches: Set<BranchId> | null
  drawIn: boolean
  onDotHover: (i: number) => void
  onLeave: () => void
}) {
  const L = geom.narrow ? LANES_SLIM : LANES_WIDE
  const dim = (b: BranchId) => (litBranches ? !litBranches.has(b) : false)
  return (
    <svg
      viewBox={`0 0 ${geom.width} ${geom.height}`}
      width={geom.width}
      height={geom.height}
      className={`absolute top-0 left-0 overflow-visible ${drawIn ? 'nbg-draw' : ''}`}
      role="img"
      aria-label="The career drawn as a commit graph: the main line runs from the B.Arch to now; branches fork for the self-employed practice (the one live red tip), BIM International, SOMA, Dynamic Solution and MaCAD. Every commit is a row in the record beside the drawing."
      onPointerLeave={onLeave}
    >
      {/* year lettering (the drawing's own axis; the rows carry full dates) */}
      {!geom.narrow && (
        <g aria-hidden="true" className="nbg-mark">
          {geom.years.map((t) => (
            <text
              key={t.label}
              x={30}
              y={t.y + 3}
              textAnchor="end"
              className="font-mono text-[8px] tracking-[0.08em]"
              fill="var(--lang-ink-faint)"
            >
              {t.label}
            </text>
          ))}
        </g>
      )}

      {BRANCH_IDS.map((b) => (
        <g
          key={b}
          aria-hidden="true"
          className="transition-opacity duration-200"
          style={{ opacity: dim(b) ? 0.22 : 1 }}
        >
          <path
            d={geom.paths[b]}
            pathLength={1}
            className="nbg-lane"
            style={{ animationDelay: DRAW_DELAY[b] }}
            fill="none"
            stroke="var(--lang-ink)"
            strokeWidth={b === 'main' ? 1.6 : litBranches?.has(b) ? 1.8 : 1.1}
            strokeLinecap="round"
            opacity={b === 'main' ? 0.8 : 0.55}
          />
          {/* open tips: the self-employed tip is the ONE red mark (live) */}
          {b === 'self' && (
            <g className="nbg-mark">
              <path
                d={`M ${L.self} ${TIP_Y.self + 8} L ${L.self} ${TIP_Y.self + 4}`}
                fill="none"
                stroke="var(--lang-interaction)"
                strokeWidth={1.6}
              />
              <circle
                cx={L.self}
                cy={TIP_Y.self}
                r={3.4}
                fill="var(--lang-ground)"
                stroke="var(--lang-interaction)"
                strokeWidth={1.6}
              />
              {!geom.narrow && (
                <text
                  x={L.self + 8}
                  y={TIP_Y.self + 3}
                  className="font-mono text-[8px] tracking-[0.1em]"
                  fill="var(--lang-interaction)"
                >
                  LIVE
                </text>
              )}
            </g>
          )}
          {b === 'main' && (
            <g className="nbg-mark">
              <circle cx={L.main} cy={TIP_Y.main - 4} r={3} fill="var(--lang-ground)" stroke="var(--lang-ink)" strokeWidth={1.2} />
              {!geom.narrow && (
                <text x={L.main - 10} y={TIP_Y.main - 8} textAnchor="end" className="font-mono text-[8px] tracking-[0.1em]" fill="var(--lang-ink)">
                  NOW
                </text>
              )}
            </g>
          )}
          {(b === 'dyn' || b === 'macad') && (
            <circle className="nbg-mark" cx={L[b]} cy={TIP_Y[b] - 4} r={3} fill="var(--lang-ground)" stroke="var(--lang-ink)" strokeWidth={1.2} />
          )}
          {!geom.narrow && (
            <text
              className="nbg-mark font-mono text-[8px] tracking-[0.1em]"
              fill={litBranches?.has(b) ? 'var(--lang-ink)' : 'var(--lang-ink-muted)'}
              x={geom.labelAt[b].x}
              y={geom.labelAt[b].y}
              transform={`rotate(90 ${geom.labelAt[b].x} ${geom.labelAt[b].y})`}
            >
              {BRANCH_LABEL[b]}
            </text>
          )}
          {/* commit dots: pointer garnish only (the rows are the record) */}
          {items.map((it, i) => {
            if (itemBranch(it) !== b) return null
            const faded = !itemMatches(it, facet)
            return (
              <circle
                key={i}
                className="nbg-mark"
                cx={L[b]}
                cy={geom.ys[i]}
                r={it.type === 'entry' && it.e.kind === 'project' ? 2.8 : 2.2}
                fill="var(--lang-ink)"
                opacity={faded ? 0.18 : 1}
                style={{ pointerEvents: 'all', cursor: 'default' }}
                onPointerEnter={() => onDotHover(i)}
              />
            )
          })}
          {b === 'bim' && <circle className="nbg-mark" cx={L.bim} cy={geom.bimDotY} r={2.2} fill="var(--lang-ink)" />}
        </g>
      ))}
    </svg>
  )
}

// ---- Rows (the readable record; every link lives here) ---------------------

function projectOf(e: RegistryEntry) {
  return e.project ? PROJECTS_BY_SLUG[e.project] : undefined
}

function RowBody({ e }: { e: RegistryEntry }) {
  if (e.kind === 'project') {
    const p = projectOf(e)
    return (
      <div className="min-w-0">
        <p className="text-[15px] leading-6 font-semibold">
          {e.sheet ? (
            <Link
              to={e.sheet.route}
              viewTransition
              className="-m-2 p-2 text-[var(--lang-ink)] no-underline hover:underline hover:decoration-[var(--lang-interaction)] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
            >
              {e.title}
            </Link>
          ) : (
            e.title
          )}
        </p>
        {p?.dek && (
          <p className="mt-1 line-clamp-2 max-w-[62ch] font-serif text-[13.5px] leading-relaxed text-[var(--lang-ink-muted)]">
            {p.dek}
          </p>
        )}
      </div>
    )
  }
  if (e.kind === 'thought') {
    return (
      <p className="font-serif text-[15px] lowercase italic leading-relaxed text-[var(--lang-ink-muted)]">
        {e.note?.status === 'drafted' ? (
          <Link
            to={e.note.route}
            viewTransition
            className="-m-2 p-2 text-[var(--lang-ink-muted)] no-underline hover:text-[var(--lang-ink)] hover:underline hover:decoration-[var(--lang-interaction)] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            {e.title}
          </Link>
        ) : (
          e.title
        )}
      </p>
    )
  }
  if (e.kind === 'sheet') {
    // A publication event, worded warm since G1 retired the sheet tier: the
    // showcase opened. Single-issue months only (groups render below).
    return (
      <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
        <Link to={e.sheet!.route} viewTransition className={`-m-2 p-2 ${RED_LINK}`}>
          {e.title.toUpperCase()} — SHOWCASE OPENED ›
        </Link>
      </p>
    )
  }
  // Log lines (milestone/award/press/talk): milestones stay ink, the spine.
  return (
    <p className="font-mono text-[10px] tracking-[0.08em] leading-relaxed">
      <span className={e.kind === 'milestone' ? 'text-[var(--lang-ink)]' : 'text-[var(--lang-ink-muted)]'}>
        {e.title.toUpperCase()}
      </span>
    </p>
  )
}

function GroupBody({ sheets }: { sheets: RegistryEntry[] }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
      {sheets.map((s, i) => (
        <span key={s.id}>
          {i > 0 && ' · '}
          <Link to={s.sheet!.route} viewTransition className={`-my-2 -mx-1 px-1 py-2 ${RED_LINK}`}>
            {s.title.toUpperCase()}
          </Link>
        </span>
      ))}{' '}
      — SHOWCASES{' '}OPENED{' '}›
    </p>
  )
}

// ---- The field card (glass-2 garnish; everything it says is in the rows) ---

function FieldCard({ item, index, total }: { item: LogItem; index: number; total: number }) {
  const e = item.type === 'entry' ? item.e : undefined
  const title = e ? e.title : item.type === 'sheetGroup' ? item.sheets.map((s) => s.title).join(' · ') : ''
  const date = e ? e.date : (item as { date: string }).date
  const kind = e
    ? { project: '■ PROJECT', thought: '~ THOUGHT', milestone: '+ MILESTONE', award: '✦ RECOGNITION', press: '¶ PRESS', sheet: '# PUBLISHED', talk: '" TALK' }[e.kind]
    : '# PUBLISHED'
  const blurb = e
    ? e.kind === 'project'
      ? projectOf(e)?.dek
      : e.kind === 'thought'
        ? THOUGHT_OPENINGS[e.id]
        : undefined
    : undefined
  return (
    <aside
      aria-hidden="true"
      className="lang-glass-2 infocard-enter fixed right-4 bottom-4 left-4 z-30 rounded-[var(--r-sheet)] px-5 py-4 md:top-24 md:right-6 md:bottom-auto md:left-auto md:w-80"
    >
      <div className="flex justify-between gap-3 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
        <span>{date}</span>
        <span className="text-[var(--lang-ink)]">{kind}</span>
      </div>
      <p
        className={`mt-2 text-[16px] leading-snug font-semibold text-[var(--lang-ink)] ${
          e?.kind === 'thought' ? 'font-serif lowercase italic font-medium' : ''
        }`}
      >
        {title}
      </p>
      {blurb && (
        <p className="mt-1.5 font-serif text-[13px] leading-relaxed text-[var(--lang-ink-muted)]">{blurb}</p>
      )}
      <div className="mt-3 flex justify-between gap-3 border-t-[0.5px] border-[var(--lang-hairline)] pt-2.5 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
        <span>BRANCH · {BRANCH_NAME[itemBranch(item)].toUpperCase()}</span>
        <span>
          COMMIT {String(total - index).padStart(2, '0')} / {total}
        </span>
      </div>
    </aside>
  )
}

// ---- The page ---------------------------------------------------------------

const FACETS: { id: Facet | null; to: string; mark?: string; label: string }[] = [
  { id: null, to: '/notebook', label: 'ALL' },
  { id: 'projects', to: '/notebook#projects', mark: '■', label: 'PROJECTS' },
  { id: 'thoughts', to: '/notebook#thoughts', mark: '~', label: 'THOUGHTS' },
  { id: 'milestones', to: '/notebook#milestones', mark: '+', label: 'MILESTONES' },
]

export default function Notebook() {
  const { hash } = useLocation()
  const raw = hash.replace('#', '')
  const facet: Facet | null = raw === 'projects' || raw === 'thoughts' || raw === 'milestones' ? raw : null

  const prm = usePrefersReducedMotion()
  const items = collapseSheetIssues(timelineEntries())
  const total = items.reduce((n, it) => n + (it.type === 'sheetGroup' ? it.sheets.length : 1), 0)

  const stageRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const [geom, setGeom] = useState<Geom | null>(null)
  const [focusIdx, setFocusIdx] = useState<number | null>(null)

  // Measure the rows, draw the graph; remeasure on resize and once fonts
  // settle (row heights shift when the serif arrives).
  useLayoutEffect(() => {
    const stage = stageRef.current
    const list = listRef.current
    if (!stage || !list) return
    const rows = Array.from(list.children) as HTMLElement[]
    const build = () => setGeom(buildGeom(stage, rows, items))
    build()
    const ro = new ResizeObserver(build)
    ro.observe(stage)
    document.fonts?.ready.then(build).catch(() => {})
    return () => ro.disconnect()
    // items derives from the registry; its length is the real dependency.
  }, [items.length])

  const focused: LogItem | null = (focusIdx != null ? items[focusIdx] : null) ?? null
  let litBranches: Set<BranchId> | null = null
  if (focused) {
    litBranches = new Set<BranchId>([itemBranch(focused)])
    if (focused.type === 'entry') {
      const fork = FORKS[focused.e.id]
      if (fork) litBranches.add(fork)
    }
  }

  return (
    <SheetPage title="Notebook">
      <section className="pt-10 pb-2" aria-labelledby="notebook-heading">
        <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
          THE NOTEBOOK · THE RUNNING RECORD
        </p>
        {/* draftCopy: the h1 line is drafted in Emilie's voice, unsigned. */}
        <h1 id="notebook-heading" className="mt-3 mb-4 text-3xl font-semibold tracking-[-0.01em] text-[var(--lang-ink)]">
          The career, as a commit graph.
        </h1>

        <div className="-mx-1 flex flex-wrap" role="group" aria-label="Filter the record by kind">
          {FACETS.map((f) => (
            <FilterPill
              key={f.label}
              as={Link}
              to={f.to}
              viewTransition
              active={facet === f.id}
              aria-current={facet === f.id ? 'true' : undefined}
              className="px-1"
            >
              {f.mark && <span aria-hidden="true">{f.mark}&nbsp;</span>}
              {f.label}
            </FilterPill>
          ))}
        </div>

        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]" aria-live="polite">
          <span aria-hidden="true">■ PROJECT · ~ THOUGHT · + MILESTONE · ✦ AWARD · ¶ PRESS</span>
          <span className="text-[var(--lang-interaction)]">ONE RED TIP = LIVE</span>
          <span className="ml-auto">
            {total} ENTRIES · 2021 › NOW{facet ? ` · ${facet.toUpperCase()}` : ''}
          </span>
        </p>
      </section>

      <div
        ref={stageRef}
        className="relative mt-2 grid grid-cols-[84px_minmax(0,1fr)] gap-x-3 pb-16 md:grid-cols-[250px_minmax(0,1fr)] md:gap-x-10"
      >
        <div className="relative" aria-hidden="false">
          {geom && (
            <CommitGraph
              geom={geom}
              items={items}
              facet={facet}
              litBranches={litBranches}
              drawIn={!prm}
              onDotHover={setFocusIdx}
              onLeave={() => setFocusIdx(null)}
            />
          )}
        </div>

        <ol
          ref={listRef}
          className="list-none p-0 pt-16"
          onPointerLeave={() => setFocusIdx(null)}
          onBlur={() => setFocusIdx(null)}
        >
          {items.map((it, i) => {
            const isLog = it.type === 'entry' && LOG_KINDS.has(it.e.kind)
            const dimmed = !itemMatches(it, facet)
            return (
              <li
                key={it.type === 'entry' ? it.e.id : `pub-${it.date}`}
                onPointerEnter={() => setFocusIdx(i)}
                onFocus={() => setFocusIdx(i)}
                className={`grid grid-cols-[60px_20px_minmax(0,1fr)] items-baseline gap-x-3 rounded-[var(--r-control)] border-t-[0.5px] border-[var(--lang-hairline)] first:border-t-0 transition-opacity duration-200 sm:grid-cols-[60px_20px_minmax(0,1fr)_5rem] ${
                  isLog ? 'py-2' : 'py-3'
                } ${dimmed ? 'opacity-25' : ''} ${focusIdx === i ? 'bg-[var(--lang-glass-1)]' : ''}`}
              >
                <span className="font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
                  {it.type === 'entry' ? it.e.date : it.date}
                </span>
                <span className="text-center font-mono text-[10px]">
                  <KindMark kind={it.type === 'entry' ? it.e.kind : 'sheet'} />
                </span>
                {it.type === 'entry' ? <RowBody e={it.e} /> : <GroupBody sheets={it.sheets} />}
                <span className="hidden text-right font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)] sm:block">
                  {it.type === 'entry' && it.e.kind === 'project' && it.e.sheet
                    ? it.e.sheet.number
                    : it.type === 'entry' && it.e.kind === 'thought' && it.e.note
                      ? it.e.note.number
                      : ''}
                </span>
              </li>
            )
          })}
        </ol>

        {focused && focusIdx != null && geom && !geom.narrow && (
          // Commit numbering counts ITEMS (a same-month publication group is
          // one commit), so the card can never outrun the drawing. Desktop
          // garnish only: on a phone it would sit over the record it repeats
          // (the rows already carry the dek / opening).
          <FieldCard key={focusIdx} item={focused} index={focusIdx} total={items.length} />
        )}
      </div>
    </SheetPage>
  )
}
