// The landing's SIGNED identity lines (Emilie, G4 2026-07-12), in one module
// so every rendition (the DOM hero, the printed book's cover) quotes the
// same source and a re-signed line updates everywhere at once (THE ECONOMY).
// LandingCover.tsx renders these; src/print/PrintBook.tsx reuses VOICE.
// S1 (2026-07-26): `writer` retires and `computational designer` takes the slot.
// The strategy pass's finding: /thoughts already proves the writing, so the word was
// spending a slot it did not need, while the one standard term every screener searches
// appeared nowhere a human could see. Four words stays the ceiling; no `AI` prefix.
export const ADJECTIVES = 'architect · computational designer · researcher · creative technologist'
export const VOICE = 'I work with design, technology and minds.'
export const WINK = 'this whole mess is my head. touch a piece of it.'

// THE ROLE (THE SCROLL, 2026-07-27). "Design Technology Architect" is the one
// standard term a screener searches, and it lived only in the <title> tag and
// the /work footer, which is to say nowhere a human reading the site could see
// it. It shipped as its own tier above the adjective row for one build and
// Emilie CUT IT: the four adjectives are the claim on the landing. Her call at
// the same gate was that the title belongs in the BIO, so that is where it is,
// in the second paragraph, said the way a person says it rather than the way a
// job board does. Nothing else consumes this constant, so it is not exported.

// THE BIO (THE SCROLL, 2026-07-27). DRAFT, unsigned. The site had no bio
// anywhere: /about is a contact sheet ("Say hi"), not a biography. This closes
// the scroll beside the mind-graph, where a reader arrives at it rather than
// being asked to decode a drawing first. Three beats: where she came from, what
// she builds now (and what it is called), and the question underneath all of
// it. It ends on the question rather than a claim, and it carries no
// availability signal. Verbs stay honest: a copilot SCORES, a model ESTIMATES,
// neither of them measures.
export const BIO_DRAFT: readonly string[] = [
  'I trained as an architect and kept going until the drawing could think back.',
  'The title I answer to now is Design Technology Architect, which mostly means I build the instruments: a copilot that scores how a room will feel before anyone builds it, a model that estimates how a space reads to the brain, systems that turn behaviour into something you can actually draw with. I call the through line Behavior Information Modeling.',
  'Underneath it is one question asked in different rooms. What is the building doing to the person inside it?',
]
