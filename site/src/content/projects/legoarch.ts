// P-106 · lEgoarCh. Card copy migrated verbatim from data/projects.tsx
// (dek signed 2026-07-10). Spine authored fresh from the public blog + repo.
// HONESTY rules bind hard here: the ceiling is "digitally verified buildable"
// (never claims physical assembly), and the "93% supported" pull-quote
// describes the instructive intermediate FAILURE: the fail is narrated
// WITHOUT its percentage and never as a result (the anti-claim ruling).
// Duo credit woven: built with Charles Abi Chahine, end to end as a pair.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const legoarch: ProjectMeta = {
  slug: 'legoarch',
  title: 'lEgoarCh',
  lens: 'computation',
  meta: 'MACAD GENERATIVE AI · WITH CHARLES ABI CHAHINE',
  award: 'JURY AWARD',
  myPart: 'Built with Charles Abi Chahine, end to end as a pair.',
  dek: 'A render is only a promise until the bricks fit: AI imagines the set, code makes it actually buildable.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie's direction 2026-07-14): her "how can AI
  // turn text into lego sets" shape. HONESTY: input is a TEXT prompt (her
  // "or images" trimmed: images are the pipeline's intermediate, not its
  // input); ceiling stays digitally verified buildable. Question + dot set SIGNED by Emilie (REINDEX batch A, 2026-07-16).
  question: 'How can AI turn a text prompt into a LEGO set that actually snaps together?',
  stat: 'LORA · 40 IMAGES · 3 BENCHMARKS',
  tech: 'FLUX.2 KLEIN · TRELLIS-2 · LORA · LDRAW',
  links: [
    { label: 'GITHUB', href: 'https://github.com/hi-em/genai-legoarch' },
    { label: 'BLOG', href: 'https://blog.iaac.net/legoarch-behind-the-sets/' },
  ],
  // THE COVER = THE SOLVE, ALIVE (Emilie's ask, 2026-07-15): Saint Basil's
  // solving into its brick layout, still at rest, playing on hover; cut from
  // her sfx demo recording inside the app frame. The golden Sagrada render
  // moved into the flip-through (and stays the book plate below).
  image: { slug: 'legoarch', name: 'demo-cover', alt: "Saint Basil's Cathedral solving into a brick layout in lEgoarCh, the stage with no AI in it on purpose" },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  // THE PLATE MOVED (Emilie, 2026-08-11). It was sagrada-render, which was the
  // weakest image in the book at 1024px, was the one place the book broke this
  // project's own rule (explanation or screenshot, never a product render),
  // and had left the manifest, which stopped `npm run print-assets` writing
  // anything at all. `outputs` replaces it: what goes in and what comes out,
  // fitted rather than cropped so the six labelled thumbnails all survive.
  spreadAssets: [{ slug: 'legoarch', name: 'outputs' }],
  spreadFit: { mode: 'contain', ground: '#000000' },
  // PAGE TWO: six self-titling slides, so even at a third of the page each one
  // still states its claim. The failure named out loud leads.
  // Her ruling was six claims in a grid. The editorial pass (2026-08-12) traded
  // two of them for a lead, because six assets leave the lead 48mm and it stops
  // leading. CUT: lora-sweep and perceptual-colour. What survives is the three
  // claims that are hardest to argue with.
  //
  // A BOTTOM LEAD, and this is the one project it suits best: the pipeline is
  // not an opening, it is the summation. The claims run across the top and the
  // machine that produced them anchors the foot. Only two pages in the book do
  // this, and both are pipelines.
  // ⚠ EVERY LEAD IS 'top-outer' (Emilie, 2026-08-12, on seeing the eight asset
  // pages side by side). The corner used to vary per project and the intent was
  // variety; laid out together it read as inconsistency, because a reader flips
  // the pair rhythm and the lead was in a different place five times out of
  // eight. Two of them were worse than inconsistent: a bottom lead puts the
  // REGISTER ABOVE THE LEAD, so the page is read bottom-up, and it inverts the
  // whole furniture block into a running head so the page loses its foot rule.
  // Her ruling: make all eight follow page 4. EVERY LEAD IS NOW AT THE TOP.
  // ⚠ But the EDGE still alternates, outer / bound / outer, because she asked
  // for exactly that one round earlier ("not always upper left, you know mix
  // and match") and printBook.test.tsx guards it. The two instructions are
  // compatible: what read as inconsistency on the contact sheet was the
  // BOTTOM and FIELD leads, not which trim edge a top lead bleeds from.
  // ⚠ THE ONLY FILLET LEFT IN THE BOOK WAS INSIDE THIS PICTURE (Emilie,
  // 2026-08-12: "remove the fillet, or crop the fillet out of the lead image").
  // The asset-page redesign removed the 2mm radius we were DRAWING on every
  // image, and then this lead turned out to be a cream card with a 30px corner
  // radius already baked in, so the one page still showing a rounded corner was
  // the one page where it was not ours to remove.
  // Measured on the source: 2px of white margin, 30px of radius, 1819 x 782.
  // 0.042 of the shorter side is 32px off every edge, which clears both.
  bookLead: { slug: 'legoarch', name: 'pipeline', corner: 'top-bound', trim: 0.042 },
  bookRegister: [
    { slug: 'legoarch', name: 'honest-part' },
    { slug: 'legoarch', name: 'split-and-merge' },
    { slug: 'legoarch', name: 'real-parts' },
  ],
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default legoarch
