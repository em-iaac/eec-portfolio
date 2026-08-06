// THE SHARE CARDS (S3, 2026-07-13; REDESIGN-SPEC R9, CONTENT-STRATEGY D6).
// /print/og/:cardKey renders ONE 1200x630 Open Graph card that
// scripts/prerender.mjs screenshots into /og/<cardKey>.png at build time:
//   work-<id>    one per project (title, the claim line, the recognition
//                line where real, the quiet P-number)
//   thought-<id> one per thought note (the lowercase serif title, the
//                signed opening, the quiet T-number)
//   pillar       the Behavior Information Modeling definition card
// Pen Table grammar (R9): the light ground og.png uses (DL section 4.5),
// ink type, the constellation cube with its one red node, NO lens colour
// (colour never travels without its shape tick, and a share card has no
// tick). All text is read from the registry + master files: the card is a
// RENDITION, nothing is authored here (THE ECONOMY).
// Print-surface rules (G5): unlinked, noindexed (usePrintDoc belt +
// robots.txt /print/ braces), lazy, outside the Chrome wrapper.
import { type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import LogoMark from '../components/LogoMark'
import usePrintDoc from './usePrintDoc'
import { ENTRIES } from '../data/registry'
import { workEntryById } from '../data/work'
import { THOUGHT_OPENINGS } from '../thoughts/openings'
import { PILLAR_PATH, PILLAR_PHRASE } from '../lib/pillar'
import { VOICE } from '../landing/identity'
import { MIND, THREADS, spline, starPath } from '../landing/mindGraph'
import { printImageSrc } from './printImage'
import { WORK_ARTIFACTS } from '../components/work/artifacts'
import {
  AdjacencyFigure,
  BimFigure,
  ComfortFigure,
  ComputationFigure,
  DrawifaceFigure,
  EvosearchFigure,
  ExperienceFigure,
  ExplainFigure,
  GenaiFigure,
  HeritageFigure,
  LatentFigure,
  LlmFigure,
  NeuroaesFigure,
  RespondFigure,
  ScoreFigure,
  SolversFigure,
  XrealFigure,
} from '../thoughts/figures'

// EACH CARD NOW SHOWS THE THING IT IS ABOUT (Emilie, 2026-08-06: "revise the og
// cards of all possible links design to actually use the svg design of the
// thoughts and the cover of the projects, and the main website og cards").
//
// Before this every card, project and thought alike, carried a slice of the
// same mind graph. It was a real idea and it had one flaw she is naming: at
// thumbnail size in a feed, 40 cards of the same grey constellation are 40
// identical cards. A share card's whole job is to be recognisable before it is
// read, and the site already owns two things that do that instantly.
//
//   A THOUGHT gets its own PLATE, the ink figure that already opens the note.
//   A PROJECT gets its COVER, the same image the tile reveals and the book
//   prints, at the print rung.
//
// The mind-graph slice survives for the pillar and the landing, which are about
// the whole record rather than one piece of it, so there the constellation IS
// the subject.
const THOUGHT_PLATE: Record<string, ReactNode> = {
  bim: BimFigure,
  neuroaes: NeuroaesFigure,
  solvers: SolversFigure,
  genai: GenaiFigure,
  xreal: XrealFigure,
  comfort: ComfortFigure,
  drawiface: DrawifaceFigure,
  evosearch: EvosearchFigure,
  heritage: HeritageFigure,
  respond: RespondFigure,
  explain: ExplainFigure,
  adjacency: AdjacencyFigure,
  learning: ExperienceFigure,
  llm: LlmFigure,
  latent: LatentFigure,
  scoring: ScoreFigure,
  rules: ComputationFigure,
  // `charcoal` is deliberately absent: it is the one note whose figures are her
  // actual charcoal drawings rather than a drawn plate, so it keeps the graph
  // slice. A missing key falls back, it never renders blank.
}

// THE CARD'S PICTURE (2026-07-26). Every one of the 36 share cards used to
// carry the same EEC mark, so a Sensi link and a thought link looked identical
// in a feed. Each card now shows THAT ENTRY'S OWN CORNER of the mind graph:
// the same drawing, framed on the node the card is about, with that node lit.
//
// It is a CAMERA on the frozen model, exactly like the phone (DL §10): no
// coordinate moves, nothing new is drawn on the artwork, and it costs the
// runtime site nothing because these render only under the build's prerender.
const SLICE_W = 560
const SLICE_H = 420

function GraphSlice({ nodeId }: { nodeId: string }) {
  const focus = MIND.nodes.find((n) => n.id === nodeId)
  // The pillar and anything unmapped get the whole field, centred.
  const cx = focus ? focus.x : 720
  const cy = focus ? focus.y : 430
  const x = cx - SLICE_W / 2
  const y = cy - SLICE_H / 2
  return (
    <svg
      viewBox={`${x} ${y} ${SLICE_W} ${SLICE_H}`}
      width={SLICE_W}
      height={SLICE_H}
      aria-hidden="true"
      style={{ overflow: 'hidden' }}
    >
      {THREADS.map((t) => (
        <path
          key={t.id}
          d={spline(t.pts)}
          fill="none"
          stroke="var(--lang-ink)"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.26}
        />
      ))}
      {MIND.nodes.map((n) => {
        const lit = n.id === nodeId
        const fill = lit ? 'var(--lang-interaction)' : 'var(--lang-ink)'
        if (n.award) return <path key={n.id} d={starPath(n.x, n.y, lit ? 9 : 6)} fill={fill} />
        if (n.kind === 'project')
          return <circle key={n.id} cx={n.x} cy={n.y} r={lit ? 7 : 4} fill={fill} />
        return (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={lit ? 6.5 : 3.6}
            fill="none"
            stroke={fill}
            strokeWidth={lit ? 2.4 : 1.5}
          />
        )
      })}
    </svg>
  )
}

interface CardData {
  kicker: string
  title: string
  /** thoughts + the pillar speak in the thinking voice (serif lowercase italic) */
  serifTitle: boolean
  line: string
  recognition?: string
  path: string
  /** the registry id whose corner of the drawing this card frames */
  nodeId?: string
  /** a thought's own ink plate, when it has one */
  plate?: ReactNode
  /** a project's cover, at the print rung */
  cover?: { src: string; alt: string }
}

function coverOf(entry: { cover?: { slug: string; name: string; alt?: string }; title: string }) {
  if (!entry.cover) return undefined
  const src = printImageSrc(entry.cover.slug, entry.cover.name)
  return src ? { src, alt: entry.cover.alt ?? entry.title } : undefined
}

function cardFor(cardKey: string): CardData | null {
  const work = cardKey.match(/^work-(.+)$/)
  if (work) {
    const entry = workEntryById(work[1]!)
    if (!entry) return null
    return {
      kicker: `WORK · ${entry.number}`,
      title: entry.title,
      serifTitle: false,
      line: entry.question ?? entry.dek,
      recognition: entry.recognition,
      path: `emiliechidiac.com/work/${entry.id}`,
      nodeId: entry.id,
      // THE INK PLATE, NOT THE PHOTOGRAPH. Both were built and rendered as real
      // cards before choosing. The plate wins on three counts: it is line art on
      // the same ground so it composes with the type instead of needing a mask
      // to keep the words legible; it matches the thought plates, so all 41
      // cards read as ONE family rather than projects looking like a different
      // site; and it is the mark /work itself rests on, where the photograph is
      // the hover reveal, not the identity. It is also a fifth of the weight
      // (76KB against 362KB for Sensi).
      plate: WORK_ARTIFACTS[entry.id],
      // The photograph stays reachable for anything that wants it later.
      cover: coverOf(entry),
    }
  }
  const thought = cardKey.match(/^thought-(.+)$/)
  if (thought) {
    const entry = ENTRIES.find(
      (e) => e.kind === 'thought' && e.id === thought[1] && e.note?.status === 'drafted',
    )
    const opening = THOUGHT_OPENINGS[thought[1]!]
    if (!entry || !opening) return null
    return {
      kicker: `THOUGHT · ${entry.note!.number ?? 'NOTE'}`,
      title: entry.title,
      serifTitle: true,
      line: opening,
      path: `emiliechidiac.com/thoughts/${entry.id}`,
      nodeId: entry.id,
      plate: THOUGHT_PLATE[entry.id],
    }
  }
  if (cardKey === 'pillar') {
    return {
      kicker: 'THE SPINE',
      title: PILLAR_PHRASE.toLowerCase(),
      serifTitle: true,
      line: 'How a space will make someone feel, treated as design data: scored, modeled, argued with before anything is built.',
      path: `emiliechidiac.com${PILLAR_PATH}`,
    }
  }
  // THE MAIN SITE CARD (her third item, 2026-08-06). Every address without a
  // card of its own has been falling back to `public/og.png`, a hand-made file
  // from 2026-07-12 that no build regenerates: it cannot follow a rename, a
  // re-signed line or a palette change, and nothing fails when it drifts. It is
  // a generated card now, like the other forty, and it keeps the constellation
  // because the landing IS the whole record rather than one piece of it.
  if (cardKey === 'home') {
    return {
      kicker: 'DESIGN TECHNOLOGY ARCHITECT',
      title: 'Emilie El Chidiac',
      serifTitle: false,
      line: VOICE,
      path: 'emiliechidiac.com',
    }
  }
  return null
}

export default function OgRoute() {
  const { cardKey = '' } = useParams()
  const card = cardFor(cardKey)
  const ready = usePrintDoc('Share card')

  if (!card) return null

  return (
    // The card pins the LIGHT ground like og.png (DL 4.5): share cards live
    // on other sites' feeds, where the mark's documented home is the light
    // pair. Fixed 1200x630: the screenshot IS the layout.
    <div
      data-theme="light"
      data-print-ready={ready ? '' : undefined}
      className="relative flex flex-col overflow-hidden bg-[var(--lang-ground)] text-[var(--lang-ink)]"
      style={{ width: 1200, height: 630, padding: '64px 72px 56px' }}
    >
      {/* The drawing sits BEHIND the words, bled off the right edge: the card
          is read at thumbnail size in a feed, so the picture has to register as
          texture before anything else resolves. Low opacity keeps the title at
          full contrast (the AA floor applies here too). */}
      {/* THE PICTURE. A project shows its cover, a thought shows its plate, and
          anything about the whole record keeps the constellation. Each sits in
          the same corner at the same weight, so the family still reads as one
          set at thumbnail size. */}
      {card.plate ? (
        // The plate is line art on the same ground, so it needs no fade and no
        // mask: it is drawn at 300x170 and blown up to fill the right half,
        // which is what a vector is for.
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 92,
            right: -34,
            width: 660,
            opacity: 0.9,
            pointerEvents: 'none',
          }}
          className="og-plate"
        >
          {card.plate}
        </div>
      ) : card.cover ? (
        // A PHOTOGRAPH is masked to a soft edge rather than faded flat: at 0.5
        // opacity a photo turns to grey mud and stops being recognisable, which
        // would defeat the point of showing it. Full strength, dissolving into
        // the ground on the two sides the words come from. Only reached by a
        // project with no ink plate of its own.
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 640,
            height: 630,
            pointerEvents: 'none',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, #000 190px), linear-gradient(to top, transparent 0, #000 150px)',
            maskImage:
              'linear-gradient(to right, transparent 0, #000 190px), linear-gradient(to top, transparent 0, #000 150px)',
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
          }}
        >
          <img
            src={card.cover.src}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            right: -60,
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        >
          <GraphSlice nodeId={card.nodeId ?? ''} />
        </div>
      )}

      <div className="relative flex items-center justify-between">
        <LogoMark size={64} />
        <span className="font-mono text-[16px] tracking-[0.14em] text-[var(--lang-ink-muted)]">
          EMILIE EL CHIDIAC
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col justify-end">
        <p className="font-mono text-[17px] tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase">
          {card.kicker}
        </p>
        {card.serifTitle ? (
          <h1 className="mt-4 max-w-[18ch] font-serif text-[64px] leading-[1.12] font-medium lowercase italic tracking-[-0.01em]">
            {card.title}
          </h1>
        ) : (
          <h1 className="mt-4 max-w-[16ch] text-[72px] leading-[1.05] font-semibold tracking-[-0.02em]">
            {card.title}
          </h1>
        )}
        <p
          className="mt-5 max-w-[44ch] font-serif text-[27px] leading-[1.4] text-[var(--lang-ink-muted)]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {card.line}
        </p>
        {card.recognition && (
          <p className="mt-5 font-mono text-[16px] tracking-[0.1em] text-[var(--lang-ink)]">
            <span aria-hidden="true">✦ </span>
            {card.recognition}
          </p>
        )}
      </div>

      <div className="mt-10 flex items-baseline justify-between border-t-[0.5px] border-[var(--lang-hairline)] pt-5">
        <span className="font-mono text-[15px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
          {card.path}
        </span>
        <span className="font-mono text-[15px] tracking-[0.14em] text-[var(--lang-ink-muted)]">
          DESIGN TECHNOLOGY ARCHITECT
        </span>
      </div>
    </div>
  )
}
