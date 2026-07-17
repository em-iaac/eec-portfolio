// P-109 · Rings of Mars: Ring 4000 (practice). Duo credit per the public
// results page (dossier AWD-05): Charles Abi Chahine, Top 50 stands.
// S2 FIX ROUND (2026-07-16): full WHAT/WHY/HOW/OUTCOME authored from
// Emilie's own telling ("me and charles made some research about 3d printing
// on mars, and how the structure should be at a specific angle to not need
// support... we designed a ring because we wanted to take advantage of the
// craters... each crater would be a ring to create this future community...
// a mix of rhino modeling and generative ai tools at the early stages...
// a ring felt also suiting for the full ecosystem needed and to also
// include a transportation system") + her LinkedIn line (Rhino parametric,
// SubD, AI tools, V-Ray). Her flattened PSD renders joined the strip; the
// badge frame REMOVED at her call; the TOP 50 pill links her entry's
// gallery anchor on the public results page.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMaster } from './types'

const marsception: ProjectMaster = {
  slug: 'marsception',
  title: 'Rings of Mars: Ring 4000',
  lens: 'practice',
  meta: 'MARSCEPTION COMPETITION · WITH CHARLES ABI CHAHINE',
  dek: "An early bet that generative tools belonged on an architect's desk, back when that still raised eyebrows.",
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: she hated the desk line;
  // "this is about how can we build in space? in mars?"). Duo credit binds in
  // the meta row and blurb; the question asks the object. Question + dot set
  // SIGNED by Emilie (REINDEX batch C, 2026-07-16); the S2 HOW/OUTCOME
  // beats SIGNED at the S2 sign-off, 2026-07-17.
  question: 'How do you design a habitat for Mars?',
  alsoAnswers: [
    { q: 'Could AI help design a Mars habitat, years before that was normal?', beat: 'how' },
    { q: 'Why build a ring inside a Martian crater?', beat: 'why' },
    { q: 'How do you 3D print on Mars without support structures?', beat: 'how' },
    { q: 'Could generative tools and architecture share a desk?', beat: 'outcome' },
  ],
  award: 'TOP 50 @ VOLUME ZERO',
  myPart: 'A two-person entry with Charles Abi Chahine.',
  blurb:
    'A habitat ring for Mars, designed with AI-driven workflows back when that still raised eyebrows. A two-person entry with Charles Abi Chahine: research into printing regolith without supports, a ring per crater as the seed of a future community, and generative tools rendering concepts straight from the Rhino model.',
  tech: 'RHINO · SUBD · AI WORKFLOWS · V-RAY',
  links: [],
  // S2 cover: a crossfade cut of the crater hero, the farming interior, the
  // transfer box and the ring plan (mars-cover-web.webp, derived). Alt SIGNED 2026-07-17.
  image: {
    slug: 'mars',
    name: 'mars-cover',
    alt: 'Ring 4000 at a glance: the ring in its crater, the farming interior, the transfer box and the annotated ring plan',
  },
  // Created crossfade cover: card face ONLY, never a deck page (Emilie's
  // round-3 rule: a cover I assembled is not an asset).
  coverMontage: true,

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
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default marsception
