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
// standard term a screener searches. It shipped as its own tier above the
// adjective row for one build and Emilie CUT IT: the four adjectives are the
// claim on the landing.
//
// ⚠ THIS COMMENT USED TO SAY the title therefore lived "in the BIO, in the
// second paragraph". IT DOES NOT, and has not since the round-5 "cut the fluff"
// pass took that beat out. Checked on the rendered page 2026-08-05:
// `Design Technology Architect` appears in the <title>, the landing's
// aria-label, the /work footer, the CV and the book, and NOWHERE a reader of
// the landing can see it. Emilie was shown three ways to put it back (a kicker
// reading "About · Design Technology Architect", a byline, or nothing) and
// chose NOTHING, 2026-08-05: the four adjectives remain the whole claim and the
// title stays machine-facing. That is a decision now, not an accident.

// THE BIO (THE SCROLL, 2026-07-27; REWRITTEN A TO Z at THE WORDS, 2026-07-28).
// The site had no bio anywhere: /contact is a contact sheet ("Say hi"), not a
// biography. This closes the scroll beside the mind-graph, where a reader
// arrives at it rather than being asked to decode a drawing first.
//
// WHY IT WAS REWRITTEN. The first draft was a job description with better
// sentences. Emilie's verdict on three polished versions of it: "I don't like
// either, the bio should be more personal, humble, fun, some character." So the
// session stopped drafting and interviewed her instead, and the paragraphs
// below are assembled out of her own answers. Everything that follows is close
// to verbatim hers:
//   - "we build for the eye sometimes, which helps, but most of the time for
//     function. We should build for us to function at our best, not the
//     buildings" (her thesis, and better than anything drafted for her)
//   - "someday for a cursor instead of a human. I wonder is that dystopian or
//     utopian?"
//   - "I like to be the most interested person in the room, not the most
//     interesting one."
//
// FOUR BEATS: the argument · the noticing and the instruments · the honest
// limit · the character. Her rulings at the round-3 gate: open on the ARGUMENT
// rather than on herself, so a stranger meets an idea before a person; combine
// the blank-file admission with the cursor question, phrased with a word "only
// a coder would know" (her suggestion: notebook, which is also literally true,
// the T-114 note already says the notebook scaffolds came with the course);
// and CLOSE WITHOUT A QUESTION, on the character line.
//
// ROUND 4, and the correction that produced it. A draft went out that had been
// smoothed into competence: her mid-paragraph question "which is
// counterintuitive isn't it?" had been flattened into a colon, and the
// indignation was gone entirely. Her catch, verbatim: "while you analyzed my
// voice you also lost it." So the question is RESTORED AS A QUESTION, the heat
// returns in one line ("what gets me is how few people know it is being done to
// them"), and the cursor paragraph now ENDS on "Dystopian or utopian?" with
// nothing after it. Her instruction on that: "let it have its moment." A
// self-correction beat was drafted for paragraph two ("I used to call that
// taste") and she cut it: "it doesn't feel like something I would say."
//
// THE MOVES THIS PROSE IS MAKING, so a future edit does not sand them off
// again: the question asked mid-paragraph and left unanswered · the honest
// limit stated before the capability · and no summarising last sentence
// anywhere.
//
// ROUND 5, her cut, verbatim: "let's cut the fluff bro". Two beats went:
// "what gets me is how few people know it is being done to them" (the
// indignation line, which she had asked for and then judged as padding once
// she read it in place) and "I noticed it in myself first. My head works
// better in some rooms than in others, and once you notice you cannot stop
// noticing." What survives is argument, instruments, honest limit, character,
// with nothing between them. Back to roughly the height of the draft that
// preceded this whole session, at a fraction of its hedging.
//
// THINGS THIS DELIBERATELY DROPPED, recorded so nobody restores them by
// accident: the anchor title "Design Technology Architect" is no longer in the
// prose (it stays in the <title>, the landing's aria-label, the footer, the CV
// and the book), and "Behavior Information Modeling" left the landing prose
// too. She was offered both as grafts and took neither. The coinage still owns
// its pillar page and rides the graph as a node label.
//
// Verbs stay honest: a copilot SCORES, a model ESTIMATES, neither measures.
// No availability signal, no em dashes.
//
// SIGNED by Emilie 2026-07-29 ("sign everything"), which is why the export is
// BIO and no longer BIO_DRAFT. Five rounds and one interview to get here.
// ROUND 6 · REORDERED, NOT REWRITTEN (Emilie, 2026-08-05). Her comment was
// structural rather than verbal: "it's about me and my work, maybe it should
// start with something more about me? or organize it better."
//
// THE HONEST LIMIT MOVES FIRST. Three orders were rendered in full at the real
// measure and she picked this one. Opening on what she cannot do is disarming,
// it is unmistakably hers, and it answers "start with something about me"
// without spending the first paragraph on a claim. The argument lands harder
// arriving second, because a limit has already been admitted.
//
// TWO EARLIER RULINGS SURVIVE, and both were checked before this moved:
//   · "close without a question, on the character line" (round 3). An order
//     that opens on the character line would have ended the bio on "Dystopian
//     or utopian?", reversing it. She was shown that version and did not take it.
//   · "So I build the instruments" still follows the argument it depends on.
//     Any order that separates them breaks the "So" and needs a rewrite, which
//     is why only three of the possible orders were ever offered.
//
// NOT ONE WORD CHANGED. Every paragraph is still the signed 2026-07-29 text.
export const BIO: readonly string[] = [
  'I will not pretend I can fill a blank notebook from nothing. What I am good at is judging what the machine hands back and steering it. Someday that might be for a cursor instead of a person. Dystopian or utopian?',
  "We build for the eye sometimes, which helps. Mostly we build for function, which is counterintuitive isn't it? We should be building for us to function at our best, not the building.",
  'So I build the instruments: Sensi scores a floor plan across six senses, NeuroSpace estimates how a room reads to the brain and shows its weights so you can disagree with them.',
  'I would rather be the most interested person in the room than the most interesting one.',
]
