// P-105 · The Lungs. Card copy migrated verbatim from data/projects.tsx
// (locked blurb; dek signed 2026-07-10). Spine authored fresh from the
// public blog post. Framing rules bind: "designed to filter" (proposal
// tense, never built performance); DATA TEAM OF 3 is deliberate (Emilie’s
// ruling: three people did not design the whole hyperbuilding).
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const lungs: ProjectMeta = {
  slug: 'lungs',
  title: 'The Lungs',
  lens: 'computation',
  // · LIVE APP left the meta string 2026-08-20 (the TEAM-label ruling; see
  // sensi.ts). The book still prints it via `liveApp`.
  meta: 'MACAD STUDIO · DATA TEAM OF 3',
  liveApp: true,
  award: 'STUDIO AWARD',
  myPart: 'Data team of three: we built the app that ran the studio.',
  dek: "The studio’s data was the architecture: a live app running a hyperbuilding designed to filter a city’s air.",
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie’s direction 2026-07-14): the dashboard /
  // data-management vocabulary she asked for, still the data team’s ownable
  // claim, never the building’s filtration. Question + dot set SIGNED by Emilie (REINDEX batch A, 2026-07-16).
  question: 'Can a dashboard run an architecture studio?',
  stat: 'TRACKED · 3 TEAMS × 10 WEEKS',
  tech: 'VUE 3 · VITE · TAILWIND · SPECKLE',
  // The cold-start wording retired on Emilie’s instruction (2026-07-15): the
  // link is plain LIVE APP and wears the liveness dot in the links row (the
  // film now carries the tour; the app itself is IAAC-gated anyway). The
  // myPart credit line signed at G4 (2026-07-12); the blurb stays locked.
  links: [
    { label: 'LIVE APP', href: 'https://bimscstudiohb1-production.up.railway.app/' },
    { label: 'BLOG', href: 'https://blog.iaac.net/building-the-nervous-system-how-we-turned-a-hyper-building-studio-into-a-web-app/' },
  ],
  // THE COVER = THE KPI MAP, ALIVE (Emilie’s pick, 2026-07-15): the platform’s
  // dependency network at rest, breathing on hover; cut from her StudioDemo
  // edit below the app header (the teammate login chip never ships). The
  // collage moved out of the web gallery; it stays the book plate below.
  image: { slug: 'lungs', name: 'demo-cover', alt: 'The analysis tower in the live viewer, program gradients in red and blue as the timeline scrubs across the studio platform' },
  // G5: the book spread’s dominant plate (print-assets.mjs bakes the rung).
  // ⚠ NO spreadFit, AND IT WAS BUILT TWICE BEFORE THAT WAS RIGHT.
  // Round one: contain, anchored top, flat ground sampled from the bottom edge.
  // Round two: contain, centred, with a two-stop GRADIENT ground, because this
  // render’s backdrop runs red at the top (#cd5771) to green at the bottom
  // (#a2c1b4) and no flat colour could meet both edges. It blended convincingly.
  // Round three, Emilie on seeing it beside the cropped version: crop it.
  // She was right and the check is what settled it: cover removes 7.5% from each
  // side, and measured against the montage that is the outer margin of the left
  // panel and a sliver of the monitor’s bezel. No chart, no label, no name.
  // THE RULE THIS LEAVES: a plate crops unless the crop costs INFORMATION.
  // Sensi keeps its ground because its crop was eating the SENSES and CONFLICTS
  // column, which is the part that proves the tool scores anything.
  spreadAssets: [{ slug: 'lungs', name: 'tower' }],
  // PAGE TWO (Emilie, 2026-08-11, her swap of timeline for why-how-what). The
  // plate is already a composite of the whole platform, so this page is not
  // allowed to just repeat it in miniature: these four are the two a technical
  // reader scans for (Speckle, and the KPI dependency map) at a size where
  // they read, plus the two things the plate does not carry at all.
  // The portrait Speckle capture sits beside the wide KPI map in a justified
  // row, so it takes a narrow column and neither is cropped.
  // THE ONE FIELD PAGE IN THE BOOK. speckle-live is 0.64, the only portrait
  // asset across all eight projects, so it is the only lead that can hold the
  // full height of the page and let its register stack BESIDE it rather than
  // beneath. Measured: at 170mm tall it is 109mm wide, leaving a 160mm column,
  // and two assets fill 166mm of that 170mm. Three did not fit (300mm), which
  // is why stress-test was CUT. Her ruling of 2026-08-11 ("timeline replaces
  // why-how-what") is what decided which two survive.
  // ⚠ EVERY LEAD IS 'top-outer' (Emilie, 2026-08-12, on seeing the eight asset
  // pages side by side). The corner used to vary per project and the intent was
  // variety; laid out together it read as inconsistency, because a reader flips
  // the pair rhythm and the lead was in a different place five times out of
  // eight. Two of them were worse than inconsistent: a bottom lead puts the
  // REGISTER ABOVE THE LEAD, so the page is read bottom-up, and it inverts the
  // whole furniture block into a running head so the page loses its foot rule.
  // ⚠ THIS ONE PAGE KEEPS ITS FIELD LAYOUT, and it is the deliberate exception
  // to "every lead at the top" (Emilie, 2026-08-12, on seeing what the rule did
  // here). speckle-live is the ONLY PORTRAIT ASSET IN THE BOOK at 0.64, and a
  // top lead is sized by the height it can spare: 63mm wide, a quarter of the
  // page, against a 212mm head column three times wider than any other page’s,
  // with a 150 x 90mm void between them. Measured, not judged.
  //
  // A field lead does NOT carry the fault that moved the other seven: the
  // register never sits above it, and the page keeps its foot rule. It runs full
  // height down the bound edge with the register stacked beside it, which is
  // what a portrait wants and what nothing else in the book needs.
  //
  // The original ruling, kept because it still governs the other seven:
  // ⚠ But the EDGE still alternates, outer / bound / outer, because she asked
  // for exactly that one round earlier ("not always upper left, you know mix
  // and match") and printBook.test.tsx guards it. The two instructions are
  // compatible: what read as inconsistency on the contact sheet was the
  // BOTTOM and FIELD leads, not which trim edge a top lead bleeds from.

  // ⚠ THE TIMELINE LEADS, AND THE PORTRAIT STANDS BESIDE THE HEAD (Emilie,
  // 2026-08-12: "what if we change the lead? let the timeline be the lead, I
  // think the lead being landscape will help the composition"). She was right,
  // and the reason is arithmetic: a lead is sized by the HEIGHT it can spare,
  // so a 2.47 asset turns that height into far more width than a 0.64 one. The
  // timeline goes from 143mm to 198, and the two screens under it grow with it.
  //
  // The portrait then has nowhere good to be. In a justified row it falls to
  // 41mm, because a row hands out width in proportion to aspect and a portrait
  // asks for almost none. Standing it in the head column instead spends the
  // page’s spare HEIGHT on it, which is exactly what a landscape lead leaves
  // over, and it comes back to 71mm.
  //
  // Four assets where one is a portrait is the hardest page in the book, and it
  // took five compositions drawn at size to find this one. The two rejected
  // families are worth not repeating: the portrait LEADING (everything else
  // shrinks, and the portrait is still only 72mm) and three stacked in a field
  // column (66mm each, at which the KPI map’s node labels stop being readable).
  // The edge is BOUND so the book keeps alternating outer/bound down its eight
  // asset pages, which printBook.test.tsx guards. Mirrored, not changed: the
  // timeline bleeds right, the head and the portrait stand in the left column.
  bookLead: { slug: 'lungs', name: 'timeline', corner: 'top-bound' },
  bookRegister: [
    { slug: 'lungs', name: 'kpi-map' },
    { slug: 'lungs', name: 'stress-test' },
  ],
  bookColumn: { slug: 'lungs', name: 'speckle-live' },
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default lungs
