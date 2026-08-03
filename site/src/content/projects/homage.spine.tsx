// THE SPINE of homage: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of homage.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// homage.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What could adaptive reuse do for the Rachid Karami Fair in Tripoli?', beat: 'what' },
    { q: 'Why does Tripoli need its third heart back?', beat: 'why' },
    { q: 'What is the Transfer Box?', beat: 'how' },
    { q: 'What came of a thesis about an unfinished fair?', beat: 'outcome' },
  ],
  what: (
    <>
      My bachelor thesis at LAU, supervised by Issam Barhouch: an adaptive reuse of Oscar
      Niemeyer&rsquo;s Rachid Karami International Fair in Tripoli, the fairground left unfinished
      when Lebanon&rsquo;s war stopped the works. The intervention re-inhabits the remnants of his
      collective housing bar as three homages at once: the past kept in the original units, the
      present dug into sunken courts that hand the ground back to nature, and the future inserted
      as new unit typologies, workshops and an educational exhibition.
    </>
  ),
  why: (
    <>
      Niemeyer said Tripoli has two hearts, the old city and the port, and that the fair would
      become the third. Half a century later the third heart still is not beating. A homage, the
      thesis argues, is not a museum piece: it is the building lived in again.
    </>
  ),
  how: [
    <>
      Read the site through its own timeline: the 1960 design, decades of piecemeal
      interventions, then the two moves that matter, reconnecting the ground to nature and
      connecting past, present and future in one section.
    </>,
    <>
      Keep the old Niemeyer typology and insert three new unit types alongside it, studios,
      luxury units and affordable artisan apartments with their own workshop space, under planted
      roofs.
    </>,
    <>
      Invent the Transfer Box: a rail mounted glass container that moves materials and artworks
      through an underground gallery and doubles as a moving exhibition room.
    </>,
  ],
  outcome: (
    <>
      The Tamayouz Excellence Award panel selected The Homage among its Top 100 architecture
      graduation projects for 2023, out of 422 entries from 141 universities in 36 countries. It
      is also where this record starts: the first project that asked what a building owes the
      people, and the past, inside it.
    </>
  ),
}

export default spine
