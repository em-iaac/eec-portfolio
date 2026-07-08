// SHEET P-102 · NeuroSpace. The second cinematic sheet (Session 9; the Sheet
// cinema addendum signed 2026-07-08, generalized from P-101). ALL copy here
// is a DRAFT in Emilie's voice pending her sign-off (draftCopy on the
// registry issue entry): title, metaRight wink, abstract, method, n.b. dots,
// margin + riding notes, captions. This is SOLO work; the authorship is
// woven into the abstract as an ordinary sentence per the Session 7 rule
// (never a labeled line). Verb rule (dossier PRJ-NEURO-02): NeuroSpace
// ESTIMATES and SCORES cortisol / circadian / cognitive-load effects, never
// MEASURES; no clinical claims. NO stat number, by ruling (dossier NUM-10:
// the live app is the stronger proof than any digit). Keywords woven in
// prose: Rhino.Compute, Three.js, the server-geometry-to-browser-scoring
// pipeline. The live app link stays one gesture away (meta row + prose).
// LISTING 1 is verbatim from her own public repo, the browser-scoring core,
// pinned to:
// github.com/hi-em/neurospace/blob/12512514a92621550192a7a444f3173a1033129f/src/utils/neuroScore.js
// Rule 8 note count: 2 aside + 2 riding = 4 of 5 (plus 3 n.b. dots, which by
// P-104 precedent do not count toward the cap; Emilie to confirm).
import SheetLayout, { SheetLabel } from '../components/sheet/SheetLayout'
import NBDot from '../components/sheet/NBDot'
import MarginNotes from '../components/sheet/MarginNotes'
import CinemaPlate from '../components/sheet/CinemaPlate'
import SheetVideo from '../components/sheet/SheetVideo'
import { LensTick, LENSES } from '../components/Lens'

const PROSE = 'font-serif text-[15.5px] leading-[1.65] max-w-[62ch]'
const LINK =
  'text-redline underline underline-offset-2 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

export default function P102() {
  return (
    <SheetLayout
      sheetNo="P-102"
      title="Behavior Information Modeling: a browser that scores how a room's defaults shape you"
      navLabel="EMILIE EL CHIDIAC · WORK / NEUROSPACE · SHEET P-102"
      metaLeft="EL CHIDIAC, E. · MACAD · P-102"
      metaRight="SIGNED: PARTY OF ONE"
      footerLeft="GRASSHOPPER · RHINO.COMPUTE · VUE 3 · THREE.JS"
      footerRight="P-102 · 1 OF 1"
      aside={
        <MarginNotes
          notes={[
            'one slider, one score, no server round trip. that gap is where it starts to feel alive.',
            'bim was always about information. i just changed which information we mean.',
          ]}
        />
      }
    >
      {/* Lens + solo + the live app, one mono row (MiniSheet grammar). No
          award, NO stat (the NUM-10 ruling: the live app is the number).
          The live link is the first gesture, above the fold on mobile. */}
      <div className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.08em] text-anno">
        <span className="inline-flex items-center gap-1.5">
          <LensTick lens="computation" size={8} />
          {LENSES.computation.label.toUpperCase()}
        </span>
        <span aria-hidden="true">·</span>
        <span>MACAD · SOLO</span>
        <span aria-hidden="true">·</span>
        <a href="https://hi-em.github.io/neurospace" target="_blank" rel="noreferrer" className={LINK}>
          TRY IT LIVE<span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>

      <SheetLabel>ABSTRACT</SheetLabel>
      <p className={`mb-[26px] ${PROSE}`}>
        You are sitting in a room right now, and its defaults are quietly working on you: the ceiling
        height nudging your cortisol, the daylight setting your circadian clock, the wall you are
        facing adding to or lifting your cognitive load. NeuroSpace makes that invisible layer
        legible.{' '}
        <a href="https://hi-em.github.io/neurospace" target="_blank" rel="noreferrer" className={LINK}>
          Move a slider<span className="sr-only"> (opens the live app in a new tab)</span>
        </a>{' '}
        and the room rebuilds while a score answers back, live.
        <NBDot note="the first time the score moved while i was still dragging, i laughed out loud." /> I
        built it on my own: a Grasshopper definition doing the heavy geometry on the server through
        Rhino.Compute, Three.js drawing the room in the browser, and a scoring pass that estimates
        the behavioral effect the moment you let go of the slider. It never measures your body; it
        scores the design against neuroarchitecture research and shows its work. This is the thesis I
        keep circling: BIM, reframed from Building Information Modeling to Behavior Information
        Modeling.
        <NBDot note="a score you can argue with beats a number you have to trust." align="right" />
      </p>

      <CinemaPlate
        media={{
          kind: 'image',
          slug: 'neurospace',
          name: 'landing',
          alt: 'NeuroSpace landing page: a parametric room beside its live behavioral score',
        }}
        caption="PLATE 1 · THE ROOM, AND ITS SCORE"
        note="you never chose the ceiling height. the room did. that is the whole point."
        bleed
      />

      <SheetLabel>METHOD</SheetLabel>
      <ol className={`mb-[26px] list-decimal pl-5 ${PROSE} leading-[1.7] max-w-[60ch]`}>
        <li>
          Describe the room as parameters, not geometry: ceiling height, wall count and curvature,
          how many openings and how large, how much organic form, how many plants. Every one is a
          slider (Plate 2).
        </li>
        <li>
          Send the parameters to a Grasshopper definition running on the server. Rhino.Compute
          evaluates it and streams the heavy geometry back, so the browser never has to model
          anything itself.
        </li>
        <li>
          Draw the returned room with Three.js and let the person walk the parameters in real time.
          Geometry is the slow path; it only recomputes when the shape actually changes.
        </li>
        <li>
          Score the behavior on the fast path, in the browser, the instant a slider settles: a
          transparent weighted sum over the five dimensions the research cares about (Listing 1). No
          server round trip, so the number answers as fast as you can drag.
          <NBDot note="separate the compute by latency or the whole thing feels like glue." />
        </li>
        <li>
          Read the score back as a hypothesis, not a verdict: each dimension explains what it is
          estimating and why, and you are free to overrule it.
        </li>
      </ol>

      <SheetLabel>LISTING 1 {'{'} THE BROWSER SCORE · src/utils/neuroScore.js</SheetLabel>
      <pre className="mb-[26px] max-w-[60ch] overflow-x-auto border border-ink/35 bg-ink/4 p-3.5 font-mono text-[10px] leading-[1.7] whitespace-pre-wrap">
        {`export function calculateNeuroScore(params) {
  const d = _dimScores(_normParams(params))
  const raw = (
    d.heightScore    * 0.22 +  // Ceiling height → cognitive freedom
    d.curveScore     * 0.25 +  // Wall curvature → visual stress reduction
    d.daylightScore  * 0.22 +  // Natural light → wellbeing
    d.biophilicScore * 0.18 +  // Biophilic form → neuroinflammation
    d.plantScore     * 0.13    // Potted plants → attention restoration
  )
  return Math.round(Math.max(0, Math.min(1, raw)) * 100)
}`}
      </pre>

      <p className={`mb-[26px] ${PROSE}`}>
        The whole app is{' '}
        <a href="https://github.com/hi-em/neurospace" target="_blank" rel="noreferrer" className={LINK}>
          one public repo<span className="sr-only"> (opens in new tab)</span>
        </a>{' '}
        and{' '}
        <a href="https://hi-em.github.io/neurospace" target="_blank" rel="noreferrer" className={LINK}>
          one live URL<span className="sr-only"> (opens in new tab)</span>
        </a>
        ; the scoring file above is the honest core of it. The weights are not a secret and not a
        measurement. They are a reading you can check.
      </p>

      <CinemaPlate
        media={{
          kind: 'image',
          slug: 'neurospace',
          name: 'view',
          alt: 'The NeuroSpace parametric room rebuilt from server geometry and drawn with Three.js',
        }}
        caption="PLATE 2 · THE PARAMETRIC ROOM, DRAWN IN THE BROWSER"
      />

      {/* The slider-tour: the motion beat this sheet was waiting on (Session 9
          tail, encoded Session 11). Silent screen capture; SheetVideo marks it
          so and runs it as a muted loop where motion is allowed, poster +
          controls under reduced motion. Direct SheetVideo (no riding note)
          keeps the rule-8 count at 4 of 5. */}
      <SheetVideo
        slug="neurospace"
        name="slider-tour"
        ariaLabel="NeuroSpace screen capture: dragging the room parameters while the behavioral score updates in real time"
        caption="PLATE 3 · DRAG A SLIDER, THE SCORE ANSWERS"
      />

      <div className="mb-[26px]" />

      <SheetLabel>THE HONEST PART</SheetLabel>
      <p className={`mb-[26px] ${PROSE}`}>
        The score is a heuristic, not an instrument. It leans on neuroarchitecture research (the
        ceiling-height and curvature findings, the daylight and biophilic work) and turns it into
        weights you can read in Listing 1, which means you can also argue with them.
        <NBDot note="i kept the weights visible on purpose. a black box would have been easier and worse." /> That
        is the design. A tool that makes comfort legible can slide into prescription if you let it,
        so NeuroSpace shows every assumption on the way to the number and lets you overrule it. It
        estimates; it does not diagnose.
      </p>

      <CinemaPlate
        media={{
          kind: 'image',
          slug: 'neurospace',
          name: 'score-1',
          alt: 'A NeuroSpace score read out per dimension, each with its own reasoning',
        }}
        caption="PLATE 4 · ONE SCORE, BROKEN DOWN BY SENSE"
        flow
      />

      <CinemaPlate
        media={{
          kind: 'image',
          slug: 'neurospace',
          name: 'score-2',
          alt: 'The NeuroSpace score after a parameter change, showing how the dimensions shift',
        }}
        caption="PLATE 5 · CHANGE ONE SLIDER, WATCH IT MOVE"
        note="the score is a hypothesis with its receipts attached. argue with it."
        flow
      />
    </SheetLayout>
  )
}
