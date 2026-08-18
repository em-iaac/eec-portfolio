// P-108 · Verve City Walk (practice). S2 FIX ROUND (2026-07-16): retitled
// from "Towers at SOMA" at Emilie’s call: Verve City Walk is the project’s
// name; the entry id 'soma' and this file’s slug stay (permanent URLs).
// Verve leads; District O, Enara and Saria stay woven with their public
// links (her pick at the gate). Responsibilities woven from her LinkedIn
// record (Design Architect, SOMA, Aug 2023 - Jul 2024: Rhino + Grasshopper
// design exploration and parametric facade studies; Revit BIM for
// floorplans, facade strategies and interior layouts of the residential
// towers). The TG renders are project marketing imagery, never personal
// renders; the NDA on Verve imagery was lifted 2026-07-16.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17), incl. the re-drafted dek.
import type { ProjectMeta } from './types'

const somaTowers: ProjectMeta = {
  slug: 'soma-towers',
  title: 'Verve City Walk',
  lens: 'practice',
  meta: 'SOMA · DESIGN ARCHITECT · 2023-24',
  myPart: 'Design architect at SOMA: parametric facade studies in Rhino and Grasshopper, carried into the Revit BIM set.',
  dek: 'Verve at City Walk, from parametric facade studies to the BIM set.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "good", lead kept; still
  // true of the retitled entry). Question + dot set SIGNED by Emilie
  // (REINDEX batch C, 2026-07-16).
  question: 'What survives when a parametric study meets a real drawing set?',
  tech: 'RHINO · GRASSHOPPER · REVIT',
  // THE BOOK (2026-08-11). Verve joined the book this session: it is the only
  // page that answers whether a parametric study survives into a real drawing
  // set, which is the question the rest of the site leaves open. The two-tower
  // elevation is the plate because it is 9930px, it is almost exactly the
  // plate’s shape so it barely crops, and it is a drawing rather than a
  // marketing render. PAGE TWO puts what she drew above what the development
  // sells: her contribution here is facade and massing studies carried into
  // the Revit set, and three glossy renders leading a page under her name
  // would say something the credit line does not.
  // ⚠ THE DUSK RENDER IS THE PLATE AND IT CROPS (Emilie, 2026-08-14, after
  // seeing both drawn at size). It is sanctioned soft in printBook.test.tsx.
  //
  // THE ARITHMETIC, because it is the reason this took three attempts:
  // every Verve render is an 880 x 860 square export while the drawings are
  // enormous, so a render cannot hold a plate on resolution and a drawing can.
  // Filled, this one prints 880px across 145mm, about 154dpi against a 300dpi
  // floor, and loses 32% of its height. Fitted it would be 228dpi and whole, but
  // it needs 47mm of ground either side, and she does not want the band.
  //
  // ⚠ WHAT THE DRAWN COMPARISON CHANGED, and it reversed my own recommendation:
  // I argued for putting the elevation back on the plate because it is 9930px
  // and prints at 315dpi. Drawn at size it is two slender towers in a field of
  // white, so the plate reads mostly empty. Correct resolution, wrong image.
  // The render crops better than predicted: the facade, the lit terraces, the
  // skyline and enough of the fog all survive. On screen, which is how a
  // leave-behind is mostly read, 154dpi is fine. Printed it will be soft, and
  // that is the trade she took with the numbers in front of her.
  spreadAssets: [{ slug: 'verve', name: 'dusk-facade' }],
  // ⚠ THE ONE PAGE WHERE THE FOUR-ASSET CEILING BENDS AN EARLIER RULING.
  // Her pick of 2026-08-11 was "1 · drawings above, renders below", which needs
  // two register rows and therefore six assets. At six the lead collapses to
  // 48mm. Raised with her on 2026-08-12 with both costs stated; she took the
  // lead. So the page is now the unit selector promoted, then ONE row holding a
  // drawing and two renders. CUT: typical-plan and podium-pool.
  //
  // Why the lead matters more here than anywhere else: dusk-facade, podium-pool
  // and lounge-interior are all 1.02, so a justified row of them is three equal
  // squares. Without a promoted asset this page is a chessboard.

  // The public anchors (NDA lifted): the developer’s page, SOMA’s own
  // project pages, and the three sibling towers from the same year.
  // ⚠ THE DUSK RENDER LEADS (Emilie, 2026-08-12). unit-selector led before, and
  // it is a screen capture of a 3D viewer mid-orbit: untextured grey massing
  // against a flat gradient sky, with a Filters / AR toolbar and a next arrow
  // floating in the picture. At 192mm it was the largest thing on the page and
  // it showed the TOOL rather than the building, on a spread whose two renders
  // are the best images in the project.
  // The cost is size: at 1.02 the dusk render is nearly square, and a lead is
  // sized by the height it can spare, so it draws 108mm where the selector drew
  // 192. Traded knowingly. The selector keeps its place in the register, where
  // being a screenshot of a working tool is exactly what it is good for.

  // ⚠ THE AMENITIES PLAN LEADS (Emilie, 2026-08-14), and this is the third lead
  // this page has had in two days, which is worth recording because each swap
  // was for a different reason.
  //   unit-selector led first: a screen capture of a 3D viewer mid-orbit, grey
  //     untextured massing with a Filters / AR toolbar floating in it. It showed
  //     the TOOL rather than the building, at 192mm.
  //   dusk-facade led second, and has now gone one page left to become the plate.
  //   amenities-plan leads now: at 192mm its room legends are readable, which is
  //     the whole reason a plan earns a page, and it is the drawing this project
  //     is actually about once the massing is settled.

  bookLead: { slug: 'verve', name: 'amenities-plan', corner: 'top-outer' },
  // ⚠ THE ELEVATION LEFT THE BOOK ENTIRELY (Emilie, 2026-08-14: "go with A and
  // drop the elevation"). Not demoted, dropped. At 80mm in a register it stood
  // 56mm tall, and the balcony rhythm the whole facade study is about was not
  // visible at that size: a drawing doing nothing is worse than a drawing absent.
  bookRegister: [
    // ASSET RETOUCH (2026-08-18): the capture carried the viewer's own chrome
    // into print — a half-cropped compass strip at the top (ticks at rows
    // 0-25 of 614), the dark Filters/AR pill at the bottom (rows 546-599,
    // then a 14-row white strip), and a stray "›" chevron at the right edge
    // (x 1268-1275 of 1280). All three are app furniture, not the building;
    // measured off frame 0 of the webp, cropped with a few px of margin.
    // ⚠ FRAME 29, NOT FRAME 0 (Emilie, round 2, 2026-08-18: "use a different
    // frame of the gif where it clearly shows that it's interactive and you
    // can hover to get info and the ar info"). Frame 29 holds the hover card
    // (unit 1402: area, status) with the red floorplan footprint lit on the
    // tower. The Filters/AR pill now STAYS in the crop — it is the AR info she
    // wants seen — so the bottom crop only sheds the white strip under it.
    { slug: 'verve', name: 'unit-selector', frame: 29, crop: { top: 0.045, right: 0.02, bottom: 0.023 } },
    { slug: 'verve', name: 'lounge-interior' },
    // ⚠ A DRAWN FIGURE IN THE REGISTER (Emilie, 2026-08-14). Shortening the row
    // to 72% left a 75 x 60mm block at its end, and rather than stretch a
    // photograph to fill it the page draws its own argument there: everything
    // into one Revit file, which is the sentence the outcome ends on.
    // It has no slug on disk and nothing is baked for it.
    {
      slug: 'verve',
      name: 'stack',
      figure: 'verve-stack',
      // draftCopy. Every clause is the signed WHAT restated: "a shared amenities
      // podium under both towers, balconies cut into the facade rather than hung
      // off it". A figure gets a caption like any other asset, and it sits on the
      // register’s caption line with the two photographs beside it.
      caption:
        'Two towers of different height over one shared amenities podium, with the balconies cut into the facade rather than hung off it',
    },
  ],
  // ⚠ THE REGISTER SCALE IS GONE, and the figure is why. It was 0.72 to shorten
  // a row of two, which had pushed the plan down to 139mm; that same shortening
  // is what left the 75 x 60mm block the figure now fills. With three items the
  // row is 59mm tall at the FULL measure, so the plan comes back to 188mm and
  // nothing is left empty. The lever did its job and then stopped being needed.
  links: [
    { label: 'VERVE @ MERAAS', href: 'https://www.meraas.com/en/project/verve-city-walk' },
    { label: 'VERVE @ SOMA', href: 'https://soma.us/verve-city-walk/' },
    { label: 'DISTRICT O @ SOMA', href: 'https://www.soma.us/district-o/p5y5k8ohl72r1mkk68pe5zxuikfcby' },
    { label: 'ENARA @ SOMA', href: 'https://www.soma.us/office-tower' },
    { label: 'SARIA @ BEYOND', href: 'https://beyonddevelopments.ae/en/new-launches/saria' },
  ],
  // S2 fix round cover: the interactive 3D unit selector capture (cropped to
  // the viewport; the sales platform’s panel and watermark never ship).
  image: {
    slug: 'verve',
    name: 'unit-selector',
    alt: 'Screen capture of the interactive 3D unit selector orbiting the twin Verve towers, one unit footprint highlighted',
  },
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default somaTowers
