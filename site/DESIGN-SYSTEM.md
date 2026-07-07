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
The drawing-set header. Cells: mark (static, always; no plot-in ceremony exists), name + role (role, MaCAD; NO status line since Session 5), keynote nav (de-numbered Session 6: titles only, no 01/02/03 indices), mode toggle.
States: current page = redline underline + `aria-current="page"`.
Mobile: nav and mode toggle each wrap to their own row; name cell flexes.
A11y: `<header>` + `<nav aria-label="Primary">`; nav links carry `-m-3 p-3` so hit areas reach ~40px.
Sanctioned redline (Session 5, FLAG-01): the public OPEN TO R&D status line is RETIRED sitewide (the search is private; LinkedIn's recruiters-only setting is the one standing signal). The remaining header redline is interaction only: the current-page underline and the `MODE: READ / EXPLORE >` toggle. The ISSUED FOR stamp stays the one sanctioned LIVENESS redline text in the drawing-set chrome (it lives in the EXPLORE header, `ISSUED FOR: READ >`), alongside the timeline NOW marker (rule 9).

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
Anatomy: image (runs the develop ceremony: grayscale to color once on first viewport entry, then stays color), mono meta row (tick + lens label + course + award), Archivo title, serif blurb max 62ch (locked copy verbatim for heroes), mono tech string, links row (mono, redline, `-m-2.5 p-2.5` hit areas, sr-only "(opens in new tab)").
States: hover/focus-visible = title underline redline; card is not one big link (title link + discrete action links for a11y). Image color is owned by develop-once, not hover (Session 5).
Awards render as mono text in INK with medium weight (status is a category; redline never categorizes), never emoji.

### Img
`srcset` helper reading `src/data/images.json` (webp ladder from the pipeline). Lazy by default, `fetchpriority="high"` opt-in for the first hero. Animated variants render `<img>` with the animated webp; under prefers-reduced-motion they render the static first-frame ladder the pipeline emits alongside (Session 4).
`develop` prop (Session 5): Img owns the grayscale-to-color develop ceremony (see Motion) via `useDevelopOnce`; the caller passes layout classes only. Set on ProjectCard, SheetFigure, MiniSheet figures, and the bench-roll minis. Raw brand headshots (Home/About) stay outside Img and keep hover-colorize until their Session 13/16 rework.

### MiniSheet
The enriched IN PREPARATION placeholder (Session 5): rendered by SheetRoute for any in-prep sheet, inside the SheetLayout frame (no new furniture). Carries the dashed ink IN PREPARATION stamp, lens+course+award meta row, the project blurb, a draftCopy "still on the drawing board" line, the figures already in the pipeline (develop-once; shared-slug folders like `professional` show only the entry's own figure), tag chips, every working external link, an `/explore/:id` deep link, and BACK TO THE NOTEBOOK. Governance: mono <= 0.875rem, LensTick never without its label. Retires per project as its full sheet issues (Sessions 8-14).

### Footer
Title-block lockup (mark + name + role), contact links (email, LinkedIn, GitHub), sheet number cell, tiny "issued from Barcelona/Beirut" line omitted: location stays honest and unlisted.

### The Notebook field guide (Session 6)
The record reads by eye. Every TEXT row (Notebook rows, mobile feed, bench-roll text columns) carries a mono kind-mark in its date gutter; `KindMark` is the single source of the grammar:

- filled ink square = project (a CSS block, not a font glyph)
- `#` = sheet issue: REDLINE, the one sanctioned mark color (issue events are liveness, rule 1)
- `~` = thought · `+` = milestone · `*` = award · `¶` = press · `"` = talk (reserved, none live yet)

Marks are ink except the sheet `#`. Each mark pairs an aria-hidden glyph with an sr-only kind name; the old visible prefixes (`AWARD ·`, `MILESTONE ·`) are retired (the marks carry the meaning, no added text labels). Project IMAGE CARDS (bench roll, mobile feed) carry no mark: the card is self-evident.

**Hierarchy:** project and sheet-issue rows keep full weight; thought/milestone/award/press/talk rows tighten (reduced padding, dotted ink/25 rule, slight indent). Milestones stay ink (the spine); awards/press/talk read annotation-grade.

**Collapse rule (render layer only, `lib/collapseSheets.ts`):** same-month sheet issues aggregate into one Notebook row, one bench-roll column, and one mobile feed row reading "SHEETS P-101, P-102 ISSUED >", the line redline as liveness, each number its own link. The registry stays one entry per issue; a single-issue month keeps the full "SHEET P-104 ISSUED: TITLE >" wording.

**Spine rule:** unlensed entries (milestones, unlensed awards/press) survive every lens filter in the Notebook; only lensed entries filter.

**Axis ticks (bench roll):** one hairline tick for every entry column since Session 6 (kind lives in the gutter mark; the milestone square and award ring retired). The NOW dot keeps its redline liveness.

## Motion vocabulary

Every ceremony is one-shot, 150-900ms, element-level (never a root-level filter), and renders its final state under `prefers-reduced-motion` (governance rule 7). Timings live in `src/index.css`.

**The develop rule (standing, Session 5).** An image develops grayscale to color once, <= 500ms, the first time it enters the viewport, on ALL devices (the ceremony is FOR phones, where there is no hover). `useDevelopOnce` (IntersectionObserver) fires once per image identity; the developed state persists across route returns within a visit (a fresh load restarts the visit). Hover-colorize is retired: once developed, the image stays in color. Reduced motion = full color immediately. Wired through Img's `develop` prop.

**The five-motion bundle (Session 5).**
1. EXPLORE InfoCard entrance: fade + 8px rise, ~280ms, keyed per focused node so switching words replays it (`.infocard-enter`).
2. InfoCard exit: OPEN SHEET leaves through the mylar mode ceremony (the light table switching back on), not the root view transition, because EXPLORE to a sheet is a mode change.
3. Notebook filter fade: the filtered results fade in ~180ms on lens change only (keyed by lens); initial mount and shared filtered URLs paint still (`.nb-fade`).
4. View transitions on internal page-to-page links: every react-router `Link`/`NavLink` that navigates between pages carries `viewTransition` (the "next sheet" lift/settle). Excluded: the READ<->EXPLORE mode links (they run the carbon/mylar ceremony) and the Notebook filter-clear (it uses nb-fade).
5. Kicker leader-line draw-in: the SVG line inks in, then the dot and arrowhead arrive, one-shot, sequenced after the header rule via `--kicker-delay` (`.kicker-draw`; Home only, ~950ms).

**Prior ceremonies (unchanged):** header rule draw-in (<= 900ms, once per session), RevisionWord ellipse (one flourish per page max), the READ<->EXPLORE mode toggle (carbon/mylar flood over MODE_FADE_MS/MODE_NAVIGATE_MS), and the root "next sheet" view transition (lift + settle, 400ms).

## Do / Don't
- Do put every number in mono. Don't set mono above 0.875rem.
- Do use redline for links, stamps, live values. Don't use it to categorize (awards are ink).
- Do keep one flourish per page (RevisionWord OR stamp wobble, not both animating). The header mark never animates.
- Don't introduce new furniture (clouds, north arrows, scale bars) without removing something.
- Rules/hairlines: ink/20 standard, ink/35 emphasized. No third weight, no dedicated hairline token.
- Authored asides in section header rows are prose and may be serif italic; UI labels may not.
- Known risk, mitigated: The Lungs LIVE APP link is a free-tier Railway deploy that can sleep; the link label discloses the cold start (Session 4). The demo-video fallback in incoming/lungs/ becomes the primary proof in Session 10.
- Analytics (decided 2026-07-07): GoatCounter, cookieless page counting; no cookies, no consent banner, no personal data. Script in index.html + SPA route counting in App.tsx. Localhost is never counted.
