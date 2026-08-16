// THE RECOGNITION MARK, DRAWN (Emilie, 2026-08-16).
//
// ✦ (U+2726) is in none of the site's five embedded faces, so anything that
// RENDERS TO A FILE at build time — the A4 book, the 41 social cards — was
// letting Chrome pick a fallback off the build machine and baking it in:
// Segoe UI Symbol on her Windows box, DejaVu Sans Mono on the ubuntu-latest
// runner that builds what the site actually serves. Two visibly different
// marks, thin-and-small against fat-and-large, in two copies of the same
// artifact. Every one of them says "this project won something".
//
// So it is drawn now, the way this project draws all its other marks (the
// lens ticks, the 21 partis). One definition, so the book and the cards can
// never disagree about the shape.
//
// ⚠ Scope: build-time renderers only. The live HTML pages still TYPE the
// character, which is a different situation — there the reader's own browser
// picks the font and nothing is baked into a file anyone keeps.
import type { CSSProperties } from 'react'

// The mark's size as a fraction of the mono it leads (4.5pt against 7.5pt in
// the book), and the optical lift as a fraction of the mark. Both are ratios
// so a card at 16px and a page at 7.5pt get the same relationship.
export const MARK_TO_TYPE = 0.6
const LIFT_TO_MARK = 0.16

/**
 * @param size  the mark's box, in the same px units as its surroundings.
 *              Rule of thumb: MARK_TO_TYPE × the mono's font-size.
 */
export default function RecognitionMark({ size = 6, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      aria-hidden="true"
      className="inline-block shrink-0"
      // THE RULE: the mark centres on the CAPS it leads, so it sits in the
      // line instead of hanging under it.
      //
      // ⚠ Two obvious levers do nothing and both were measured before this
      // one was kept: `vertical-align` on an inline-block aligns the box's
      // bottom MARGIN edge, so a length there moved the mark 0.03pt, and
      // `margin-bottom` moved it 0.00pt. A transform is what actually lifts
      // it. The ratio comes from ink rather than font metrics (which were
      // half a point out): rendered at 600dpi the mono's cap band ran rows
      // 44-93, centre 68.5, and the mark's ink centre sat at 74.5 — six
      // pixels low, which is 0.16 of the mark's own box.
      style={{ transform: `translateY(-${(size * LIFT_TO_MARK).toFixed(2)}px)`, ...style }}
    >
      {/* The four-pointed star with concave flanks, kept slightly FULLER than
          the thin DejaVu rendition on purpose: in the book this prints at
          4.5pt on an office laser, which is print.css's standing test for
          every small mark. */}
      <path
        d="M5 0 C5.35 3.35 6.65 4.65 10 5 C6.65 5.35 5.35 6.65 5 10 C4.65 6.65 3.35 5.35 0 5 C3.35 4.65 4.65 3.35 5 0 Z"
        fill="currentColor"
      />
    </svg>
  )
}
