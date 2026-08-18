// THE ASSET PAGE'S GEOMETRY, IN ONE PLACE (2026-08-12).
//
// This module exists because the same arithmetic has to be known by three
// consumers that cannot import each other's world:
//   · src/print/PrintBook.tsx      draws the page
//   · scripts/print-assets.mjs     bakes each image to the width it is DRAWN at
//   · src/print/printBook.test.tsx checks the resulting dpi at that width
//
// It used to be copied into all three with a comment saying "change one, change
// all three", which is a comment, not a guard. A wrong number in the bake
// script does not fail anything: it silently ships a soft image, and softness
// at A4 is invisible on screen. So the numbers live here, the file is pure
// (no React, no import.meta.glob, no DOM), and all three import it.
//
// EVERYTHING IS MILLIMETRES on a 297 x 210 page.

import type { BookCorner } from '../content/projects/types'

export const PAGE_W_MM = 297
export const PAGE_H_MM = 210
export const BOUND_MARGIN_MM = 18
export const OUTER_MARGIN_MM = 12
export const TOP_MARGIN_MM = 14
/** Where the foot hairline sits on a top-lead page, and where the body stops. */
export const FOOT_RULE_MM = 196
export const GAP_MM = 5
/** The caption band under a register row. */
export const CAPTION_MM = 9
/** The air between the lead and its register. */
export const LEAD_GAP_MM = 14
/** The band a lead's caption occupies directly under the lead, full lead width. */
export const LEAD_CAP_MM = 10
/** A register caption must clear the foot rule, never touch it. */
export const CAP_CLEARANCE_MM = 6
/** 210mm leaves 69mm of white for the meta column even at the outer margin. */
export const LEAD_MAX_W_MM = 210
/** THE HEMLINE (Emilie, 2026-08-18, closing Flags 09+10 as option D: "own the
 *  air"). Every top lead's bottom edge now sits on ONE line, so the band of
 *  air between lead and register starts at the same height on all eight asset
 *  pages instead of wandering 12 to 46mm as each lead's aspect dictated.
 *  84.9 and not a rounder number because the hemline must be REACHABLE by the
 *  widest lead in the book inside LEAD_MAX_W_MM: lungs/timeline at aspect
 *  2.473 needs 84.9 × 2.473 = 209.97mm. A new lead wider than 2.473 will cap
 *  at 210mm, miss the hemline, and the figure-fit guard fails the build,
 *  which is the loud failure this whole audit existed to create. */
export const LEAD_HEMLINE_MM = 84.9
/** A field lead holds the page's height rather than a corner of it. */
export const FIELD_H_MM = 170
/** The head block, plate through tech, on any page that stands something under
 *  it. Measured on the built page. */
export const HEAD_MM = 26
/** The head block on a field page: plate, credit, hairline, tech. Measured on
 *  the built page after the tech line was added; it was about 12mm before. */
export const FIELD_HEAD_MM = 26
/** Where the register starts on a BOTTOM-lead page, under the inverted head. */
export const BOTTOM_REGISTER_Y_MM = TOP_MARGIN_MM + 18

// ONE definition, in the master types beside the long note explaining why a
// bottom lead is only ever given to a project whose lead is a summation. This
// is a `import type`, so esbuild erases it and the bake script never pulls the
// projects barrel (and its import.meta.glob) into Node.
export type { BookCorner }

export interface AssetBox {
  /** Set when this box is a drawn figure rather than a photograph. */
  figure?: string
  src: string
  alt: string
  x: number
  y: number
  w: number
  h: number
}
export interface AssetPageLayout {
  lead: AssetBox | null
  register: AssetBox[]
  /** An asset standing under the head, when the page declares one. */
  column: AssetBox | null
  /** The head meta: the sheet number, the plate number and the woven credit. */
  meta: { x: number; y: number; w: number }
  /** The lead's caption, always in white rather than over an image. */
  leadCap: { x: number; y: number; w: number }
  /** The hairline. On a bottom-lead page it inverts to a running head. */
  ruleY: number
}

type Sized = { w: number; h: number; src: string; alt: string; figure?: string }

/** A justified row: the widths divide in proportion to the aspects, so every
 *  image keeps its true shape and NOTHING IS EVER CROPPED. */
export function registerRowHeight(aspects: number[], scale = 1): number {
  if (aspects.length === 0) return 0
  const measure = (PAGE_W_MM - BOUND_MARGIN_MM - OUTER_MARGIN_MM) * scale
  const usable = measure - GAP_MM * (aspects.length - 1)
  return usable / aspects.reduce((a, b) => a + b, 0)
}

/**
 * The width the lead is actually DRAWN at, which is what the bake script must
 * size it to. Capped at LEAD_MAX_W_MM so the meta column never disappears.
 *
 * The room a lead has is whatever the register has not already spent, and that
 * is the whole reason four assets is the ceiling: a register row of three is 42
 * to 46mm tall, a row of two is 65 to 73mm, and six assets leave the lead 48mm.
 */
export function leadDrawnWidth(corner: BookCorner, leadAspect: number, rowH: number): number {
  if (corner.startsWith('field')) return FIELD_H_MM * leadAspect
  const room = corner.startsWith('top')
    ? FOOT_RULE_MM - CAP_CLEARANCE_MM - (LEAD_CAP_MM + LEAD_GAP_MM + rowH + CAPTION_MM)
    : PAGE_H_MM - (BOTTOM_REGISTER_Y_MM + rowH + CAPTION_MM + LEAD_GAP_MM)
  // A top lead stops at the hemline; `room` still binds when a tall register
  // leaves less than the hemline, so the lead can never run into its own row.
  if (corner.startsWith('top')) {
    return Math.min(LEAD_MAX_W_MM, room * leadAspect, LEAD_HEMLINE_MM * leadAspect)
  }
  return Math.min(LEAD_MAX_W_MM, room * leadAspect)
}

/**
 * Place the lead and its register in millimetres on the page.
 *
 * `outerLeft` is the binding truth: on a verso the outer edge is the left one,
 * so a `-outer` corner bleeds left and a `-bound` corner bleeds right. Asset
 * pages are always even and therefore always verso, but this reads the side
 * rather than assuming it, so re-ordering the book cannot silently push a lead
 * into the gutter.
 */
export function layoutAssetPage(
  lead: (Sized & { corner: BookCorner }) | null,
  register: Sized[],
  outerLeft: boolean,
  columnAsset: Sized | null = null,
  /** How much of the measure the register row spends. 1 fills it.
   *
   *  ⚠ THE LEVER FOR "BIGGER LEAD, SMALLER REGISTER", and it exists because the
   *  obvious move does not work. A justified row's HEIGHT is set by the measure
   *  and the aspects, so a row of two is 84mm tall where a row of three is 62,
   *  and every millimetre of that comes out of the lead. Dropping an asset makes
   *  the lead SMALLER, which is the opposite of what anyone expects. Spending
   *  less of the measure is the only way to shorten a row without changing what
   *  is in it. The row then runs ragged on its inner edge, which reads as a
   *  decision beside a lead that bleeds. */
  registerScale = 1,
): AssetPageLayout {
  const left = outerLeft ? OUTER_MARGIN_MM : BOUND_MARGIN_MM
  const right = PAGE_W_MM - (outerLeft ? BOUND_MARGIN_MM : OUTER_MARGIN_MM)

  const aspects = register.map(i => i.w / i.h)
  const rowH = registerRowHeight(aspects, registerScale)
  const rowAt = (y: number) => {
    let x = left
    return register.map((it, i) => {
      const w = aspects[i]! * rowH
      const box = { src: it.src, alt: it.alt, figure: it.figure, x, y, w, h: rowH }
      x += w + GAP_MM
      return box
    })
  }

  if (!lead) {
    const y = TOP_MARGIN_MM + 16
    return {
      lead: null,
      register: rowAt(y),
      column: null,
      meta: { x: left, y: TOP_MARGIN_MM, w: right - left },
      leadCap: { x: left, y: TOP_MARGIN_MM, w: 0 },
      ruleY: FOOT_RULE_MM,
    }
  }

  const la = lead.w / lead.h
  // A bleeding edge is a TRIM edge, so the lead starts at 0 or ends at 297.
  const leadOnLeft = outerLeft ? lead.corner.endsWith('-outer') : !lead.corner.endsWith('-outer')

  if (lead.corner.startsWith('field')) {
    // FULL HEIGHT. The lead's width follows its aspect and the register stacks
    // in the column left over rather than in a row beneath it.
    //
    // ⚠ THE COLUMN IMAGES ARE SIZED TO FIT, not to fill the column, and that is
    // the whole reason this branch has arithmetic in it. The head gained a tech
    // line and a rule on 2026-08-12, which took it from about 12mm to 26mm, and
    // at full column width the two stacked images then needed 172mm inside the
    // 158mm left under it: the head printed straight over the first image.
    // Widening the column is not available either, because the column IS
    // whatever the portrait does not use, and a 0.64 portrait at full height
    // leaves 167mm no matter what. So the images take the width at which the
    // stack fits, and the column runs ragged on its inner edge against a lead
    // that is flush to the trim, which reads as a decision rather than a
    // shortfall.
    const lw = FIELD_H_MM * la
    const lx = leadOnLeft ? 0 : PAGE_W_MM - lw
    const colX = leadOnLeft ? lw + GAP_MM * 2 : left
    const colW = (leadOnLeft ? right : lx - GAP_MM * 2) - colX
    const top = TOP_MARGIN_MM + FIELD_HEAD_MM
    const room = FOOT_RULE_MM - CAP_CLEARANCE_MM - top
    const perWidth = aspects.reduce((a, r) => a + 1 / r, 0)
    const fitW =
      (room - register.length * CAPTION_MM - Math.max(0, register.length - 1) * GAP_MM) / perWidth
    const imgW = Math.max(0, Math.min(colW, fitW))
    let y = top
    const boxes = register.map((it, i) => {
      const h = imgW / aspects[i]!
      const box = { src: it.src, alt: it.alt, figure: it.figure, x: colX, y, w: imgW, h }
      y += h + CAPTION_MM + GAP_MM
      return box
    })
    return {
      lead: { src: lead.src, alt: lead.alt, figure: lead.figure, x: lx, y: 0, w: lw, h: FIELD_H_MM },
      register: boxes,
      column: null,
      meta: { x: colX, y: TOP_MARGIN_MM, w: colW },
      // The same margin rule the top branch follows: a field lead bleeds off one
      // trim, so its caption starts at the page margin on the bled side rather
      // than at the sheet's edge.
      leadCap: leadOnLeft
        ? { x: left, y: FIELD_H_MM + 4, w: lx + lw - left }
        : { x: lx, y: FIELD_H_MM + 4, w: right - lx },
      ruleY: FOOT_RULE_MM,
    }
  }

  const atTop = lead.corner.startsWith('top')
  let lw = leadDrawnWidth(lead.corner, la, rowH)
  // ⚠ THE COLUMN PAGE JOINS THE HEMLINE (Emilie's D ruling is "one line on all
  // EIGHT pages", and the first cut of the hemline missed this page by 5.1mm).
  // leadDrawnWidth reserves room from the FULL-measure row height, but a page
  // with a column asset draws a NARROWED register, so the lead has more room
  // than it assumed — and the narrowed row's measure depends on the lead's own
  // width, so the two are solved as a fixed point. Converges in 2 iterations
  // for every real page; the 0.01mm exit is far below anything printable.
  if (atTop && columnAsset) {
    const sumAspects = aspects.reduce((a, b) => a + b, 0)
    for (let i = 0; i < 4; i++) {
      const lxI = leadOnLeft ? 0 : PAGE_W_MM - lw
      const metaXI = leadOnLeft ? lw + GAP_MM * 2 : left
      const metaWI = leadOnLeft ? right - metaXI : lxI - GAP_MM * 2 - left
      const rowRightI = leadOnLeft ? lxI + lw : right
      const rowLeftI = !leadOnLeft ? metaXI + metaWI + GAP_MM * 2 : left
      const narrowHI = (rowRightI - rowLeftI - GAP_MM * (register.length - 1)) / sumAspects
      const next = leadDrawnWidth(lead.corner, la, narrowHI)
      if (Math.abs(next - lw) < 0.01) break
      lw = next
    }
  }
  const lh = lw / la
  const lx = leadOnLeft ? 0 : PAGE_W_MM - lw
  const ly = atTop ? 0 : PAGE_H_MM - lh

  if (atTop) {
    // ⚠ A COLUMN ASSET NARROWS THE REGISTER ROW. The column stands in the same
    // vertical band the row would otherwise cross, so the row is measured to the
    // LEAD'S INNER EDGE rather than to the page margin. Without this the two
    // overlap, and the overlap is invisible in a wireframe because both are
    // boxes: it only shows once real images are drawn.
    // THE REGISTER IS BOTTOM-ANCHORED, and that is the fix for the residue the
    // first grid left. Laying it directly under the lead pushed all the spare
    // height into a trailing gap above the foot rule, which reads as "the page
    // ran out of content". Anchored to the rule, the spare height becomes ONE
    // band of air between the lead and its register, which reads as a decision.
    // ⚠ THE REGISTER CLEARS THE FOOT RULE BY CAP_CLEARANCE_MM. It used to be
    // bottom-anchored so its captions ENDED EXACTLY ON THE RULE, at 191mm
    // against a rule at 191mm, which is not alignment, it is a collision that
    // has not happened yet: one more character of caption and it prints over
    // the hairline. Same fault, and the same fix, as the about page's contents.
    const metaX = leadOnLeft ? lw + GAP_MM * 2 : left
    const metaW = leadOnLeft ? right - metaX : lx - GAP_MM * 2 - left
    const rowRight = columnAsset
      ? leadOnLeft
        ? lx + lw
        : right
      : left + (right - left) * registerScale
    const rowLeft = columnAsset && !leadOnLeft ? metaX + metaW + GAP_MM * 2 : left
    const rowMeasure = rowRight - rowLeft - GAP_MM * (register.length - 1)
    const narrowH = rowMeasure / aspects.reduce((a, b) => a + b, 0)
    const useH = columnAsset ? narrowH : rowH
    const ry = Math.max(
      lh + LEAD_CAP_MM + LEAD_GAP_MM,
      FOOT_RULE_MM - CAP_CLEARANCE_MM - CAPTION_MM - useH,
    )
    const rowAtNarrow = (y: number) => {
      let x = rowLeft
      return register.map((it, i) => {
        const w = aspects[i]! * useH
        const box = { src: it.src, alt: it.alt, figure: it.figure, x, y, w, h: useH }
        x += w + GAP_MM
        return box
      })
    }
    // ⚠ THE COLUMN ASSET IS BOTTOM-ALIGNED TO THE REGISTER ROW (Emilie,
    // 2026-08-12: "the caption of the speckle view should be aligned with the
    // other captions, and the whole asset drop down to match that, which leaves
    // more room to the header, we like white space don't fight it").
    //
    // It takes the head's width and sits so its BOTTOM EDGE meets the row's, and
    // therefore its caption starts on the row's caption line. Two things follow,
    // and both are better than the version that hung it off the head:
    //   · the alignment is TRUE rather than approximate. Hung under the head it
    //     landed wherever the head's wrapping put it, which was 19mm off.
    //   · the leftover height collects ABOVE it, as one band under the head,
    //     instead of being scattered.
    // It is anchored to the row rather than to the head, so a credit line that
    // wraps to two lines moves nothing.
    const colH = columnAsset ? metaW / (columnAsset.w / columnAsset.h) : 0
    const colBox = columnAsset
      ? {
          src: columnAsset.src,
          alt: columnAsset.alt,
          figure: columnAsset.figure,
          x: metaX,
          y: ry + useH - colH,
          w: metaW,
          h: colH,
        }
      : null
    return {
      lead: { src: lead.src, alt: lead.alt, figure: lead.figure, x: lx, y: ly, w: lw, h: lh },
      register: columnAsset ? rowAtNarrow(ry) : rowAt(ry),
      column: colBox,
      meta: { x: metaX, y: TOP_MARGIN_MM, w: metaW },
      // ⚠ THE LEAD'S CAPTION IS BACK UNDER THE LEAD (Emilie, 2026-08-12), and
      // the comment this replaces was right about the collision and wrong about
      // the cause. Under the lead it hit the register because the register was
      // laid directly beneath the lead with no band reserved for a caption; now
      // LEAD_CAP_MM is part of the arithmetic that sizes the lead in the first
      // place, so the room is allocated before the lead is drawn rather than
      // discovered afterwards.
      //
      // Why it belongs here at all: in the meta column it set SIX LINES DEEP in
      // a 64mm measure and sat in the same stack as the plate number and the
      // credit, so nothing told a reader that two of those label the PAGE and
      // one labels the PICTURE. Under the lead it runs the lead's full width and
      // sets in two.
      // ⚠ THE CAPTION STOPS AT THE MARGIN, NOT AT THE TRIM. The lead bleeds off
      // one edge, so `lx` is 0 or the page width; setting the caption to the
      // lead's own box ran the text to the very edge of the sheet, past every
      // other line on the page. It starts at the page margin on the bled side
      // and ends at the lead's inner edge, so it aligns with the register below
      // it and the foot rule under that.
      leadCap: leadOnLeft
        ? { x: left, y: lh + 4, w: lx + lw - left }
        : { x: lx, y: lh + 4, w: right - lx },
      ruleY: FOOT_RULE_MM,
    }
  }

  // A BOTTOM LEAD runs to the bottom trim, so there is no foot to rule. The
  // whole furniture block INVERTS into a running head: meta, hairline, then the
  // title and URL line. The page still carries identical information, and it
  // never prints over an image.
  const ry = BOTTOM_REGISTER_Y_MM
  return {
    lead: { src: lead.src, alt: lead.alt, figure: lead.figure, x: lx, y: ly, w: lw, h: lh },
    register: rowAt(ry),
    column: null,
    meta: { x: left, y: TOP_MARGIN_MM - 5, w: right - left },
    // The empty quadrant beside a bottom lead is where its caption belongs: it
    // is the only white left on the page, and it puts the words next to the
    // thing they describe.
    leadCap: {
      x: leadOnLeft ? lw + GAP_MM * 2 : left,
      y: ly + 6,
      w: leadOnLeft ? right - (lw + GAP_MM * 2) : lx - GAP_MM * 2 - left,
    },
    ruleY: TOP_MARGIN_MM + 6,
  }
}
