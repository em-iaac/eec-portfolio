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

interface CardData {
  kicker: string
  title: string
  /** thoughts + the pillar speak in the thinking voice (serif lowercase italic) */
  serifTitle: boolean
  line: string
  recognition?: string
  path: string
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
      className="flex flex-col overflow-hidden bg-[var(--lang-ground)] text-[var(--lang-ink)]"
      style={{ width: 1200, height: 630, padding: '64px 72px 56px' }}
    >
      <div className="flex items-center justify-between">
        <LogoMark size={64} />
        <span className="font-mono text-[16px] tracking-[0.14em] text-[var(--lang-ink-muted)]">
          EMILIE EL CHIDIAC
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end">
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
