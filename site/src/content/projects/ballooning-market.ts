// P-104 · A Ballooning Market. Card copy migrated verbatim from
// data/projects.tsx (locked blurb; dek signed 2026-07-10). The spine is
// TRIMMED from the retired P-104 sheet: the solver-goals listing did not
// migrate (the blog tells the long version). The instructive fail stays
// filed as the outcome, on purpose.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const ballooningMarket: ProjectMeta = {
  slug: 'ballooning-market',
  title: 'A Ballooning Market',
  lens: 'computation',
  meta: 'MACAD · SOLO',
  dek: 'Physics is the difference between a mess and a roof: the balloons ghosted through each other until Kangaroo gave them awareness.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: she hated the mess line as
  // lead, loved the touch-nothing and teach-balloons ones, asked for the
  // pneumatic-simulation register; fused below). Question + dot set SIGNED by Emilie (REINDEX batch C, 2026-07-16).
  question: 'Can balloons roof a historic market without touching it? A pneumatic simulation.',
  tech: 'GRASSHOPPER · KANGAROO · DENDRO · D5',
  // ⚠ THE ALGORITHM LEADS, AND EVERY BAKED HEADING IS CROPPED OFF (Emilie,
  // 2026-08-12). Two decisions, and the second is the one that matters.
  //
  // THE LEAD. The Grasshopper algorithm is the densest asset here and it was
  // sitting in the register at 88mm, where its boxes and arrows are decoration.
  // At 210mm they are readable. The cost is that the four-stage inflation sheet
  // drops to a register width and its own stage labels stop being legible, which
  // is survivable because the book's caption already names those four stages.
  //
  // THE CROPS. Every asset on this page arrived with its own title burnt in
  // ("// ballooooooning", "// the algorithm", "// epic fails") plus its own red
  // stage labels and grey descriptions. Printed, the lead's heading set LARGER
  // THAN THE PROJECT TITLE on the facing page, in a face the book uses nowhere
  // else: two title systems, two caption systems, one spread.
  // Her ruling: crop them, and let the book's full captions do the labelling.
  //
  // The bands below are MEASURED off each image's own row-by-row ink profile,
  // not guessed. algorithm: heading occupies 4-11% of the height, drawing runs
  // 18-98%. process: heading 6-13%, drawing 34-63%, red labels 77-79%,
  // descriptions 85-97%. epic-fails: heading 5-13%, drawing 27-78%, error
  // labels 85-93%.
  bookLead: {
    slug: 'ballooning-market',
    name: 'algorithm',
    corner: 'top-bound',
    crop: { top: 0.15 },
  },
  // ⚠ epic-fails LEFT THE PAGE, and the crops are why (Emilie, 2026-08-12:
  // "I like how it is without the labels but there is something off about the
  // secondary asset row ... let's remove the epic fails here and just make the
  // two assets bigger").
  //
  // The chain is worth writing down because it is not obvious: cropping the
  // baked headings and stage labels off makes an image WIDER (process went from
  // 2.07 to 4.40, epic-fails from 2.06 to 3.37), and a justified row hands out
  // width in proportion to aspect, so three wide assets sharing one measure gave
  // a 27mm row and a 48mm render. Two give a 42mm row, a 186mm process sheet and
  // a 76mm render. REMOVING BAKED TEXT COSTS REGISTER HEIGHT, and this is what
  // paying for it looks like.
  //
  // Nothing is lost by dropping it: the failures are told in the facing page's
  // own WHAT CAME OF IT, "the balloons had no physical awareness of each other,
  // just ghosting through one another in a chaotic, colorful mess". The picture
  // was the second telling, not the only one.
  bookRegister: [
    { slug: 'ballooning-market', name: 'process', crop: { top: 0.25, bottom: 0.28 } },
    // ⚠ render-3 REPLACED souk-interior (Emilie, 2026-08-12). The souk is the
    // richer image and the wrong one at this size: it is a wide scene of stalls
    // and figures, and at 76mm beside a 186mm stage sheet that becomes texture.
    // render-3 has ONE figure doing ONE thing, which is what survives small.
    // It also earns its place in the sequence rather than just filling it: the
    // algorithm above ends on `spine tunnel`, and this is the spine tunnel, so
    // the register reads as cause and effect.
    // ⚠ chromatic-study was the other candidate and is NOT a render: it is a
    // studio sheet with "// rgb glitch" baked in, the exact thing this page just
    // finished cropping off everything else.
    { slug: 'ballooning-market', name: 'render-3' },
  ],
  links: [
    { label: 'BLOG', href: 'https://blog.iaac.net/a-ballooning-market-why-i-decided-to-fill-a-historic-market-with-balloons-and-how-i-almost-failed/' },
  ],
  // THE COVER = THE INFLATION, ALIVE (Emilie, 2026-07-15): the Kangaroo
  // process gif, still at rest, playing on hover; render-1 moved into the
  // strip and stays the book plate below.
  image: { slug: 'ballooning-market', name: 'process', alt: 'The Kangaroo inflation running: balloons seeding, anchoring and settling into a roof over Bab al-Luq market' },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  // ⚠ NO spreadFit HERE, AND THAT IS THE RULE (Emilie, 2026-08-12): "for the
  // renders we can just crop and zoom in, because it won't look wrong, it's a
  // picture". A contain ground was BUILT for this plate and reverted on sight.
  // The distinction that came out of it: cropping a RENDER costs framing, and
  // cropping a SCREEN costs information. Sensi's crop removed the panel that
  // proves the tool scores anything; this one removes some pavement.
  // Measured before deciding: this image's bottom edge varies by 53 across the
  // strip (cars, awnings, palms), so no flat ground could ever match it and the
  // band printed as a slab.
  spreadAssets: [{ slug: 'ballooning-market', name: 'render-1' }],
  // PAGE TWO (Emilie, 2026-08-11): four method, two renders. Everything this
  // project owns is about 2:1, so a plain grid is honest here where it would
  // crop half the book. epic-fails earns its place ahead of prettier frames:
  // the two errors are named on the slide, which is the account of what the
  // machine got wrong that almost nobody prints.
  // Her ruling was "1 · four method, two renders". At four assets that becomes
  // the process promoted, two methods, and ONE render. CUT: design-matrix, and
  // render-3, which was the second of two renders where souk-interior is the
  // better one. The process sheet opens the page because it is the first beat
  // of her order.
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

  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default ballooningMarket
