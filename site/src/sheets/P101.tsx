// SHEET P-101 · Sensi. The first cinematic sheet (Session 8; Sheet cinema
// addendum signed 2026-07-08). ALL copy here is a DRAFT in Emilie's voice
// pending her sign-off (draftCopy on the registry issue entry): abstract,
// method, n.b. dots, margin + riding notes, captions, and the metaRight
// wink. Attribution is woven into the abstract as an ordinary sentence per
// the Session 7 rule (myPart ceiling: project lead, team credited, team of
// four, no percentages, NEVER a labeled line). Verb rule (dossier): Sensi
// scores and estimates comfort, never measures; no clinical claims.
// LISTING 1 is verbatim from the public team repo, de-indented from inside
// build_graph(), pinned to:
// github.com/sclebow/AIA26_Studio/blob/e82f1e0b183e06138ea9c1d685fdaf9ac7388ea8/team_02/python/graph.py
// Rule 8 note count: 2 aside + 2 riding = 4 of 5 (plus 3 n.b. dots, which
// by P-104 precedent do not count toward the cap; Emilie to confirm).
// Session 8 critique rulings applied: Plate 2 flows (a pin must earn its
// hold), the two videos are separated by the FINDINGS beat, the sheet
// lands on Plate 5's riding note.
import SheetLayout, { SheetLabel } from '../components/sheet/SheetLayout'
import NBDot from '../components/sheet/NBDot'
import MarginNotes from '../components/sheet/MarginNotes'
import CinemaPlate from '../components/sheet/CinemaPlate'
import SheetVideo from '../components/sheet/SheetVideo'
import { LensTick, LENSES } from '../components/Lens'

const PROSE = 'font-serif text-[15.5px] leading-[1.65] max-w-[62ch]'

export default function P101() {
  return (
    <SheetLayout
      sheetNo="P-101"
      title="Comfort as a design layer: an agentic copilot that scores a floor plan across six senses"
      navLabel="EMILIE EL CHIDIAC · WORK / SENSI · SHEET P-101"
      metaLeft="EL CHIDIAC, E. · MACAD · P-101"
      metaRight="SIGNED: ALL FOUR OF US"
      footerLeft="PYTHON · LANGGRAPH · FASTAPI · REACT"
      footerRight="P-101 · 1 OF 1"
      aside={
        <MarginNotes
          notes={[
            'the six scores argue like a family. the coupling matrix is the dinner table.',
            'legibility can become prescription. we say it out loud so it stays a warning.',
          ]}
        />
      }
    >
      {/* Lens + team + award + the one defensible number, one mono row
          (MiniSheet grammar; award is ink, rule 1; stat is the Session 7
          ruling rendered as sheet metadata). */}
      <div className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.08em] text-anno">
        <span className="inline-flex items-center gap-1.5">
          <LensTick lens="computation" size={8} />
          {LENSES.computation.label.toUpperCase()}
        </span>
        <span aria-hidden="true">·</span>
        <span>MACAD STUDIO · TEAM OF 4</span>
        <span aria-hidden="true">·</span>
        <span className="font-medium text-ink">
          MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER
        </span>
        <span aria-hidden="true">·</span>
        <span>LLM BENCH · 2 PROVIDERS × 3 SCENES</span>
      </div>

      <SheetLabel>ABSTRACT</SheetLabel>
      <p className={`mb-[26px] ${PROSE}`}>
        Every tool in the stack could tell us how a building performs. None of them would say how
        a room feels. Sensi is the copilot we built to close that gap: it reads a floor plan and
        scores comfort across six senses (thermal, visual, acoustic, spatial, olfactory,
        tactile), calibrated to one person at a time, not an average.
        <NBDot note="you do not walk in and average a room. neither should the software." /> A
        coupling matrix keeps the senses honest with each other: warm a room and the acoustics
        shift, open a wall and three scores move at once. Project lead, A to Z, built with a team
        of four: Lakzhmy Mari Zaro, María Sánchez Domínguez, Charles Abi Chahine, and me.
        <NBDot note="four people, one rule: if the plan cannot answer back, it does not ship." align="right" />
      </p>

      <CinemaPlate
        media={{
          kind: 'image',
          slug: 'sensi',
          name: 'app-shape',
          alt: 'Sensi mid-conversation, scoring a floor plan in the shape view',
        }}
        caption="PLATE 1 · THE COPILOT AT WORK, SHAPE VIEW"
        note="the plan answers back. that part still feels like a trick."
        bleed
      />

      <SheetLabel>METHOD</SheetLabel>
      <ol className={`mb-[26px] list-decimal pl-5 ${PROSE} leading-[1.7] max-w-[60ch]`}>
        <li>
          Ask before analyzing: onboarding calibrates the copilot to the person in the room,
          their thermal grudges, their noise tolerance (Plate 2). Comfort without a subject is
          just weather.
        </li>
        <li>
          Load the layout; let one action classifier, a single LLM call per turn, decide where
          the request goes: analyze, edit, preview, audit (Listing 1). The agent is a LangGraph
          state graph; the routing is the architecture.
          <NBDot note="the graph got smaller every week. that was the progress." />
        </li>
        <li>
          Score the six senses and let the coupling matrix ripple each change into the others. A
          fix that quietly breaks a neighboring sense gets flagged, not hidden.
        </li>
        <li>
          Detect conflicts, suggest edits the layout can actually absorb, and preview the
          hypothetical without committing it. Then render, compare, and hand over the report
          (Plates 3 to 5).
        </li>
        <li>
          Bench the judgment: run the same scenes past a second provider before trusting the
          first (the findings below).
        </li>
      </ol>

      <SheetLabel>LISTING 1 {'{'} THE AGENT'S TOOL DISPATCH · team_02/python/graph.py</SheetLabel>
      <pre className="mb-[26px] max-w-[60ch] overflow-x-auto border border-ink/35 bg-ink/4 p-3.5 font-mono text-[10px] leading-[1.7] whitespace-pre-wrap">
        {`# Layout dispatch
g.add_conditional_edges("load_layout", _route_after_load_layout, {
    "overview_respond":  "overview_respond",
    "analyze":           "analyze",
    "detect":            "detect",       # cache hit: jump straight to detect
    "edit_planner":      "edit_planner",
    "preview":           "preview",
    "topologic_analysis": "topologic_analysis",
    "biophilic_audit":   "biophilic_audit",
    "persona_comparison": "persona_comparison",
    END:                 END,            # requested layout not found
})`}
      </pre>

      <CinemaPlate
        media={{
          kind: 'image',
          slug: 'sensi',
          name: 'onboarding',
          alt: 'Sensi onboarding, calibrating the six senses to one person',
        }}
        caption="PLATE 2 · ONBOARDING, THE CALIBRATION ACT"
        flow
      />

      <SheetVideo
        slug="sensi"
        name="demo"
        ariaLabel="Sensi demo: onboarding, scoring, editing, and the rendered comparison, forty-four seconds"
        caption="PLATE 3 · THE DEMO · 44 SECONDS, WITH SOUND"
      />

      <div className="mb-[26px]" />

      <SheetLabel>FINDINGS · THE BENCH</SheetLabel>
      <p className={`mb-[26px] ${PROSE}`}>
        Three scenes, chosen to disagree with each other: a cosy bedroom, a mixed kitchen, a
        living room arranged to fail. Two LLM providers scored all three end to end, on the same
        six senses. They mostly agreed, including about the room we sabotaged, and it would have
        been easy to call that validation. We wrote agreement is not truth into the notes
        instead, and kept every disagreement as data: same scenes, same senses, swap the model,
        read the diff.
      </p>

      <SheetVideo
        slug="sensi"
        name="flow-report"
        ariaLabel="Sensi assembling the comfort report, screen capture"
        caption="PLATE 4 · THE REPORT, ASSEMBLING ITSELF"
      />

      <div className="mb-[26px]" />

      <CinemaPlate
        media={{
          kind: 'image',
          slug: 'sensi',
          name: 'report-detail',
          alt: 'Sensi report detail: per-sense scores with the conflicts called out',
        }}
        caption="PLATE 5 · THE REPORT, UP CLOSE"
        note="the thing that is wrong is the thing you notice. the report agrees."
      />
    </SheetLayout>
  )
}
