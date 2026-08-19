// THE HOUSE-STYLE CENSUS (the consistency pass, 2026-08-19). Five measurement
// agents took the book apart — footer geometry, margins as spreads, a font
// census, a color census, baseline rhythm — and Emilie ruled on every finding.
// This module is how those rulings stay rulings: it reads the SAME numbers off
// the printed bytes on every build, so the drift they closed cannot reopen
// quietly. render-pdfs.mjs turns the census into loud assertions.
//
// Everything here reads the PDF, never the DOM: the DOM is what the book asks
// for, the bytes are what the reader gets, and the whole point of the pass was
// that those can disagree (Chrome px-snapping had every leading in the book
// alternating between two pitches while the CSS said one number).
import { getDocument, OPS } from 'pdfjs-dist/legacy/build/pdf.mjs'

/** One color-setting op, normalised to lowercase #rrggbb. This pdfjs build
 *  hands setFillRGBColor/setStrokeRGBColor args as a pre-normalised hex
 *  string; gray and CMYK setters arrive as numbers and are converted so a
 *  figure drawn in a different color space cannot slip the census. */
function toHex(args) {
  const a = args?.[0]
  if (typeof a === 'string' && a.startsWith('#')) return a.toLowerCase()
  const nums = Array.isArray(args) ? args.filter(v => typeof v === 'number') : []
  const ch = (v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')
  if (nums.length === 1) return `#${ch(nums[0])}${ch(nums[0])}${ch(nums[0])}`
  if (nums.length === 3) return `#${ch(nums[0])}${ch(nums[1])}${ch(nums[2])}`
  if (nums.length === 4) {
    const [c, m, y, k] = nums
    return `#${ch((1 - c) * (1 - k))}${ch((1 - m) * (1 - k))}${ch((1 - y) * (1 - k))}`
  }
  return null
}

const COLOR_OPS = new Set(
  [
    OPS.setFillRGBColor,
    OPS.setStrokeRGBColor,
    OPS.setFillGray,
    OPS.setStrokeGray,
    OPS.setFillCMYKColor,
    OPS.setStrokeCMYKColor,
  ].filter(op => op !== undefined),
)

/**
 * The per-page census every house-style assertion reads from.
 *
 * @returns {Promise<{
 *   numPages: number,
 *   pages: {
 *     width: number, height: number,
 *     texts: {str: string, x: number, y: number, w: number, size: number, font: string}[],
 *     colors: string[],
 *     footRules: number[],
 *   }[],
 * }>}
 *   `y` is the BASELINE height above the bottom trim (PDF user space), `size`
 *   the effective pt size off the text matrix, `font` the embedded PostScript
 *   name with the subset prefix stripped (e.g. "Archivo-SemiBold").
 */
export async function designCensus(bytes) {
  const doc = await getDocument({ data: new Uint8Array(bytes) }).promise
  const pages = []
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    // ⚠ THE OPERATOR LIST COMES FIRST, and the order is load-bearing: fonts
    // land in page.commonObjs while the operator list is BUILT, so asking for
    // a font's name before getOperatorList() throws for every id and the
    // census reports g_d0_f1 instead of Archivo-SemiBold. The first run of
    // this guard failed exactly that way — 1,498 misses, all of them the
    // census's own fault, none of them the book's.
    const ops = await page.getOperatorList()
    const colors = new Set()
    for (let i = 0; i < ops.fnArray.length; i++) {
      if (!COLOR_OPS.has(ops.fnArray[i])) continue
      const hex = toHex(ops.argsArray[i])
      if (hex) colors.add(hex)
    }
    // THE FOOT RULES (added after the pass's own miss): unifying the foot
    // BASELINES still left the two hairlines 0.8mm apart across every spread,
    // because the rule hangs from padding-top while the baseline hangs from
    // padding-bottom. Wide, thin, bottom-band path boxes are collected here so
    // the rule's height is a guarded number too, not a side effect.
    const hlines = []
    {
      const mul = (a, b) => [
        a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
      ]
      const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]
      let ctm = [1, 0, 0, 1, 0, 0]
      const stack = []
      for (let i = 0; i < ops.fnArray.length; i++) {
        const fn = ops.fnArray[i]
        if (fn === OPS.save) stack.push(ctm)
        else if (fn === OPS.restore) ctm = stack.pop() ?? ctm
        else if (fn === OPS.transform) ctm = mul(ctm, ops.argsArray[i])
        else if (fn === OPS.constructPath) {
          const mm = ops.argsArray[i]?.[2] ?? ops.argsArray[i]?.minMax
          if (!mm || mm.length < 4) continue
          const [x1, y1] = apply(ctm, mm[0], mm[1])
          const [x2, y2] = apply(ctm, mm[2], mm[3])
          const yLo = Math.min(y1, y2)
          const yHi = Math.max(y1, y2)
          if (Math.abs(x2 - x1) > 200 && yHi - yLo < 3 && yLo > 25 && yLo < 55) {
            hlines.push((yLo + yHi) / 2)
          }
        }
      }
    }
    const content = await page.getTextContent()
    const texts = []
    for (const item of content.items) {
      if (!('str' in item) || item.str.trim() === '') continue
      // The REAL face, not pdfjs's internal id: g_d0_f1 tells nobody which
      // font shipped, and "the book printed in Times with every check green"
      // is the exact failure the font law exists to name. Fallback: the text
      // content's own styles map carries a fontFamily per id.
      let font = item.fontName
      try {
        font = page.commonObjs.get(item.fontName)?.name ?? font
      } catch {
        font = content.styles?.[item.fontName]?.fontFamily ?? font
      }
      texts.push({
        str: item.str,
        x: item.transform[4],
        y: item.transform[5],
        w: item.width,
        size: Math.round(Math.hypot(item.transform[0], item.transform[1]) * 10) / 10,
        font: String(font).replace(/^[A-Z]{6}\+/, ''),
      })
    }
    const [, , w, h] = page.view
    pages.push({ width: w, height: h, texts: [...texts], colors: [...colors], footRules: hlines })
  }
  return { numPages: doc.numPages, pages }
}

/** Max per-channel distance between two #rrggbb colors — the "two grays a
 *  hair apart" metric the color audit used (Δ ≤ 12 reads as one color). */
export function channelDelta(a, b) {
  const n = (h, i) => parseInt(h.slice(i, i + 2), 16)
  return Math.max(
    Math.abs(n(a, 1) - n(b, 1)),
    Math.abs(n(a, 3) - n(b, 3)),
    Math.abs(n(a, 5) - n(b, 5)),
  )
}
