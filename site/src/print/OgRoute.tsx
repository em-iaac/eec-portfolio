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
import { useParams } from 'react-router-dom'
import LogoMark from '../components/LogoMark'
import usePrintDoc from './usePrintDoc'
import { ENTRIES } from '../data/registry'
import { workEntryById } from '../data/work'
import { THOUGHT_OPENINGS } from '../thoughts/openings'
import { PILLAR_PATH, PILLAR_PHRASE } from '../lib/pillar'
import { MIND, THREADS, spline, starPath } from '../landing/mindGraph'

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
