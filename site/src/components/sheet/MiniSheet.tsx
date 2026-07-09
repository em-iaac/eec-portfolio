// The enriched IN PREPARATION placeholder (Session 5). Every sheet route whose
// status is in-preparation renders this instead of a bare stamp: the project
// blurb, the figures already in the pipeline, its tags, every working link,
// and a link to the mind graph (the landing). It reuses the sheet frame
// (SheetLayout) and adds no furniture beyond it; mono stays <= 0.875rem and no
// lens tick ever shows without its label (governance rules 2, 5, 6).
import { Link } from 'react-router-dom'
import SheetLayout, { SheetLabel } from './SheetLayout'
import SheetFigure from './SheetFigure'
import { LensTick, LENSES } from '../Lens'
import { ENTRIES, type RegistryEntry } from '../../data/registry'
import { PROJECTS_BY_SLUG } from '../../data/projects'
import manifest from '../../data/images.json'

type ImgEntry = { name: string; role: string }

const RED_LINK =
  'text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

// Slugs referenced by more than one registry project (only 'professional'
// today: SOMA + Marsception share a folder). For those, a placeholder shows
// only its own named figure, never the neighbour's.
const SHARED_SLUGS = (() => {
  const count = new Map<string, number>()
  for (const e of ENTRIES) {
    if (e.image) count.set(e.image.slug, (count.get(e.image.slug) ?? 0) + 1)
  }
  return new Set([...count].filter(([, n]) => n > 1).map(([slug]) => slug))
})()

// Up to four figures already available for this project, hero first.
function figuresFor(entry: RegistryEntry): { slug: string; name: string }[] {
  const slug = entry.image?.slug
  if (!slug) return []
  const all = (manifest as Record<string, ImgEntry[]>)[slug] ?? []
  const pool = SHARED_SLUGS.has(slug)
    ? all.filter((i) => i.name === entry.image?.name)
    : all
  return pool.slice(0, 4).map((i) => ({ slug, name: i.name }))
}

const figCaption = (name: string, i: number) =>
  `FIG. ${String(i + 1).padStart(2, '0')} · ${name.replace(/-/g, ' ').toUpperCase()}`

export default function MiniSheet({ entry }: { entry: RegistryEntry }) {
  const number = entry.sheet!.number
  const p = entry.project ? PROJECTS_BY_SLUG[entry.project] : undefined
  const figures = figuresFor(entry)

  // Every working link, project first, registry extras deduped by href.
  const links = [...(p?.links ?? [])]
  for (const l of entry.links ?? []) {
    if (!links.some((x) => x.href === l.href)) links.push(l)
  }

  return (
    <SheetLayout
      sheetNo={number}
      title={entry.title}
      navLabel={`EMILIE EL CHIDIAC · WORK / ${entry.title.toUpperCase()} · SHEET ${number}`}
      metaLeft={`EL CHIDIAC, E. · ${number}`}
      metaRight="STATUS: IN PREPARATION"
      footerLeft={p?.tech ?? ''}
      footerRight={`${number} · 0 OF 1`}
    >
      {/* Status is a fact, not an interaction: the stamp is ink (dashed,
          drafting-style), never redline. */}
      <div className="mb-5 inline-block border border-dashed border-ink px-5 py-3 font-mono text-[10px] tracking-[0.12em] text-ink">
        SHEET: IN PREPARATION
      </div>

      {/* Lens + course + award, one mono row; tick never without its label. */}
      {(entry.lens || p?.meta || p?.award) && (
        <div className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.08em] text-anno">
          {entry.lens && (
            <span className="inline-flex items-center gap-1.5">
              <LensTick lens={entry.lens} size={8} />
              {LENSES[entry.lens].label.toUpperCase()}
            </span>
          )}
          {p?.meta && (
            <>
              <span aria-hidden="true">·</span>
              <span>{p.meta}</span>
            </>
          )}
          {p?.award && (
            <>
              <span aria-hidden="true">·</span>
              {/* Awards are status, not interaction: ink (rule 1). */}
              <span className="font-medium text-ink">{p.award}</span>
            </>
          )}
          {p?.stat && (
            <>
              <span aria-hidden="true">·</span>
              {/* The one defensible number (Session 7): status, anno ink. */}
              <span>{p.stat}</span>
            </>
          )}
        </div>
      )}

      {p && (
        <p className="mb-5 max-w-[62ch] font-serif text-[15.5px] leading-[1.65]">{p.blurb}</p>
      )}

      {/* The honest "still being written" line, Emilie's voice. Approved
          Session 11 (rolling batch #1). */}
      <p className="mb-6 max-w-[62ch] font-serif text-[14px] leading-relaxed text-anno italic">
        The full sheet is still on the drawing board. Until it is issued, here is
        the short version: the figures so far, and every link that already works.
      </p>

      {figures.length > 0 && (
        <div className="mb-6 grid gap-x-9 gap-y-8 sm:grid-cols-2">
          {figures.map((f, i) => (
            <SheetFigure
              key={f.name}
              slug={f.slug}
              name={f.name}
              alt={entry.image?.alt ?? entry.title}
              caption={figCaption(f.name, i)}
            />
          ))}
        </div>
      )}

      {entry.tags.length > 0 && (
        <div className="mb-6">
          <SheetLabel>TAGS</SheetLabel>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <span
                key={t}
                className="border border-ink/30 px-2 py-1 font-mono text-[9px] tracking-[0.08em] text-anno"
              >
                {t.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/20 pt-5 font-mono text-[10px] tracking-[0.1em]">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`-m-2 p-2 ${RED_LINK}`}
          >
            {l.label}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        ))}
        {entry.explore && (
          <Link to="/" className={`-m-2 p-2 ${RED_LINK}`}>
            SEE IT IN THE MIND &gt;
          </Link>
        )}
        <Link to="/notebook" viewTransition className={`-m-2 p-2 ${RED_LINK}`}>
          BACK TO THE NOTEBOOK &gt;
        </Link>
      </div>
    </SheetLayout>
  )
}
