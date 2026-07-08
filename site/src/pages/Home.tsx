// A-000 · THE MIND IS THE LANDING (Session 13). The EXPLORE network is now the
// landing's opening panel: the sanctioned SHOWCASE surface (idle float + camera
// drift) as the hero image, with the LOCKED hero line and the four recruiter
// facts layered OVER it as real DOM text (never baked into the poster). Depth
// levels: this landing > a focused word (/explore/:id) > the full EXPLORE route.
//
// Hero copy is LOCKED (content/copy-draft.md v1.0): verbatim, no em dashes, no
// open-to status (FLAG-01, retired sitewide Session 5).
import { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import Kicker from '../components/Kicker'
import RevisionWord from '../components/RevisionWord'
import ProjectCard from '../components/ProjectCard'
import BenchRoll from '../components/BenchRoll'
import ExploreErrorBoundary from '../components/ExploreErrorBoundary'
import NetworkSrNav from '../explore/NetworkSrNav'
import { POSTER_ALT, POSTER_SRC, fallbackReason } from '../explore/poster'
import type { ExploreScene } from '../explore/scene'
import { HOME_FEATURED } from '../data/projects'
import { ExploreExitContext, ExploreExitLink } from '../hooks/useExploreTransition'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// Deferred so three.js stays OUT of the landing's initial JS and loads only
// after the poster paints (LCP), and only on the WebGL path.
const ExploreSurface = lazy(() => import('../explore/ExploreSurface'))

const RED_LINK =
  'text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'
const WIRE_LINK =
  'text-redline-wire underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline-wire'

// ---- The network hero ------------------------------------------------------

function NetworkHero() {
  const prm = usePrefersReducedMotion()
  const beginExit = useContext(ExploreExitContext)
  const sceneRef = useRef<ExploreScene | null>(null)
  // Poster-only (PRM / no-WebGL / save-data / low-power) drives the HUD copy and,
  // seeded once, whether the scene chunk ever loads. Kept in sync for runtime
  // context loss via onModeResolved.
  const [posterOnly, setPosterOnly] = useState(() => fallbackReason(prm) !== null)
  // The live scene mounts one frame AFTER the poster paints, and never on a
  // poster-only device (save-data must not pay for three.js it will not run).
  const [showLive, setShowLive] = useState(false)

  useEffect(() => {
    if (fallbackReason(prm) !== null) return
    // Defer the scene chunk one task past the effect so the poster paints as the
    // LCP first. setTimeout (not rAF) so a backgrounded/prerendered tab still
    // mounts the scene when it foregrounds; rAF is paused while hidden.
    const id = window.setTimeout(() => setShowLive(true), 0)
    return () => window.clearTimeout(id)
  }, [prm])

  return (
    <section
      aria-label="Emilie El Chidiac, the network of projects and thoughts"
      className="relative isolate -mx-5 flex min-h-[86svh] flex-col overflow-hidden bg-carbon sm:-mx-8 sm:min-h-[78svh] lg:min-h-[600px]"
    >
      {/* The poster: the designed FIRST FRAME and universal fallback (never an
          error state). Painted immediately as the LCP; the base layer under the
          live scene, and the whole picture in poster-only mode. */}
      <img
        src={POSTER_SRC}
        alt={showLive ? '' : POSTER_ALT}
        aria-hidden={showLive ? true : undefined}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Hero copy: real DOM over the surface. FIRST in DOM so screen readers and
          keyboard users reach the headline + the four facts before the network's
          list; z-10 keeps it painted above the surface + scrim regardless of DOM
          order. pointer-events-auto so a swipe on the text scrolls the page. On
          phones the column spans the panel, so the whole hero scrolls and the
          network stays an ambient showcase; from sm up the column caps and the
          bare canvas on the right takes orbit. */}
      <div className="pointer-events-auto relative z-10 flex flex-1 flex-col justify-center gap-5 px-5 py-12 sm:max-w-[62%] sm:px-10">
        <h1 className="max-w-[24ch] text-[clamp(1.65rem,4.4vw,2.9rem)] leading-[1.16] font-semibold tracking-[-0.015em] text-balance text-ink-dark">
          I started asking buildings a question my software couldn't answer:{' '}
          <span className="font-serif font-medium italic tracking-normal">
            how will this space make someone{' '}
            <RevisionWord delayMs={900}>feel?</RevisionWord>
          </span>
        </h1>

        <p className="max-w-[54ch] font-serif text-[16.5px] leading-relaxed text-ink-dark">
          So I build the missing tools. I'm Emilie El Chidiac, Design Technology Architect.{' '}
          <span className="border border-ink-dark/30 px-1.5 py-0.5 font-mono text-[0.72em]">NeuroSpace</span>{' '}
          reads a floor plan and scores its effect on the mind;{' '}
          <span className="border border-ink-dark/30 px-1.5 py-0.5 font-mono text-[0.72em]">Sensi</span>, winner
          at the MaCAD Awards 2026, makes comfort a design layer.
        </p>

        {/* Fact 4: the niche in standard vocabulary, scannable in mono. */}
        <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em] text-anno-dark">
          COMPUTATIONAL DESIGN · DESIGN TECHNOLOGY · MACAD @ IAAC
        </p>

        {/* Fact 2's live proof, one gesture away. Draw-in sequenced after the
            header rule (Session 5 bundle), dark-ground variant. */}
        <Kicker
          lead="i call where this is going:"
          linkText="Behavior Information Modeling"
          href="https://hi-em.github.io/neurospace"
          note="(opens the live NeuroSpace app)"
          draw
          drawDelayMs={950}
          dark
        />
      </div>

      {/* Live scene: deferred, WebGL path only, DOM AFTER the copy (above). A
          chunk-load or scene throw degrades to the poster underneath
          (fallback={null}), never a message. */}
      {showLive && (
        <ExploreErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <ExploreSurface
              onRequestFocus={(id) => {
                if (id) beginExit?.(undefined, `/explore/${id}`)
              }}
              onEntryDone={() => {}}
              onModeResolved={setPosterOnly}
              sceneRef={sceneRef}
              embedded
            />
          </Suspense>
        </ExploreErrorBoundary>
      )}

      {/* The navigable list travels with the surface in ALL modes; on the WebGL
          path ExploreSurface renders its own, so avoid the duplicate here. */}
      {!showLive && <NetworkSrNav />}

      {/* Legibility scrim (static, PRM-safe): DOM AFTER the surface so it dims the
          network, but under the z-10 copy above. A heavier carbon wash where the
          text sits, thinning toward the open field; mobile keeps the wash the
          length of the column, desktop clears the right where the network breathes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-carbon via-carbon/90 to-carbon/70 sm:bg-gradient-to-r sm:from-carbon sm:via-carbon/80 sm:to-transparent"
      />

      {/* HUD: interaction hints, or the poster-only line so the fallback never
          reads as broken; plus the way down into the full network. */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 pb-5 font-mono text-[9px] tracking-[0.12em] text-anno-dark sm:px-10">
        <span className="pointer-events-none">
          {posterOnly ? (
            'A STILL OF THE FIELD ON THIS DEVICE · SCROLL FOR THE FULL RECORD'
          ) : (
            <>
              {/* Phones scroll the whole hero, so the field is ambient there; from
                  sm up the bare canvas takes drag + tap. */}
              <span className="sm:hidden">THE FIELD, DRIFTING · OPEN IT TO FOLLOW A WORD</span>
              <span className="hidden sm:inline">DRAG TO ORBIT · TAP A WORD TO FOLLOW IT</span>
            </>
          )}
        </span>
        <ExploreExitLink className={`-m-2 p-2 ${WIRE_LINK}`}>EXPLORE THE WHOLE MIND &gt;</ExploreExitLink>
      </div>
    </section>
  )
}

// ---- The proof pair --------------------------------------------------------

function ProofPair() {
  return (
    <section id="work" aria-labelledby="featured-heading" className="border-t border-ink/20 pt-7 pb-8">
      <h2 id="featured-heading" className="mb-5 font-mono text-[11px] tracking-[0.12em] text-anno">
        FEATURED / THE PROOF PAIR
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {HOME_FEATURED.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i === 0} />
        ))}
      </div>
      <p className="mt-6 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[11px] tracking-[0.06em]">
        <Link to="/sheets/p-101" viewTransition className={RED_LINK}>
          SHEET P-101: SENSI &gt;
        </Link>
        <Link to="/sheets/p-102" viewTransition className={RED_LINK}>
          SHEET P-102: NEUROSPACE &gt;
        </Link>
      </p>
    </section>
  )
}

export default function Home() {
  return (
    <SheetPage title="Design Technology Architect">
      <NetworkHero />
      <ProofPair />
      <BenchRoll />
    </SheetPage>
  )
}
