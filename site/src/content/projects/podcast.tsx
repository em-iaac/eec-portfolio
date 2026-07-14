// P-107 · Optimizing for the Mind (the podcast, the listening member).
// Card copy migrated verbatim from data/projects.tsx (dek + pull-quote usage
// signed 2026-07-10). The meta row IS the attribution (Emilie's Session 7
// ruling: no separate myPart). The audio hero leads with the pull-quote.
// The quantified research (qEEG etc.) is Dr. Valentine's, never Emilie's:
// the spine stays on the conversation and the coined term. No HOW: it is a
// conversation, not a pipeline, and the slot is not padded.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMaster } from './types'

const podcast: ProjectMaster = {
  slug: 'podcast',
  title: 'Optimizing for the Mind',
  lens: 'computation',
  meta: 'MACAD PODCAST · CO-HOSTED WITH CHARLES ABI CHAHINE',
  dek: 'Where Behavior Information Modeling got its name: why no standard yet asks if a building is good for your brain.',
  dekSigned: true,
  // THE QUESTION (D4): DEFERRED to the question-discovery session (Emilie,
  // 2026-07-13). Candidate parked: "Why does no building code ask whether a
  // space is good for your brain?" ("ask", not "measure": the quantified
  // research is Dr. Valentine's). The signed dek serves meanwhile.
  pullQuote: {
    text: 'There is no standard, anywhere in the world, that measures whether a building is good for your brain.',
    source: 'Dr. Cleo Valentine, Cambridge',
  },
  blurb: (
    <>
      The conversation with Dr. Cleo Valentine (Cambridge, architectural neuroimmunology) where Behavior Information
      Modeling was born. "There is no standard, anywhere in the world, that measures whether a building is good for
      your brain." We think there should be.
    </>
  ),
  tech: 'GENAI · GAME ENGINES · BIM',
  links: [
    { label: 'SPOTIFY', href: 'https://open.spotify.com/episode/6WpF5HmKteEBateSqSWe0D' },
    { label: 'BLOG', href: 'https://blog.iaac.net/optimizing-for-the-mind-integrating-generative-ai-and-game-engines-into-bim/' },
  ],

  what: (
    <>
      A conversation with Dr. Cleo Valentine (Cambridge, architectural neuroimmunology) for the
      MaCAD Theory Podcast, co-hosted with Charles Abi Chahine: her research on how architectural
      geometry affects neuroinflammation and stress regulation, and what it would take for
      cognitive performance to become a building standard.
    </>
  ),
  why: (
    <>
      A facade is not just an aesthetic choice; it is a public health decision. Codes certify
      energy, fire, and structure, yet nothing certifies what a building does to your brain. We
      argued the field deserves a data layer for exactly that.
    </>
  ),
  outcome: (
    <>
      The layer needed a name, so we coined one on air: Behavior Information Modeling. It became
      the spine of my year; NeuroSpace demonstrates it live, Sensi turns it into a copilot, and
      the thesis keeps circling it.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default podcast
