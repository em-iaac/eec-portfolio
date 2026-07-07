# Pen Table — design system (Session 2)

Direction locked 2026-07-06: Pen Table hybrid ("the model holds the red pen").
Tokens live in `src/index.css` (`@theme`); governance rules are commented there and repeated per-component below. No hex values outside tokens. No em dashes in any copy, ever.

## Tokens (summary)

- **Grounds:** `mylar` #F7F7F4 (READ), `carbon` #0B0E13 (EXPLORE / dark strips)
- **Ink:** `ink` #16181D (16.6:1), `anno` #565B63 (6.4:1), `hairline` #D6D8D4; dark: `ink-dark`, `anno-dark`
- **Redline:** `redline` #BE123C (text, interaction/liveness ONLY), `redline-stroke` #E11D48 (graphic strokes >= 3px only), `redline-wire` #FF4D6D (dark)
- **Lens pens/wires:** cyan (Computation & Research), magenta (Design & Practice), yellow (Explorations; ticks + labels only, never running text)
- **Type:** `--font-display` Archivo (variable; width tokens: `.font-expanded` 120% / `.font-condensed` 80%, nothing ad hoc), `--font-serif` Source Serif 4 (prose only), `--font-mono` Martian Mono (every number on the site; never above 0.875rem)
- **Motion:** one-shot scoped ceremonies, 150-900ms, reduced-motion renders final state

## Components

### SheetPage
Page chrome: skip link, TitleBlock header, `<main>`, Footer. Sets `document.title` and the sheet number.
Props: `sheet` (A-000 | A-101 | A-201 | C-001), `title`, `children`.
Sheet registry: Home A-000, Work A-101, About A-201, CV C-001 (Now N-001 arrives Session 16).

### TitleBlock
The drawing-set header. Cells: mark (static, always; no plot-in ceremony exists), name + status (recruiter block: role, MaCAD, OPEN TO R&D ROLES IN EUROPE), keynote nav, sheet number, ISSUED FOR stamp.
States: current page = redline underline + `aria-current="page"`. The EXPLORE side of the stamp sits in anno with an sr-only "(EXPLORE mode plots in Session 3)".
Mobile: stamp and nav each wrap to their own row; name cell flexes.
A11y: `<header>` + `<nav aria-label="Primary">`; nav links carry `-m-3 p-3` so hit areas reach ~40px. Two sanctioned redline texts live here as LIVENESS, not category: the OPEN TO R&D status line and the ISSUED FOR stamp.

### LensTick + Legend
`LensTick lens=computation|practice|explorations` renders the shape only (square cyan / diamond magenta / triangle yellow) and is `aria-hidden`; the API forces a paired visible label via the chip components. GOVERNANCE: never color without shape + label.
`Legend mode=anchors|route`: `anchors` renders same-page `#lens` links (Work); `route` renders react-router Links to `/work#lens` (Home) so navigation stays client-side.

### Kicker
Leader-line annotation (SVG dot > line > arrowhead + mono text). One per page maximum.
The Home instance carries the locked kicker and links to the live NeuroSpace app.

### RevisionWord
The hand-wobbled redline ellipse around one word (`redline-stroke`, 3px, dashoffset draw-in, PRM-safe). HARD CAP: once per page; currently only Home's "feel".

### ProjectCard
Image-optional single component (no variant prop): with image = feature card; without = compact text card (podcast, XR Lab).
Anatomy: image (grayscale at rest, color on hover/focus-within: color = data arriving), mono meta row (tick + lens label + course + award), Archivo title, serif blurb max 62ch (locked copy verbatim for heroes), mono tech string, links row (mono, redline, `-m-2.5 p-2.5` hit areas, sr-only "(opens in new tab)").
States: hover/focus-visible = image colors + title underline redline; card is not one big link (title link + discrete action links for a11y).
Awards render as mono text in INK with medium weight (status is a category; redline never categorizes), never emoji.

### Img
`srcset` helper reading `src/data/images.json` (webp ladder from the pipeline). Lazy by default, `fetchpriority="high"` opt-in for the first hero. Animated variants render `<img>` with the animated webp; under prefers-reduced-motion they render the static first-frame ladder the pipeline emits alongside (Session 4).

### Footer
Title-block lockup (mark + name + role), contact links (email, LinkedIn, GitHub), sheet number cell, tiny "issued from Barcelona/Beirut" line omitted: location stays honest and unlisted.

## Do / Don't
- Do put every number in mono. Don't set mono above 0.875rem.
- Do use redline for links, stamps, live values. Don't use it to categorize (awards are ink).
- Do keep one flourish per page (RevisionWord OR stamp wobble, not both animating). The header mark never animates.
- Don't introduce new furniture (clouds, north arrows, scale bars) without removing something.
- Rules/hairlines: ink/20 standard, ink/35 emphasized. No third weight, no dedicated hairline token.
- Authored asides in section header rows are prose and may be serif italic; UI labels may not.
- Known risk, mitigated: The Lungs LIVE APP link is a free-tier Railway deploy that can sleep; the link label discloses the cold start (Session 4). The demo-video fallback in incoming/lungs/ becomes the primary proof in Session 10.
- Analytics (decided 2026-07-07): GoatCounter, cookieless page counting; no cookies, no consent banner, no personal data. Script in index.html + SPA route counting in App.tsx. Localhost is never counted.
