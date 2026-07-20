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
/  (LANDING)            the mind graph, full-bleed. The mind AT REST, unchanged.
                        prerendered honest DOM hero paints < 1s over the drawing.
├── /work               THE GALLERY: grid of all projects; card-on-top opens a
│   └── /work/:id         project's story; deep link to its full page.
├── /thoughts           THE NEURAL WORLD (built at the meta build): the whole
│   │                     record in time, one full-bleed proximity-revealed map
│   │                     (§6); #<id> deep-links centre + wake a piece.
│   ├── ?view=words     the G2 READING ROOM, one corridor away (editorial rows,
│   │                     year spine; unchanged).
│   └── /thoughts/:id   a thought note stays a words-only leaf.
├── /notebook           RETIRED → redirects to /thoughts forever (the world
│                         shows every kind; old #kind hashes need no carrying).
├── /cv                 the plain ATS-safe list, nothing else (§9; the G3 graph
│                         view + ghost rail retired at the meta build; old
│                         ?view=graph URLs degrade to the list, never 404).
├── /about              the person; THE CONTACT SHEET (2026-07-12): ONE SCREEN,
│                         no scroll · "Say hi" h1 + cube + short signed bio +
│                         invitation ("what's in yours?"); THE FOOTER IS the
│                         contact row; story, headshot + NOW module retired.
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

> **THE META BUILD · THE NEURAL WORLD SHIPPED (2026-07-11, Emilie; every gate
> decided live over the browser + AskUserQuestion; production code in
> `site/src/thoughts/world/`).** The G3.5 world went to production as
> /thoughts with one headline refinement signed at gate 1:
> - **THE PROXIMITY REVEAL ("a simple way to show complexity").** At REST the
>   world is quiet points in time: somas + labels at 62% ink (Emilie's dial
>   said 55%, which fails AA on the light ground at 3.9:1; the a11y floor
>   binds, so rest ink ships at 62% = 4.9:1 light / 6.4:1 dark — flagged in
>   §14), real dates, year columns, the faint skeleton — NO dendrites, NO
>   threads drawn. As
>   the pointer moves, only neurons within the wake radius GROW (dendrites
>   draw out of the soma) and their correlations BUILD to the synapse, which
>   pops and fires once; leave, and it settles. Signed feel: **radius 180
>   canvas units · build 1400ms · decay 3000ms · REACH OUT** semantics (a
>   waking neuron's threads build all the way to their far ends; the far
>   label brightens and names the correlation). The engine is one rAF loop
>   writing stroke-dashoffset/opacity only; it self-suspends when settled.
> - **ONE ANATOMY, STRENGTH AS THREADS (gate 1 refinement).** A connection
>   fibre is drawn with the same dendrite grammar as the neuron's own
>   branches (same widths, same twigs); a tie's strength 1..3 grows that
>   many fibres from EACH end toward a bigger synapse bud (the braid).
> - **THE CORRELATIONS ARE REGISTRY DATA (gate 4).** An appends-only
>   `CORRELATIONS: [earlier, later, strength][]` block at the bottom of
>   registry.ts, idea lineage only; award→work threads DERIVE from each
>   award's refId, and Tamayouz (honouring the B.Arch milestone) anchors via
>   the world-local override in `thoughts/world/skeletonIds.ts`. Validator
>   clauses: ids resolve, idea kinds only, no self-links, no duplicate
>   pairs, strength 1..3; plus census (the world covers every project,
>   thought, milestone, award: 35 pieces, press stays off per gate 2) and
>   the route model (below).
> - **THE FROZEN LAYOUT, DONE RIGHT.** X is a fixed step (78) per
>   chronological rank with the viewBox width DERIVED from the census, so
>   new work appends to the right and no shipped coordinate moves;
>   randomness seeds from the entry ID, never the rank. Snapshot-guarded
>   (`worldGraph.test.ts`).
> - **READING (gate 3).** A thought's ring opens its note, a project's soma
>   its showcase, an award the showcase its refId names; milestones + the
>   two unanchored awards are focusable card-only marks. Returning restores
>   the world where you left it; `/thoughts#<id>` centres + wakes a piece
>   (the notes' "SEE THIS THOUGHT IN TIME ›" corridor). The G2 reading room
>   survives at **/thoughts?view=words** ("PREFER THE WORDS?"), rows +
>   year spine + morphs intact.
> - **TOUCH (gate 5).** Tap empty space = the region wakes and blooms fully
>   (attention parks until you touch elsewhere); a pan's grabbed spot glows
>   in your hand; tap a piece = wake + card (armed); second tap opens. 44px+
>   targets held (49px at 375px).
> - **THE LIVE TIP CARRIES NOW (gate 2).** Hover/focus on the red
>   LIVE · STILL GROWING tip shows the now.ts lines (building / reading /
>   thinking), so the record's open end answers "doing what?".
> - **CHROME (gates 2 + 6, copy SIGNED in-session).** The floating glass
>   pill header rides over the world (no footer; the stage is one frame).
>   kicker "THOUGHTS · ONE WORLD · EVERYTHING, IN TIME" · h1 **"points in
>   time"** (Emilie's own line) · sub "{n} PIECES · 2021 › NOW · PROJECTS +
>   THOUGHTS + MILESTONES + AWARDS · EVERY PIECE OPENS" (count derived) ·
>   hint "DRAG TO EXPLORE · IT WAKES WHERE YOU LOOK" · corridor "PREFER THE
>   WORDS? THE READING ROOM ›" · tip tag "LIVE · STILL GROWING" · the
>   ⟳ WATCH IT GROW replay ships (chronological sweep, then settles; hidden
>   under PRM). Nav label stays **THOUGHTS** (gate 7).
> - **FLOORS.** Reduced motion = the fully-grown, connected, labelled still
>   (engine off); every piece focusable with a full SR nav; routed nodes are
>   links (Enter/Space); the CV reverted to the plain §9 list (graph view +
>   ghost rail + lazy chunk deleted); /notebook → /thoughts forever.

> **G3.5 · THE NEURAL WORLD (2026-07-11, Emilie; decided over live animated
> prototypes in the Neural Studio session; production build is a follow-on
> session).** The time story leaves the CV and becomes **/thoughts: one
> full-bleed, sideways-explorable WORLD** where EVERYTHING (all 11 projects,
> 10 thoughts, 7 milestones, 7 awards; 35 pieces, 2021 › NOW) is drawn as a
> NEURAL map: nodes are anatomical neurons whose dendrites reach toward each
> other, meet at a synapse, and FIRE (tension + touch; a thought connecting
> to an earlier one). Her rulings, each felt live before locking:
> - **NO clusters** — one whole map of everything together, chronological
>   left to right (rank-stepped like a commit graph; real dates printed,
>   year columns mark the warp), correlations forming across it.
> - **ANATOMICAL always** (the diagrammatic dial retired); the connection
>   threads are anatomical too — organic, tapering, twigged — so the whole
>   surface reads as ONE drawing.
> - **KIND lives in the neuron** (the landing's mark grammar carried and
>   elevated): project = largest filled soma + lens nucleus · thought =
>   ring + lens core · award = small ink star hanging off its work ·
>   milestone = a plain commit dot ON the career lane (no dendrites).
>   Synapse = two reaches touching (legend names it).
> - **THE COMMIT GRAPH DOES NOT RETIRE — it merges as the skeleton** (the
>   drop-one test settled it: nerve-only is alive but unaccountable,
>   ruler-only is credible but lifeless). It keeps the SHIPPED CareerGraph
>   design language, transposed horizontal: straight lane runs, one clean
>   S-curve per fork/merge, open ring tips, NOW on the main line, the ONE
>   red LIVE tip on the self-employed lane. Faint beneath; the mind owns
>   all motion. **The contrast is the design: the record is drawn with a
>   ruler, the thinking is drawn by a nerve.** They converse: hovering a
>   piece of the mind drops a plumb line to its moment on the record.
> - **IA = TWO VIEWS OF ONE MIND, no duplicates:** the LANDING stays the
>   mind AT REST (ideas, no time, the honest hero; unchanged for now; any
>   neural re-skin of it is a later, /llm-council-gated move). /thoughts
>   becomes the mind IN TIME (this world); the reading room's words stay
>   reachable from it. The CV's G3 graph view + ghost rail retire and the
>   CV reverts to the plain list (already ruled at the post-G3
>   redirection; ATS unaffected).
> - Floors held in the prototypes and binding for the build: every piece a
>   labelled reachable link + a full SR nav, 44px+ touch targets, drag/
>   wheel/keyboard panning, PRM = the complete grown static map (no
>   growth, no drift, no pulses), honest registry data only (draft dates
>   stay drafts; team credits woven; no invented claims).
> Prototypes of record: `design-studio/neural-world.html` (the model) +
> `neural-world-variants.html` (the drop-one test) + the exploration set
> (`neural-lab`, `neural-thoughts`, `neural-landing`, `neural-merge`,
> `neural-tension`, `neural-landing-variants`). The paragraphs below
> describe the pre-neural notebook/CV states and read through this ruling.

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
- The CV is the fully plain list again, and ONLY that. **The G3 graph view,
  the LIST | GRAPH pills, the ghost rail and the lazy graph chunk all RETIRED
  at the meta build (Emilie, 2026-07-11): the time story lives at /thoughts
  as the neural world (§6), and the plain list is better for ATS anyway.**
  Old `/cv?view=graph` URLs degrade to the list (params ignored, never 404);
  `/notebook` redirects to `/thoughts`. Print and the build-time PDF are the
  same plain light list as ever.

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
**G4 · THE FINAL SWEEP (2026-07-12, two gates, all Emilie's over the findings
board + the sign-off ledger):** gate 1 — the LANDING judged beside the glass
world: verdict "not old" (already on the tokens; chrome divergence is
intentional), Emilie chose **(b) light glass polish**: the cover gains the
44px ModeToggle (in the jump-pill row), the jump bar grows to 44px, the
thread-legend labels gain real 26px hit rects; no layout/motion/copy change;
the neural re-skin NOT queued · **KICKERS: every room gets one** (one
room-sign grammar sitewide; WORK · THE PROOF + CV · THE RECORD added, both
signed at gate 2; the CV's never prints) · **the WARM 404 built** (spec §2's
line; all copy signed; retired routes keep their redirects, only truly
unknown URLs land there) · floors fixed: the world's date labels + NOW lane
label to AA in both modes (dates ride the 62% rest ink), card micro-labels
muted-not-faint; CV re-skinned off the last Pen Table utilities; dead code
deleted (ProjectCard, Kicker, RevisionWord + their CSS + two orphan tokens);
source-comment hygiene swept · gate 2 — **the great sign-off:** rest ink 62%
SIGNED · world kicker/hint ink SIGNED · all 19 correlation strengths KEPT ·
reading-room h1 SIGNED, its corridor SHORTENED to "SEE THEM IN TIME ›" and
signed · ALL landing lines signed · About kicker + callback signed, the
pivot h1 REMOVED (plain "About" + room sign carry the page) · CV SKILLS
signed · both new kickers + the whole 404 set signed · ALL 11 spines + all
8 woven credits + ALL 10 note bodies SIGNED · ALL 31 draft months CONFIRMED.
Left flagged by her: the NOW module's three lines + the CV FOCUS line. The
real-phone touch pass moved to after the push, on the live site.
**THE META BUILD (2026-07-11, seven gates, all Emilie's over the live browser):**
gate 1 REST state locked (quiet points in time, no threads) + PROXIMITY REVEAL
feel signed (radius 180 / build 1400ms / decay 3000ms / REACH OUT) + the braid
(one dendrite anatomy; strength 1..3 = fibres per side) · gate 2 neuron/skeleton
balance confirmed as prototyped; census stays 35 (press off); the LIVE tip
carries the NOW card; the glass pill header floats over the world · gate 3
reading interaction confirmed (milestones + unanchored awards = card-only
marks; return recentres; the G2 reading room survives at /thoughts?view=words) ·
gate 4 CORRELATIONS shape signed (registry block, idea lineage only, refId-
derived award threads, Tamayouz anchor override) · gate 5 touch model shipped
(tap-to-wake + grab-glow + armed-tap) · gate 6 copy SIGNED: h1 "points in time"
(hers), LIVE · STILL GROWING, the kicker/sub/hint/corridor package, WATCH IT
GROW ships · gate 7 the nav label stays THOUGHTS · the CV reverted to the plain
list; /notebook → /thoughts.
**THE CONTACT SHEET (2026-07-12, five gates, all Emilie's over in-chat
mockups):** About rebuilt from the G3 person page into a designed contact
sheet · gate 1 LAYOUT = "the stack" (one open-air column, no page glass; the
pills are the only glass; chosen over the all-on-one-card and the half/half
split) · gate 2 the CONSTELLATION CUBE stands in for the face (72px beside the
title; the mind, not the headshot; placeholder photo + develop-once ceremony
retired from the page, real headshot no longer blocking) · gate 3 the NOW
module DROPPED from About (now.ts keeps feeding the registry/CV red tip, its
only renderer now) · gate 4 the short BIO SIGNED (option 2 "the point in
time": map of my head / shakes your hand / the question won't; replaces the
long approved story; Biennale line holds the "a project featured at" ceiling;
the stray ">" left with the old prose) · gate 5 the NODE CURSOR ships
SITEWIDE (her call over world-only, trade-off stated): soma at rest, red live
node over interactive targets, native I-beam/grab/zoom survive, keyword
fallbacks everywhere (DL §4.6). The signed callback carries over verbatim.
**Round 2 (same session, Emilie): ONE SCREEN, NO SCROLL + kill the echoes.**
The sheet centres in the shell's leftover space and fits every viewport
>= ~634px tall (768p laptops included); h1 = **"Say hi" (SIGNED)** so the
room sign and title stop repeating (the About-page h1 no longer reads
"About"); the CV pointer line RETIRED (the header's CV door covers it); the
page's own pill row RETIRED — **THE FOOTER IS THE CONTACT ROW** (name lockup
+ EMAIL/LINKEDIN/GITHUB as the sheet's signature line; `SheetPage
footerCompact` pulls it close, new Footer/SheetPage prop); the Session-11
invitation SHORTENED to "If your team is trying to make buildings answer
harder questions, let's talk." — INTERIM draftCopy, the page's whole text
gets its own revisit session (Emilie's ruling).
**S4a · THE WORK ROOM (2026-07-13, all seven gates Emilie's over the visualize
widget + the live build; uncommitted, no git run per contract):** the
work-rework session, split off from S5 as the container-finishing pass.
- **THE SHOWCASE IS THE BOOK PLATE** (§5 amended). The opened card no longer
  reads as a scrolling sheet with a folded story: it mirrors the printed
  spread. No top identity bar (the ✕ floats); the TOP ROW splits in two — a
  tall 4:3 FLIP-THROUGH asset (‹ › arrows flip, a tap zooms via the Lightbox;
  counter + dots) on the left, the title / lens / award / claim / woven credit
  / tech + stat / links-out on the right — and the signed spine runs straight
  down in TWO columns below. **The "THE STORY" collapse is retired** (the words
  are never a tap away now). No scroll on desktop (Sensi, the richest, fits
  0px at 1280×900; only sub-780px-tall + phones take an honest invisible
  scroll, phones stacking title-first). The card↔plate morph survives; a
  keydown Escape handler peels one layer per press (lightbox › plate › grid),
  because this Chromium delivers the Escape keydown but never fires the native
  `<dialog>` 'cancel'.
- **/work GAINS THE FEATURED TIER (§4).** FEATURED (Sensi, NeuroSpace, lEgoarCh,
  the Lungs, the Huddle, the podcast) leads larger, then MORE WORK; single-
  sourced by slug in `data/work.ts` (`FEATURED_SLUGS`). Cards went LANDSCAPE
  (`Card aspect="wide"`; the DL-0 square default now holds only for the dev Lab).
  The mind graph + the world still show EVERYTHING; the tier is a /work
  reading-order idea only.
- **WORK IS A PLAIN DOOR SITEWIDE.** The emphasised-WORK proof-path underline
  (§3.2 / §7 / council F-fix in §12) is RETIRED from the header AND the landing
  (Emilie's direct instruction): every door reads the same, and the ACTIVE
  page wears a soft filled "you are here" pill in the header instead of an
  underline. (The proof-path job is carried by the landing composition + the
  tappable nodes + the jump bar, as it already was.)
- **THE THOUGHTS SWITCH IS A TWO-STATE CONTROL.** The one-way "prefer the
  words ›" corridor becomes a GRAPH | WORDS segmented control (Links +
  `aria-current`, 44px) up by the title in BOTH the world and the reading room
  (`site/src/thoughts/ViewToggle.tsx`).
- **THE RECORD GAINS "emiliechidiac.com goes live" (2026-07).** A milestone on
  the self lane; the world census moved 35 → 36 and `world-layout.snap.json`
  refreshed.
- **D4 DEFERRED — the questions get their own discovery session.** Authoring
  the eleven candidates showed the real task is choosing the question a normal
  person would actually ask, which needs a collaborative pass. The candidates
  are PARKED as comments in the master files; the signed dek serves on screen
  and as the meta description meanwhile (`headData` already prefers `question`
  when one exists, so nothing regresses). A dedicated question-discovery
  session authors + signs them for all projects at once, best after S4b.
**S4b · THE FOUR (2026-07-14, gates over the visualize widget + the live build;
uncommitted).** S4b's "five" shipped as FOUR.
- **ADDED (supporting tier; the featured six unchanged):** Narkomfin as a Graph
  (P-112), Encoding Urban Risk (P-113), Data into Geometry (P-114), Tsukiji Fish
  Market (P-115) — one registry entry + one master file each; images pulled from
  Emilie's public IAAC blog through the pipeline with authored alt text.
- **PELAGÑOU PULLED at her copy gate** — a reading of someone else's essay reads
  as a THOUGHT, not a project (and its slide assets were weak). Removed from every
  surface, parked as a thought candidate (a words session).
- **HONESTY (all four = shared team credit, no individual slice).** Urban Risk
  reads as machine learning and Emilie declined the dossier's recorded slice for
  "team of four, all hands"; Narkomfin shares credit too, chosen knowingly over the
  data-prep slice; the accuracy figures stay the team's, woven as prose. Catch:
  Data into Geometry's blog hero was another team's image, so it never ships here.
- **THE LANDING CONSTELLATION grew 21 → 25, connected.** A new `pointOnThread`
  helper (`landing/mindGraph.ts`) samples the drawn idea-lines so an appended
  project declares which thread it rides and how far along, instead of hand-placed
  pixels (the "optimized way" Emilie asked for); Narkomfin sits at the data×AI
  crossing. The world census moved 36 → 40; three new idea threads.
- **NEXT = FINALIZE THE WORK ROOM (Emilie's post-S4b direction).** Her north star:
  finalize + simplify the site, THEN a Phase-2 CV + LinkedIn pass. She flagged the
  work page's visual fluff — a lone animated cover distracts, a tighter book-like
  index reads better, covers should sit still and move only on hover. So the
  question-discovery + the full gallery refresh (186 blog images staged) fuse with
  that visual-simplify pass into one session; §4 (the gallery) reads through this.
**FINALIZE THE WORK ROOM (2026-07-14, three gates Emilie's over the visualize
widget, then her AUTOMODE instruction: build everything, feedback at the end;
uncommitted, no git run per contract).** §4 (the gallery) now reads through this.
- **G-COVERS = STILL + HOVER-PLAY.** Every grid cover sits still (an animated
  entry renders its static first-frame ladder via a new `Img still` prop); the
  one animated cover (Urban Risk, 956KB loop) plays only while hovered OR
  keyboard-focused, phones and reduced motion always get the 26KB still, and
  the pipeline now fails if an animated image ships without its static ladder.
  Motion lives inside the plate, as the D5 visual amendment orders.
- **G-GRID = FULL INDEX (her pick over "tighter tail").** FEATURED goes
  3-across at `lg` (was 2), MORE WORK goes 4-across with a compact `dense`
  card face (13px title + lens pill only, tags dropped, gap-3) — the /work
  page now reads like the printed book's index page. Card primitive gained
  `dense`; sizes hints retuned per tier.
- **G-FLUFF = ALL FOUR CUTS.** The grayscale develop-in retired on /work
  covers (colors arrive immediately; the ceremony survives elsewhere); the
  "15 PROJECTS · ALL" count line cut (an sr-only aria-live announcer keeps
  filter changes audible); XR's "PHOTO PENDING" tile now wears its quiet
  P-111; the flip-through dot row retired (counter + arrows carry it).
- **THE GALLERIES ×12 (D3's flip-through, filled).** All staged blog frames
  were viewed (12 fan-out viewing agents), curated to 6-9 frames per project,
  every frame honesty-checked, EVERY entry now carries an authored alt
  (80-140 chars, context not contents; validated programmatically). 50 → 86
  manifest images. HONESTY CATCHES executed: legoarch's three gallery frames
  exposing personal browser tabs swapped for clean crops (privacy); the lungs
  cover alt corrected (it claimed a tower render; the frame is the app
  collage); cappelletti's pasta-atlas frame cropped to the team's own typeset
  half (the left half was a third-party book photo; crop staged as
  `pasta-atlas-team-crop.png`); Dr. Valentine's science diagrams kept OFF the
  podcast plate (one honest frame ships: the team's episode key art);
  data-geometry's other-team title board (image-309) re-confirmed banned;
  tsukiji's official-render comparison (10-1) kept out; the lungs classmate
  "calmness leaderboard" frame withheld pending Emilie's explicit OK; huddle's
  misnamed "wind-study" render replaced by the real climate analysis.
- **THE QUESTIONS ×15 (D4, executed, then ROUND 2 at Emilie's desk).** Round 1
  flipped the parked candidates live. Round 2 (her feedback, same day): a full
  discovery pass, 4 research agents mapping 5 questions per project +
  reverse-engineering real Google/AI search phrasing; she picked per project
  and the leads were REWRITTEN to her direction (Sensi = the sense ripple;
  NeuroSpace = visualize the parameters; lEgoarCh = "how can AI turn a text
  prompt into a LEGO set"; Lungs = the dashboard; Podcast = "How does
  architecture affect your brain? A conversation."; Urban Risk = "Can we
  predict crime from urban features? A machine learning test."; Ballooning =
  the pneumatic-simulation fusion; Marsception = "How do you design a habitat
  for Mars?"; XR = "Can AR and VR change how we learn?"; the rest kept/tuned).
  All still DRAFT pending her final sign; each = plate claim + meta
  description + OG line; all 15 unique, no em dashes.
- **THE QUESTION DOT (Emilie's ask, round 2).** Every master carries
  `alsoAnswers` (the 4 other questions it answers, each with an optional
  `beat`); the plate's lead question wears an NB-grammar dot
  (`components/work/QuestionsDot.tsx`): hover/tap reveals ALL the questions
  at a glance, pressing one scrolls to + briefly tints the spine section
  that answers it (`[data-beat]` anchors on SpineBeat; `.beat-flash` redline
  tint, interaction-only per governance rule 1). Escape peels the tip first,
  never the plate; 44px hit boxes; viewport clamp; reduced motion = instant
  scroll, tint as a state not a motion. Her "explain complex technical
  subjects in a fun captivating way" goal is parked as an S5 THOUGHT
  candidate.
- Reviews run in-session: code review (aria-live announcer restored, dense
  sizes hint fixed, focus parity added, pipeline assert), design critique,
  accessibility audit (0 critical/major). Build chain green end to end: 43
  tests, tsc, prerender 31 routes + 26 OG cards, both PDFs regenerated.
- **GALLERY REVIEW round 2 (2026-07-15, Emilie project by project): SENSI
  FINALIZED + THE QUALITY PASS.** Sensi's cover is THE GALAXY (her pick): the
  sense-constellation still at rest, rippling on hover (an 8s ffmpeg cut of
  her galaxy-cover-dynamic master; still 19KB, play 995KB on demand); the
  plate runs act order ×10 behind the 45s scored demo video (onboard gif +
  shot, shape + green-lens shots, report gif + shot, galaxy UI gif, the
  two idea frames); demo gifs re-cut from the richer demos exports. THE
  QUALITY ROOT CAUSE: the plate stage carried no `sizes` hint, so retina
  screens loaded the 640 rung on every gallery image; fixed (STAGE_SIZES),
  gallery ladders grew a 1600 rung, gifs a 1024 rung, stills to q82, full
  89-image regen. Pipeline hardened: the `professional` slug is FROZEN
  (its old-site sources left the repo in the hygiene cleanup; baked entries
  carry forward instead of crashing full regens). Her follow-up swap: Sensi's
  two idea closers replaced with sensory-layer + coupling-map + act-2-flow
  (11 pages).
- **NEUROSPACE FINALIZED (2026-07-15, her picks).** PRIVACY CATCH: the shipped
  slider-tour video included the recording's browser chrome with her personal
  tabs; the re-encode now carries a BINDING crop (video-manifest `vf`,
  optimize-videos gained per-item filters) slicing exactly above the app, and
  the old file is replaced (history scrub decision pending, same bundle as
  legoarch). Her video pick: the silent recording stays the lead (the unused
  CBDM final demo remains staged); the cover is a hover-play cut of the red
  room morphing under a slider drag (demo-cover, still at rest, cut inside
  the app frame); the landing screenshot moved into the strip; plate = 7
  pages. Both flagship covers now share the gif-from-video method (ffmpeg
  to animated webp to the pipeline's still + play ladders).
- **THE FIT RULINGS (2026-07-15, her picks, four rounds to the bulletproof
  end-state).** Neuro cover re-cut to a clean rest frame and native 16:9.
  (a) GRID CARDS run 16:9 (`aspect-video`, was 16:10): the work's native
  webpage-landscape shape. (b) The pipeline gained `frame16x9: true, bg:
  '#hex'`: an off-ratio cover composites onto a true 16:9 canvas of its OWN
  background color (galaxy #424242; sagrada / workflow / site-maps /
  assessment-ui #ffffff), so 13/15 cards render zero-crop (the frozen
  soma/mars photos side-crop; sources gone). (c) THE PLATE STAGE is a 16:9
  WHITE MAT pinned in BOTH modes (a content surface like the print pin, "the
  plate's paper") and EVERY asset renders object-contain, videos included,
  no hybrid, no exceptions: her final ruling after the interim smart-hybrid
  still shaved near-16:9 screenshots. Nothing in a flip-through is ever
  cropped; the mat only shows where an asset genuinely is not 16:9.
- **LEGOARCH FINALIZED (2026-07-15, her ask: a new silent film in the Sensi
  45s grammar).** A 60s edit assembled in-session from the unused S12 demo
  recording: question card, spaced title card, five mono act cards (NAME A
  BUILDING · THE RENDER · THE MESH · THE BRICKS, VERIFIED · THE SET) and an
  award closer, cards rendered with the site's own fonts (puppeteer, film
  grammar shared with the Sensi 45s). PRIVACY: the raw recording shows
  personal browser tabs; the chrome is cropped out of every segment at the
  source. CEILING: the live bricks-on-the-table intro stays OUT (it would
  read as physical assembly). The plate now leads with the film (10 pages);
  the gallery gained the Sagrada pipeline trilogy (FLUX render, TRELLIS
  mesh, joining mesh-vs-lego) and the clean booklet render. The golden
  sagrada-render remains the card cover + book plate but no longer appears
  inside the flip-through (the film replaced the photo page). Card copy is
  DRAFT pending her sign-off. Her follow-ups: the flip is SLIDES + APP
  SCREENSHOTS only (product renders out; four clean deck slides in); the
  cards carry the REAL brand (wordmark + emblem from incoming/legoarch/
  brand); film v2 rebuilt from her sfx-only base with the app sounds kept;
  the cover is a live cut of Saint Basil's solving into its brick layout.
- **THE LUNGS FINALIZED (2026-07-15, her spec).** Her studio demo re-cut to a
  42.5s silent film (1.6x, title/credits dropped, the two teammate-name
  segments skipped, cropped below the app header so the logged-in teammate
  chip never ships); it leads the plate, which also answers the IAAC-gated
  live app: the demo shows what the login hides, and the LIVE APP link
  stays in the links row. The cover is a live cut of the KPI dependency
  map, still at rest, breathing on hover. The strip runs inside-the-app
  first (her priority), with the KPI map swapped to its chromeless version
  (the old frame showed the teammate logged in). The tower collage left the
  web gallery; it remains the book plate via its print rung.
- **S1 · REINDEX + LOCK (2026-07-16, all gates Emilie's; uncommitted).**
  **/work IS NOW THE PRINTED BOOK'S INDEX** (§4): one uniform tile grid (the D2
  featured-LARGER tier retired from the render; the strongest-first order +
  eager-load kept), each tile carrying its quiet `P-nnn · ✦` meta, a
  `✦ RECOGNITION` legend on the filter row, and THE THOUGHTS rows closing the
  page. ONE layout logic: `registry.thoughtIndexEntries()` + a shared
  `ThoughtIndexRows` render BOTH the /work list AND the book index page (screen +
  print skins), so they cannot drift. **/thoughts is the neural WORLD ONLY**
  (§2, §6): the GRAPH|WORDS toggle + the reading-room LIST retired (ViewToggle +
  ReadingRoom deleted); `?view=words` strips its param client-side (never 404s);
  each thought's NOTE page stays prerendered, opening from the index rows + the
  world; a note's back-corridor lands on `/work#thoughts`. **THE LOCK:** Emilie
  signed all 15 questions + `alsoAnswers` dot sets, all gallery alt text, the
  lEgoarCh film cards, and the full podcast rewrite — /work ships ZERO draft copy.
  Two one-line-revert consequences of the uniform pick: the big award pill left
  the index faces (the ✦ + legend + the opened plate carry it); at 320px the tile
  meta can clip its last glyph. tsc + 43 tests + full build green (book census
  intact at 10 pages). Owed: her commit + push, the history scrub, the real-phone
  reduced-motion pass, post-deploy Lighthouse.
**S2 · ADD THE NEW WORK — THE SIX (2026-07-17, automode build then her end-review;
all signed, committed).** Six new projects P-116..P-121 into the book index:
- **The Homage** — her LAU bachelor thesis (adaptive reuse of Niemeyer's Rachid
  Karami Fair, Tripoli). The Tamayouz result was VERIFIED from the certificate +
  tamayouz-award.com = **TOP 100 of 422 (2023), never "winner"** (her memory said
  "won"; the record is Top 100); the `tamayouz` award gained a refId + the public
  page as its anchor. Supervisor Issam Barhouch woven.
- **The Encounter + Falcon Square** — the Jemma year split into two projects; role =
  architectural designer (per her LinkedIn), she led the falcon; Falcon Square carries
  a FINALIST pill linking its certificate (finalist = a recognition, precise).
- **Three bootcamp mini-explorations** — light explorations entries.
- ENRICHED: **Verve City Walk** (soma-towers RENAMED; the SOMA/Dynamic NDA resolved,
  imagery cleared; AR-capture cover; woven responsibilities + 5 public links) ·
  **Rings of Mars** (her renders + full spine; TOP 50 @ Volume Zero → #gallery-56) ·
  **XR for Education** (her story Max/Maya → Unity → Oculus, honest outcome).
- SYSTEM: `final-assets/` folders are the curation surface the manifest reads; created
  covers are `coverMontage` (they play on the face, never a plate page); GIF covers on
  ALL 21 tiles (still + hover, her standing rule); ✦ recognition lines on winner tiles;
  ORIGIN STAMPS `P-nnn · MACAD/LAU/SOMA/JEMMA/SELF` on the face + the printed index; her
  curated order closes on The Homage; the 320px meta clip fixed; the book index went
  7-across. Constellation 31, world 46; build green (37 routes, 32 OG, both PDFs, 43
  tests). NEXT (her call): a WORK PAGE · LOOK & ORDER design pass (cover unification +
  the thoughts layout + a reshuffle) before S5.
**WORK PAGE · LOOK & ORDER (2026-07-18, committed; Emilie very happy).** The three
concerns she raised over the live /work, resolved:
- **THE PLATES (the cover-unification answer).** Instead of a desaturate / mat /
  neutral-ground filter, the grid coheres by giving every tile a hand-designed signed
  INK ARTIFACT as its RESTING face (new `artifacts.tsx`, 21 of them); hover/focus
  reveals the real cover, and gifs flip through the assets. Plates everywhere, mobile
  included; reduced motion rests calm. This is the site's spine made literal on the
  grid: calm ink at rest, the work on interaction — the whole page coheres without
  touching a single cover image.
- **ONE PAGE, FULL WIDTH (the layout answer).** /work leaves the centered column for a
  full-width grid (7 across, ~255px tiles at 1920); THE THOUGHTS close the page in
  THREE COLUMNS (a right rail was considered and declined); the opening reveal FLOATS
  so nothing reflows; the footer aligns wide; zero vertical scroll at >= 1280x800.
  §4 (the gallery) reads through this — /work and the book index now share DATA
  (`thoughtIndexEntries` + `ThoughtIndexRows`) but the screen layout is full-width.
- **THE BAR.** /work's header stack collapsed into one full-width glass `WorkHeaderBar`
  via a new `SheetPage` `headerBar` slot (other pages untouched); one row on wide
  screens, two when narrow, the pill below lg.
- **THE ORDER.** Her swaps (Homage/XR, Verve/Mars), single-sourced; flipbook covers
  added for Narkomfin + Data into Geometry; all six flipbooks start instantly.
The plates/artifacts, the full-width one-page grid, and the `headerBar` slot are new
DESIGN-LANGUAGE patterns (a DL entry is owed when DL is next touched). NEXT: S5 = the
words + a page-by-page design-system polish (Emilie's ask).

**THE DESIGN AUDIT + REDESIGN (2026-07-19/20; the fresh-lens session after S5;
every ruling decided over live builds in three review rounds; DL amendments
14-22 are the design of record for all of it).** The whole top-of-page and
page-frame system rebuilt to Emilie's rulings:
- **THE FROZEN FRAME.** Every page = frozen header line · content scrolling
  invisibly between · frozen footer line. §7's "one chrome grammar" reads
  through DL 15/16 now: the pill is identical and LEFT-ANCHORED everywhere,
  page tools ride the header line's right on the ground; the WorkHeaderBar,
  the headerBar slot, and the room-sign kickers (G4's grammar) all RETIRED
  (the 404 keeps a bare `404`). Iteration trail, for the record: two-pill
  stack -> one wide pill -> side-by-side -> tools-on-the-ground was walked
  LIVE with her; "one identical pill + ground tools" is the survivor.
- **THE MAGNIFIER.** The active-door cue is a liquid-glass lens that slides
  under pointer/focus and gently magnifies (she loves it); reusable
  (`LensGroup`) and extended by her pick to the footer contact row, the
  About cluster and the landing doors. Never on selection controls.
- **THE CV (supersedes §9's screen face; the ATS PDF + §9's data discipline
  unchanged).** Landscape, full-width, three columns (Education +
  Certificates | Experience | Awards + Skills), icon + AA-accent section
  titles, no footer, identity in content, links + DownloadChip on the header
  line, FOCUS phrase off the screen (PDF keeps it). Jemma title corrected to
  Architectural Designer (the S2 ruling, now in cv.ts -> all three
  renditions).
- **ABOUT.** The landscape contact split (person | line | links, all links
  mid-page under one lens); footer dropped; NEW script drafted from her
  brief, `draftCopy` until signed.
- **THE WORLD.** Canvas words retired (sr-only h1), the stage inset between
  the lines, the fade scrims retired; WATCH IT GROW on the header line, the
  legend + drag hint on the footer line. THE THOUGHT LEAF: meta + coloured
  icon controls (ALL THOUGHTS/IN TIME/NEXT; pillar door retired) on the
  header line, title + words in the band.
- **ONE DOWNLOAD CHIP** sitewide (`DownloadChip`); the ✦ RECOGNITION legend
  retired on /work.
Build green end-to-end at close (43 tests, 40 routes, 35 OG, both PDFs, the
overflow probe + ATS assertions). Deferred to a next session: the audit
board's performance pass (animated-webp re-encode + hover warm-up + landing
idle), the world's resting label collisions, the under-the-hood token/dedup
sweep, and her sign-offs on the About script + the batch itself.

---

## 14 · Still needs Emilie's sign-off

> **THE GREAT SIGN-OFF (G4, 2026-07-12) cleared this section.** Every landing
> line, every showcase spine, every woven credit, all ten thought notes, the
> reading-room strings, the About kicker + callback, the CV SKILLS wording,
> the two new kickers, the whole 404 set, the rest-ink 62%, the world's ink
> kicker/hint, all 19 correlation strengths and all 31 draft months were
> SIGNED or CONFIRMED (decision log, §13). What remains:

- The NOW module's three lines (`now.ts`, also the world's live-tip card) —
  kept flagged by Emilie at G4; they update whenever life moves anyway.
- The CV FOCUS line — kept flagged by Emilie at G4.
- The two sheet-issue events' `draftCopy` in the registry (P-101/P-102) —
  inert: they render on no surface today; retire or reword if a surface ever
  reads them.
- The real-phone touch pass on the neural world — after the push, on the
  live site (Emilie's call at G4).
- The book's spread copy and the flagship selection for the ~6 spreads (G5).
- FLAG-03: the MaCAD award still needs a public anchor (a link the award line
  can point to); surfaced whenever the landing or a card renders the award.
- (Perf notes for the record, measured at G4 on the production build:
  landing entry JS 108.7 KB gzip vs the 150 KB budget; local FCP/LCP 108 ms,
  CLS 0, LCP element = the DOM hero's positioning line; the world holds
  60fps under a continuous wake sweep and through the replay, worst frame
  32 ms, unthrottled desktop — a throttled-device Lighthouse run on the live
  URL after deploy is the remaining datapoint. Per-route prerender + OG
  cards + the jump bar's full site index remain R9 scope.)

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

