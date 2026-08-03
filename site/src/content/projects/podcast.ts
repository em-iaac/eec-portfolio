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
import type { ProjectMeta } from './types'

const podcast: ProjectMeta = {
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
  // VERBATIM from the transcript (Dr. Valentine, incoming/podcast/_script.txt);
  // her opinion, not a quantified finding, so it ships in her voice honestly.
  pullQuote: {
    text: 'The built environment is one of the most underutilized tools for public health intervention.',
    source: 'Dr. Cleo Valentine',
  },
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
  showcaseDraft: false, // rewritten off the transcript, re-signed by Emilie (REINDEX batch B, 2026-07-16)
}

export default podcast
