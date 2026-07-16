// G5 · THE A4 BOOK (REDESIGN-SPEC §10, re-designed in the current brand for
// print). One A4-landscape page per flagship project, reading the SAME
// master content files as the site (the spine WHAT / WHY / HOW / WHAT CAME
// OF IT, the dek, the woven credits, the award recognition), an INDEX page
// over the WORK grid's own data + the registry's thoughts, a CV tail from
// cv.ts, and a colophon. Nothing is authored here; it is composed here.
//
// These components are deliberately router-free and hook-light: the census
// test renderToString's them directly, and headless Chrome prints them.
// Variants (cover, index) exist for the design gates and collapse to
// Emilie's pick when she signs.
import type { ReactNode } from 'react'
import LogoMark from '../components/LogoMark'
import { LENSES, LensTick, type Lens } from '../components/Lens'
import { VOICE } from '../landing/identity'
import { MIND, THREADS, VIEWBOX, spline, starPath } from '../landing/mindGraph'
import { MASTERS_BY_SLUG } from '../content/projects'
import { thoughtIndexEntries } from '../data/registry'
import { WORK_ENTRIES } from '../data/work'
import ThoughtIndexRows, { fmtMonthYear } from '../components/ThoughtIndexRows'
import { EDUCATION, EXPERIENCE, AWARDS, SKILLS, LANGUAGES, CERTIFICATES, UPDATED } from '../data/cv'
import A4Page, { sideOf, type PageSide } from './A4Page'
import { BOOK_SPREADS, type SpreadData } from './bookContents'
import { printImageSrc } from './printImage'

// The design gates (Emilie, 2026-07-12, this session) collapsed the
// exploration variants to her picks: cover = THE MIND ON PAPER (the landing
// artwork, ink on white) · spread = THE PLATE (image across the top) ·
// index = TILES (the WORK grid's manner) · colophon kept with the signed
// caption. The imageless-spread fallback below survives as protection, not
// as a variant.
//
// draftCopy (G5, pending Emilie's sign-off; every other line on these pages
// is signed content rendered verbatim): the SUBTITLE composition below, the
// structural labels PORTFOLIO · 2026, Index, THE THOUGHTS, ✦ RECOGNITION,
// LISTEN, THE FULL RECORD, the PLATE NN caption grammar (the §5 family rule
// applied to a new surface), and /work's DOWNLOAD THE BOOK (PDF).

const SITE = 'emiliechidiac.com'

const NAME = 'Emilie El Chidiac'
// draftCopy: the cover subtitle COMPOSES the locked anchor title
// ("Design Technology Architect", the CV header string) with the landing's
// signed positioning line (landing/identity.ts). Both pieces are signed;
// the join is new and needs Emilie's nod.
const SUBTITLE = `Design Technology Architect. ${VOICE}`
// The cover rail's award fact is the SIGNED award line from the Sensi
// master, never authored here (the spec-era fact line retired with the
// landing's G4 wording; the record is the single source).
const AWARD_FACT = MASTERS_BY_SLUG['sensi']?.award ?? ''

// The date grammar moved into the shared index-rows module (Session 1
// REINDEX, 2026-07-16): the /work index and this book render the same rows.
const fmtDate = fmtMonthYear

function LensPill({ lens }: { lens: Lens }) {
  return (
    <span className="pr-pill">
      <LensTick lens={lens} size={8} />
      {LENSES[lens].label}
    </span>
  )
}

/* ---- 1 · THE COVER ------------------------------------------------------
   The cover carries the SITE'S OWN FRONT DOOR (Emilie's gate ruling,
   2026-07-12): the landing mind graph, drawn from the SAME frozen model the
   landing renders (src/landing/mindGraph.ts), so an appended node updates
   the book cover on the next build and the art can never stale. Ground =
   THE MIND ON PAPER (Emilie's pick over the carbon night): ink threads on
   white, the landing's own light mode, office-printer friendly. */

function MindGraphArt({ ink, anno }: { ink: string; anno: string }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    >
      {THREADS.map(t => (
        <path
          key={t.id}
          d={spline(t.pts)}
          fill="none"
          stroke={ink}
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={0.28}
        />
      ))}
      {THREADS.filter(t => t.label).map(t => (
        <text
          key={`${t.id}-label`}
          x={t.label![0]}
          y={t.label![1]}
          textAnchor={t.anchor}
          fontFamily="Martian Mono"
          fontSize={8}
          letterSpacing={1.1}
          fill={anno}
        >
          {t.id}
        </text>
      ))}
      {MIND.nodes.map(n => (
        <g key={n.id}>
          {n.award ? (
            <path d={starPath(n.x, n.y, 5.6)} fill={ink} />
          ) : n.kind === 'project' ? (
            <circle cx={n.x} cy={n.y} r={3.6} fill={ink} />
          ) : (
            <circle cx={n.x} cy={n.y} r={3.2} fill="none" stroke={ink} strokeWidth={1.4} />
          )}
          {n.rest &&
            (n.kind === 'project' ? (
              <text
                x={n.x + n.d[0]}
                y={n.y + n.d[1]}
                textAnchor={n.a}
                fontFamily="Martian Mono"
                fontSize={8}
                letterSpacing={0.8}
                fill={ink}
              >
                {n.label}
              </text>
            ) : (
              <text
                x={n.x + n.d[0]}
                y={n.y + n.d[1]}
                textAnchor={n.a}
                fontFamily="Source Serif 4"
                fontStyle="italic"
                fontSize={9.5}
                fill={anno}
              >
                {n.label}
              </text>
            ))}
        </g>
      ))}
    </svg>
  )
}

function Cover() {
  const ink = '#16181d'
  const anno = '#565b63'

  return (
    <A4Page>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
        }}
      >
        {/* The artwork: 297mm wide at the model's own aspect leaves the
            bottom band free for the identity rail, like the landing's scrim. */}
        <div style={{ height: '166mm', overflow: 'hidden' }}>
          <MindGraphArt ink={ink} anno={anno} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '8mm',
            padding: '0 14mm 11mm 18mm',
          }}
        >
          <div>
            <h1 className="pr-title" style={{ fontSize: '26pt', margin: 0, color: ink }}>
              {NAME.toUpperCase()}
            </h1>
            <p className="pr-dek" style={{ margin: '2.4mm 0 0', color: ink }}>{SUBTITLE}</p>
            {/* draftCopy: the PORTFOLIO · 2026 rail label is new (structural). */}
            <p className="pr-mono" style={{ margin: '3.4mm 0 0', color: anno }}>
              PORTFOLIO · 2026 · ✦ {AWARD_FACT}
            </p>
          </div>
          <div style={{ textAlign: 'right', flex: 'none' }}>
            <LogoMark size={52} />
            <p className="pr-mono" style={{ margin: '2.4mm 0 0', color: anno }}>{SITE}</p>
          </div>
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 2 · THE SPREAD ------------------------------------------------------ */

function SpineSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h3>{label}</h3>
      {children}
    </section>
  )
}

function Spread({ data, side, plate }: { data: SpreadData; side: PageSide; plate: number }) {
  const { master, entry } = data
  // The dominant plate: the master's curated spreadAssets first (the
  // print-resolution rung), the card cover as the honest fallback.
  const plateRef = master.spreadAssets?.[0] ?? master.image
  const img = plateRef ? printImageSrc(plateRef.slug, plateRef.name) : undefined
  const alt =
    master.image && plateRef && master.image.name === plateRef.name
      ? master.image.alt
      : `${master.title}, the book plate`

  const figure = plateRef && img && (
    <figure className="pr-spread__figure" style={{ margin: 0 }}>
      <img src={img} alt={alt} />
    </figure>
  )

  const caption = figure && (
    <span className="pr-spread__caption">
      PLATE {String(plate).padStart(2, '0')} · {master.title.toUpperCase()}
    </span>
  )

  const head = (
    <>
      <div className="pr-spread__meta">
        <span className="pr-mono pr-mono--muted">{entry.number}</span>
        <LensPill lens={entry.lens} />
        <span className="pr-mono pr-mono--muted">{master.meta}</span>
      </div>
      {entry.recognition && (
        <span className="pr-mono pr-spread__award">✦ {entry.recognition}</span>
      )}
      <h2 className="pr-title pr-spread__title">{master.title}</h2>
      {master.dek && <p className="pr-dek pr-spread__dek">{master.dek}</p>}
    </>
  )

  const spine = (
    <div className="pr-spine pr-body">
      <SpineSection label="WHAT">
        <p>{entry.what}</p>
      </SpineSection>
      <SpineSection label="WHY">
        <p>{entry.why}</p>
      </SpineSection>
      {entry.how && entry.how.length > 0 && (
        <SpineSection label="HOW">
          <ol>
            {entry.how.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </SpineSection>
      )}
      {entry.outcome && (
        <SpineSection label="WHAT CAME OF IT">
          <p>{entry.outcome}</p>
        </SpineSection>
      )}
    </div>
  )

  const foot = (
    <div className="pr-spread__foot">
      <span className="pr-mono">
        {master.tech}
        {master.stat && <span className="pr-mono--muted"> · {master.stat}</span>}
      </span>
      <span className="pr-mono pr-mono--muted">
        {SITE}/work/{entry.id} · {fmtDate(entry.date)}
      </span>
    </div>
  )

  // The dominant image bleeds the OUTSIDE edge: recto (odd, binds left)
  // carries it right; verso mirrors. No image = an honest all-text page
  // (the fallback form below, whose content column simply spans wider).
  if (figure) {
    return (
      <A4Page>
        <div className={`pr-spread pr-spread--plate pr-spread--${side}`}>
          <div className="pr-plate__top">
            {side === 'recto' ? (
              <>
                <div className="pr-plate__head">{head}</div>
                {figure}
              </>
            ) : (
              <>
                {figure}
                <div className="pr-plate__head">{head}</div>
              </>
            )}
          </div>
          <div className="pr-plate__body">
            {spine}
            {foot}
          </div>
          {caption}
        </div>
      </A4Page>
    )
  }

  // No figure: the honest all-text page. The side class keeps the bound
  // gutter's 18mm; the solo modifier spans the content across the full page.
  return (
    <A4Page>
      <div className={`pr-spread pr-spread--${side}`}>
        <div className="pr-spread__content pr-spread__content--solo">
          {head}
          {spine}
          {foot}
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 3 · THE INDEX ------------------------------------------------------- */

// The rows themselves live in components/ThoughtIndexRows (print skin): the
// /work index renders the same component in its screen skin, so the two
// renditions share one layout logic + one selector (REINDEX, 2026-07-16).
const THOUGHTS = thoughtIndexEntries()

function IndexPage({ side }: { side: PageSide }) {
  return (
    <A4Page>
      <div className={`pr-index pr-index--${side}`}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '3mm' }}>
          <h2 className="pr-title" style={{ fontSize: '20pt', margin: 0 }}>Index</h2>
          <span className="pr-kicker">
            EVERYTHING · {WORK_ENTRIES.length} PROJECTS + {THOUGHTS.length} THOUGHTS · {SITE}
          </span>
        </div>
        {/* Colour never means alone: the ticks are named once per page.
            (S4b: 15 projects = a third tile row; the legend + THE THOUGHTS
            margins each gave back ~1.75mm so the page keeps its box.) */}
        <div className="pr-legend pr-kicker" style={{ marginBottom: '3.5mm' }}>
          {(Object.keys(LENSES) as Lens[]).map(l => (
            <span key={l}>
              <LensTick lens={l} size={6} /> {LENSES[l].label.toUpperCase()}
            </span>
          ))}
          <span>✦ RECOGNITION</span>
        </div>

        {/* The WORK grid's manner, in print (Emilie's pick over the rows
            contents page): image tiles for every project, quiet tiles where
            no photograph exists (the podcast honestly says LISTEN).
            (S2, 2026-07-16: 20 projects. At 6-across the fourth tile row
            pushed the page 181px past its A4 box, so the index runs 7-across
            = 3 rows and the page keeps its box; measured live.) */}
        <div className="pr-index__grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {WORK_ENTRIES.map(w => {
            const src = w.cover && printImageSrc(w.cover.slug, w.cover.name)
            return (
              <div key={w.id}>
                <div className="pr-tile__img">
                  {src ? (
                    <img src={src} alt={w.cover?.alt ?? w.title} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="pr-mono pr-mono--muted">{w.hero === 'audio' ? 'LISTEN' : w.number}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.6mm', marginTop: '1.6mm' }}>
                  <LensTick lens={w.lens} size={6} />
                  <span className="pr-body" style={{ fontSize: '8pt', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    {w.title}
                  </span>
                </div>
                <div className="pr-mono pr-mono--muted" style={{ marginTop: '0.6mm' }}>
                  {w.number}
                  {w.recognition ? ' · ✦' : ''}
                </div>
              </div>
            )
          })}
        </div>
        <h3 className="pr-kicker" style={{ margin: '5mm 0 2.4mm' }}>THE THOUGHTS</h3>
        <ThoughtIndexRows skin="print" />
      </div>
    </A4Page>
  )
}

/* ---- 4 · THE CV TAIL ----------------------------------------------------- */

function CvTail({ side }: { side: PageSide }) {
  return (
    <A4Page>
      <div className={`pr-cv pr-cv--${side}`}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '5mm' }}>
          {/* The locked CV header string, verbatim. */}
          <h2 className="pr-title" style={{ fontSize: '20pt', margin: 0 }}>
            {NAME} <span style={{ fontWeight: 400, color: 'var(--pr-ink-muted)' }}>| Design Technology Architect</span>
          </h2>
          <span className="pr-mono pr-mono--muted">chidiacemilie@gmail.com · {SITE}</span>
        </div>

        <div className="pr-cv__cols">
          <div>
            <h3>EDUCATION</h3>
            {EDUCATION.map(e => (
              <div key={e.title} className="pr-cv__entry">
                <p className="pr-mono pr-mono--muted" style={{ margin: 0 }}>{e.dates}</p>
                <p className="pr-body" style={{ margin: '0.6mm 0 0', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  {e.title} · {e.org}
                </p>
                <p className="pr-body" style={{ margin: '0.6mm 0 0' }}>{e.notes}</p>
              </div>
            ))}
            <h3 style={{ marginTop: '5mm' }}>CERTIFICATES</h3>
            {CERTIFICATES.map(c => (
              <p key={c} className="pr-mono" style={{ margin: '0 0 1.4mm', letterSpacing: '0.02em' }}>{c}</p>
            ))}
            <h3 style={{ marginTop: '5mm' }}>LANGUAGES</h3>
            <p className="pr-mono" style={{ margin: 0, letterSpacing: '0.02em' }}>{LANGUAGES}</p>
          </div>

          <div>
            <h3>EXPERIENCE</h3>
            {EXPERIENCE.map(e => (
              <div key={e.org + e.dates} className="pr-cv__entry">
                <p className="pr-mono pr-mono--muted" style={{ margin: 0 }}>{e.dates}</p>
                <p className="pr-body" style={{ margin: '0.6mm 0 0', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  {e.title} · {e.org}
                </p>
                <p className="pr-body" style={{ margin: '0.6mm 0 0' }}>{e.notes}</p>
              </div>
            ))}
          </div>

          <div>
            <h3>AWARDS & RECOGNITION</h3>
            {AWARDS.map(a => (
              <div key={a.text} style={{ display: 'grid', gridTemplateColumns: '10mm 1fr', gap: '2mm', marginBottom: '1mm' }}>
                <span className="pr-mono pr-mono--muted">{a.year}</span>
                <span className="pr-body" style={{ fontSize: '8.5pt', lineHeight: 1.32 }}>{a.text}</span>
              </div>
            ))}
            <h3 style={{ marginTop: '4mm' }}>SKILLS</h3>
            {SKILLS.map(s => (
              <div key={s.group} style={{ marginBottom: '1.2mm' }}>
                <span className="pr-mono pr-mono--muted">{s.group} · </span>
                <span className="pr-mono" style={{ letterSpacing: '0.01em' }}>{s.items}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '3mm', borderTop: '0.5pt solid var(--pr-hairline)', display: 'flex', justifyContent: 'space-between' }}>
          <span className="pr-mono pr-mono--muted">UPDATED {UPDATED.toUpperCase()}</span>
          <span className="pr-mono pr-mono--muted">THE FULL RECORD · {SITE}/cv</span>
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 5 · THE COLOPHON ---------------------------------------------------- */

function Colophon() {
  return (
    <A4Page>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '7mm' }}>
        <LogoMark size={88} />
        {/* The landing's signed caption, reused verbatim as the closing line. */}
        <p className="pr-dek" style={{ margin: 0 }}>this is what's on my mind</p>
        <div style={{ display: 'flex', gap: '5mm' }}>
          <span className="pr-mono">chidiacemilie@gmail.com</span>
          <span className="pr-mono pr-mono--muted">·</span>
          <span className="pr-mono">linkedin.com/in/EmilieElChidiac</span>
          <span className="pr-mono pr-mono--muted">·</span>
          <span className="pr-mono">github.com/hi-em</span>
        </div>
        {/* The sanctioned functional touch (§9's UPDATED line), nothing more:
            the "rendered from the live site" provenance line the critique
            flagged left; unsigned voice stays off the page. */}
        <span className="pr-mono pr-mono--muted">
          {SITE} · UPDATED {UPDATED.toUpperCase()}
        </span>
      </div>
    </A4Page>
  )
}

/* ---- The book ------------------------------------------------------------ */

// The book's page count: cover + the spreads + index + CV tail + colophon.
// The render script asserts the PDF matches this exactly (a page that
// silently overflows or vanishes fails the build).
export const BOOK_PAGE_COUNT = BOOK_SPREADS.length + 4

export default function PrintBook() {
  // Page numbers are the binding truth: cover = 1 (recto), spreads follow.
  let page = 1
  const spreadPages = BOOK_SPREADS.map((data, i) => {
    page += 1
    return <Spread key={data.master.slug} data={data} side={sideOf(page)} plate={i + 1} />
  })
  const indexSide = sideOf(++page)
  const cvSide = sideOf(++page)

  return (
    <>
      <Cover />
      {spreadPages}
      <IndexPage side={indexSide} />
      <CvTail side={cvSide} />
      <Colophon />
    </>
  )
}
