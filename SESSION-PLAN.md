# SESSION PLAN { Sessions 4-12 (v1, issued 2026-07-06)

Continuation roadmap after Session 3 shipped (registry-driven notebook site,
live at https://hi-em.github.io/eec-portfolio/). Each session is one focused
sitting with a specific target, and ENDS SHIPPED: build green, committed on
`main` with a summary, pushed, verified live. Paste the session's kickoff
prompt into a fresh Claude Code session to start it.

## Standing rules (every session)

- Read this file's session section + `site/DESIGN-SYSTEM.md` before touching code.
- Registry invariants are law: EXPLORE node order/tags frozen (seeded layout);
  new explore nodes APPEND; sheet numbers live in `site/src/data/registry.ts`.
- Governance: no hex outside `@theme`; redline = interaction/liveness only;
  mono <= 0.875rem; every ceremony renders final state under reduced motion.
- Copy is drafted in Emilie's voice (see memory: rigor + play, honest, funny,
  no em dashes) and flagged `draftCopy: true` until she signs off.
- Definition of done, always: `npm run build` green; preview-verified
  (console clean, mobile, reduced motion); committed on main with a summary;
  pushed; live deep links spot-checked.

## Overview table

| # | Session | Target | Key outputs |
|---|---------|--------|-------------|
| 4 | Sheet Foundry I | P-101 Sensi + P-102 NeuroSpace, full depth | 2 hero sheets, video embed component, manifest additions |
| 5 | Sheet Foundry II | P-103 Huddle, P-105 Lungs, P-106 lEgoarCh, P-107 podcast | 4 computation sheets, Lungs fallback video |
| 6 | Compact sheets | P-108 SOMA, P-109 Ring 4000, P-110 Cappelletti, P-111 XR | Compact sheet variant, all stubs retired |
| 7 | Thought notes | All 10 thoughts as open-able written notes | `/thoughts/:id` format (words only), registry wiring |
| 8 | EXPLORE integration | Every node opens its page; promote EXPLORE everywhere | Node->page links, standalone-thought support, share links |
| 9 | CV rethink | Full redesign + never-stale PDF | Commit-graph year axis, registry-driven CV, PDF pipeline |
| 10 | About + Now | Persona layer, notebook-style | Final headshot, NOW section, reading shelf |
| 11 | Share layer | How the site travels | OG images (per-surface), favicon polish, LinkedIn rewrite |
| 12 | Audit + sign-off | Hardening and the draft sweep | a11y/perf/code review, all dateDraft/draftCopy resolved |

Optional add-on (any time, before CV print): custom domain { buy, add CNAME,
set vite `base: '/'`, update OG URLs. GitHub URL is professionally fine
meanwhile; the domain is resilience + memorability, not a fix.

---

## Session 4 { Sheet Foundry I: the proof pair

**Goal:** Sensi (P-101) and NeuroSpace (P-102) get full P-104-grade sheets;
these are what recruiters open from Home and EXPLORE.

**Scope:** Add a `SheetVideo` component (self-hosted mp4/webm, poster frame,
no autoplay under PRM, mono caption like SheetFigure). Extend the image
pipeline manifest with the figures each sheet needs (`npm run images` after
dropping picks into `site/public/assets/projects/<slug>/` source flow {
check `site/scripts/optimize-images.mjs` for the incoming path). Write both
sheets: abstract, method, one LISTING each (real code from the repos), 4-8
captioned figures, video where motion carries (Sensi demo, NeuroSpace slider
tour), 2-4 n.b. dots + margin notes each (drafts). Flip registry statuses to
`issued`, add `sheet` log entries dated this month (the bench roll and
Notebook update themselves). Source material: `content/blog-catalog.json`
(quotes, image URLs), the IAAC blog posts, `PORTFOLIO-REBRAND-BRIEF.md`.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 4 of SESSION-PLAN.md (read that section
plus the Standing rules first, then site/DESIGN-SYSTEM.md and the P-104
pattern in site/src/sheets/P104.tsx).

Build full case-study sheets for Sensi (P-101) and NeuroSpace (P-102) using
the existing sheet system (SheetLayout/NBDot/MarginNotes/SheetFigure). Add a
SheetVideo component for self-hosted video figures (poster, controls, muted
loop only when reduced-motion allows, mono caption). Source the copy from
content/blog-catalog.json and the linked IAAC blog posts; write in Emilie's
voice (rigor + play, honest, no em dashes); mark all new note copy
draftCopy. Pick figures from site/public/assets/projects/{sensi,neurospace}/
(extend the manifest via the image pipeline if a needed image lacks
variants). Flip both registry entries to status 'issued' and append
sheet-issue log entries dated 2026-07 so the bench roll updates. Verify with
the preview tools (console, mobile, PRM), build, commit on main with a
summary, push, and confirm the live routes /sheets/p-101 and /sheets/p-102.
Flag anything needing my sign-off at the end.
```

## Session 5 { Sheet Foundry II: the computation record

**Goal:** The Huddle (P-103), The Lungs (P-105), lEgoarCh (P-106), and the
podcast (P-107) complete the computation lens.

**Scope:** Same pattern as Session 4. Specials: Lungs { record/collect a
screen-capture video of the Railway app as the in-sheet proof (the free-tier
app may sleep; the sheet must never depend on it being awake); lEgoarCh {
pick 4-8 from the 45-file booklet, resist the gallery urge; podcast (P-107)
{ audio-first sheet variant: Spotify embed or link + pull-quotes from the
Cleo Valentine conversation (the BIM origin story) instead of METHOD.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 5 of SESSION-PLAN.md (read that section,
Standing rules, and mirror the Session 4 sheets as the pattern).

Write full sheets for The Huddle (P-103), The Lungs (P-105), lEgoarCh
(P-106), and Optimizing for the Mind (P-107). Lungs: embed a self-hosted
screen-capture video as the primary proof and demote the Railway link to a
TRY IT link with an honest note (free tier sleeps). lEgoarCh: max 8 figures
from the booklet assets. P-107 is audio-first: no METHOD/LISTING; use
pull-quotes from content/blog-catalog.json and the Spotify link; design a
minimal quote treatment consistent with serif-prose governance. Flip the
four registry statuses to issued + add dated sheet-issue entries. Copy in
Emilie's voice, draftCopy-flagged. Ship per the standing definition of done
and list sign-off items.
```

## Session 6 { Compact sheets: practice + explorations

**Goal:** SOMA (P-108), Ring 4000 (P-109), Cappelletti (P-110), XR (P-111)
get honest compact sheets; no stub remains anywhere.

**Scope:** Add a `compact` variant to the sheet content pattern: meta row,
title, abstract, 2-4 figures, footer { no METHOD, no LISTING, margin notes
optional. Practice copy stays within the Session 1 lock (SOMA + Marsception
only, professional reframing). XR may be text-only if assets are thin.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 6 of SESSION-PLAN.md (read that section
+ Standing rules).

Create the compact sheet variant (abstract + figures only) and write P-108
Towers at SOMA, P-109 Ring 4000, P-110 Cappelletti Pavilion, P-111 XR for
Education. Respect the Session 1 practice lock (SOMA + Marsception only) and
the existing draft blurbs in site/src/data/projects.tsx as starting copy.
Flip all four registry statuses; after this session no sheet route may show
the IN PREPARATION stub. Ship per the standing definition of done; flag
sign-offs.
```

## Session 7 { Thought notes: the mind in writing

**Goal:** Emilie's decision: every thought becomes its own open-able written
note { words only, as short or as long as it wants to be. This is the
research agenda in prose (the 'Vocabulary' move).

**Scope:** New format + route `/thoughts/:id`: a narrow serif page (notebook
leaf { mylar, title in the thought's lowercase serif-italic voice, dated,
optional n.b. dots, NO figures), plus registry support: thought entries gain
`note` status (drafted/absent) analogous to sheets. Notebook rows and bench
roll thoughts become links when a note exists. EXPLORE info card: thoughts
with notes get `OPEN NOTE >` instead of SHEET: IN PREPARATION. Draft all 10
notes in her voice at whatever length each earns (bim and comfort-as-data
will run long; solvers may be three sentences) { ALL flagged draftCopy for
her rewrite pass.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 7 of SESSION-PLAN.md (read that section
+ Standing rules first).

Build the thought-note format: route /thoughts/:id rendering a words-only
notebook leaf (narrow serif column, dated, lowercase serif-italic title
treatment, optional NBDot annotations, no figures), registry wiring (thought
entries reference their note), links from Notebook rows, bench-roll thought
entries, and the EXPLORE info card (OPEN NOTE > when a note exists). Draft
all 10 thought notes in Emilie's voice using the brand spine (Behavior
Information Modeling), the podcast material, and the project sheets as
source; each note as short or as long as it earns; every note draftCopy. Do
NOT touch EXPLORE graph order/tags. Ship per the standing definition of
done; list all 10 notes as sign-off items.
```

## Session 8 { EXPLORE integration + promotion

**Goal:** EXPLORE stops being a destination and becomes the connective
tissue: every node opens its written page, and the rest of the site invites
you in. Support thoughts that connect to nothing.

**Scope:** (a) Info card links: all issued sheets + all thought notes
open-able from focus (done pieces from S4-7 verified here end-to-end).
(b) Cross-links INTO explore: sheets and thought notes get a mono link `SEE
IT IN THE MIND >` deep-linking to /explore/:id; Notebook rows get a small
explore glyph. (c) Standalone thoughts: registry flag `standalone` exempts
FUTURE thought nodes from the implied-edge correction (appended nodes only;
frozen 21 untouched) so an unconnected thought can float alone, per Emilie.
(d) Promotion polish: per-node document.title, share affordance on the info
card (copy deep link), and the Home explore link's copy audit.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 8 of SESSION-PLAN.md (read that section
+ Standing rules; the EXPLORE layout invariants in site/src/explore/graph.ts
are critical { existing 21 nodes must not move).

Wire the full circulation: EXPLORE info card opens every issued sheet and
thought note; sheets and thought notes link back with SEE IT IN THE MIND >
deep links (/explore/:id); Notebook rows gain a discreet explore link. Add
`standalone: true` support in the registry + graph so future appended
thoughts can skip implied-edge correction and float unconnected (write a
regression check proving the frozen 21-node layout is byte-identical before
and after). Add per-node document.title on /explore/:nodeId and a
copy-deep-link affordance on the info card. Ship per the standing definition
of done.
```

## Session 9 { CV rethink

**Goal:** Full CV redesign around the notebook identity, plus a PDF that can
never go stale. The memo's parked idea lands here: the commit-graph year
axis.

**Scope:** (a) Rethink /cv: career as a commit graph { a year axis (echoing
the bench roll) where education/roles/awards/projects plot as commits with
mono labels; detail sections below stay scannable/ATS-friendly. Pressure-test
the direction with llm-council before building if it feels risky. (b) One
data source: merge cv.ts facts into the registry (or derive CV sections from
registry + cv.ts joins) so CV, bench roll, and Notebook can't disagree.
(c) PDF pipeline: print-stylesheet route (@media print, A4) rendered to PDF
in the build or via a script, replacing the stale Feb-2025 file; DOWNLOAD
PDF always serves current data. (d) Recruiters: keep it boring where boring
wins { the graph is garnish, the facts are the meal.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 9 of SESSION-PLAN.md (read that section
+ Standing rules).

Redesign the CV page around a commit-graph year axis (career events plotted
on a vertical year rule with mono labels, consistent with the bench roll's
axis grammar; redline only for the live NOW edge). Unify data: CV sections
derive from site/src/data/registry.ts + cv.ts without duplication. Replace
the stale PDF: build an A4 print stylesheet for the CV route and a script
(e.g. puppeteer or vite plugin) that regenerates
site/public/assets/cv-emilie-el-chidiac.pdf from it at build time; the
download link must always serve current data. Keep the page ATS-legible
(real text, semantic headings). If the commit-graph direction feels
uncertain, run /llm-council on the layout choice before building. Ship per
the standing definition of done; show me a screenshot of page + PDF.
```

## Session 10 { About + Now: the real glimpse

**Goal:** The persona layer approved in discovery: final headshot, tightened
About, a NOW section, and an annotated reading shelf { notebook-style, cheap
to keep fresh.

**Scope:** (a) Final headshot lands (Emilie provides; compress via pipeline).
(b) About copy pass (approved 'trust for now' copy gets her final rewrite).
(c) NOW: a small dated data file (building / reading / thinking, 3-5 lines)
rendered on About + surfaced as the newest bench-roll entry kind; updating
it = editing one file. (d) Reading shelf: annotated list (title, author, one
irreverent line each) { neuroarchitecture papers, books, films; serif, no
covers needed. (e) Links into thought notes where reading fed thinking.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 10 of SESSION-PLAN.md (read that section
+ Standing rules).

Rework /about: final headshot (I will provide the file; run it through the
image pipeline), leave the locked copy but stage my edits if I supply them,
then add two notebook-grade sections: NOW (a dated data module {
building/reading/thinking { rendered on About and emitted as a bench-roll
entry so the timeline shows freshness) and THE SHELF (annotated reading
list: title, author, one line in my voice, draftCopy). Cross-link shelf
items to thought notes where relevant. Keep About one screen-ish, serif
prose, zero new furniture. Ship per the standing definition of done.
```

## Session 11 { Share layer: OG, favicon, LinkedIn

**Goal:** Make the site travel well: link cards that look designed, favicon
polish, and the LinkedIn rewrite aligned to the brand spine.

**Scope:** (a) OG images via the canvas-design skill: one master card
(Pen-Table mylar, name, spine line, redline accent) + optional per-sheet
cards (sheet number + title); wire meta tags per route (react-helmet-style
or build-time). (b) Favicon: verify the EEC mark reads at 16/32px; regenerate
sizes. (c) LinkedIn: rewrite headline/about/featured from
content/copy-draft.md + brand-spine memory; banner image from the OG master;
a checklist Emilie applies manually (deliverable: LINKEDIN.md, not code).

**Kickoff prompt:**

```
In eec-portfolio: implement Session 11 of SESSION-PLAN.md (read that section
+ Standing rules).

Three deliverables: (1) OG share images { use the canvas-design skill to
produce a master 1200x630 card in the Pen Table system (mylar ground, ink
type, one redline accent, no lens colors without ticks) plus a per-sheet
template; wire og:image/twitter meta per route at build time and verify
with a link-preview check. (2) Favicon audit: the EEC mark at 16/32/180px,
regenerate what's soft. (3) LINKEDIN.md: headline, about section, featured
items, and banner spec rewritten from content/copy-draft.md and the locked
brand spine { wording I can paste into LinkedIn myself. Ship code per the
standing definition of done; the LinkedIn doc is a repo file, committed.
```

## Session 12 { Audit + the sign-off sweep

**Goal:** Hardening pass + retire every DRAFT flag with Emilie in the loop.

**Scope:** (a) /code-review (high) over the accumulated site code; fix
findings. (b) Accessibility audit (design:accessibility-review skill):
keyboard walk, contrast, focus, SR labels across READ + EXPLORE + sheets.
(c) Performance: bundle audit, image weights, LCP on Home. (d) THE SWEEP:
walk every `dateDraft`/`draftCopy` in the registry, sheets, notes with
Emilie live { fix dates, confirm sheet numbers P-101..P-111, sign off n.b. +
margin + thought copy, tune 4:3 `image.position` crops. Remove flags as
approved. (e) Cross-browser: Firefox (no view transitions), Safari, touch.

**Kickoff prompt:**

```
In eec-portfolio: implement Session 12 of SESSION-PLAN.md (read that section
+ Standing rules). I will be present for the sign-off sweep { ask me in
batches.

First run /code-review at high effort on the site code and fix what
survives verification. Then an accessibility pass (use the
accessibility-review skill: keyboard-only walk of Home > Notebook > a sheet
> EXPLORE > back, contrast on carbon surfaces, aria-live behavior, PRM).
Then performance: report bundle sizes per route, heaviest images, and Home
LCP; fix cheap wins. Then walk me through every dateDraft and draftCopy
flag grouped by surface (registry dates, sheet numbers, n.b./margin/thought
copy, crop positions) using AskUserQuestion batches; apply my answers and
remove the flags. Ship per the standing definition of done.
```
