// THE NOTEBOOK bench roll: the research record as a horizontal drawing roll.
// A year axis runs the length of the strip; the redline NOW marker sits at
// the live (left) edge and history unrolls to the right. Entry kinds are
// told apart by shape + type, never color (rule 2 analog): sheets/projects
// are bordered cards above the axis, thoughts hang below in serif italic,
// milestones and awards are mono log lines with distinct axis markers.
// Motion tier: WHISPER · no entry ceremonies; card images run the shared
// develop-once ceremony (Session 5) as they scroll into view.
// Below md the same record renders as a vertical feed.
import {
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import Img from './Img'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { timelineEntries, type RegistryEntry } from '../data/registry'
import { PROJECTS_BY_SLUG } from '../data/projects'

const RED_LINK =
  'text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

// Above-axis zone height; every column shares it so the axis stays straight.
const ABOVE = 'h-56'

type RollItem =
  | { type: 'entry'; entry: RegistryEntry }
  | { type: 'year'; year: string }

function buildItems(entries: RegistryEntry[]): RollItem[] {
  const items: RollItem[] = []
  let year: string | null = null
  for (const e of entries) {
    const y = e.date.slice(0, 4)
    if (y !== year) {
      items.push({ type: 'year', year: y })
      year = y
    }
    items.push({ type: 'entry', entry: e })
  }
  return items
}

function entryTarget(e: RegistryEntry): { to?: string; href?: string } {
  if (e.sheet) return { to: e.sheet.route }
  const p = e.project ? PROJECTS_BY_SLUG[e.project] : undefined
  const ext = e.links?.[0] ?? p?.links[0]
  if (ext) return { href: ext.href }
  return { to: '/notebook' }
}

function DateLabel({ e }: { e: RegistryEntry }) {
  return (
    <span className="font-mono text-[8.5px] tracking-[0.08em] text-anno">{e.date}</span>
  )
}

function AxisTick({ kind }: { kind: RegistryEntry['kind'] }) {
  if (kind === 'milestone') {
    return <span aria-hidden="true" className="-mt-[2px] block size-[5px] bg-ink" />
  }
  if (kind === 'award' || kind === 'talk' || kind === 'press') {
    return <span aria-hidden="true" className="-mt-[3px] block size-[7px] rounded-full border border-ink bg-mylar" />
  }
  return <span aria-hidden="true" className="block h-2 w-px bg-ink/50" />
}

function ProjectCardMini({ e }: { e: RegistryEntry }) {
  const target = entryTarget(e)
  const inner = (
    <>
      {e.image && (
        <div className="aspect-[4/3] overflow-hidden border-b border-ink/35">
          <Img
            slug={e.image.slug}
            name={e.image.name}
            alt={e.image.alt}
            sizes="224px"
            develop
            className="block h-full w-full object-cover"
          />
        </div>
      )}
      <p className="flex items-baseline justify-between gap-2 px-2 py-1.5 font-mono text-[8.5px] tracking-[0.08em]">
        <span className="truncate font-medium text-ink">{e.title.toUpperCase()}</span>
        {e.sheet && (
          <span className={e.sheet.status === 'issued' ? 'shrink-0 text-ink' : 'shrink-0 text-anno'}>
            {e.sheet.status === 'issued' ? e.sheet.number : 'IN PREP'}
          </span>
        )}
      </p>
    </>
  )
  const cls =
    'group block w-56 border border-ink/35 bg-mylar no-underline focus-visible:outline-2 focus-visible:outline-redline'
  return target.to ? (
    <Link to={target.to} viewTransition className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={target.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  )
}

function RollColumn({ e }: { e: RegistryEntry }) {
  const isThought = e.kind === 'thought'
  const width =
    e.kind === 'project' ? 'w-56' : isThought ? 'w-44' : e.kind === 'sheet' ? 'w-52' : 'w-48'

  let above: ReactNode = null
  if (e.kind === 'project') {
    above = <ProjectCardMini e={e} />
  } else if (e.kind === 'sheet') {
    above = (
      <p className="font-mono text-[9px] leading-relaxed tracking-[0.08em]">
        <Link to={e.sheet!.route} viewTransition className={`-m-2 p-2 ${RED_LINK}`}>
          SHEET {e.sheet!.number} ISSUED &gt;
        </Link>
        <br />
        <span className="text-anno">{e.title.toUpperCase()}</span>
      </p>
    )
  } else if (e.kind === 'milestone') {
    above = (
      <p className="font-mono text-[9px] leading-relaxed tracking-[0.08em] font-medium text-ink">
        {e.title.toUpperCase()}
      </p>
    )
  } else if (!isThought) {
    const prefix = e.kind.toUpperCase()
    above = (
      <p className="line-clamp-3 font-mono text-[9px] leading-relaxed tracking-[0.08em]">
        <span className="font-medium text-ink">{prefix} · </span>
        <span className="text-anno">{e.title.toUpperCase()}</span>
      </p>
    )
  }

  return (
    <li className={`flex ${width} shrink-0 snap-start flex-col`}>
      <div className={`flex ${ABOVE} flex-col justify-end pb-3`}>{above}</div>
      <div className="flex flex-col items-start">
        <AxisTick kind={e.kind} />
        <div className="pt-1.5">
          <DateLabel e={e} />
          {isThought && (
            <p className="mt-1 max-w-full font-serif text-[14px] italic leading-snug text-anno">
              {e.title}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

function YearColumn({ year }: { year: string }) {
  return (
    <li aria-hidden="true" className="flex w-6 shrink-0 snap-start flex-col">
      <div className={ABOVE} />
      <div className="flex flex-col items-start">
        <span className="-mt-2 block h-4 w-px bg-ink/50" />
        <span className="pt-1.5 font-mono text-[10px] font-medium tracking-[0.08em] text-ink">
          {year}
        </span>
      </div>
    </li>
  )
}

function NowColumn() {
  return (
    <li className="flex w-12 shrink-0 snap-start flex-col">
      <div className={ABOVE} />
      <div className="flex flex-col items-start">
        {/* Rule 9: redline marks the live edge of the record */}
        <span aria-hidden="true" className="-mt-[3px] block size-[7px] rounded-full bg-redline-stroke" />
        <span className="pt-1.5 font-mono text-[9px] tracking-[0.12em] text-redline">NOW</span>
      </div>
    </li>
  )
}

// ---- Mobile feed (same record, vertical) -----------------------------------

function FeedRow({ e }: { e: RegistryEntry }) {
  let body: ReactNode
  if (e.kind === 'project') {
    body = <ProjectCardMini e={e} />
  } else if (e.kind === 'thought') {
    body = <p className="font-serif text-[15px] italic leading-snug text-anno">{e.title}</p>
  } else if (e.kind === 'sheet') {
    body = (
      <p className="font-mono text-[9px] tracking-[0.08em]">
        <Link to={e.sheet!.route} viewTransition className={`-m-2 p-2 ${RED_LINK}`}>
          SHEET {e.sheet!.number} ISSUED: {e.title.toUpperCase()} &gt;
        </Link>
      </p>
    )
  } else {
    body = (
      <p className="font-mono text-[9px] leading-relaxed tracking-[0.08em]">
        {e.kind !== 'milestone' && <span className="font-medium text-ink">{e.kind.toUpperCase()} · </span>}
        <span className={e.kind === 'milestone' ? 'font-medium text-ink' : 'text-anno'}>
          {e.title.toUpperCase()}
        </span>
      </p>
    )
  }
  return (
    <li className="relative border-l border-ink/35 pb-6 pl-5">
      <span aria-hidden="true" className="absolute top-1 -left-px block h-px w-3 bg-ink/50" />
      <p className="mb-1.5 font-mono text-[8.5px] tracking-[0.08em] text-anno">{e.date}</p>
      {body}
    </li>
  )
}

// ---- The roll ---------------------------------------------------------------

export default function BenchRoll() {
  const prm = usePrefersReducedMotion()
  const scroller = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })

  const entries = timelineEntries()
  const items = buildItems(entries)
  const newestYear = entries[0]?.date.slice(0, 4)

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = scroller.current
    if (!el) return
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }
    el.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: PointerEvent) {
    const d = drag.current
    const el = scroller.current
    if (!d.active || !el) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 5) d.moved = true
    el.scrollLeft = d.startLeft - dx
  }
  function endDrag(e: PointerEvent) {
    if (drag.current.active && scroller.current?.hasPointerCapture(e.pointerId)) {
      scroller.current.releasePointerCapture(e.pointerId)
    }
    drag.current.active = false
  }
  // A drag must not fire the card link it started on.
  function onClickCapture(e: MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }
  function onKeyDown(e: KeyboardEvent) {
    const el = scroller.current
    if (!el) return
    const behavior: ScrollBehavior = prm ? 'auto' : 'smooth'
    if (e.key === 'ArrowRight') {
      el.scrollBy({ left: 320, behavior })
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      el.scrollBy({ left: -320, behavior })
      e.preventDefault()
    } else if (e.key === 'Home') {
      el.scrollTo({ left: 0, behavior })
      e.preventDefault()
    } else if (e.key === 'End') {
      el.scrollTo({ left: el.scrollWidth, behavior })
      e.preventDefault()
    }
  }

  return (
    <section aria-labelledby="notebook-roll-heading" className="border-t border-ink/20 pt-7 pb-10">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="notebook-roll-heading" className="font-mono text-[11px] tracking-[0.12em] text-anno">
          THE NOTEBOOK / 2021 &gt; NOW
        </h2>
        <p className="font-mono text-[10px] tracking-[0.06em]">
          <Link to="/notebook" viewTransition className={RED_LINK}>
            FULL NOTEBOOK: ALL ENTRIES &gt;
          </Link>
        </p>
      </div>

      {/* Desktop: the roll. Newest at the left edge; drag, scroll, or arrow
          through time. The thin scrollbar is the progress rule. */}
      <div
        ref={scroller}
        role="region"
        aria-label="Notebook timeline; newest entries first, scrolls horizontally"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className="bench-scroll bench-fade hidden cursor-grab snap-x snap-proximity overflow-x-auto overscroll-x-contain pb-2 select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-redline md:block"
      >
        <div className="relative w-max">
          {/* The axis rule, aligned to the boundary of every column's above-zone */}
          <div aria-hidden="true" className="absolute inset-x-0 top-56 h-px bg-ink/35" />
          <ul className="m-0 flex list-none gap-8 p-0 pr-10 pl-1">
            <NowColumn />
            {newestYear && <YearColumn year={newestYear} />}
            {items
              .filter((it, i) => !(it.type === 'year' && i === 0))
              .map((it) =>
                it.type === 'year' ? (
                  <YearColumn key={`y-${it.year}`} year={it.year} />
                ) : (
                  <RollColumn key={it.entry.id} e={it.entry} />
                ),
              )}
          </ul>
        </div>
      </div>

      {/* Mobile: the same record as a vertical feed (most recent first) */}
      <ul className="m-0 list-none p-0 md:hidden">
        {entries.slice(0, 6).map((e) => (
          <FeedRow key={e.id} e={e} />
        ))}
        <li className="border-l border-ink/35 pl-5 font-mono text-[10px] tracking-[0.06em]">
          <Link to="/notebook" viewTransition className={RED_LINK}>
            FULL NOTEBOOK &gt;
          </Link>
        </li>
      </ul>
    </section>
  )
}
