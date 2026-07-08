// SHEET P-104 · A Ballooning Market. Copy is verbatim from the Session 3
// design of record (Site P-104.dc.html). The n.b. notes and margin notes
// are DRAFTS in Emilie's voice, pending her sign-off (memo QUESTION item).
// The epic fail (Fig. 2) is filed as method, on purpose.
// Session 7 (2026-07-07, approved live): course code retired from metaLeft;
// metaRight joke reworked to one beat (SIGNED: EVENTUALLY, her pick).
import SheetLayout, { SheetLabel } from '../components/sheet/SheetLayout'
import NBDot from '../components/sheet/NBDot'
import MarginNotes from '../components/sheet/MarginNotes'
import SheetFigure from '../components/sheet/SheetFigure'

const PROSE = 'font-serif text-[15.5px] leading-[1.65] max-w-[62ch]'

export default function P104() {
  return (
    <SheetLayout
      sheetNo="P-104"
      title="Pneumatic parasitism: packing a settled balloon roof into a historic steel frame"
      navLabel="EMILIE EL CHIDIAC · WORK / A BALLOONING MARKET · SHEET P-104"
      metaLeft="EL CHIDIAC, E. · MACAD · P-104"
      metaRight="SIGNED: EVENTUALLY"
      footerLeft="GRASSHOPPER · KANGAROO · DENDRO · D5"
      footerRight="P-104 · 1 OF 1"
      aside={
        <MarginNotes
          notes={[
            'daylight through three membranes mixes on the floor. unplanned. kept.',
            'next: same trick, other markets?',
          ]}
        />
      }
    >
      <SheetLabel>ABSTRACT</SheetLabel>
      <p className={`mb-[26px] ${PROSE}`}>
        A historic Cairo market receives a new roof of pressure-packed balloons that borrows the
        existing steel frame without modifying it.
        <NBDot note="the frame is the client, the balloons are the tenants, the solver is the lease." />{' '}
        The method models each balloon as a Kangaroo body with collision, inflation, and anchor
        goals, then meshes the settled cluster with Dendro for lighting studies in D5. The first
        attempt failed in an instructive way; the failure is documented as part of the method.
        <NBDot note="kept the fail gif. people read honesty faster than polish." />
      </p>

      <SheetLabel>METHOD</SheetLabel>
      <ol className={`mb-[26px] list-decimal pl-5 ${PROSE} leading-[1.7] max-w-[60ch]`}>
        <li>Trace the frame of Bab al-Luq; mark the nodes that can host anchors.</li>
        <li>Seed balloons in the volume; declare radii, no physics yet.</li>
        <li>
          Observe the fail: bodies pass through bodies (Fig. 2).
          <NBDot note="never trust a still. it looked fine until it moved." />
        </li>
        <li>
          Add collision and inflation goals; anchor the cluster; let the solver settle (Fig. 3).
          <NBDot note="collision too low, they cuddle. too high, they panic. tune like a thermostat." align="right" />
        </li>
        <li>Mesh the settled cluster with Dendro; render light through CMY membranes in D5 (Figs. 1, 4).</li>
      </ol>

      <SheetLabel>LISTING 1 {'{'} SOLVER GOALS, ABRIDGED</SheetLabel>
      <pre className="mb-[26px] max-w-[60ch] overflow-x-auto border border-ink/35 bg-ink/4 p-3.5 font-mono text-[10px] leading-[1.7] whitespace-pre-wrap">
        {`goals = [
  SphereCollide(balloons, k=high),
  Pressure(target_volume),
  Anchor(frame_nodes),
  Load(buoyancy, +z),
]
solver.settle(goals)`}
      </pre>

      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <SheetFigure
          slug="ballooning-market"
          name="render-1"
          alt="Settled balloon cluster in the steel frame"
          caption="FIG. 1 SETTLED CLUSTER, D5"
        />
        <SheetFigure
          slug="ballooning-market"
          name="epic-fails"
          alt="Balloons ghosting through each other in the first run"
          caption="FIG. 2 THE INSTRUCTIVE FAIL"
        />
        <SheetFigure
          slug="ballooning-market"
          name="process"
          alt="Kangaroo negotiation process"
          caption="FIG. 3 NEGOTIATION, ANIMATED"
        />
        <SheetFigure
          slug="ballooning-market"
          name="render-3"
          alt="Membrane detail with daylight"
          caption="FIG. 4 MEMBRANE + DAYLIGHT"
        />
      </div>
    </SheetLayout>
  )
}
