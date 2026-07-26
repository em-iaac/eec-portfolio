# DESIGN LANGUAGE v3

**The visual language of record for eec-portfolio.** Consolidated 2026-07-26
from v2 plus its 32 amendments; extended to 35.

**How to read this file.** Every section states what is TRUE NOW. There are no
"supersedes" chains to follow: where an amendment changed a rule, the rule below
is already the changed one. Two appendices carry the history that still earns
its keep — **§13 THE DECLINED LIST** (what was tried and refused, so it stays
refused) and **§14 THE DECISION RECORD** (amendments 1-35 → where each lives
now, so `// DL amendment 17` in the code still resolves).

**Precedence.** `REDESIGN-SPEC.md` is the CONCEPT of record; this file is the
VISUAL language of record. On skin (corners, surfaces, density, type, motion)
this file wins. On concept, REDESIGN-SPEC wins. Where either disagrees with the
built code, **the code is the truth and this file is the bug.**

**This file is DESIGN ONLY.** It rebuilds no page; each surface is re-skinned to
it in its own focused, visualise-first session.

---

## 0 · What binds (non-negotiable)

- **HONESTY.** Woven attribution, no percentages. NeuroSpace verbs are
  score / estimate / model, **never measure**; no clinical claims. lEgoarCh's
  "93% supported" is a failure, not a result, and is never quoted. Awards
  exact: Tamayouz Top 100, Jemma finalist, MaCAD '26 winner.
- **PRIVACY.** No public job-search signal anywhere: no open-to, no
  availability, no location, no target role. `content/RECRUITER-CALIBRATION.md`,
  `WORDS-BRIEF.local.md` and `GITHUB-HONEST-MATERIAL.local.md` are LOCAL: read
  them, never commit, quote or paraphrase them.
- **THE ECONOMY.** `site/src/data/registry.ts` plus the master content files are
  the single source. A new project or note joins the site, the sitemap, the
  prerender and the print book by existing.
- **FLOORS.** WCAG AA contrast — **text on glass must still meet AA**
  (translucency is decorative; legibility wins). Touch targets >= 44px. Keyboard
  and screen reader reach everything. **Every motion is PRM-honest: reduced
  motion renders a calm, COMPLETE static state — never broken, never empty.**
- **THE INK FLOOR.** Text that renders at rest holds at least the **62% rest
  ink**. Hierarchy comes from SIZE, never from sub-AA ink. "Faint" is reserved
  for non-text decoration.
- **HER VOICE, NO EM DASHES.** New copy ships `draftCopy` until she signs it.
  Aria strings are copy too. Flag, never silently rewrite.
- **LOCKED COPY.** The hero question and the "Behavior Information Modeling"
  spine are content, not chrome.
- **COLOUR NEVER MEANS ALONE.** Lens colour always ships with its shape mark
  AND a label.

---

## 1 · The core idea

Soft, filleted, glass. Filleted edges everywhere; pills for compact metadata;
translucent frosted surfaces over a ground; low information density (the eye
meets the *work*, detail lives one layer in). But it stays a **computational
design lab** in feel, not a generic premium template: mono micro-labels, the
award recognition, lens colour and faint hairlines survive as quiet research
accents. "The lab, softened."

---

## 2 · Two grounds, one mode system

**ONE mode for the WHOLE site, the landing included.** Every screen surface
follows the mode. If it starts dark, everything is dark.

- **Mode source:** `prefers-color-scheme` by default, overridable by
  `[data-theme="light|dark"]` on `<html>` (the ModeToggle sets it; persisted;
  `index.html` re-applies it before first paint so a dark load never flashes).
- **The mind-graph survives both grounds**: dark = light-ink threads on carbon
  ("the mind at night"), light = dark-ink threads on cool white ("the mind on
  paper"). Lens colours use their wire variants on dark, their pen variants on
  light.
- **The ONE pinned exception is PRINT/PDF**, which pins LIGHT (ATS + print
  legibility). The CV *screen* follows the mode like everything else.
- Any pin wraps in a `[data-theme]` container. Never hardcode a hex.

Light ground `#f5f6f7` (cool-clean). Dark ground `#0b0e13` (carbon).

---

## 3 · Tokens

`site/src/styles/language.css` and the `@theme` block in `site/src/index.css`
are the source of truth.

**There is ONE colour system.** The old Pen Table screen colours
(`--color-mylar`, `--color-ink`, `--color-redline`, `--color-anno`) are DELETED:
they were a second vocabulary for what `--lang-*` already named, and they
disagreed — `body` painted `#f7f7f4` while every surface painted `#f5f6f7`,
which two components patched at runtime to compensate.

### Grounds + ink (per mode)
| token | light | dark |
|---|---|---|
| `--lang-ground` | `#f5f6f7` | `#0b0e13` |
| `--lang-ink` | `#16181d` | `#e8eaed` |
| `--lang-ink-muted` | `#565b63` | `#8a919c` |
| `--lang-ink-faint` | `#8a919c` | `#6b727e` |
| `--lang-hairline` | `rgba(22,24,29,.10)` | `rgba(255,255,255,.10)` |
| `--lang-interaction` | `#be123c` | `#ff4d6d` |
| `--lang-hero-muted` | `#565b63` | `#c7cbd1` |
| `--lang-hand-warm` | `#6d5f46` | `#d8d2c4` |

The last two are the landing hero's special inks; the dark hero-muted rides
brighter than ink-muted on purpose (the scrim floor).

### Glass tiers (per mode)
`backdrop-filter: blur(var(--lang-glass-blur))` where supported; `@supports not`
falls back to the same fill at full opacity (never a see-through mush). Blur is
capped and applied to bounded panels only.

| tier | light fill / border | dark fill / border | use |
|---|---|---|---|
| glass-1 (raised) | `rgba(255,255,255,.65)` / `rgba(22,24,29,.10)` | `rgba(255,255,255,.05)` / `rgba(255,255,255,.12)` | cards, panels |
| glass-2 (floating) | `rgba(255,255,255,.85)` / `rgba(22,24,29,.14)` | `rgba(255,255,255,.09)` / `rgba(255,255,255,.18)` | overlays, sheets, menus |
| `--lang-glass-blur` | `16px` | `16px` | blur cap |

### The photo scrim
Controls riding ON a photograph cannot trust the ground behind them, so they
carry their own dark. **Mode-INDEPENDENT on purpose: a photograph is a
photograph in either mode.** `--lang-scrim-rest` (.55) · `-hover` (.8) ·
`-soft` (.45) · `-faint` (.35), over `--lang-scrim` (`11 14 19`).

### Fillet scale (mode-independent)
`--r-pill: 999px` · `--r-control: 12px` · `--r-image: 14px` · `--r-card: 20px` ·
`--r-sheet: 28px`. Nothing angular; no single-sided rounded borders.

### Lens colour
`components/Lens.tsx` is the ONE consumer-side source: per lens a `label`
(long), `short` (chip), `shape`, `pen` (light), `wire` (dark) and `accent` (the
literal `light-dark()` pair — the only form that survives an SVG **presentation
attribute**, where `var()` is not reliable).

Two copies exist outside it, both sanctioned, both because they render where CSS
custom properties do not: `landing/palette.ts` (bundled under Node for the
prerender; drift-guarded at runtime) and `print/print.css` (paper). **Nowhere
else may spell a lens hex.**

---

## 4 · Type

Archivo (display / UI), Source Serif 4 (prose), Martian Mono (numbers + micro
labels), Caveat (margin notes and the landing's voice line only). Mono is a
*quiet accent*, not the dominant texture Pen Table used.

### The ladder
**9 steps. The numbers are NOT a mathematical ratio, deliberately.** Four faces
are not optically comparable — Martian Mono at 13px reads far larger than Source
Serif at 13px, and Caveat ~30% smaller than Archivo at the same value — so one
ratio would force a face to be wrong. The steps are **what the site already
agreed with itself about**.

| token | px | job |
|---|---|---|
| `--text-micro` | 9 | mono meta: tech tags, plate numbers, legends |
| `--text-label` | 10 | mono labels: doors, contact links, chips, filters |
| `--text-nav` | 12 | mono kickers, status pills, the landing nav + jump bar |
| `--text-small` | 13 | compact serif: card deks, the footer name |
| `--text-body` | 15 | body copy |
| `--text-prose` | 17 | the reading measure: About, the pillar, thought leaves |
| `--text-lead` | 21 | a surface's own title (the work overlay's h2) |
| `--text-display` | 27 | SERIF titles: the pillar, thought leaves |
| `--text-title` | 30 | ARCHIVO page titles: /work, /about, /cv |

The last two are separate on purpose: different faces do not share a rung.

**Nothing invents a size again.** If a new surface needs a value that is not
here, that is a design decision, not a CSS one.

**The pinned exceptions** are not stragglers; each is bound to something the
ladder cannot know: the name (45/30) and the descriptor row (14/12) are
MEASURE-BOUND via `--wdth-fit`; the voice line (30.97/21) and the n.b. wink
(18/16) are Caveat, and the voice line is also the measured LCP element and the
printed book's cover subtitle; About's `tall:` bumps are responsive comfort
variants, not roles; the 404 numeral (64/80) is one decorative glyph; the share
cards are a fixed 1200x630 canvas. `src/print/` is a separate `pt` system.

**A `text-[Npx]` grep is NOT the inventory.** Page titles used standard Tailwind
classes (`text-3xl`, `text-2xl`), which that grep misses entirely — which is how
/cv's h1 came to be 24px while /work's and /about's were 30px. Always check the
standard scale AND raw `font-size:` in CSS.

### The width axis
Archivo ships `wdth 62-125`. It is adopted as ONE token, `--wdth-fit: 87.5%`,
for exactly one job: **fitting a KNOWN string to a KNOWN measure**, where the
alternative is a wrap or a hand-tuned magic number. Everywhere else stays 100%;
scattered ad-hoc widths are what make type look unresolved.

What it buys, measured on the landing's 436px column: Archivo 14px is **465px at
width 100 (wraps) and 420px at 87.5 (fits)**. The axis buys a whole type step.
87.5% is subtle enough not to read as a condensed style; 75% starts to.

Consequence: the descriptor row and the name are **measure-bound**. If the copy
grows, dial the token — do not add a size.

### Ragging
`text-wrap: pretty` on prose (a last-lines optimisation: kills orphans, evens
the rag, cheap on long text) via `.prose-rag`; `text-wrap: balance` on h1/h2/h3
(it evens SHORT text into equal lines and the browser caps it at ~6 lines, so it
belongs on titles — on body copy it silently does nothing).
**`hanging-punctuation` is deliberately NOT used**: it is Safari-only, and an
optical margin only a minority of readers see is not a rule the design can lean
on.

### Canvas type
**The WORDS in a drawing render at the same PHYSICAL size whatever the viewport;
only the DRAWING scales.** SVG canvas type is therefore sized per breakpoint and
is welded to that breakpoint's camera (§10). Change a camera and its type sizes
must change with it, or the rule breaks.

---

## 5 · The emblem (CE, the constellation cube)

The EEC mark is a graph cube. `site/src/components/LogoMark.tsx` is the geometry
of record; `public/favicon.svg` carries the same geometry with beefed weights.

- **Letter anatomy** (canonical): E1 = left face, E2 = top face, C = right face.
  E2's spine sits on the edge it shares with E1; E2's far bar is the same stroke
  as the C's top arm.
- **Three depths of line**: the outer shell heavy (w7); every thread touching
  the redline node thin (w4); the two back-right edges that only close the cube
  a 45% ghost (w3.2). The object converges into its live point.
- **Nodes**: 6 corner (r13) + 2 dash-tip (r8), ink. The redline node (r15) sits
  where all three letters meet and rides `--lang-interaction` — the mark's one
  red.
- **Mode-aware always.** No tone prop, no ground-pinned variant.
- **STATIC ALWAYS: no plot-in, no hover ceremony.** Unchanged since Session 4,
  re-affirmed 2026-07-26 (§13).
- **Derivatives regenerate together**: `favicon.svg` (self-theming),
  `favicon-16/32.png`, `apple-touch-icon.png`, `og.png`.
- `aria-label="EEC"`, `role="img"`.

---

## 6 · The cursor (the node cursor, sitewide)

The pointer is part of the drawing: a **soma** at rest (ink node, r5 core,
contrast outline, 55% halo, 24px, hotspot-centred) and the **red live node**
over anything clickable — red = interaction, the same law as the graph. The
visitor is a point in time moving through the mind.

- **Tokens** `--cursor-rest` / `--cursor-live`, mode-aware via explicit
  `prefers-color-scheme` + `[data-theme]` blocks (`light-dark()` cannot wrap
  `url()`). Each carries its native keyword fallback, so unsupporting browsers
  and forced-colors users keep the OS cursor.
- **Semantics survive, non-negotiable**: text fields keep the I-beam, the world
  keeps grab/grabbing, the lightbox keeps zoom-in. Touch is unaffected.

---

## 7 · The frame

**Every interior page is a FROZEN FRAME**: `h-dvh`, the header pill on top, the
content band scrolling internally, the footer at the foot. The page does not
scroll; its content does.

- **ONE PILL, ANCHORED LEFT, on every page.** Pixel-identical everywhere: the
  EEC mark, the four doors, a hairline, the 44px ModeToggle. It never grows or
  morphs between rooms.
- **A page's own TOOLS ride the header line beside the pill**, never inside it
  (`.pill-tools`). They are FRAME, not content.
- **The FOOTER is a frozen wide pill**: near-full-width with a breath of margin,
  the same stadium the header wears, name lockup left, contact right. `/about`
  and `/cv` drop it — their contact lives in the content. That inconsistency is
  deliberate and correct.
- **NO ROOM SIGNS.** The old kicker tier (`WORK · THE PROOF`, `CV · THE RECORD`
  …) is gone sitewide: the nav says where you are, the title says it once, a
  third repetition is scaffolding. ONE survivor: the 404's bare mono `404`,
  because the status number is real information its voiced h1 lacks.
- **A page title is either a ROOM LABEL or CONTENT, and they behave
  differently.** `/work`'s h1 is `lg:sr-only` because the pill already says
  WORK; `/about`'s "Say hi" and `/cv`'s name are content and show. Not an
  inconsistency.
- **The thought leaf** carries its meta (kind · date · lens · number) and its
  three controls on the header line, each an icon + its own AA accent: ALL
  THOUGHTS (list glyph, indigo), IN TIME (clock, amber), NEXT (arrow, teal).
  Only the title and the words live in the content band.

**Known debt: `SheetPage` is a switchboard, not a shell.** Five props produce six
page shapes for six pages, so every surface is a special case and the shell
cannot tell you what a page IS. The fix is 2-3 named presets
(`reading` / `gallery` / `canvas`). It touches all six pages, the gain is
internal, and it cannot be verified by looking: **it needs its own session.**

---

## 8 · Components

Primitives ship in `site/src/components/ui/`.

- **Pill** (`Pill.tsx`) — the compact metadata unit, `--r-pill`.
  `Pill` (neutral) · `FilterPill` (facet control; active = solid ink, rest =
  glass; the visible pill stays compact inside a transparent >= 44px hit area) ·
  `StatusPill` (`live` = an interaction dot; `award` = `✦` + wording; `solid`
  swaps the translucent fill for the pre-composited one when riding a
  photograph) · `LensPill` (truncating; carries the SHORT lens name).
- **LensMark** — the ONE lens shape component, `{lens, size, active}`. Size 7
  inside a pill, 9 beside running text. Inside a solid-ink pill it inherits
  `currentColor` so it never fights the fill. `Lens.tsx`'s `LensGlyph` is the
  geometry and the only place the three shapes are described. Print keeps its
  own six-line renderer off that same geometry: paper has its own type, tokens
  and pinned ground.
- **Surface** — the glass panel wrapper: `tier` 1 raised / 2 floating.
- **Card** — image-forward, built on Surface. On `/work` every face is a PLATE
  (a designed ink artifact) at rest; the cover and its gif reveal on hover.
- **DownloadPill** — the ONE download affordance sitewide: a compact visible
  pill inside a transparent >= 44px hit area, type icon + label.
- **ModeToggle** — sets `[data-theme]` and persists.
- **The magnifier (`.nav-lens`)** — the site's pointer ceremony ON CONTROLS. A
  liquid-glass lens rests on the current room and SLIDES to whatever door the
  pointer is over, magnifying the label beneath it. **Motion never means alone**:
  the active label stays bold ink, so a no-JS / reduced-motion / first-paint
  visitor still reads "you are here". **The magnifier belongs to controls. It
  was tried on the artwork and refused (§13).**
- **The sketch dot** — the one figure mechanism in thought notes.
- **Link recipes** (`lib/linkStyles.ts`) — `RED_LINK` (the paint) ·
  `RED_LINK_ROW` (paint + a 44px inline-flex box, for standalone links) ·
  `RED_LINK_TAP` (paint + `-m-2 p-2`, for links inside running prose where
  inline-flex would break the line box) · `INK_LINK` (the one deliberate
  near-variant: ink text, red focus ring, on a photograph's caption strip).

- **The share cards** (`print/OgRoute.tsx`) — 36 cards, one per page, built by
  the prerender. Each frames **its own corner of the mind graph**, with its node
  lit in the interaction red, bled off the right edge behind the words at 0.5
  opacity. A camera on the frozen model, exactly like the phone: no coordinate
  moves and nothing new is drawn on the artwork. They used to share one mark, so
  every link looked identical in a feed.
- **The jump bar** — searches labels (fuzzy subsequence), then TAGS and DEKS
  (substring, ranked strictly below any label match, so naming a thing never
  buries it). Tags and lens are free — the registry is already in the entry
  bundle. **Deks are NOT**: they live in the 129kB `/work` chunk, so they are
  lazy-loaded on first FOCUS of the bar. Nobody pays for search text until they
  reach for search. It matters most on phones, where the camera frames only part
  of the drawing.

**NAMING: one noun per shape.** "Chip" is retired as a rival to "pill" — every
`--r-pill` object is a Pill; the lens shape is a Mark.

---

## 9 · Motion

`--ease-soft: cubic-bezier(.2,.8,.3,1)`. Durations 200-320ms. Every ceremony is
one-shot and renders its final state under `prefers-reduced-motion`.

### The vocabulary
**THERE IS ONE CONTENT SURFACE ON THIS SITE, AND IT CHANGES WHAT IT HOLDS.**

The fix for "it feels like pages" was not an effect, it was **naming**. A
`view-transition-name` lifts an element OUT of the root snapshot, so the content
moving underneath can no longer drag it along.

- **The frame holds still**: `chrome-pill`, `page-tools`, `page-foot` are named.
  Do NOT force `animation: none` on them — `/work` has a footer and `/about`
  does not, so an unpaired name would hold full opacity and then vanish in one
  frame. The default fade handles paired and unpaired correctly.
- **The magnifier is the one moving piece of chrome**: it slides from the old
  door to the new one across the navigation.
- **The content moves, and it is the only thing that moves.** Out is fast
  (140ms, translate + fade); in is slower (300ms) and starts at 80ms, once the
  old has mostly gone. **Never two equal opposing fades — the eye reads that as
  a flicker, not a movement.** Transform + opacity only.
- `mix-blend-mode: normal` is pinned on root's old/new: Chrome's default
  plus-lighter is built for symmetric cross-fades of the SAME content, and two
  different pages on a light ground wash bright.
- **`stay`** (`<html data-vt>`, `lib/navIntent.ts`) is the one exception: a
  change WITHIN a room (the /work card over its own gallery) must not move the
  content at all, or the gallery slides out from under the card just opened. A
  short opacity pass only; the shared-element morph carries the meaning.

### Shared-element morphs
The name is the DESTINATION route's slug: `page-` + the route with slashes as
hyphens (`page-work-sensi`). The routed page's hero carries it; a source that
opens that route adopts the same name.

**HARD RULE: at most ONE element per name per rendered state.** A duplicate
aborts the whole transition to a hard cut.

**A shared name is a PROMISE THAT THE TWO BOXES ARE THE SAME OBJECT.** If they
are not, give them different names — one shared `page-tools` made the browser
squash /work's 794px filter row into /thoughts' 149px button. Measure the boxes
before sharing a name.

Wired pairs: the /work plate → its page · a landing mark → its page · the
world's locked CARD → its page (the card, not the neuron: the card is what the
reader is looking at when they press OPEN, and it already holds the title).

### A blank hold is not a transition
Every route is lazy behind a Suspense hold. A cold navigation used to fade into
an empty rectangle and then hard-cut when the chunk landed.
`lib/preloadRoute.ts` warms the chunk first — the four doors on idle, anything
else on pointer/focus intent — **always AFTER `load`**, so warming can never
compete with the landing's LCP.

### Ceremonies play ONCE PER VISIT
`lib/develop.ts` is the ledger (the image develop, the mind-graph draw-in, the
overture). An entrance that replays every time you come home is the opposite of
the site being one continuous place.

### The overture
The identity column enters in READING ORDER over ~1.1s (5 x 120ms stagger +
620ms). **TEXT RISES, TEXT NEVER FADES.** A text tier starting at `opacity: 0`
is text that PAINTS LATE, and the late-painting thing is the sentence a
recruiter came to read; the voice line is the measured LCP element. A transform
costs LCP nothing. Only the MARK, a graphic and not a sentence, may fade.
Transform-only means layout-neutral: no CLS.

### No forever-motion
The landing ran **14 infinite animations** (7 award halos + 7 sparkles) to say
something a static mark can say. The halo now RESTS at `opacity: 0.3` — it was
`0`, which is precisely why it had to loop to be visible at all — breathes twice
on arrival and once on hover. Keyframes begin and end ON the resting value so
the pulse lands with no step. **ONE infinite animation survives, deliberately:**
`nw-livebeat`, the live NOW tip on /thoughts — one element, and a pulse there
genuinely means *live*.

### Engineering rules these cost us
- **A bare inline `animationDelay` applies to EVERY animation that element will
  ever run.** A delay belonging to one animation must be a named custom property
  that only that rule reads.
- **A MediaQueryList `change` event is not enough.** On a resize `.matches` can
  flip and the CSS re-evaluate while `change` never fires. Anything mirroring a
  media query into JS state must listen to `resize` too. CSS media queries are
  guaranteed by the platform; a JS mirror is not. Prefer CSS; where JS must
  mirror it (an SVG `viewBox` cannot be set from CSS), belt AND braces.
- **A cloned layer must not reuse the live layer's classes**: those carry state
  (dimming, rest opacity, draw-in animations) that has no meaning in a clone.

---

## 10 · The field (the two drawings)

Two views of one mind: the landing is **the mind at rest**, `/thoughts` is **the
mind in time**. Both read the same registry.

### The neural vocabulary (`/thoughts`)
Kind lives in the neuron: filled soma + lens nucleus = project · ring + core =
thought · a small star off its work = award · a bare commit dot on the lane =
milestone. The ruler is geometric and faint, the nerve organic and bright; the
contrast is the design. **The mind owns all motion.** At rest it is quiet points
in time; it WAKES WHERE YOU LOOK (the proximity reveal). Hover glances, a click
LOCKS the card, click again / Escape / a tap on empty field closes it. The
canvas carries no words of its own.

### The landing field
Six idea threads; projects sit where threads cross, thoughts sit along a thread.
Geometry is FROZEN by a file snapshot — **content may be appended, coordinates
may not move.**

### The phone camera
A phone does not see the whole canvas. At 390px the full 1440x860 sliced into
the 46svh band renders every mark at **3.2px**, which is a drawing you cannot
use. So the phone gets its **own camera on the same drawing**: `viewBox
530 200 557 554`, scale 0.451 → **0.70**, marks → **5.0px**, framing 18 marks
and 5 of the 7 awards over the dense middle. It deliberately drops the lower
shelf of older, smaller work.

A viewBox is a CAMERA, not geometry: no coordinate moves and the snapshot stays
green. **Two costs, accepted knowingly**: all six THREAD NAMES anchor at the far
right (x ~1337) and fall outside the window; and the phone canvas type is
calibrated to 0.70 and must move if the frame does.

**The phone field is a CONSTELLATION.** Resting labels are hidden below 640px
(they rendered at 3.6px — not small, illegible); ONE name shows at a time, at a
size you can read. A **"start here"** mark arrives already named, so the field
says "these dots are things" before any input. It is NOT the full bloom —
setting `active` would dim every other thread — and it retires on first touch.

**Touch targets are honest by PICKING, not by hit boxes**: `onPointerDown`
selects the NEAREST node within 80 canvas units — a **72px effective diameter
with no dead zones between marks**. The `r=15` hit circle is the MOUSE target.

**Gate the CSS and the JS on the SAME query.** The invitation once used
`pointer: coarse` while the CSS used `max-width: 639px`; a narrow DESKTOP window
then got no rest labels AND no invitation — a field of anonymous dots.

---

## 11 · Colour governance

- **Redline = interaction + liveness ONLY.** Never a category.
- **Lens colours** — cyan = Computation & Research, magenta = Design & Practice,
  yellow = Explorations — always ship with a shape mark + a label. Open set.
- **Lens names are TWO-FORM**, deliberately: the LONG name is what a screen
  reader hears, the SHORT one is what a 9px chip can hold. Neither may be edited
  without the other. A screen reader is never handed an all-caps string it may
  spell out letter by letter.
- **Award = recognition: ink, `✦`, no box, NEVER red.**
- Glass tints are neutral (white / ink alpha). Colour enters only through lens
  marks and the interaction accent.

---

## 12 · Density

Low. A surface shows the least that lets the visitor choose; the next layer
holds the detail. This recycles everywhere: the gallery card, the CV, the About
page all inherit "quiet surface, detail one layer in".

The CV is the **landscape record** on screen (three columns, no scrolling
system, icon + AA accent per section) and stays the plain single-column portrait
in the PDF, which ATS reads. About is the **landscape contact split**: the person
left, a hairline, the contact right.

**Folders** are deferred, not rejected. `/work` stays on filter pills; a folder
element is a candidate for a different surface and gets its own visualise-first
session.

---

## 13 · THE DECLINED LIST

**Everything here was considered and refused. Do not re-propose it.** Where
something was built before being refused, that is noted — rebuilding it better
is not an answer to it.

| | why it is dead |
|---|---|
| **The magnifier over the artwork** | BUILT, verified, cheap (0.013ms/move) and reverted **on sight** (2026-07-26). Not blocked on execution quality. |
| **The woven question along a thread** | The spec asked for a textPath on COMFORT, which drops 560 canvas units while moving 45 sideways: it reads TOP TO BOTTOM. On a horizontal thread it leaves the idea it names. `QUESTION` / `QUESTION_FULL` deleted. |
| **A directional page slide** | BUILT and dropped. 24px over 300ms is the dead zone where the eye reads "something shifted" instead of "I travelled"; committing harder makes it a phone-app push. |
| **Pinch / zoom / pan on the phone field** | Replaced by the fixed phone camera (§10). |
| **A preview card on a mark** | Puts a panel over the artwork. |
| **A tethered award label, or anything drawn ON TOP of the artwork** | The artwork carries no chrome. |
| **A proof / award CHIP or button in the identity column** | Declined 2026-07. |
| **The credential plate** | Declined 2026-07. |
| **Paper grain / ink bleed** | Declined. Do not prototype it to make the no harder. |
| **The signet breathing** | §5 says the mark is static always. Unlocking a signed rule for a hover flourish: declined 2026-07-26. |
| **Making the handwritten line a claim** | Council-killed: it is the measured LCP element, it is signed, it is the printed book's cover subtitle, and 21px Caveat is a scan-hostile face. |
| **A whole-landing composition redesign** | Ranked last on every council ballot. PARKED, explicitly. |
| **Tracing a lineage** (click a node, walk its braid chronologically) | A new mode on a surface just simplified. /thoughts already walks time; the landing already lights threads. Declined 2026-07-26. |
| **Procedural plates** for a project with no hand-drawn one | All 21 projects have plates. Infrastructure for a project that does not exist. Build it the day it is needed. |
| **The mode flip as a ceremony** | A transition on a toggle is ornament that does not earn its place. Declined 2026-07-26. |
| **A per-project single-sheet PDF** | The A4 book already is the leave-behind, and this adds 21 renders to every build. Declined 2026-07-26. |

---

## 14 · THE DECISION RECORD

Amendments 1-35 (v2, 2026-07-09 → 2026-07-26) and where each now lives. Kept so
that code comments citing an amendment number still resolve.

| # | what it decided | now |
|---|---|---|
| 1 | CV mode follows, not pinned | §2 (superseded in full by 5) |
| 2 | /work soft dark pin | §2 (retired by 5) |
| 3 | the floating glass header pill | §7 (detail rewritten by 16) |
| 4 | card face = square, `--r-card` | §8 (re-skinned by the plates) |
| 5 | ONE mode, whole site | §2 |
| 6 | page transitions + the morph naming convention | §9 (rewritten by 23) |
| 7 | the NEURAL vocabulary | §10 |
| 8 | the PROXIMITY REVEAL | §10 |
| 9 | room signs **+ the 62% rest-ink floor** | signs retired by 14; **the INK FLOOR is LIVE, §0** |
| 10 | About = contact sheet; the node cursor | §6, §12 |
| 11 | the sketch dot | §8 |
| 12 | the pillar carries no room sign | absorbed by 14 |
| 13 | hero ink tokens | §3 |
| 14 | the sign lines RETIRED | §7 |
| 15 | THE FROZEN FRAME | §7 |
| 16 | ONE pill, anchored left; tools on the header line | §7 |
| 17 | THE MAGNIFIER (on controls) | §8 |
| 18 | the footer = a frozen wide pill | §7 |
| 19 | ONE download affordance | §8 (`DownloadChip` → `DownloadPill`) |
| 20 | the CV = the landscape record | §12 |
| 21 | About = the landscape contact split | §12 |
| 22 | the thought leaf inside the frame | §7 |
| 23 | THE MOTION VOCABULARY | §9 |
| 24 | THE WIDTH AXIS, one step | §4 |
| 25 | THE SMALL TYPE SCALE, 9 tokens | §4 |
| 26 | ONE SYSTEM (colour, lens mark, scrim, naming) | §3, §8, §11 |
| 27 | the forever-twinkle retired | §9 |
| 28 | the phone field + the phone camera | §10 |
| 29 | the magnifier on the drawing: reverted | §13 |
| 30 | THE OVERTURE | §9 |
| 31 | the woven question: resolved out | §13 |
| 32 | a MediaQueryList `change` event is not enough | §9 |
| 33 | share cards frame their own corner of the drawing | §8 |
| 34 | the jump bar searches tags + deks, deks lazy | §8 |
| 35 | prose ragging: `pretty` on prose, `balance` on titles | §4 |

**Historical: the rebuild sequence.** `DL-0` foundation · `DL-1` header + footer
· `DL-2` WORK · `DL-3` notebook · `DL-4` About · `DL-5` CV. All executed. These
are SESSION names, not amendment numbers; code comments cite them widely and
they are deliberately not renumbered.
