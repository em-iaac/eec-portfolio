// THE CV SECTION GLYPHS, shared by the screen page and the printed A4 page
// (the CV pass, 2026-07-27). One definition, two surfaces: the icons used to
// live inside pages/CV.tsx and the print page had none, which is exactly the
// kind of divergence that made the two documents stop looking like each other.
//
// WHY SVG PATHS AND NOT AN ICON FONT. These are pure <path> elements with no
// text nodes, so they contribute NOTHING to the PDF's text layer and cannot
// corrupt an ATS parse. Icon FONTS are the unsafe option in a PDF: they emit
// real codepoints, which is why they extract as gibberish. Images are worse
// again, because they hide whatever they replace. The rule that follows from
// this: a glyph may sit BESIDE a plain text label, never instead of one.
//
// COLOUR. These carry no colour of their own. They inherit from their parent,
// which is muted ink on both surfaces. The five-hue category scheme retired at
// the accent decision: the single red accent lives on the section RULE, and a
// uniform rule is an accent rather than a category.
export type CvSection = 'education' | 'experience' | 'skills' | 'awards' | 'writing'

export function CvIcon({ name, size = 14 }: { name: CvSection; size?: number }) {
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="shrink-0">
      {name === 'education' && (
        <>
          <path {...p} d="M2 6l6-2.8 6 2.8-6 2.8L2 6z" />
          <path {...p} d="M5 7.4v3c0 .9 1.3 1.8 3 1.8s3-.9 3-1.8v-3" />
        </>
      )}
      {name === 'experience' && (
        <>
          <rect {...p} x="2.5" y="5" width="11" height="8" rx="1.2" />
          <path {...p} d="M6 5V3.9c0-.6.4-1 1-1h2c.6 0 1 .4 1 1V5" />
          <path {...p} d="M2.5 8.6h11" />
        </>
      )}
      {name === 'skills' && (
        <>
          <path {...p} d="M3 5h5M11.5 5h1.5M3 11h1.5M7.5 11h5.5" />
          <circle {...p} cx="9.5" cy="5" r="1.4" />
          <circle {...p} cx="5" cy="11" r="1.4" />
        </>
      )}
      {name === 'awards' && (
        <>
          <circle {...p} cx="8" cy="6" r="3.4" />
          <path {...p} d="M6 9l-1 4 3-1.6 3 1.6-1-4" />
        </>
      )}
      {name === 'writing' && (
        <>
          <path {...p} d="M11.4 2.9l1.7 1.7-7 7-2.3.6.6-2.3 7-7z" />
          <path {...p} d="M3 13.5h10" />
        </>
      )}
    </svg>
  )
}
