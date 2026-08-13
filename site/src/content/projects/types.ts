/** One image on the book's second page, named the way the manifest names it. */
export interface BookAsset {
  /** Trim this fraction of the image's SHORTER side off every edge at bake time.
   *
   *  It exists for ONE thing: an image that arrives with a rounded corner baked
   *  into the picture. Print trims, it does not round, and a fillet we did not
   *  draw is still a fillet on the page. lEgoarCh's pipeline diagram is a cream
   *  card with a 30px radius and a 2px white margin, measured, so 0.042 of its
   *  782px height takes 32px off each edge and the corner is square again.
   *
   *  A fraction of the shorter side rather than a pixel count, so it survives
   *  the original being re-exported at another resolution. */
  trim?: number
  /** Crop these fractions off each edge at bake time.
   *
   *  `trim` above is symmetric and exists for a rounded corner. This one is
   *  per-edge and exists for BAKED TEXT: assets exported from a studio sheet
   *  arrive with their own heading and their own stage labels burnt into the
   *  picture, in a type family the book uses nowhere else, so the page ends up
   *  with two title systems and two caption systems arguing. The bands are
   *  measured off the image's own ink profile, never guessed. */
  crop?: { top?: number; bottom?: number; left?: number; right?: number }
  /** Draw a figure from src/print/figures.tsx instead of printing a picture.
   *  When set, `slug`/`name` are only an id: nothing is baked and nothing is
   *  read from disk. Used where the honest asset is a drawing the book makes
   *  rather than a screenshot of somebody else's diagram. */
  figure?: string
  slug: string
  name: string
  invert?: boolean
  caption?: string
}

/**
 * WHERE THE LEAD BLEEDS OFF THE TRIM (Emilie, 2026-08-12): "we are always
 * using the hero on the left side, we can switch sometimes and have it on the
 * right? or down right, not always upper left."
 *
 * Every asset page is an EVEN page, so `outer` is the left edge and `bound` is
 * the right one. The book alternates outer / bound down its whole length, and
 * varies the vertical only where the project's reading order allows it: a lead
 * at the bottom is read AFTER its register, so it is only ever given to a
 * project whose lead is a summation rather than an opening (lEgoarCh's
 * pipeline, NeuroSpace's pipeline). Sensi's flowchart, Huddle's growth study,
 * Ballooning's process and Falcon's first sketch sheet all have to come first
 * by Emilie's own per-project rulings, so those stay at the top.
 *
 * `field-*` is the full-height variant, which needs a portrait asset to be
 * worth doing. There is exactly one in the book (The Lungs' Speckle capture,
 * at 0.64), so there is exactly one field page.
 *
 * ⚠ A `bound` lead bleeds toward the GUTTER. That is fine for a PDF and for
 * loose sheets, which is how this leave-behind actually travels, and it would
 * lose a few millimetres into the spine if it were ever perfect-bound. Traded
 * knowingly for the variation she asked for, not overlooked.
 */
export type BookCorner =
  | 'top-outer'
  | 'top-bound'
  | 'bottom-outer'
  | 'bottom-bound'
  | 'field-outer'
  | 'field-bound'

// THE MASTER CONTENT FILE (G1, 2026-07-10; REDESIGN-SPEC §11). ONE file per
// project under content/projects/ is the canonical home of everything the
// project SAYS: the card copy that used to live in data/projects.tsx plus the
// showcase spine. The /work card, the opened showcase, and later the book
// spread and the CV line are RENDITIONS of this one object. The registry
// (data/registry.ts) stays the single INDEX: dates, numbers, tags, joins.
//
// THE SPINE (signed by Emilie in the G1 director session, 2026-07-10):
// WHAT · WHY · HOW · WHAT CAME OF IT, then the tools, then the links out.
// WHAT and WHY are authored for every project. HOW and OUTCOME render only
// where real material exists: a thin project is honestly short, never padded
// (no slot begs to be filled). Winks ride inline as the <NB> hover dot, one
// per project at most, only where a good one already exists.
//
// Copy rules that bind every field (REDESIGN-SPEC §0): attribution woven into
// prose as ordinary sentences, never labelled lines or percentages; verbs
// score / estimate / model, never measure; Lungs "designed to filter";
// lEgoarCh's instructive fail is narrated without its percentage; Emilie's
// voice, NO em dashes; new prose ships showcaseDraft: true until she signs it.
//
// ONE PROJECT, TWO HALVES (2026-08-03, the phone pass). The master is still one
// idea, but it now lives in two files because the two halves have completely
// different audiences:
//
//   ProjectMeta   <slug>.ts        JSX-free. The grid face, the CV line, the OG
//                                  card, headData and the sitemap all need it,
//                                  synchronously, on every route. Statically
//                                  barrelled by index.ts.
//   ProjectSpine  <slug>.spine.tsx The four ReactNode beats. Exactly ONE surface
//                                  reads them (the opened showcase), so they are
//                                  lazy: index.ts reaches them through
//                                  import.meta.glob.
//
// Measured before the split: data/work.ts materialised all 21 spines at module
// scope, so `work-*.js` was 61.4KB and any import from it — including
// WORK_LENSES, three strings — pulled every project's prose. It was preloaded on
// /cv and /rights too.
//
// ProjectMaster (the intersection) still exists for the surfaces that genuinely
// need both halves at once: the printed book and the guard tests.
import type { ReactNode } from 'react'
import type { Lens } from '../../components/Lens'

export interface ProjectMeta {
  slug: string
  title: string
  lens: Lens
  meta: string
  award?: string
  // The card face's corner-pill short wording (DL-2); the full award line
  // still renders verbatim in the showcase.
  awardShort?: string
  tech: string
  links: { label: string; href: string }[]
  // `position` = CSS object-position for the uniform 4:3 crop (escape hatch
  // when center-crop cuts the important part of a wide screenshot).
  image?: { slug: string; name: string; alt: string; position?: string }
  // The cover is a MONTAGE/reel of the strip (2026-07-16): it plays on the
  // card face but is NOT a plate page, so the flip-through starts on the real
  // frames instead of replaying the reel (podcast quote reel).
  coverMontage?: boolean
  draftCopy?: boolean
  // Session 7 rulings: myPart NEVER renders as a labeled line; it is woven
  // into `what` as an ordinary sentence. `stat` = the one defensible number.
  myPart?: string
  stat?: string
  // The card's ONE authored "what it proves" line; the showcase's claim.
  dek?: string
  dekSigned?: boolean
  // THE QUESTION (D4, authored in S4/S5, signed before it ships): the one
  // plain-language question this project answers. The moment it exists it
  // automatically becomes the route's <meta name="description"> and the
  // JSON-LD description (lib/headData.ts prefers it over the dek); S4 also
  // makes it the on-screen claim. Until then the signed dek serves.
  question?: string
  // The listening member's hero line (the podcast leads with a pull-quote).
  pullQuote?: { text: string; source: string }

  // The spine prose is unsigned until Emilie signs it (Section 14). The FLAG
  // stays on the meta half even though the prose it describes moved: the card
  // face and the guard tests read it without opening the spine.
  showcaseDraft: boolean

  // ---- Future renditions (declared now so the shape is complete) ----------
  cvLine?: string
  // THE BOOK PLATE: the dominant image on the project's page one. Baked to a
  // ~300dpi print rung by scripts/print-assets.mjs.
  spreadAssets?: { slug: string; name: string }[]
  // THE BOOK'S SECOND PAGE (2026-08-11): the asset grid facing the project
  // page. Curated with Emilie project by project, because the right count and
  // arrangement depend entirely on what shape that project's images are: a
  // page of 2:1 slides and a page holding a portrait Speckle capture beside a
  // square plan are not the same page.
  //
  // A LEAD AND A REGISTER, not a grid (Emilie, 2026-08-12, the editorial
  // pass). The grid was the complaint: "not all assets should be the same
  // size", and "more editorial like the first page". Page one is a
  // composition because ONE image dominates and BLEEDS OFF THE TRIM, so page
  // two now makes the same move. `bookLead` is the promoted asset and the
  // corner it bleeds from; `bookRegister` is the subordinate row beneath or
  // beside it.
  //
  // WHY FOUR ASSETS AND NOT SIX, measured rather than judged. A register row
  // of three is 42 to 46mm tall at this measure; a row of two is 65 to 73mm.
  // With six assets the register eats 130mm of the 178mm body, which leaves
  // the lead 48mm and it stops being a lead. At lead + three every project in
  // the book clears with the lead at 54 to 71% of the page width. The surplus
  // assets each project used to carry were cut by Emilie, one at a time,
  // against that arithmetic; the cut ones are recorded in each master.
  //
  // A ROW STILL JUSTIFIES: every image keeps its true aspect and the row's
  // widths divide in proportion to them, so nothing is ever cropped and a
  // portrait capture simply takes a narrow column beside a wide diagram. This
  // is also what lets print-assets.mjs bake each image to the width it is
  // actually drawn at (~220dpi, invisible on screen and on an office printer),
  // which is what keeps a 20-page book under the mail ceiling.
  //
  // `invert` flips a drawing that was scanned or exported white-on-black back
  // to ink-on-paper (Emilie, 2026-08-11, on the falcon sketches: two flooded
  // black rectangles on a printed page, where the same drawing dark-on-white is
  // closer to what it actually is). The bake inverts LIGHTNESS and rotates the
  // hue back, because a straight negative turns her red annotations cyan.
  //
  // `caption` overrides the manifest alt FOR PRINT ONLY. It exists for exactly
  // one reason: an inverted drawing's signed alt can describe the ground it no
  // longer has ("ink sketches ON BLACK", printed on white). The site keeps her
  // wording because there the description is still true. Any override ships
  // draftCopy until she signs it.
  bookLead?: BookAsset & { corner: BookCorner }
  bookRegister?: BookAsset[]
  /** An asset that STANDS IN THE HEAD COLUMN, under the plate/credit/tech block.
   *
   *  It exists for one shape: a page whose best lead is wide and whose remaining
   *  assets include a TALL one. A portrait dropped into a justified row shrinks
   *  to a sliver, because a row gives width in proportion to aspect; standing it
   *  in the column instead spends the page's spare HEIGHT on it, which is the
   *  one thing a landscape lead leaves over.
   *  Declaring it narrows the register row to the lead's inner edge, so the two
   *  never collide. The Lungs is the only page in the book that needs it. */
  bookColumn?: BookAsset
  /** How much of the measure page two's register row spends. 1 fills it.
   *
   *  Lower it to make the LEAD bigger: a justified row's height comes out of the
   *  lead's, so a shorter row is a taller lead. Verve is the only page that
   *  needs it, because dropping its elevation left a row of two, and a row of
   *  two is 84mm tall against a row of three at 62. */
  bookRegisterScale?: number
  // The plate FITS instead of filling, on its own ground. For a dominant image
  // that is a diagram rather than a photograph, where cropping to the plate's
  // shape would cut the labels off the edges (lEgoarCh's outputs slide, whose
  // black ground makes the letterbox invisible).
  spreadFit?: { mode: 'contain'; ground: string }
}

// ---- The showcase spine (G1) ----------------------------------------------
// Lives in <slug>.spine.tsx, loaded only when a project is opened.
export interface ProjectSpine {
  // THE QUESTION DOT (Emilie, 2026-07-14): the OTHER questions this project
  // answers, revealed by the dot beside the lead question on the plate, "all
  // the questions at a glance". Optional `beat` names the spine section that
  // answers it; pressing the question highlights that section. Wordings ship
  // DRAFT until she signs them, like the lead.
  //
  // It rides with the SPINE, not the meta (2026-08-03): the showcase is its one
  // reader, its `beat` values name spine sections, and four questions per
  // project was the largest single field every route was paying for.
  alsoAnswers?: { q: string; beat?: 'what' | 'why' | 'how' | 'outcome' }[]
  // WHAT: the story under the claim, 2-4 sentences, credits woven in.
  what: ReactNode
  // WHY: one short beat, why it matters or why she did it.
  why: ReactNode
  // HOW: 3-5 tight numbered steps; the full method stays in the blog/repo.
  how?: ReactNode[]
  // WHAT CAME OF IT: only where real (a finding, an instructive fail, what
  // it changed). Never invented to fill the slot.
  outcome?: ReactNode
}

/** Both halves at once: the printed book and the guard tests, nothing else. */
export type ProjectMaster = ProjectMeta & ProjectSpine
