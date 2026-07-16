// P-107 · Optimizing for the Mind (the podcast, the listening member).
// HONESTY CORRECTION (2026-07-15): the prior pullQuote + blurb quoted "There
// is no standard, anywhere in the world, that measures whether a building is
// good for your brain" as Dr. Cleo Valentine — that line is NOT in the
// transcript (incoming/podcast/_script.txt, 23pp). It was a fabricated
// attribution to a real person and is REPLACED with verbatim quotes checked
// against the transcript. The quantified research (qEEG etc.) is Dr.
// Valentine's, never Emilie's: the spine stays on the conversation and the
// coined term. No HOW: a conversation, not a pipeline. The rewritten copy
// (dek, pull quote, spine, the 7 verbatim quote cards, the alts) was
// RE-SIGNED by Emilie (REINDEX batch B, 2026-07-16); the quotes stay
// verbatim and Dr. Valentine's science diagrams stay out, binding.
import type { ProjectMaster } from './types'

const podcast: ProjectMaster = {
  slug: 'podcast',
  title: 'Optimizing for the Mind',
  lens: 'computation',
  meta: 'MACAD PODCAST · CO-HOSTED WITH CHARLES ABI CHAHINE',
  dek: 'The conversation with Dr. Cleo Valentine where Behavior Information Modeling got its name: architecture as a public health question.',
  dekSigned: true, // re-signed by Emilie off the verbatim rewrite (REINDEX batch B, 2026-07-16)
  // THE QUESTION (D4 round 2, Emilie's direction 2026-07-14): the highest
  // volume search phrase, owned as a conversation ("its nice", her words).
  // The quantified research stays Dr. Valentine's. Question + dot set SIGNED
  // by Emilie (REINDEX batch B, 2026-07-16).
  question: 'How does architecture affect your brain? A conversation.',
  alsoAnswers: [
    { q: 'Why does no building code ask whether a space is good for your brain?', beat: 'why' },
    { q: 'Where did Behavior Information Modeling come from?', beat: 'what' },
    { q: 'Is a facade a public health decision?', beat: 'why' },
    { q: 'What would it take for cognitive performance to become a building standard?', beat: 'why' },
  ],
  // VERBATIM from the transcript (Dr. Valentine, incoming/podcast/_script.txt);
  // her opinion, not a quantified finding, so it ships in her voice honestly.
  pullQuote: {
    text: 'The built environment is one of the most underutilized tools for public health intervention.',
    source: 'Dr. Cleo Valentine',
  },
  blurb: (
    <>
      The conversation with Dr. Cleo Valentine, the architectural neuroimmunology researcher, where Behavior Information
      Modeling got its name. She calls the built environment "one of the most underutilized tools for public health
      intervention." We spent an hour on what it would take to design as if that were true.
    </>
  ),
  tech: 'GENAI · GAME ENGINES · BIM',
  // THE COVER = THE QUOTE REEL (Emilie's design, 2026-07-16): a gif of the
  // seven quote cards, still at rest, playing on hover; the crisp reel video
  // leads the plate (video-manifest). This makes the hero a video, so the
  // Spotify link now lives in the links row below (still one tap away).
  image: { slug: 'podcast', name: 'demo-cover', alt: 'The podcast quote reel: seven timestamped lines from the conversation on architecture and the brain' },
  coverMontage: true, // the reel plays on the card; the plate flips the 7 cards
  links: [
    { label: 'SPOTIFY', href: 'https://open.spotify.com/episode/6WpF5HmKteEBateSqSWe0D' },
    { label: 'BLOG', href: 'https://blog.iaac.net/optimizing-for-the-mind-integrating-generative-ai-and-game-engines-into-bim/' },
  ],

  what: (
    <>
      A conversation with Dr. Cleo Valentine, a design researcher at HKS and affiliate lecturer at
      Cambridge who is building the field of architectural neuroimmunology, for the MaCAD Theory
      Podcast, co-hosted with Charles Abi Chahine. Her research studies how architectural geometry
      affects neuroinflammation and stress regulation; we asked what it would take for cognitive
      performance to become a building standard.
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
      The layer needed a name, so we coined one on air: Behavior Information Modeling. Cleo's
      reply is the reason it stuck, "I hope that catches on because that's a really, really
      elegant and articulate way of describing what we're trying to do." It became the spine of
      my year; NeuroSpace demonstrates it live, Sensi turns it into a copilot, and the thesis
      keeps circling it.
    </>
  ),
  showcaseDraft: false, // rewritten off the transcript, re-signed by Emilie (REINDEX batch B, 2026-07-16)
}

export default podcast
