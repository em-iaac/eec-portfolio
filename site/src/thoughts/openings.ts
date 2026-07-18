// THE OPENINGS (G2): the first sentences of each thought note, VERBATIM.
// The /thoughts index and the CV career graph's field card show these as
// excerpts, so the shelf reads like the notes it holds. Kept in a JSX-free
// module so the graph never drags the full note prose (notes.tsx) into its
// chunk. Update an opening whenever its note's first lines change (notes.tsx
// re-exports this map so the pairing stays visible there).
export const THOUGHT_OPENINGS: Record<string, string> = {
  bim: "For thirty years we've been getting very good at Building Information Modeling: every beam, every duct, every clash, tracked to the millimeter.",
  neuroaes:
    'Neuroaesthetics is the unglamorous name for a question everyone already feels: why does one room settle you and another keep you on edge?',
  solvers:
    "A physics solver is the most honest collaborator I have: it doesn't care what I intended, only what I actually built.",
  genai:
    'Generative AI made the inspired gesture free. Anyone can produce a thousand renders before lunch, and a render is a promise, not a product.',
  xreal:
    'I started in a lab strapping headsets onto students to see whether a lesson lands harder when you can walk around inside it.',
  comfort:
    "You don't walk into a room and average your experience. You walk in and the thing that's wrong is the thing you notice: the glare, the echo, the cold draft on the back of your neck.",
  drawiface:
    'For most of my life the drawing was the output. You designed the thing, then you drew it to prove it existed.',
  evosearch:
    'Evolutionary search is what I reach for when a problem is too tangled to solve head on: describe what good looks like, then let a population of designs breed, mutate, and compete until something clever falls out.',
  heritage:
    'The usual choice with an old building is a trap: treat it as a museum piece no one may touch, or drop a glass-and-steel box in the middle and call it modern.',
  respond:
    'Right now a building is a fixed guess. Someone chose the ceiling height and the window size years before you arrived, and you live inside their averaged assumptions whether they fit you or not.',
  charcoal:
    'When the art class was asked who here dislikes drawing, mine was the only hand that went up. Awkward.',
  pelagnou: 'Some projects hand you a tool; Pelagñou handed me a library card.',
  explain:
    'How do you explain a complex, honestly boring technical subject so someone leans in instead of glazing over?',
}
