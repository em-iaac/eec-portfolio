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

### CinemaPlate (Session 8)
A cinema plate is a FIGURE, not new furniture (rule 6): a full-width figure or video block inside an ISSUED sheet's main column that pins (native `position: sticky` only) while scroll develops it. Props: `media` (image or video manifest ref), `caption` (SheetFigure mono grammar), `note?` (ONE riding margin note in handwriting; it counts toward rule 8's five-per-sheet cap TOGETHER with the MarginNotes aside), `height?` (160/180/200 svh, default 180), `bleed?` (lg only: the plate extends under the aside track; authoring rule: bleed plates sit below the aside's vertical extent, which holds by construction because riding notes live inside the plate), `flow?` (no pin on any breakpoint; the develop still scrubs with viewport traversal), `still?` (the PLATE SPEC, Session 9: full-bleed ONE-SHOT plate on every device, no pin, no scrub, no scroll listener; the foundry default, see "The plate spec" below). Cinematic mode drives `--p` (raw progress) and `--dev` (ratcheted develop) through the shared scrub manager; static mode (reduced motion, save-data, low-power) OR `still` renders the SheetFigure pattern with the standing one-shot develop, final states, no listeners. Sanctioned by motion unlock (a) and the Sheet cinema addendum below; illegal anywhere outside an issued sheet's plates.

**Authoring rules (Session 8 critique, binding for Sessions 9-14):** a pin must EARN ITS HOLD: pin only plates whose media rewards staring; demote the rest to `flow`. The pin is a desktop dramaturgy: below lg every plate flows unpinned with the traversal scrub and full-bleed media (a wide capture pinned in a phone-height stage reads as a stamp floating in empty mylar). Caption and riding-note opacity ride the ratcheted develop, never raw progress, so read content never fades back out on an upward scroll.

### SheetVideo (Session 8)
Self-hosted video figure reading `src/data/videos.json` (emitted by `scripts/optimize-videos.mjs`: H.264 mp4 + webp poster ladder; the sources array keeps a webm slot open, mp4-only shipped by Emilie's call 2026-07-08). Native `controls` ALWAYS (WCAG 2.2.2), `playsInline`, poster attr, mono caption in SheetFigure grammar, layout reserved from the manifest aspect. Without reduced motion: silent clips run as muted loops whose play/pause follows viewport visibility; `preload="metadata"` (`none` under save-data). Under reduced motion: poster + controls, no autoplay, no loop. Sound NEVER autoplays. Silent captures say so in the caption. Works standalone in the prose flow or as CinemaPlate media (video is never filter-scrubbed; develop applies to stills only).

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

**The develop rule (standing, Session 5).** An image develops grayscale to color once, <= 500ms, the first time it enters the viewport, on ALL devices (the ceremony is FOR phones, where there is no hover). `useDevelopOnce` (IntersectionObserver) fires once per image identity; the developed state persists across route returns within a visit (a fresh load restarts the visit). Hover-colorize is retired: once developed, the image stays in color. Reduced motion = full color immediately. Wired through Img's `develop` prop. *Plate variant (Session 8, motion unlock a):* inside a cinema plate the develop is scroll-scrubbed instead of time-driven; it RATCHETS (scroll can only advance it, never regress it below its high-water mark) and a fully developed plate persists for the visit exactly like the one-shot develop. Everywhere outside plates, the one-shot rule stands unchanged.

**The five-motion bundle (Session 5).**
1. EXPLORE InfoCard entrance: fade + 8px rise, ~280ms, keyed per focused node so switching words replays it (`.infocard-enter`).
2. InfoCard exit: OPEN SHEET leaves through the mylar mode ceremony (the light table switching back on), not the root view transition, because EXPLORE to a sheet is a mode change.
3. Notebook filter fade: the filtered results fade in ~180ms on lens change only (keyed by lens); initial mount and shared filtered URLs paint still (`.nb-fade`).
4. View transitions on internal page-to-page links: every react-router `Link`/`NavLink` that navigates between pages carries `viewTransition` (the "next sheet" lift/settle). Excluded: the READ<->EXPLORE mode links (they run the carbon/mylar ceremony) and the Notebook filter-clear (it uses nb-fade).
5. Kicker leader-line draw-in: the SVG line inks in, then the dot and arrowhead arrive, one-shot, sequenced after the header rule via `--kicker-delay` (`.kicker-draw`; Home only, ~950ms).

**Prior ceremonies (unchanged):** header rule draw-in (<= 900ms, once per session), RevisionWord ellipse (one flourish per page max), the READ<->EXPLORE mode toggle (carbon/mylar flood over MODE_FADE_MS/MODE_NAVIGATE_MS), and the root "next sheet" view transition (lift + settle, 400ms).

## Sheet cinema (Session 8 addendum · signed 2026-07-08)

**Scope.** Scroll-driven motion is legal INSIDE sheet plates only, nowhere else. A plate is a full-width figure or video block inside an ISSUED sheet's main column. Sheet chrome (header, title block, meta rows, footer), running prose, cards, the Notebook, EXPLORE, Home, About, CV: none of it may be scroll-linked, ever. New motion outside this scope remains an explicit Emilie decision, never a silent add.

**Framing.** Cinematic pacing reads as leafing through Em's notebook. Plates are notebook pages: the pin is the moment a page holds your attention; the develop is the print developing while you look at it; margin notes ride along like handwriting in the gutter; the instructive fail is filed as method with the same care as the wins. A cinematic sheet must never read as a product page: no feature grids, no marketing bands, no CTA blocks, no autoplaying sound, no numbers set as hero type.

**Motion grammar.** Inside a plate, motion is position-driven, not time-driven: scroll position maps to element-level transform / opacity / filter only (rule 7's element-level clause binds here; root-level effects stay illegal). Pinning uses native `position: sticky` only. The scrubbed develop RATCHETS: scroll can only develop a plate further, never back below its high-water mark, and a fully developed plate stays developed for the visit (develop-once persistence extends to scrubbed develops). Captions and margin notes may ride with progress; handwriting stays inside rule 8's caps.

**Fallback.** Reduced-motion, save-data, and low-power devices get the static sheet: no pinning, no scroll linkage; plates render as plain figures with at most the standing one-shot develop, final states always. The static sheet is a first-class design, not a degraded one: every plate must read complete without motion.

**Perf bar.** Scrolling a cinematic sheet holds >= 30fps at 4x CPU throttle on a mid-range mobile profile. A plate that cannot hold the bar loses its motion, not the sheet its content.

**A11y floor.** No pinned section may trap keyboard scrolling: the document scrolls natively at all times (no wheel, touch, or key interception, no JS scroll-jacking, no forced snap points). All content is reachable and readable without JS. Videos never autoplay with sound; a muted loop runs only where reduced motion allows it, and controls are always present.

## The plate spec (Session 9 addendum · signed 2026-07-08)

Derived from the cinematic system above as the LIGHTER DEFAULT for the eight foundry sheets. Emilie's ruling 2026-07-08: **full-bleed one-shot plates.** It binds Sessions 10 and 14.

**What it is.** A plate spec plate is `<CinemaPlate still>`: a full-bleed figure (edge-to-edge on phones, framed back inside the paper margin at lg) that runs the STANDING one-shot develop (grayscale to color once on first viewport entry, the develop-once rule) and nothing else. No pin, no scroll linkage, no scrub listener, on every device. Same media resolution, caption grammar, and riding-note grammar as a cinema plate; only the motion contract is lighter.

**When to use which.** The plate spec is the DEFAULT for a sheet's figures. Scrubbed/pinned cinema (the flagship treatment) stays reserved for the two flagships, P-101 Sensi and P-102 NeuroSpace, where the media rewards staring and motion carries the meaning (an app answering back, a slider moving a score). A pin must still earn its hold; if you cannot say why a plate rewards a scroll-linked develop, it is a `still` plate. A single sheet may mix: a `still` spine with one earned cinematic plate is legal, but the eight foundry sheets are expected to be all-`still`.

**Authoring rules.** Full-bleed is automatic (`still` handles the negative margins); pass `bleed` only for the lg under-aside extension, exactly as a cinema plate. Captions keep the SheetFigure mono grammar; riding notes and the MarginNotes aside share rule 8's five-per-sheet cap unchanged. Video plates never take `still` (video is never a still; use a plain plate or `flow`). Keep figure counts honest: the plate spec makes every figure full-bleed and loud, so resist the gallery urge (P-106's eight-figure ceiling is the model).

**Fallback.** A `still` plate is already a one-shot, so reduced motion, save-data, and low-power need no separate path: they simply skip the develop animation and paint full color immediately (develop-once's PRM clause). The static plate is the design, on every device.

**Perf.** A `still` plate registers no scroll listener and writes no per-frame CSS vars, so a plate-spec sheet costs nothing beyond its images (which carry the develop-once IntersectionObserver already). The >= 30fps-at-4x-throttle bar is a flagship concern; foundry sheets clear it by construction.

## Do / Don't
- Do put every number in mono. Don't set mono above 0.875rem.
- Do use redline for links, stamps, live values. Don't use it to categorize (awards are ink).
- Do keep one flourish per page (RevisionWord OR stamp wobble, not both animating). The header mark never animates.
- Don't introduce new furniture (clouds, north arrows, scale bars) without removing something.
- Rules/hairlines: ink/20 standard, ink/35 emphasized. No third weight, no dedicated hairline token.
- Authored asides in section header rows are prose and may be serif italic; UI labels may not.
- Known risk, mitigated: The Lungs LIVE APP link is a free-tier Railway deploy that can sleep; the link label discloses the cold start (Session 4). The demo-video fallback in incoming/lungs/ becomes the primary proof in Session 10.
- Analytics (decided 2026-07-07): GoatCounter, cookieless page counting; no cookies, no consent banner, no personal data. Script in index.html + SPA route counting in App.tsx. Localhost is never counted.
