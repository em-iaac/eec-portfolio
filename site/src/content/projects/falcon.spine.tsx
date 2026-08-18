// THE SPINE of falcon: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of falcon.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project’s prose, not all 21. The meta half stays in
// falcon.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What is MIDAN AL SAKR, the Falcon Square of Al Khobar?', beat: 'what' },
    { q: 'How do takeoff angles and control surfaces turn into wings?', beat: 'how' },
    { q: 'Why carry Arabic calligraphy on the wings?', beat: 'why' },
    { q: 'Where did the monument land?', beat: 'outcome' },
  ],
  what: (
    <>
      {/* Trimmed twice at the book audit (Emilie approved "a small trim" as
          part of pinning the spine columns, 2026-08-18): the tools live in the
          rail (RHINO · SUBD · ARCHVIZ) and the landscape in HOW, so WHAT+WHY
          fit one pinned column. */}
      A monument for a highway roundabout in Al Khobar: MIDAN AL SAKR, the office&rsquo;s
      Moujassam Watan competition entry. Layered steel blades form a falcon, two wings of
      pierced Arabic calligraphy between them. As an architectural designer at Jemma Chidiac
      Architects, I started the concept sketches and led the design from brainstorming to
      proposal.
    </>
  ),
  why: (
    <>
      The concept began with my ink studies of an aircraft: takeoff angles, control surfaces,
      the lines a plane draws when it leaves the ground. Mirrored once, the drawings opened a
      void; mirrored again, they closed into a falcon, the national bird carrying the national
      script. A monument for a roundabout has one job, to be read at speed, and a takeoff line
      is the fastest line there is.
    </>
  ),
  how: [
    <>Sketch the aircraft in ink: takeoff pitches, primary and secondary control surfaces.</>,
    <>Layer the takeoff traces at different angles, then fold the set over itself until no void
      is read.</>,
    <>Build the layered blades in Rhino SubD, thread the pierced calligraphy panels between
      them, and <span style={{ whiteSpace: 'nowrap' }}>re-landscape</span> the roundabout so the
      ground carries the bird.</>,
  ],
  outcome: (
    <>
      The proposal shipped as the office&rsquo;s competition entry, made the finalists, and
      lives on the practice&rsquo;s site. The falcon stayed on the drawing board, which is
      where most competition monuments live; the sketches that started it are in the gallery.
    </>
  ),
}

export default spine
