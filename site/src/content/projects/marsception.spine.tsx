// THE SPINE of marsception: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of marsception.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// marsception.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Could AI help design a Mars habitat, years before that was normal?', beat: 'how' },
    { q: 'Why build a ring inside a Martian crater?', beat: 'why' },
    { q: 'How do you 3D print on Mars without support structures?', beat: 'how' },
    { q: 'Could generative tools and architecture share a desk?', beat: 'outcome' },
  ],
  what: (
    <>
      A habitat ring for Mars, a two-person competition entry with Charles Abi Chahine. Ring
      4000 sits in the rim of a crater inside Valles Marineris: a 3D printed regolith shell
      holding farming, research, living pods and a transportation ring in one closed loop, with
      the long game that every crater gets its own ring until the rings are a community. It
      placed in Marsception&rsquo;s Top 50.
    </>
  ),
  why: (
    <>
      The craters are the site Mars already gives you, so the ring takes their shape instead of
      fighting it. And a ring suits everything a habitat needs: the ecosystem closes on itself,
      the transport runs in a loop, and the future expansion is just the next crater over.
    </>
  ),
  how: [
    <>
      Research 3D printing on Mars: regolith melted into paste, printed by drone robotics, and
      shaped so every surface stands at an angle that needs no support, because we all hate
      support with 3D printers.
    </>,
    <>Model the ring in Rhino with SubD, from the massing to the sleeping pods.</>,
    <>
      Feed the model to generative AI tools, at the early stage of image generation becoming a
      thing, to render concepts straight from the geometry, finished in V-Ray.
    </>,
  ],
  outcome: (
    <>
      Top 50 at Marsception, listed with both our names on the public results page. And my first
      proof that generative tools and architecture could share a desk: an early bet, and it aged
      well.
    </>
  ),
}

export default spine
