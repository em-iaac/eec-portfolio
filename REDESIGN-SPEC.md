# REDESIGN-SPEC.md · the design of record

**Status: design phase COMPLETE, 2026-07-09.** Every design fork was decided by
Emilie with a visual in front of her. This file is the design of record for the
eec-portfolio rebuild; the implementation session plan is Section 16. It
supersedes `site/DESIGN-SYSTEM.md` and `SESSION-PLAN.md` as the forward design
authority (those remain as history). Mockups live in `design-studio/` (serve with
`npx serve design-studio`, or the launch.json "design-studio" config on port
5051; walk from `design-studio/index.html`).

No production code was written in this session; the landing is proven as the
mockup `design-studio/cover-dark-threads.html`.

> **VISUAL SKIN SUPERSEDED (2026-07-09): see `DESIGN-LANGUAGE.md` (v2).** After R2,
> Emilie pivoted the visual language to **soft / filleted / glass + a light/dark
> mode system** ("Apple Intelligence / liquid glass"; "the lab, softened").
> `DESIGN-LANGUAGE.md` is now the VISUAL language of record; THIS file remains the
> CONCEPT of record (the mind graph, the notebook, the lab framing, the IA, the
> honesty rules, the copy — all unchanged). **Where sections below describe SKIN
> (corners, surfaces, density, mono-as-texture, the Pen Table look — especially
> §5 template family, §7 chrome, §8 colour/type/motion), defer to
> `DESIGN-LANGUAGE.md`.** Where the two touch CONCEPT, this file wins. The rebuild
> plan (§16) now runs through the DL re-skin sequence (DESIGN-LANGUAGE §9): every
> future page-building session builds in the v2 language, DL-0 (foundation) first.

---

## 0 · How to read this file · what binds

- Sections 1-11 are the DESIGN. Section 12 folds in the council pressure-test.
  Section 13 is the decision log with Emilie's sign-offs. Section 14 lists what
  still needs her sign-off. Section 16 is the build plan with paste-ready prompts.
- **What binds every future session (not design, non-negotiable):**
  - HONESTY: attribution woven into prose as ordinary sentences (never labelled
    lines, never percentages; Sensi = "project lead, team credited, team of
    four"; Marsception credits Charles Abi Chahine). Verbs for the neuro tools
    are score / estimate / model, never measure; no clinical claims. lEgoarCh's
    "93% supported" describes an instructive failure, never a result.
  - PRIVACY: no public job-search signals anywhere on the site.
    `content/RECRUITER-CALIBRATION.md` is LOCAL and git-ignored: read from disk,
    never commit / quote / paraphrase its content into any committed file.
  - THE ECONOMY: `site/src/data/registry.ts` stays the single source driving the
    timeline, gallery, project pages, and the graph; the site stays cheap to
    update from that one file. Layout freezes keep CI guardrails (snapshot test +
    validator); appends only.
  - FLOORS: accessibility and honest reduced-motion states are non-negotiable in
    every direction; Emilie's voice rules apply to any drafted text (rigor +
    play, honest, funny; NO em dashes, ever); anything drafted in her voice ships
    `draftCopy: true` until she signs it.
  - LOCKED COPY: the hero question ("I started asking buildings a question my
    software couldn't answer: how will this space make someone feel?") and the
    "Behavior Information Modeling" spine are content; challenge only as an
    explicit flagged recommendation, never a silent rewrite.
- **Emilie's standing process rule (2026-07-09):** before building any page, the
  session first VISUALISES all of that page's locked design decisions for her
  confirmation, THEN builds. Every embedded prompt in Section 16 carries this.

---

## 1 · The concept

The site is **the mind of Em**: a warm, research-forward home where a visitor
meets her work as a living field of ideas and can descend into any one of them.
Two through-lines survive the review:

- **The mind graph** is the front door and the one showcase surface: her projects
  and thoughts drawn as a network of ideas.
- **The notebook** is the running record: the same work in time, drawn as the
  literal commit graph of a career.

**Tone calibration (Emilie, 2026-07-09, important):** the site leans INTO the warm
"mind / notebook / thoughts" register and OUT of the cold "construction-document /
ISSUED / tender-stamp" ceremony the old build leaned on. Numbers (P-101, T-101)
survive only as quiet labels; awards read as recognition, not stamps; placeholders
are gentle, not rubber-stamped. The drawing-set skeleton stays useful; its costume
recedes.

The brand spine ("Behavior Information Modeling") and her voice (rigor + play,
honest, funny) are unchanged.

---

## 2 · Information architecture

One world, four doors, no "modes" (five doors until G3, 2026-07-10: the NOTEBOOK
door retired; see §6). Nav (visible + scannable on every page):
**WORK · THOUGHTS · CV · ABOUT**.

```
/  (LANDING)            the mind graph, all-dark, full-bleed. The one showcase.
                        prerendered honest DOM hero paints < 1s over the drawing.
├── /work               THE GALLERY: grid of all projects; card-on-top opens a
│   └── /work/:id         project's story; deep link to its full page.
├── /projects/:id       THE PROJECT PAGE ("sheet"): proof-first; 5-template family.
├── /thoughts           THE THOUGHTS index: the written notes, newest first,
│   └── /thoughts/:id     quiet year groups (G3); a thought note (words-only leaf).
├── /notebook           RETIRED at G3 → redirects to /cv?view=graph forever (the
│                         record); old #kind hashes carry over as the facet param.
├── /cv                 plain ATS-safe CV list, default; screen-only GRAPH VIEW
│                         toggle carries the career commit graph (§6, §9).
├── /about              the person; the pivot story; NOW; contact ("what's in yours?").
└── (404)               a warm "this thought wandered off, back to the mind ›".
```

RETIRED: the separate immersive `/explore` route and `/explore/:id` focus route,
and the READ/EXPLORE "mode" framing. The mind graph absorbs the showcase job. Old
`/explore*` URLs redirect to `/` (client redirect; they are shared and citable, so
they must never 404). See Section 12 (F7) for the migration of the frozen-layout
guardrails onto the new graph. Also RETIRED (G3, 2026-07-10, Emilie): the
/notebook door; the career graph relocates INTO the CV's screen-only GRAPH VIEW
(§9), and /notebook redirects there forever, never 404s. References to the
NOTEBOOK door elsewhere in this file read through this amendment.

Every route is prerendered to a real HTML file at build time (Section 11) so each
has its own share/preview card and returns real content (not an SPA shell) to
crawlers and link-unfurlers.

---

## 3 · The landing composition (the centerpiece)

Proven as `design-studio/cover-dark-threads.html`. **All-dark, full-bleed,
non-scrolling.** The whole viewport is carbon; the mind graph fills it; a text
layer floats over it inside a soft radial scrim so it stays legible.

**3.1 The mind graph (the artwork).**
- NODES = projects + thoughts only (never employers, never milestones; milestones
  live in the Notebook time-graph). Today: 11 projects + 10 thoughts = 21 nodes.
- THREADS = ideas (neuro, AI, geometry, XR, comfort, data, and more as they
  arrive). A project sits where its idea-threads cross; a thought sits along a
  thread. Threads are an OPEN set (facets): a new kind of work adds a new thread,
  nothing is re-labelled.
- MARKS (all circles, one clean grammar): **filled dot = project · hollow ring =
  thought · larger dot with a star knocked out of it = award-winning project.**
  Award = recognition, ink, never red, never a bordered stamp.
- COLOUR ON TOUCH: at rest the whole field is monochrome (ink + anno on carbon),
  with ~5 labels showing. Hover (desktop) OR tap (mobile) a node → its own threads
  bloom in its lens colour (research cyan / practice magenta / explorations
  yellow; thoughts bloom neutral bright), connected nodes brighten, the rest dim.
- GROWTH = EVERYTHING FOREVER. The full, growing field is the art ("a work of art
  of a mind"). Legibility at scale is bought with interaction, not curation (3.4).
- THE WOVEN QUESTION: the locked opening line runs as text ALONG the comfort
  thread's curve (SVG textPath), faint, a secret rewarded by looking. It is NOT a
  headline and NOT duplicated elsewhere.
- MOTION: a one-shot draw-in on load (threads sweep, marks pop, labels fade),
  150-1500ms; reduced-motion renders the identical final composition instantly.
  A very slow (>= 20s) idle drift is the only looping motion, PRM-gated.

**3.2 The text layer (floats over the drawing, top-left, in a scrim).**
- Name: **EMILIE EL CHIDIAC** (Archivo semibold).
- Subtitle (draftCopy): **"Design Technology Architect. I work with design,
  technology and minds."** ("minds" carries the neuro/behavior niche.)
- One mono fact line: **MACAD AWARDS 2026 · WINNER · COMPUTATIONAL DESIGN ·
  MACAD @ IAAC** (the 10-second scan's award + niche insurance).
- Nav links WORK / THOUGHTS / NOTEBOOK / CV / ABOUT, with **WORK visually
  EMPHASISED** as the recruiter's proof-path. (R1 build refinement, Emilie: the
  separate "SEE THE WORK" button was DROPPED to avoid duplicating the nav; the
  emphasised WORK link carries the council's proof-path job, backed up by the
  tappable nodes and the jump bar, which are additional one-tap routes to the
  work.)
- A **jump bar** ("jump to any project or thought", `/` to focus): a smart-drawer
  that filters everything on the site and routes to it. Named as travel, never
  "ask"; no live AI (a live model is a flagged FUTURE experiment, needs a server).
  It complements the links (links = top pages, bar = the deep nodes you can't
  list), so there is no duplication.
- A handwritten Caveat margin note carrying the self-aware wink (draftCopy).
- Caption under the drawing: **"this is what's on my mind"**; its other half,
  **"what's in yours?"**, opens the contact invite on About.

**3.3 The honest hero (the council's core fix, adopted).** The name, subtitle,
fact line, the emphasised WORK link, and the graph's screen-reader `<nav>` are real DOM
that paint in under one second, before and regardless of any animation or WebGL.
The mockup is SVG/DOM (no three.js on the landing), so this is nearly free. The
ten-second phone scan (name / title / award / niche / a tap to the work) is
satisfied as flat scannable content; the artwork is progressive enhancement.

**3.4 The phone as a first-class surface (adopted).** Not a fallback:
- **tap-to-bloom**: tap a node to do what hover does on desktop.
- a **default-lit "start here" state** so the graph reads as designed before any
  input (never a dead grey field).
- a **44px minimum touch target** on every node and the award star (at 4px the
  star is currently an un-tappable smudge).
- pinch/zoom + pan available as the field grows.

**3.5 Fallback matrix** (carried from the old poster contract, simplified because
the graph is SVG/DOM, not WebGL): reduced-motion / save-data / low-power → the
static final composition, no draw-in, no drift. The screen-reader `<nav>` (every
node a labelled link, awards annotated) travels in all modes. No path shows a
broken or empty state.

---

## 4 · The gallery (WORK) · the missing surface

The review's central gap: the site indexed the work three ways but had no page
where a visitor browses the projects visually. WORK is that page.

- A simple, uniform GRID of all projects. Each card: a 4:3 image (develop-once
  grayscale→colour on first view), the project title, a ONE-LINE authored "what it
  proves" dek (a real field, never a mid-sentence clamp), a mono tech row, the
  award recognition line where real, and the project's quiet number + status.
- CLICK a card → it opens as a **card-on-top of the dimmed grid** (Emilie's pick,
  the andrewheumann.com mechanism): cover image, the story, a small strip of more
  pictures, and **OPEN THE FULL PAGE →**. Identical behaviour on phones.
- The grid is filterable by lens (facets; an open set).
- **One data object, two renditions:** this page and the printed book's index page
  are the same data and the same layout logic (Section 10, 11).

---

## 5 · The template family portrait

> **MODEL CHANGE (Emilie, 2026-07-09): the separate project "full page" is
> RETIRED. The opened card IS the project showcase.** A project has two layers,
> not three: the gallery CARD → the SHOWCASE (the opened glass sheet, deep-linkable
> at `/work/:id`). The showcase leads with the proof (media rule
> video›live›photo›audio›text), then answers the SIGNED SPINE **WHAT · WHY · HOW ·
> WHAT CAME OF IT** (G1, Emilie 2026-07-09; "what came of it" pulls an honest
> outcome into every project; the wink lives in an n.b. hover dot; tools + claim +
> links sit alongside; THE STORY collapses by default), then links OUT
> to repo / blog / live for the deep version. It is TIGHT by design: "a portfolio,
> not a blog" (Emilie) — code, full method, and long write-ups live in the linked
> repo/blog, not reproduced on-site. ONE flexible template that ADAPTS by media
> type (a video project, a build, a podcast lead differently — this is the
> "different templates per type" without maintaining N templates). The existing
> Pen Table SheetLayout sheets (P-101/102/104) are retired; their content migrates
> into the showcase (trimmed to the spine + proof + links). THOUGHTS are the
> exception (a written note keeps a calm readable page) — settled in G2. The
> master-content-file model (§11) still feeds the showcase + book spread + CV line.
> The five-member family below is SUPERSEDED by this single adaptive showcase (the
> "listening" adaptation = the podcast's audio proof; "in-progress" = a project
> whose showcase is thin until material lands). Kept below for its anatomy notes.
>
> **EXECUTED (G1, 2026-07-10).** The spine was decided with Emilie at the top of
> the G1 session (options visualised in chat, her amendment signed): **WHAT ·
> WHY · HOW · WHAT CAME OF IT, then the tools, then the links out.** WHAT + WHY
> are authored for every project; HOW and the outcome render only where real
> material exists. Her second ruling: the sheet-era margin wink survives as an
> inline **hover dot** ("a dot you hover on so we don't lose space and it's for
> people who look for it") — `components/ui/NB.tsx`, at most one per project.
> The master content files live at `site/src/content/projects/` (one per
> project, §11), the showcase is `components/work/WorkOverlay.tsx` at
> `/work/:id`, the P-101/102/104 Pen Table sheets are retired and every
> `/sheets/*` URL redirects to its project's showcase (never 404). All new
> spine prose ships `showcaseDraft: true` pending her copy sign-off.

One genus, five members, ONE shared anatomy so the reader learns the page once.
Shared anatomy, top to bottom: **identification row** (lens · context · team ·
award-recognition · one defensible stat) → **title** (voice varies by member) →
**body** → **media** → **endmatter** (back to the notebook + next page + quiet
number). Proof-first ordering (T1): title → award → abstract → demo → links, THEN
method / listing / findings at depth. Nothing is cut, only sequenced.

| Member | For | Title voice | Body / media | Motion |
|---|---|---|---|---|
| **Flagship** | P-101 Sensi, P-102 NeuroSpace ONLY | Archivo semibold | abstract → demo video → links → method → real code listing → findings; scroll-cinema plates | pinned scroll-develop (earned) |
| **Standard** | the other 9 projects | Archivo semibold | same order; calm full-width stills, no scroll tricks | develop-once only |
| **In-progress** | any unwritten project | Archivo semibold | a quiet italic "still writing this one" line + the figures already in hand + working links + a jump into the graph | develop-once |
| **Thought note** | the 10 (and growing) notes | lowercase serif italic | words only, narrow measure, optional n.b. dots, NO figures | none (the reference-quiet member) |
| **Listening sheet** | P-107 the podcast | Archivo semibold | audio player + pull-quotes instead of method/code | none |

Family rules (bound into the spec, no extra sign-off):
- ONE caption grammar everywhere: `PLATE 01 · TITLE` for plates, `FIG. 01 · TITLE`
  for figures; zero-padded; middot separators.
- ONE type scale (Section 8); the six near-identical body sizes collapse.
- Code LISTINGs never re-wrap (`white-space: pre`, horizontal scroll).
- The in-progress member is a gentle line, NOT a dashed rubber stamp (tone).
- Award is the recognition line "✦ MaCAD Awards 2026 · winner", never a boxed
  stamp, never red.

---

## 6 · The notebook · the career commit graph

> **RETIRED AS A PAGE (G3, 2026-07-10, Emilie; decided over mockups + the
> live build in-session).** The /notebook door closes; `/notebook` redirects
> to the CV's GRAPH VIEW (`/cv?view=graph`) forever and never 404s; old
> `#projects/#thoughts/#milestones` hashes carry over as the `?facet=` param.
> The DESIGN below survives the move intact: the drawn graph (6 lanes, the
> one live red tip, draw-in, PRM = instant final state), the readable rows
> beside it, the glass-2 field card, the ~84px narrow rail, and the kind
> facets (now buttons writing `?facet=`) all relocated into
> `site/src/cv/CareerGraph.tsx` as built at G2; only the door, its page shell
> and its h1 retired. The two-room model becomes ROOM + VIEW: THOUGHTS stays
> the reading room (and gained quiet year groups at G3); the time drawing is
> the CV's second face. Corridors retarget accordingly (notes' "in time"
> links land on the graph view, thoughts facet lit). New at G3: the record
> gained its NOW entry (kind `now`, single-sourced in `site/src/data/now.ts`,
> prepended so it is always the newest commit) riding the self-employed lane
> under the live tip, always lit under every facet, mirrored by the About
> page's NOW module. On the list face, a faint GHOST RAIL of the drawing
> (Emilie's "background ish" amendment on the live build) keeps the left
> margin, developing to full ink on hover/focus; pressing it or the GRAPH
> pill swaps the words for the record.

> **EXECUTED (G2, 2026-07-10; every ruling Emilie's, decided over mockups in
> chat).** The G2 fork ("two clean surfaces" vs Emilie's "one merged notebook
> with two lenses") resolved as **TWO ROOMS + LENS-AS-FACET (Model C)**:
> - **NOTEBOOK = the TIME room**, this section's hybrid form carried into the
>   glass language: drawn graph (6 lanes: main + self-employed [the one live
>   red tip] + BIM Intl stub + SOMA [merges back] + Dynamic + MaCAD) beside
>   the readable rows; **kind facets** (all · projects · thoughts ·
>   milestones, hash-addressed `/notebook#thoughts`) DIM the record instead
>   of reflowing it: the thoughts facet IS Emilie's "commit-graph lens on the
>   thinking", delivered without a mode toggle. Old `#<lens>` hashes degrade
>   to ALL. Glass-2 field card on row/dot hover (desktop garnish only; rows
>   carry every link, 44px, keyboard-first). At <768px the rail COMPRESSES to
>   ~84px, it never hides. Draw-in one-shot, PRM = instant final state; the
>   live tip is static red (no pulse).
> - **THOUGHTS = the READING room** at `/thoughts` (the fifth nav door):
>   editorial contents rows (no lead, no cards: date + T-number gutter, serif
>   italic lowercase title, the note's VERBATIM opening sentences, lens tick,
>   READ), glass only as the hover wash. The note page is **words on the
>   ground** (no panel): meta line, 62ch serif column, n.b. dots, endmatter
>   with prev/next + the corridors. Openings live in
>   `site/src/thoughts/openings.ts`, mirrored verbatim from notes.tsx.
> - **CORRIDORS both ways:** notes + index deep-link into
>   `/notebook#thoughts`; thought commits/rows open their notes. Index-row
>   titles morph into note titles (`page-thoughts-<id>`).
> - **Sitewide ruling (Emilie, G2): NO page-intro paragraphs; titles are
>   self-explanatory.** Applied to /thoughts, /notebook, /work (its signed
>   intro line retired); About at G3, sweep at G4.
> - Registry append: `self-open` milestone (2022-01, from cv.ts) anchors the
>   live branch. KindMark award glyph is now `✦` (matches the award pill);
>   the sheet `#` dropped its redline (red = liveness only); sheet-issue rows
>   read "… SHOWCASES OPENED ›" (drafted wording). The h1 lines and the
>   /thoughts h1 ship as draftCopy.

The running record, drawn as the literal commit graph of a career.

- A real drawn graph shares the stage with readable rows (mockup:
  `notebook-graph-2-hybrid.html`). The main line runs from B.Arch to NOW; branches
  curve off for employers and tracks; the self-employed branch stays OPEN with a
  single live red tip (the one sanctioned "still happening" redline).
- Every entry stays a readable row (date · kind mark · title · one-line dek ·
  link), skimmable exactly as a diary; the graph is the left structure, not a
  replacement for the words.
- Draw-in on page open; a field card slides in when you hover/tap a commit dot
  (mockup: the finish from `notebook-graph-3-art.html`).
- Kind marks stay (warm, not "issued"): project · thought · milestone · award ·
  press. Rows read "● Sensi — new project page ›", not "# SHEET P-101 ISSUED".
- Milestones and awards live HERE (the time view), not on the mind graph (the idea
  view). This is the clean division that keeps both graphs honest.
- Purpose (Emilie): "the mind of Em, all of it" — record, story, index, and diary
  at once.

---

## 7 · One chrome grammar

- ONE header family, two densities. COVER pages (landing, WORK, notebook, about,
  cv) get the full header: mark · name/role · nav (WORK emphasised) · jump. PROJECT
  and THOUGHT pages get a QUIET strip that still carries the mark, the nav, and the
  same door labels (so a shared deep link is never a nav dead-end).
- Every project/thought page gains ENDMATTER: `‹ back to the notebook` + `next ›`
  + the quiet number. A record you can leaf through.
- Naming: buttons practical, moments poetic. Wayfinding never makes a stranger
  decode a metaphor. "MODE:", "THE FIELD", "ISSUED FOR: READ", and the "WORK / X"
  breadcrumb to a dead page all retire. The one poetic line the cover keeps is
  content ("what's on my mind"), not chrome.
- Numbers (P-101, T-101) are quiet labels only; the A/C page-number fiction
  retires ("< A-000 HOME" → "< home").

---

## 8 · Colour · type · motion (the system as it survives)

**Grounds & ink (kept; they work):** mylar #F7F7F4 (light pages), carbon #0B0E13
(the landing + dark strips), ink #16181D, anno #565B63, hairline. Dark-ground
ink-dark / anno-dark.

**Redline, one meaning (kept, clarified):** red is only ever "the pen is in her
hand right now" — links/affordances, the NOW dot, live values. It never
categorises; awards are ink. This single semantic is the rule's rationale, now
written down. (The old multi-role reading was always this one role.)

**Lens pens/wires (kept):** cyan = Computation & Research, magenta = Design &
Practice, yellow = Explorations; always paired with a shape tick + label, never
colour alone. The set is OPEN (a new facet may claim a new pen).

**Type (rationalised):** Archivo (display/UI), Source Serif 4 (prose only),
Martian Mono (every number, never above 0.875rem), Caveat (margin notes only,
capped). ONE scale replaces the accreted sizes: **serif 15 / 16 / 17.5, mono
9 / 10 / 11**; the 8.5px step retires; the six near-identical body sizes collapse
to two. Declared as a table in the rebuilt system doc.

**Motion (rationalised to five primitives):** (1) develop-once (the signature;
scroll-scrub is its flagship dialect on the 2 cinema sheets); (2) the mind-graph
draw-in + bloom; (3) the page-turn view transition; (4) one "pen draws" primitive
(header rule, kicker, revision ellipse are one idea); (5) the notebook graph
draw-in + field card. Everything else retires by name. Every ceremony is one-shot,
150-1500ms, and renders its final state under reduced motion.

**Print register (NEW; the old system had none):** a print token layer for the CV
and the book — hairlines print at 100% ink / 0.5pt (ink/20 vanishes at 300dpi);
mono floors at ~7.5pt; redline text collapses to ink on paper (interaction is dead
in print; red survives only as the NOW dot's meaning); plates bleed the outside
edge only, never the bound gutter. See Sections 9-10.

---

## 9 · The CV

- The web page and the downloadable A4-PORTRAIT PDF render from the SAME data at
  build time, so the PDF can never go stale.
- FULLY PLAIN and ATS-safe: single-column text layer, no letter-spaced name, real
  "Aug 2024 - Present" dates in the embedded text, current email, expanded
  certificate names, one-line focus string near the header (computational design /
  design technology vocabulary), skills grouped craft / AI workflows / ships-with
  / professional record ("Rhino Compute" spelled with a space once for ATS).
- The ONLY non-plain touch: a small functional "updated <month year>" line for
  version clarity. NO drawing-set / "issued" language (Emilie's calibration).
- The CV's DEFAULT stays the fully plain list: ATS-safe, zero novelty, exactly as
  above. **The career commit graph now lives here, behind a screen-only GRAPH
  VIEW toggle (Emilie, 2026-07-10, superseding the earlier "never on the CV"
  line; the notebook door retired the same day, §2 + §6).** A reader who wants
  the drawing flips to it (`/cv?view=graph`, LIST | GRAPH aria-pressed pills, a
  faint ghost rail on the list face as the desktop invitation); the default
  view, ATS parsing, print (`hidden` beaten by `print:block`, always the plain
  light list, both modes, both views) and the build-time PDF are unaffected: no
  toggle, no graph ever leaves the screen.

---

## 10 · The A4 book

A downloadable **A4-LANDSCAPE PDF**, rendered by a build-time print route (headless
Chrome) so it regenerates every build and can never go stale.

- CONTENTS (standing decision): ~6 flagship/awarded project spreads + one full
  INDEX page (all projects + the thoughts) + a CV tail.
- CHARACTER (Emilie): **the LAB REPORT** — each flagship as a short paper (abstract
  · method · findings · references); thoughts recast as short position papers; a
  neuroarchitecture reading-list spine. It serves the PhD door.
- SKIN: rendered in her OWN Pen Table system (mylar, ink, mono, the recognition
  line), NOT a generic academic template. The site is the playful mind; the book
  is its formal research companion.
- SPREAD ANATOMY (survives 10 seconds + greyscale office printing): one dominant
  image; title + one-line claim; the team/credit sentence woven as prose; a mono
  tech strip; the award recognition line where real; a short live URL (print can't
  click). The INDEX page IS the WORK grid's data and layout, reused.
- PIPELINE: the same headless-render investment as the per-route prerender
  (Section 11). Needs a committed high-res image ladder for the ~6 curated spreads
  (the web ladder tops out too low for 300dpi) — a bounded print-role asset set.

---

## 11 · Platform & data

- **ONE MASTER FILE PER PROJECT.** Each project's content lives in one canonical
  document (structured prose + figure roles + a `cvLine` + `spreadAssets` + the
  one-line dek). The web page, the book spread, and the CV line are RENDITIONS of
  it. This makes "one content, three renditions" real and kills the current
  four-store drift (registry / projects / sheet TSX / cv). A planned migration
  session pays for it once.
- **Registry stays the single source** for the timeline / gallery / graph; the
  master files hang off it. Every new rendition gets a validator clause (spread
  asset exists, cvLine present, prerendered route emitted) — the cheap-to-update
  promise stays a TESTED property.
- **Per-route prerender** at build time gives every route a real HTML file →
  per-route share/OG cards, an honest 404, crawlability, and it is the same
  headless-render machinery the book needs. Build once, get four wins.
- **The mind-graph layout** inherits the frozen-layout discipline: its coordinates
  are frozen + snapshot-tested, appends only, a freeze script regenerates the
  static fallback. Same guardrails, new surface.
- **Lens set is OPEN (facets):** a new kind of work adds a lens (tick + pen);
  nothing is re-labelled. The site grows past its first chapter without a redesign.
- **IDs are permanent** (citations, printed URLs, inbound links resolve for
  years); renames are new entries.

---

## 12 · Council pressure-test & resolutions

Ran `/llm-council` on the whole assembled redesign (5 advisors → anonymised peer
review → chairman). The verdict was "keep the bold direction, fix the sequence and
the fallback." Resolutions, all folded in above:

- **CAUGHT: hover-only legibility fails on phones** (the target device). ADOPTED:
  the prerendered honest DOM hero (3.3), tap-to-bloom + default-lit + 44px targets
  (3.4). The artwork becomes the reward for staying, not the toll for entering.
- **CAUGHT: the subtitle stated no niche.** RESOLVED: Emilie's niche-bearing line,
  "…I work with design, technology and minds." (3.2).
- **CAUGHT: proof must be reachable in the 10-second scan.** ADOPTED: an
  emphasised WORK proof-path on the cover (3.2). (At R1 build this became an
  emphasised WORK nav link rather than a separate button, to avoid duplication;
  the tappable nodes + jump bar are additional one-tap routes to the work.)
- **CAUGHT: "everything forever" risks illegibility at 50+.** RULED (Emilie): keep
  everything (the mess is the art), made usable by tap-to-bloom + default-lit +
  zoom; revisit only if it truly breaks around 35 nodes.
- **CAUGHT: honesty vs a forever-growing graph (retired employers as permanent
  nodes).** DISSOLVED (Emilie): the graph shows projects and thoughts, never
  employers — a job change never rewrites the mind; she was part of the project
  regardless. No collision.
- **CAUGHT: three bespoke renderers is heavy for one maintainer in a thesis year.**
  ADOPTED: sequence the recruiter door first (landing + WORK + project template),
  defer the commit-graph notebook and the PDF book to later sessions (Section 16).
- NOTED for later (Expansionist upside, not now): the mind graph could ship as an
  open-source component — a reputation layer on top of a front door that works.

The DESIGN CRAFT lens of the four-lens panel (Phase 2) served as the
design-system + design-critique audit (typography, the template family, colour,
motion, print); its UNIFY findings are the basis of Sections 5, 7, 8.

---

## 13 · Decision log (Emilie's sign-offs, 2026-07-08 › 10)

Every item below was chosen by Emilie with a visual in front of her.

**Landing:** all-dark immersive mind graph · full-bleed, non-scrolling · nodes =
projects + thoughts · marks dot/ring/starred-dot · colour-on-touch · everything
forever · question woven in the comfort thread · niche subtitle · loud SEE THE
WORK + jump bar · "what's on my mind / in yours" split · prerendered DOM hero +
tap-to-bloom + default-lit + 44px (council fixes).
**Gallery:** its own WORK page · grid of all projects · card-on-top mechanism ·
doubles as the book index.
**Project pages:** proof-first order · 5-member template family, one anatomy ·
award as recognition not a stamp.
**Notebook:** the career commit graph · readable rows + drawing · draw-in + field
card.
**Chrome:** one family two densities · endmatter + page-turn · numbers as quiet
labels · "issued/mode/field" language retired.
**Tone:** softened, warm mind/notebook, not construction-document.
**CV:** fully plain + ATS-safe · build-time PDF from data · "updated" line only.
**Book:** A4-landscape lab report in Pen Table skin · ~6 spreads + index + CV tail.
**Platform:** one master file per project → 3 renditions · lab-for-years ambition
· per-route prerender · open lens set (facets) · warm 404 · commit graph in the
notebook not the CV.
**Housekeeping ruled:** menu = WORK/THOUGHTS/NOTEBOOK/CV/ABOUT (superseded at
G3: four doors) · source-comment hygiene sweep = yes · EXPLORE retires with
redirects.
**G3 (2026-07-10):** four doors, NOTEBOOK page retired (/notebook → /cv graph
view, redirects forever, hash → facet) · the CV gains the screen-only GRAPH
VIEW toggle; default plain list + print + PDF untouched; a faint ghost rail on
the list face is the desktop way in (Emilie's "background ish" amendment over
the live build; the boxed FIG stamp rejected) · CV list to §9 spec: real dates,
skills regrouped craft / AI workflows / ships-with / professional record, full
certificate names, FOCUS + UPDATED lines, the BARCELONA | BEIRUT string dropped
(FLAG-02) · registry gains the `now` kind, single-sourced in now.ts, always the
newest commit, always lit · About rebuilt: the h1 CARRIES the pivot ("the
architect who asked one question too many", draft 1 of 3), no intro paragraph,
approved story + invitation verbatim, dated NOW module (the page's one glass
object), contact invite completes the landing's "what's in yours?" line
(mailto, no availability status), headshot hover-colorize retired to
develop-once, the reading shelf SKIPPED for G3 · /thoughts gains the YEARS
time-spine (picked over RAIL and NONE from live screenshots): quiet mono year
labels group the rows, nothing else changes.

---

## 14 · Still needs Emilie's sign-off (during the build sessions)

- The exact wording of drafted copy (all `draftCopy`): the subtitle, the margin
  wink, the "what's on my mind / in yours" lines, every project's one-line dek,
  all sheet/thought prose, the 404 line.
- ~~The THOUGHTS index page form~~ DECIDED at G2 (see §6): contents-only
  editorial rows, no lead, no intro. Still needing her sign-off from G2: the
  /thoughts h1 ("what i keep thinking about"), the "… SHOWCASES OPENED ›"
  publish wording, the KindMark `✦` award glyph, the record rows dropping the
  lens tick + IN-PREP status labels (quiet numbers only), and whether /work
  (and the CV graph view's chrome) keep their mono kickers once the no-intro
  ruling sweeps the site (G4). (The notebook h1 retired with its page at G3.)
- From G3 (all shipped `draftCopy`, unsigned): the About kicker ("ABOUT · THE
  PERSON") + the picked h1 wording · the NOW module's three lines (now.ts) +
  the NOW row/field-card wording on the graph · the contact callback line
  ("That's what's on my mind. What's in yours?") · the CV FOCUS line · the
  SKILLS regroup wording · the ghost rail's "OPEN THE GRAPH ›" reveal line ·
  the retargeted /thoughts corridor label ("SEE THE THOUGHTS IN TIME · THE CV,
  DRAWN ›") · the YEARS spine refinement question (drop row dates to
  month-only under the year labels?) · whether the NOW module ever gets a
  "this feeds the record ›" corridor line (deferred, G4).
- The EXPLORE-retirement redirect behaviour and the frozen-layout migration
  (F7) — confirmed at the landing session.
- The book's spread copy and the flagship selection for the ~6 spreads.
- Final draft-flag sweep (all `dateDraft` / `draftCopy`) at the last session.
- FLAG-03: the MaCAD award still needs a public anchor (a link the award line can
  point to); surfaced whenever the landing or a card renders the award.

---

## 15 · Mockup inventory (design-studio/)

| File | What it is | Status |
|---|---|---|
| index.html | Studio index, walk everything from here | living |
| **cover-dark-threads.html** | **The LOCKED landing (pre-council-fix build)** | **landing reference** |
| notebook-graph-2-hybrid.html | Notebook: readable rows + drawn graph | locked form |
| notebook-graph-3-art.html | Notebook: full artwork | draw-in + field-card donor |
| notebook-graph-1-rail.html | Notebook: slim rail | reference |
| scale-threads-52-all.html | Growth test, 52 shown | reference (informed "everything forever") |
| scale-threads-52-curated.html | Growth test, curated 24 | reference (rejected) |
| landing-mind-ideas.html | THREADS, half-and-half | superseded |
| landing-mind-root.html / -lenses.html | ROOT / LENSES concepts | archive (eliminated) |
| landing-side-network.html / -commitgraph.html | split-hero concepts | archive |

The locked landing mock predates the council fixes; the landing build session
implements the DOM hero + tap-to-bloom + loud WORK + niche subtitle on top of it.
All mock prose is sample `draftCopy`.

---

## 16 · The implementation session plan

Right-sized one-sitting sessions. Paste the matching prompt into a fresh Claude
Code session, one at a time. Each is self-contained. Sessions never run git write
commands; each ends with a proposed commit summary, the changed-file list, and the
sign-off list, for Emilie to commit manually.

> **REGROUPED (2026-07-09, Emilie): the remaining work is FIVE grouped sessions.**
> R1/R2 + DL-0/1/2 shipped (landing, gallery, glass foundation, chrome, WORK
> re-skin). What's left, grouped:
> **G1 · Project pages** (was R3+R4): resolve the open design fork (card templates
> vs full pages) + proof-first + master content file + glass, all projects + the
> thought-note pages.
> **G2 · Thoughts + Notebook** (was /thoughts + DL-3 + R5): a design brainstorm
> first — do thoughts and the notebook combine, where the commit graph lives, the
> thought-card template — then build.
> **G3 · About + Contact + CV (screen design)** (was DL-4 + DL-5 screen).
> **G4 · Final sweep** (was R9 + R10): every page consistent, a11y/perf/cross-
> browser, comment hygiene, retire every draft flag.
> **G5 · Print: the A4 portfolio book + the A4 one-page CV PDF** (was R7 + the CV
> PDF pipeline).
> Each group's DESIGN decisions are resolved in the director session (visualise-
> first) before its build prompt is issued. The per-session prompts below (R3-R10)
> remain as source material folded into these five.

> **PLAN UPDATE (2026-07-09, after R2 + the v2 pivot):** R1 (landing) and R2 (WORK
> gallery) SHIPPED, building STRUCTURE in the interim Pen Table skin. The visual
> pivot (`DESIGN-LANGUAGE.md`) inserts a re-skin sequence **DL-0 … DL-5** (see
> DESIGN-LANGUAGE §9) that is now the ACTIVE next track: **DL-0 Foundation** (the
> mode system + glass primitives, live-verified) comes next, then DL-1 header/
> footer → DL-2 WORK re-skin → DL-3 notebook → DL-4 about → DL-5 CV. The remaining
> R-sessions below still stand for the surfaces DL does not cover, but they now
> BUILD IN THE v2 LANGUAGE (glass/soft/mode-aware, per DESIGN-LANGUAGE.md) rather
> than Pen Table: R3 project template + master file, R4 remaining project pages,
> R7 the A4 book (screen glass / print plain), R9 prerender + share + 404 + jump
> bar, R10 hardening + sweep. (R5 notebook ≈ DL-3; R6 CV ≈ DL-5; R8 about ≈ DL-4 —
> fold each pair into one session.) Sequence the recruiter door first as before.

| # | Session | Target | Definition of done |
|---|---------|--------|--------------------|
| R1 | The Landing ✅ SHIPPED | Ship the all-dark mind-graph cover with the honest DOM hero + phone-first interaction | Cover live; DOM hero (name/subtitle/fact/emphasised WORK) paints < 1s; tap-to-bloom + default-lit + 44px targets; woven question (fragment only); `/explore*` → `/` redirects; fallback + a11y verified desktop, 390px, reduced motion, keyboard, tap. (R1 refinements: SEE-THE-WORK button dropped for an emphasised WORK link; explore→/ naming cleanup deferred to R10; confirm Lighthouse LCP/CLS numbers at R10.) |
| R2 | The WORK gallery | The missing "show me the work" surface | `/work` grid of all 11 projects; card-on-top opens story + pictures + link; one-line deks authored; lens facet filter; award recognition line; same data shape the book index will reuse |
| R3 | Project template + master file (flagships) | One template genus, proven proof-first on the 2 flagships, one chrome grammar | Master content file shape defined; P-101 + P-102 render from it proof-first; one header (two densities) + endmatter; caption grammar + type scale + listing fix; softened tone; PRM + mobile clean |
| R4 | The remaining project pages | Every project on a real page; backlog absorbed | The other 9 projects migrated to master files; standard / in-progress / listening members; no bare placeholder anywhere; validator green |
| R5 | The Notebook commit graph | The career drawn as its commit graph (PhD door) | `/notebook` graph + readable rows; draw-in + field card; branches + live self-employed tip; milestones/awards here (not on the mind graph); PRM final state |
| R6 | The CV | Plain, ATS-safe, never-stale | `/cv` plain single-column; build-time A4-portrait PDF from the same data; ATS parse test passes; "updated" line; no graph, no "issued" |
| R7 | The A4 book | The downloadable lab-report book | Build-time A4-landscape print route; ~6 flagship lab-report spreads + index page (WORK's data) + CV tail; Pen Table skin; high-res print asset ladder; regenerates every build |
| R8 | About + NOW + shelf + contact | The human layer | About with the pivot story + the "what's in yours?" contact invite; a dated NOW module (one file to update); a reading shelf; all `draftCopy` |
| R9 | Share layer + prerender + 404 + jump bar | The site travels designed and is findable | Per-route prerender (real HTML per route); per-route OG/share cards; warm 404; the jump-bar smart-drawer wired to the site content index |
| R10 | The hardening + sweep | Verified against its own rules; signed | `/code-review` high; a11y (keyboard, contrast, SR on the graph); perf vs budgets (confirm the landing's Lighthouse LCP/CLS numbers deferred from R1); cross-browser; the source-comment hygiene sweep; the deferred "explore → /" naming cleanup (useExploreTransition etc.); every `dateDraft`/`draftCopy` retired with Emilie |

Sessions R5-R10 are the PhD-door / polish tail (deferred per the council); R1-R4
are the recruiter door and should ship first.

---

### The binding block (every prompt below restates this)

> BINDING (not design decisions, non-negotiable): (1) HONESTY — attribution woven
> into prose as ordinary sentences, never labelled lines or percentages (Sensi =
> "project lead, team credited, team of four"; Marsception credits Charles Abi
> Chahine); neuro-tool verbs score/estimate/model, never measure, no clinical
> claims; lEgoarCh's "93% supported" is an instructive failure, never a result.
> (2) PRIVACY — no public job-search signals anywhere; `content/RECRUITER-
> CALIBRATION.md` is LOCAL, git-ignored: read from disk, never commit/quote/
> paraphrase it into a committed file. (3) THE ECONOMY — `site/src/data/
> registry.ts` stays the single source; keep the site cheap to update from one
> file; the frozen layout has CI guardrails (snapshot + validator), appends only.
> (4) FLOORS — accessibility + honest reduced-motion states are non-negotiable;
> Emilie's voice (rigor + play, honest, funny), NO em dashes ever; anything
> drafted in her voice ships `draftCopy: true` until she signs it. (5) LOCKED COPY
> — the hero question and the "Behavior Information Modeling" spine are content;
> challenge only as an explicit flagged recommendation, never a silent rewrite.
> PROCESS — before building the page, VISUALISE all its locked design decisions
> (from REDESIGN-SPEC.md) in the chat for Emilie's confirmation, in plain design
> language, THEN build. Preview-verify everything (console clean, 390px mobile,
> reduced-motion). Do NOT run any git write commands; end your final message with
> (1) a proposed commit summary I can paste into git, (2) the changed/created file
> list, (3) everything needing my sign-off.

---

### R1 · The Landing

```
You are a design-director-grade front-end engineer who ships accessible,
performance-budgeted interactive SVG. Start in plan mode. Read first, in order:
REDESIGN-SPEC.md sections 0-3, 12, 13 (the landing is fully specced there);
design-studio/cover-dark-threads.html (the proven landing mock; you are
productionising it WITH the council fixes); site/src/pages/Home.tsx and
site/src/explore/ (poster.ts, graph.ts, ExploreSurface.tsx, NetworkSrNav.tsx) to
reuse the fallback + screen-reader-nav + frozen-layout patterns; site/src/
data/registry.ts (the node data); site/src/index.css (tokens). Then, BEFORE any
code, visualise the landing's locked decisions in the chat for my confirmation.

Build the all-dark, full-bleed, non-scrolling mind-graph landing: nodes =
projects + thoughts (filled dot / hollow ring / starred dot for award), colour on
touch (hover OR tap blooms the node's threads in its lens colour), the locked
question woven along the comfort thread, and the floating text layer (name; the
draftCopy subtitle "Design Technology Architect. I work with design, technology
and minds."; the mono fact line; the nav; a LOUD "SEE THE WORK" button; the jump
bar named "jump to anything"; the Caveat wink; the "this is what's on my mind"
caption). Adopt the council fixes as first-class: a prerendered honest DOM hero
that paints in under 1s regardless of animation; tap-to-bloom + a default-lit
"start here" state + 44px touch targets; the SVG/DOM draw-in with an identical
reduced-motion final state. Retire the separate /explore + /explore/:id routes and
redirect them to /. Migrate the frozen-layout guardrails onto the mind-graph
coordinates (freeze + snapshot + validator; regenerate the static fallback). Keep
the full screen-reader nav in all modes.

Perf budgets: DOM hero LCP <= 2.5s and CLS <= 0.1 on the Lighthouse mobile preset;
the graph is progressive enhancement. Use the preview tools throughout (console,
390px, reduced motion, and a real tap pass); run /code-review before finishing.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R2 · The WORK gallery

```
You are an editorial front-end designer. Start in plan mode. Read first:
REDESIGN-SPEC.md sections 2, 4, 11, 13; site/src/data/registry.ts and
projects.tsx (project data + the myPart attribution wordings); site/src/
components/ProjectCard.tsx and Img.tsx (develop-once); site/src/index.css. Then
visualise the WORK page's locked decisions in the chat for my confirmation.

Build /work: a uniform grid of all 11 projects; each card = 4:3 develop-once
image, title, a ONE-LINE authored "what it proves" dek (a real registry field, not
a clamp), a mono tech row, the award RECOGNITION line where real ("✦ MaCAD Awards
2026 · winner", ink, no box), the quiet number + status. Clicking a card opens it
as a card-on-top of the dimmed grid (cover, story, a strip of more pictures,
"OPEN THE FULL PAGE →"); identical on phones. Lens facet filter (open set). Design
the card's data as the exact object the book's index page will reuse. Author each
dek in my voice (draftCopy). Use design:design-critique on the grid before
finishing, and the preview tools (console, 390px, reduced motion); /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R3 · Project template family + master file (flagships)

```
You are a design-systems front-end engineer. Start in plan mode. Read first:
REDESIGN-SPEC.md sections 5, 7, 8, 11, 13; the current sheets
site/src/sheets/P101.tsx + P102.tsx and site/src/components/sheet/* (SheetLayout,
CinemaPlate, SheetFigure, MarginNotes, MiniSheet, SheetVideo); site/src/
thoughts/ThoughtLeaf.tsx (the reference-quiet member); site/src/index.css. Then
visualise the template family + master-file decisions in the chat for my
confirmation.

Define the MASTER CONTENT FILE shape for a project (structured prose + figure
roles + cvLine + spreadAssets + the one-line dek) and render P-101 Sensi and P-102
NeuroSpace from it in the PROOF-FIRST order (title → award recognition → abstract
→ demo → links → method → real code listing → findings). Establish the ONE
template genus with its shared anatomy (identification row → title → body → media
→ endmatter). Unify the chrome to ONE family, two densities (full header on cover
pages, quiet strip with mark+nav+same door labels on project/thought pages), and
add endmatter (back to notebook + next + quiet number). Apply the softened tone
(award = recognition not a stamp; no "ISSUED" language), the ONE caption grammar
(PLATE 01 / FIG. 01, zero-padded, middot), the rationalised type scale (serif
15/16/17.5, mono 9/10/11), and the listing fix (white-space: pre). Keep the two
flagships' earned scroll-cinema. Verify console, 390px, reduced motion, throttled
scroll; design:design-system on the family; /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R4 · The remaining project pages

```
You are a research editor and front-end engineer. Start in plan mode. Read first:
REDESIGN-SPEC.md sections 5, 11, 13; a flagship from R3 as the pattern; the master
content-file shape; content/blog-catalog.json (source material); site/src/
data/registry.ts + projects.tsx. Then visualise, per project, the page's
decisions (which template member, the dek, the honest framing) for my confirmation.

Migrate the other 9 projects to master content files and render them in the
correct template member (standard for most; in-progress as a gentle "still writing
this one" line where copy is not ready; the listening member for P-107 the
podcast). Weave attribution into prose per the honesty rule; hold the verb rules
(Lungs "designed to filter"; lEgoarCh "digitally verified buildable"; NeuroSpace
"estimates/scores"). No bare placeholder remains anywhere. Copy is draftCopy.
Verify console, 390px, reduced motion; validator green; /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R5 · The Notebook commit graph

```
You are an information designer and creative coder. Start in plan mode. Read
first: REDESIGN-SPEC.md sections 6, 8, 13; design-studio/notebook-graph-2-
hybrid.html (the locked form) and notebook-graph-3-art.html (the draw-in + field
card to graft); site/src/pages/Notebook.tsx + components/BenchRoll.tsx +
KindMark.tsx; site/src/data/registry.ts + cv.ts (career events). Then visualise
the notebook's decisions in the chat for my confirmation.

Rebuild /notebook as the career commit graph: a real drawn graph (main line,
employer/track branches, one live red self-employed tip) beside fully readable
rows (date · kind mark · title · one-line dek · link). Draw-in on open; a field
card on hover/tap of a commit dot. Milestones and awards live here (the time
view), NOT on the mind graph. Keep the warm kind-mark language (no "ISSUED").
Reduced motion renders the final composition. Verify console, 390px, reduced
motion; /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R6 · The CV

```
You are an information designer and build-pipeline engineer. Start in plan mode.
Read first: REDESIGN-SPEC.md sections 9, 11, 13; site/src/pages/CV.tsx +
site/src/data/cv.ts + registry.ts; the ATS + keyword guidance you must honour
lives in content/RECRUITER-CALIBRATION.md (LOCAL, git-ignored: read from disk,
never quote into a committed file). Then visualise the CV's decisions for my
confirmation.

Rebuild /cv fully plain and ATS-safe (single-column text layer, no letter-spaced
name, real "Aug 2024 - Present" dates, current email, expanded certificate names,
a one-line focus string, skills grouped craft / AI workflows / ships-with /
professional record, "Rhino Compute" spelled with a space once). Build the
build-time A4-PORTRAIT PDF from the SAME data so it never goes stale; prove it with
a text-extraction parse test. The only non-plain touch is a small functional
"updated <month year>" line; NO drawing-set language, NO graph on the CV. Verify
console, 390px, print preview; show the page and PDF side by side; /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R7 · The A4 book

```
You are a print-literate front-end + build-pipeline engineer. Start in plan mode.
Read first: REDESIGN-SPEC.md sections 8 (print register), 10, 11, 13; the master
content-file shape (R3); site/scripts/*.mjs (the existing image/poster pipeline to
extend); the WORK page (R2) whose data + layout the index page reuses. Then
visualise the book's spread anatomy + index + CV-tail decisions for my
confirmation, and confirm the ~6 flagship selection with me.

Build the build-time A4-LANDSCAPE print route (headless Chrome) that regenerates
the downloadable PDF every build: ~6 flagship lab-report spreads (abstract ·
method · findings · references), a full index page (the WORK grid's data), and a
CV tail, all in the Pen Table skin (mylar/ink/mono, the recognition line), NOT a
generic academic template. Add the print register from section 8 (hairlines 0.5pt
100% ink, mono floor ~7.5pt, redline → ink, outside-edge bleed only) and the
committed high-res print asset ladder for the curated spreads. Verify a rendered
PDF (screenshot + greyscale check); /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R8 · About + NOW + shelf + contact

```
You are a brand-literate front-end engineer and UX writer. Start in plan mode.
Read first: REDESIGN-SPEC.md sections 2, 3.2 (the "what's in yours?" contact half),
13; site/src/pages/About.tsx; site/src/data/registry.ts (a NOW entry kind); the
positioning ground truth in content/RECRUITER-CALIBRATION.md (LOCAL, read from
disk, never quote). Then visualise the About/NOW/shelf/contact decisions for my
confirmation.

Rebuild /about with the pivot story and the contact invite that completes the
landing's line ("what's in yours? Let's talk", a mailto, no public availability
status). Add a dated NOW module (building/reading/thinking) that updates by
editing one file and emits as the newest notebook entry. Add a reading shelf
(annotated, cross-linked to thought notes). All copy draftCopy. Retire the About
illustration's hover-colorize to develop-once. Verify console, 390px, reduced
motion; design:ux-copy on the microcopy; /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R9 · Share layer + prerender + 404 + jump bar

```
You are a build-pipeline engineer. Start in plan mode. Read first: REDESIGN-SPEC.md
sections 2, 3.2 (the jump bar), 11, 13; site/vite.config.ts + index.html (current
SPA fallback + static OG); site/src/data/registry.ts (the route + content index);
the anthropic-skills:canvas-design skill for the share-card art in the Pen Table
grammar. Then visualise the share-card + 404 + jump-bar decisions for my
confirmation.

Build build-time per-route prerender (a real HTML file per registry route) so each
route carries its own title/description/OG card and returns real content to
crawlers; per-route share cards (Pen Table: carbon or mylar ground, ink type, the
recognition line, no lens colour without a tick); a warm 404 ("this thought
wandered off, back to the mind ›"); and wire the jump-bar smart-drawer to the
site content index (filters everything, routes to it; named as travel, never
"ask", no live AI). Verify a link-preview check + the preview tools; /code-review.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

### R10 · The hardening + sweep (Emilie present)

```
You are a principal engineer running a release-hardening pass; Emilie is present.
Start in plan mode. Read first: REDESIGN-SPEC.md sections 8, 11, 13, 14 and the
perf budgets; site/DESIGN-SYSTEM.md (history). Then: /code-review at high effort
and fix verified findings; design:accessibility-review per a keyboard + contrast +
screen-reader walk (landing graph → work → project → thought → notebook and back,
including the mind graph's SR nav and the tap targets); performance vs the budgets
with a per-route bundle + LCP report on the landing; cross-browser (Firefox,
Safari, a real touch device). Run the SOURCE-COMMENT HYGIENE SWEEP: rename any
comment that narrates the private search to neutral terms (do this without ever
writing the private content into a committed file). Then walk every dateDraft /
draftCopy flag with Emilie in AskUserQuestion batches and retire them as approved.
Fix cheap wins, report the rest with numbers.

[RESTATE THE BINDING BLOCK ABOVE, VERBATIM.]
```

