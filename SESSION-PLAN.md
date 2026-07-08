# SESSION PLAN v2 · Sessions 4-18 (issued 2026-07-07, supersedes v1)

Merged roadmap: every v1 core idea survives (sheets for all 11 projects, thought
notes, EXPLORE integration, CV rethink, About/Now/shelf, share layer, audit +
sign-off sweep) reshaped around Emilie's three new goals (more engaging animation
inside an honest motion contract, simplified flow, registry stays cheap to update)
and the July 2026 audit findings. Designed via a three-perspective planning
exercise (risk-first, brand-first, recruiter-first) plus cross-examination;
sequencing verdicts are baked in below.

Workflow (unchanged from v1): each session is ONE focused sitting. Emilie receives
the session's kickoff prompt from the director conversation (the prompts embedded
here are DRAFTS; the live prompt is issued at dispatch, adjusted to what actually
shipped), pastes it into a fresh Claude Code session, reviews, and COMMITS MANUALLY
herself. Sessions never run git write commands; they end with a proposed commit
summary, the changed-file list, and the sign-off list. Pushing `main` auto-deploys
via Actions.

## Standing rules (every session)

- Read this file's session section + Standing rules, then `site/DESIGN-SYSTEM.md`,
  before touching code.
- Registry invariants are law: EXPLORE node order/tags frozen (seeded layout);
  new explore nodes APPEND only; sheet numbers live in `site/src/data/registry.ts`.
  From Session 4 on, the snapshot test + validator enforce this in CI.
- Governance: no hex outside `@theme`; redline = interaction/liveness only;
  mono <= 0.875rem; every ceremony renders final state under reduced motion.
- Motion unlocks granted 2026-07-07, scoped narrowly:
  (a) scroll-driven plates INSIDE sheets only, framed as leafing through the
  notebook; PRM and low-power devices get static final states / one-shot plates.
  (b) showcase sanction relocated: "showcase = the network surface wherever it
  appears" · idle float + camera drift legal on the landing; PRM/no-WebGL/
  save-data get the static poster, final state.
  Nothing else loops, nothing else is scroll-linked. New motion outside these
  scopes = explicit Emilie decision, never a silent add.
- Develop-once rule: an image develops (grayscale to color, one-shot, <= 500ms)
  the first time it enters the viewport, on ALL devices; developed state persists
  across route returns within a visit; hover-colorize is retired once developed;
  PRM renders full color immediately.
- Perf budgets (every DoD inherits): landing poster-path LCP <= 2.5s and
  CLS <= 0.1 on the Lighthouse mobile preset; landing initial JS <= 150KB gz with
  three.js deferred until after poster paint; network scene >= 30fps sustained at
  4x CPU throttle.
- Poster contract: the landing poster is generated at build time from makeGraph()
  output, never hand-exported; appends can never stale it.
- Copy: Emilie's voice (rigor + play, honest, funny). No em dashes anywhere,
  ever. '{' appears only inside LISTING code blocks, never in running prose.
  Everything drafted in her voice is flagged `draftCopy: true` until she signs off;
  unconfirmed months stay `dateDraft: true`.
- Attribution rule (Session 7, binding for 8-14): NO labeled attribution line
  anywhere, ever. The approved wordings live as `myPart` data (projects.tsx +
  the dossier's MYPART- series) and are woven into sheet prose as ordinary
  sentences, in the modest shared-credit register Emilie chose. The dossier's
  live-rulings block binds all sheet copy; its anti-claims (e.g. lEgoarCh's
  "93% supported" describes the instructive failure) are never mined as results.
- Definition of done, always: `npm run build` green (includes validator + snapshot
  test from Session 4 on); preview-verified (console clean, mobile viewport,
  reduced motion); NO git commit/push (Emilie commits manually); end with
  (1) a proposed commit summary, (2) the changed-file list, (3) items needing
  Emilie's sign-off.

Custom domain: DECIDED 2026-07-08, staying on hi-em.github.io (calibration found
no screening penalty; zero maintenance). Reopening later means a one-time
LinkedIn re-edit + OG/PDF URL refresh; that cost is accepted.

## Overview table

Session numbers are STABLE identifiers; the table below is in EXECUTION ORDER
(landing-first reorder, Emilie 2026-07-08). Shipped sessions listed first.

| # | Session | Target | Status / Emilie present? |
|---|---------|--------|--------------------------|
| 4 | Guardrails + Honesty | Registry safe to churn; live embarrassments dead | SHIPPED 07-07 |
| 4.2 | The Recruiter Calibration | One positioning dossier every content session reads | SHIPPED 07-07 |
| 5 | The Develop Pass | Develop ceremony + motion bundle + living placeholders | SHIPPED 07-07 |
| 6 | The Notebook Field Guide | Log markers, collapse rule, row hierarchy, de-numbered nav | SHIPPED 07-07 |
| 7 | Attribution Day | Credits, claims, numbers, repo mirror + LINKEDIN.md | SHIPPED 07-08 |
| 7.5 | The History Audit | Public history + surfaces leak nothing; prevention guards | SHIPPED 07-08 |
| 8 | Sheet Cinema I | Scroll-cinema governance addendum + template proven on P-101 Sensi | NEXT · direction gate |
| 9 | Sheet Cinema II | P-102 NeuroSpace + plate spec + P-104 retrofit | plate spec |
| 11 | Thought Notes | 10 words-only notes at /thoughts/:id, T-series decision | 10 notes |
| 12 | Landing I: The Surface | llm-council gate; embeddable network, poster pipeline, fallback matrix, touch pass, two-pass layout | council verdict |
| 13 | Landing II: The Mind is the Landing | Hero composition, depth-level spec, proof pair, capped roll, one reviewable Home swap | hero on phone |
| 10 | Plate Foundry I | P-103 Huddle, P-105 Lungs (video), P-106 lEgoarCh, P-107 podcast | copy sign-off |
| 14 | Plate Foundry II | P-108 SOMA, P-109 Ring 4000, P-110 Cappelletti, P-111 XR (+ ML addendum when assets land) | copy sign-off |
| 15 | The Career Commit Graph | CV rethink, registry/cv.ts unification, never-stale ATS-safe PDF | axis design |
| 16 | Persona + The Postcard | About/NOW/shelf + OG cards + per-route share meta + favicon | headshot, copy |
| 17 | The Hardening Audit | /code-review high, a11y, perf vs budgets, cross-browser | no |
| 18 | The Sweep | Every dateDraft/draftCopy retired; the notebook is signed | yes, fully |

Sequencing logic, recorded so future edits respect it: Attribution (7) precedes
sheet mass-production so attribution wordings and quantified outcomes flow into
all 11 sheets once. The cinematic template is proven on ONE flagship (8) behind an
explicit gate before it spreads (9) and derives the plate spec for the foundries
(10, 14). The landing (12-13) waits until every tappable word resolves to a real
page: placeholders by 5, flagships by 9, thought notes by 11. The two-pass append
layout lands in 12 where graph.ts is open anyway; until an append exists, the
Session 4 snapshot test fully protects the frozen 21. CV stays late (15) because
the axis echoes the final roll grammar and Session 4's interim PDF removes the
urgency; LINKEDIN.md does NOT wait: it ships in 7.
Session 4.2 (inserted 2026-07-07 at Emilie's proposal, Session 4 return): recruiter
calibration is captured ONCE, before any content session encodes positioning;
Sessions 5-6 are design/mechanical and consume none of it, so it slots before 5
without resequencing. Its dossier feeds 7 (which extends, not rebuilds, the claims
inventory), 8-14 (sheet copy), 15 (CV), 16 (LinkedIn-adjacent share layer), and 13
as a read-only 10-second-scan checklist.
LANDING-FIRST REORDER (Emilie, 2026-07-08): with the award post + LinkedIn pastes
about to drive her traffic peak, the landing jumps the plate foundries: execution
order is 8, 9, 11, 12, 13, then 10, 14. Every network word still resolves at
landing launch (flagship sheets by 9, thought notes by 11, honest mini-sheets for
the rest); the foundry sheets follow behind the new front door. Session numbers
stay stable; only the order changed. Rolling sign-off batches: each Emilie-present
sitting may close a short batch from the accumulated draft-flag ledger so Session
18 shrinks; the director tracks the ledger and injects batches into kickoff prompts.

---

## Session 4 · Guardrails + Honesty

**Goal:** The registry becomes safe to churn for eleven content sessions, and the
two live recruiter embarrassments (stale PDF, dead OG host) die today.

**Scope, core (in this order):**
1. og:url/og:image in `site/index.html` point at the dead em-iaac host: repoint to
   https://hi-em.github.io/eec-portfolio/ (fix the stale vite.config.ts comment too).
2. Interim PDF: `site/public/assets/cv-emilie-el-chidiac.pdf` is the Feb-2025
   pre-rebrand resume. Emilie picks: regenerate a simple current one-pager from
   `cv.ts` data, or relabel the button honestly until Session 15. Fix the wrong
   "Session 4" comment at cv.ts:3 (pipeline is Session 15).
3. Graph guardrails: Node snapshot test of makeGraph() (ids + sorted tags +
   rounded coords) as `npm test`; test step in `.github/workflows/deploy.yml`
   before deploy; React error boundary around the lazy explore chunk so a graph
   throw degrades to a message instead of blanking the app.
4. Registry validator (~40 lines, runs in build): every entry.project resolves in
   PROJECTS_BY_SLUG; every issued sheet has its SHEETS key; every image ref exists
   in images.json; explore orders unique + contiguous. Enable
   noUncheckedIndexedAccess in tsconfig and fix fallout.
5. PRM compliance: animated webp variants render a static first frame under
   prefers-reduced-motion (Img.tsx finally reads `animated`); add the
   ::view-transition reduce-media override so PRM users get the documented
   instant swap.

**Scope, cut-line tail** (ordered; spills to Session 5's preamble if the sitting
runs long): framer-motion removal from package.json + DESIGN-SYSTEM line;
LogoMark dead plot-in code + doc fix; About/CV skills dedup (skills stay CV-only);
CV body contact row (email · LinkedIn · GitHub · Barcelona | Beirut); Lungs LIVE
APP cold-start honest label; EXPLORE hover-spring PRM gate in scene.ts; node 22 in
deploy.yml; header ceremony composite trim to <= 900ms; the '{' prose sweep
(prose gets ':' or '·', LISTINGs keep '{').

**Decision presented (not pre-made):** analytics. Recommendation: GoatCounter
(cookieless, one script line) vs deliberately
tracking-free, recorded either way in DESIGN-SYSTEM.md. Wire only if opted in.

**DoD extras:** deliberately breaking a registry join or the node order locally
fails the build/test (then reverted); a simulated explore-chunk throw lands on
the error boundary; PRM walk shows no looping webp and no crossfade.

**Draft kickoff prompt:**

```
You are a senior platform engineer with design-governance literacy, working on
eec-portfolio. Start in plan mode: read SESSION-PLAN.md (Session 4 + Standing
rules), site/DESIGN-SYSTEM.md, the governance comments in site/src/index.css,
site/src/data/registry.ts (header contract), and site/src/explore/graph.ts before
proposing anything. Implement Session 4: Guardrails + Honesty, exactly per the
scope order (core items 1-5, then the cut-line tail as time allows; an unfinished
tail is fine, an unfinished core item is not). Ask me the two decisions with
AskUserQuestion before executing them: (a) interim PDF regenerate vs relabel,
(b) analytics GoatCounter vs tracking-free. Verify with the preview tools:
console clean, mobile viewport, reduced-motion walk proving the webp and
view-transition fixes; prove the guardrails by breaking a join and the node order
locally, showing the failure, and reverting. Run /code-review before finishing.
Do NOT run any git write commands; end your final message with (1) a proposed
commit summary I can paste into git, (2) the changed/created file list,
(3) everything needing my sign-off.
```

## Session 4.2 · The Recruiter Calibration (Emilie present)

*(Inserted 2026-07-07 at Emilie's proposal after Session 4 shipped.)*

**Goal:** One calibration dossier that every content session from 7 onward reads,
so positioning is decided once instead of guessed per session.

**Scope:** (a) SOLO PREP first: build a claims inventory from the repos, cv.ts,
projects.tsx, registry.ts, and content/blog-catalog.json: claim, evidence,
defensibility grade. Optionally deep-research current EU R&D / design-technology
screening signals (titles, keywords, ATS realities) so the quiz asks sharp
questions, not generic ones. (b) THE QUIZ: interview Emilie in AskUserQuestion
batches: goals and timeline (incl. the thesis-year constraint); role types ranked
(research vs design-technology vs software-leaning); industries and company
sizes; geographies + work rights + relocation/remote stance; non-negotiables and
red lines (claims she will not make); evidence gaps still fillable cheaply;
keyword bank she is comfortable owning. (c) SYNTHESIZE:
`content/RECRUITER-CALIBRATION.md`: target-role matrix, keyword bank, graded
claim inventory, decision log, and a ROUTING section stating which finding feeds
which future session (7 · 8-14 · 15 · 16, plus 13 as a read-only 10-second-scan
checklist for the landing hero).

**Constraints:** council-locked copy (brand spine, hero line, OPEN TO R&D status)
is read-only input; if calibration argues for reopening any of it, that returns
to the director + council as an explicit decision, never a silent edit. No site
code changes: the diff is one markdown dossier.

**Sign-offs:** the dossier, section by section; the routing decisions.

**SHIPPED 2026-07-07.** Director rulings on its flags (Emilie confirmed):
the dossier is LOCAL-ONLY (git-ignored, never pushed; sessions read it from
disk at content/RECRUITER-CALIBRATION.md); FLAG-01 executes in Session 5 (the
public open-to status retires sitewide; LinkedIn recruiters-only setting is the
single standing signal; Session 13's hero spec updated accordingly); FLAG-02's
Home figcaption gets non-location replacement drafts in Session 5; FLAG-03 is
an evidence action (Session 7 offers to draft the award announcement post; if
AWD-01 still lacks a public anchor when Session 13 ships the hero, say so at
the gate).

**Draft kickoff prompt:**

```
You are a senior technical recruiter and career strategist who places
computational-design and R&D candidates in Europe, working on eec-portfolio.
Start in plan mode: read SESSION-PLAN.md (Session 4.2 + Standing rules),
PORTFOLIO-REBRAND-BRIEF.md, content/copy-draft.md (locked spine: read-only),
site/src/data/cv.ts, site/src/data/projects.tsx, site/src/data/registry.ts,
content/blog-catalog.json. Work SOLO first: build a graded claims inventory
from those sources, and use deep-research for current EU R&D screening signals
if needed. THEN quiz me in AskUserQuestion batches per the session scope
(goals, roles ranked, industries, geographies + work rights, red lines,
evidence gaps, keyword bank). Synthesize content/RECRUITER-CALIBRATION.md with
a routing section mapping findings to Sessions 7, 8-14, 15, 16, and 13
(read-only checklist). Locked copy is a constraint, not a target. No site code
changes. Do NOT run any git write commands; end your final message with (1) a
proposed commit summary I can paste into git, (2) the changed/created file
list, (3) everything needing my sign-off.
```

## Session 5 · The Develop Pass

**Goal:** The site's small-motion vocabulary lands as one composed system, and no
route anywhere shows a bare IN PREPARATION stamp again.

**Scope:** (a) `useDevelopOnce` hook (IntersectionObserver, fires once, state
persists across route returns per the standing rule) driving the grayscale-to-
color develop on Img/ProjectCard/SheetFigure on ALL devices; retire hover-colorize
per the rule; PRM = immediate full color. (b) The approved five-motion bundle:
EXPLORE InfoCard entrance (fade + 8px rise, ~280ms, keyed per node), InfoCard
exit through the mylar mode ceremony instead of the root view transition,
Notebook filter fade (~180ms on lens change), viewTransition prop on ALL internal
links, Kicker leader-line one-shot draw-in sequenced after the header rule.
(c) `MiniSheet.tsx`: registry-driven enriched placeholder for every in-prep sheet
route: blurb from projects.tsx, available figures from images.json, external
links, tags, an /explore/:id deep link; SheetRoute renders it wherever status is
in-preparation. (d) DESIGN-SYSTEM.md motion vocabulary updated (develop rule +
five bundle entries). (e) FLAG-01 execution (director ruling 2026-07-07,
reopening confirmed by Emilie): remove the redline OPEN TO R&D status line from
TitleBlock and the CV page; soften the About availability sentence to an
invitation without a status (the "let's talk" energy stays; drafted in her
voice, draftCopy); update DESIGN-SYSTEM's sanctioned-redline list (the ISSUED
FOR stamp remains the header's one redline text). (f) FLAG-02: replace the Home
figcaption "EM · BARCELONA VIA BEIRUT" with 2-3 non-location alternatives in
her voice (draftCopy; lean on MaCAD/IAAC or the notebook conceit, never a
location claim she cannot defend). Internal cut order: develop > MiniSheet >
FLAG-01/02 > bundle, so a truncated sitting still leaves a coherent commit.

**Sign-offs:** develop timing/feel checked on Emilie's phone; MiniSheet layout;
any new placeholder microcopy (draftCopy); the softened About sentence; the
figcaption pick.

**Draft kickoff prompt:**

```
You are a motion-literate front-end engineer on eec-portfolio. Start in plan
mode: read SESSION-PLAN.md (Session 5 + Standing rules, especially the
develop-once rule and motion scopes), site/DESIGN-SYSTEM.md, site/src/index.css
governance, site/src/components/Img.tsx, ProjectCard.tsx,
explore/InfoCard.tsx, hooks/useExploreTransition.tsx, pages/SheetRoute.tsx.
Implement Session 5: The Develop Pass (useDevelopOnce + the five-motion bundle +
the MiniSheet enriched placeholder replacing every bare stub + the FLAG-01/02
copy work per the session spec: retire the OPEN TO R&D status line sitewide,
soften the About availability sentence, draft non-location figcaption
alternatives, all draftCopy). Every ceremony: one-shot, 150-900ms, final state
under reduced motion. Use the preview tools throughout (console, mobile
viewport, PRM walk of every new motion, all 10 in-prep routes render
respectable MiniSheets). Use design:design-critique on the MiniSheet before
finishing, and /code-review at the end. Do NOT run any git
write commands; end your final message with (1) a proposed commit summary I can
paste into git, (2) the changed/created file list, (3) everything needing my
sign-off.
```

## Session 6 · The Notebook Field Guide

**Goal:** The Notebook reads by eye: every entry kind carries a mark, log lines
know their place, and the coming flood of sheet issues has a collapse rule
before it starts.

**Scope:** (a) G2 log markers in the date gutter, mono ink: filled square =
project, # = sheet issue (redline, it is a liveness event), ~ = thought,
+ = milestone, asterisk = award; PLUS a proposal for the two kinds the approved
set missed: press and talk (e.g. pilcrow for press; Emilie decides). (b) Log-row
hierarchy: projects keep full weight; thought/milestone/award/press rows tighten
(reduced padding, lighter rule, slight indent), no added text labels. (c) Collapse
rule at the render layer: same-month sheet issues aggregate into one row
("SHEETS P-101, P-102 ISSUED >"); registry data model unchanged. (d) Nav
de-numbering sitewide (01/02/03 go; titles stay). (e) Lens filtering keeps
unlensed milestones visible (they are the spine of the timeline). Design against
synthetic flood data (fake 4 same-month issues locally, then revert).

**Sign-offs:** the full glyph set including press/talk; collapse row wording;
final nav labels.

**Draft kickoff prompt:**

```
You are an editorial-systems designer-engineer on eec-portfolio. Start in plan
mode: read SESSION-PLAN.md (Session 6 + Standing rules), site/DESIGN-SYSTEM.md,
site/src/pages/Notebook.tsx, components/BenchRoll.tsx, components/TitleBlock.tsx,
site/src/data/registry.ts. Implement Session 6: The Notebook Field Guide (G2
mono kind-markers incl. a press/talk proposal for my decision via
AskUserQuestion, tightened log rows, same-month sheet-issue collapse at the
render layer, sitewide nav de-numbering, unlensed milestones surviving lens
filters). No new text labels; marks only. Verify with preview tools (mobile,
PRM, a synthetic four-issue month proving the collapse, then reverted). Run
design:design-critique on the marked-up Notebook and /code-review before
finishing. Do NOT run any git write commands; end your final message with (1) a
proposed commit summary I can paste into git, (2) the changed/created file list,
(3) everything needing my sign-off.
```

## Session 7 · Attribution Day (Emilie present)

**Goal:** Every honesty and credit question is decided once, live, before any
sheet copy exists; LinkedIn ships the same day.

**Scope:** Solo first phase: start from the graded claims inventory in
`content/RECRUITER-CALIBRATION.md` (Session 4.2) and EXTEND it with quantified-
outcome candidates (parameters scored, solver bodies, round-trip latency, model
counts) from the repos, IAAC blog posts, and content/blog-catalog.json: do not
rebuild it. Then, with Emilie via
AskUserQuestion batches: course-code reframing ("MACAD STUDIO · TEAM OF 4" style),
MY PART one-liners for every group project, mirroring the Sensi repo to
github.com/hi-em (checklist deliverable; README credits teammates), the P-104
"RECEIVED: LATE" metaRight joke, one defensible number per project. Deliverables:
copy edits applied (draftCopy), MIRRORING.md checklist, LINKEDIN.md (headline,
about, featured items, banner spec from the locked brand spine, paste-ready).

**Sign-offs:** all attribution copy; LINKEDIN.md wording; the number set.

**Draft kickoff prompt:**

```
You are a hybrid technical-recruiter and UX-copy specialist on eec-portfolio.
Start in plan mode: read SESSION-PLAN.md (Session 7 + Standing rules),
PORTFOLIO-REBRAND-BRIEF.md (sections 6 and 8), content/RECRUITER-CALIBRATION.md
(the Session 4.2 dossier: your positioning ground truth), content/
blog-catalog.json, site/src/data/projects.tsx, site/src/sheets/P104.tsx. First
work SOLO: extend the dossier's graded claims inventory with defensible
quantified-outcome candidates per project from the repos and blog posts. Then
interview me in AskUserQuestion batches: course-code
reframing, MY PART lines, the Sensi repo mirror, the P-104 meta joke, one number
per project. Apply my answers (draftCopy flagged), produce MIRRORING.md and
LINKEDIN.md (paste-ready, from the locked Behavior Information Modeling spine;
use design:ux-copy for the microcopy and deep-research if you need current EU
R&D screening signals). Preview-verify any card/meta changes. Do NOT run any git
write commands; end your final message with (1) a proposed commit summary I can
paste into git, (2) the changed/created file list, (3) everything needing my
sign-off.
```

## Session 7.5 · The History Audit (solo, before Session 8)

*(Inserted 2026-07-08 at the Session 7 return: forward cleanups cannot reach
already-pushed history; a one-time full-history hygiene pass lands before
LINKEDIN.md's featured links start sending recruiters to the repo.)*

**Goal:** The public repo's ENTIRE surface (every commit, blob, deployed page,
workflow artifact, and any orphaned public remnant such as the old em-iaac
repo/host) leaks no PII or credentials.

**Scope:** (a) Automated sweep of full pushed history (gitleaks/trufflehog plus
a targeted PII term list built live with Emilie and NEVER committed). (b)
Findings walked in AskUserQuestion batches: accept / edit-forward / rewrite,
per item. (c) Approved rewrite via git filter-repo + force-push with lease
(Emilie runs or authorizes the push live; note filter-repo drops the origin
remote, restore it); then GitHub hygiene: fork check, GitHub Support cached-view
purge request or temporary private toggle, old em-iaac repo/host verification
(gh CLI is authenticated), Actions artifact retention check, fresh-clone
re-verification of every scrubbed term. (d) Prevention: local pre-push hook +
CI guard whose term list stays OUT of the repo (a committed leak-list is itself
the leak; a repo secret or local-only file can carry it).

**Known findings to seed:** maintained in the local-only audit note, never in
this file.

**Sign-offs:** the term list; per-finding rulings; the force-push itself, live.

**Draft kickoff prompt:** issued at dispatch (this session runs against live
git history; the prompt is calibrated to the repo state on the day it runs).

## Session 8 · Sheet Cinema I: the template + P-101 Sensi

**Goal:** The scroll-cinema system exists, governed in writing as leafing through
Em's notebook, and Sensi ships as its proof.

**Scope:** FIRST deliverable, before any code: the scroll-cinema governance
addendum for DESIGN-SYSTEM.md (scope: sheet plates only; the notebook-leafing
framing; what PRM and low-power devices get: static plates with one-shot
develops; the perf budget). Emilie signs it, then build: the cinematic sheet
system (pinned plate sections, scroll-driven develops, margin notes riding
along), the SheetVideo component (self-hosted mp4/webm, poster, controls, muted
loop only where reduced motion allows, mono caption), and P-101 Sensi at full
depth: abstract, method, real LISTING from the repo, 4-8 plates, video where
motion carries, attribution woven into the prose per the Session 7 rule (myPart
data; no labeled line), n.b. dots + margin notes (drafts).
Registry flips P-101 to issued + dated issue entry. END GATE: Emilie reviews the
result and explicitly approves the direction; her verdict binds Sessions 9-14.

**Sign-offs:** the addendum; Sensi copy; the direction gate itself.

**Draft kickoff prompt:**

```
You are a motion director and front-end engineer who has shipped scroll-driven
editorial features, on eec-portfolio. Start in plan mode: read SESSION-PLAN.md
(Session 8 + Standing rules, especially the motion unlock scopes),
site/DESIGN-SYSTEM.md, site/src/sheets/P104.tsx and the sheet components,
content/blog-catalog.json for Sensi source material. Step one, before code:
draft the scroll-cinema governance addendum and get my sign-off via
AskUserQuestion. Then build the cinematic sheet system + SheetVideo + the full
P-101 Sensi sheet (copy in my voice, draftCopy; attribution woven into prose
per the Session 7 rule, never a labeled line; real code listing). The whole thing must read as leafing through my notebook, never a
product page. Verify with preview tools: console, mobile, the FULL
reduced-motion walk proving static plates, and scroll performance on a throttled
profile. Use design:design-critique on the finished sheet, /llm-council if the
direction wobbles, /code-review before finishing. Do NOT run any git write
commands; end your final message with (1) a proposed commit summary I can paste
into git, (2) the changed/created file list, (3) everything needing my sign-off,
ending with the explicit direction-gate question.
```

## Session 9 · Sheet Cinema II: P-102 NeuroSpace + the plate spec

**Goal:** The cinematic template proves it generalizes; the lighter plate
treatment is derived and documented; P-104 gets its retrofit decision.

**Scope:** P-102 NeuroSpace full cinematic (slider-tour video, live-app framing,
solo attribution). Derive the PLATE SPEC from the cinematic system: full-bleed
plates with one-shot develops, no pinning, documented in DESIGN-SYSTEM.md as the
default for Sessions 10/14. P-104 retrofit: present Emilie the choice (retrofit
to cinematic, restyle to plates, or leave editorial as the archive original) and
execute it. Registry flips, dated issue entries, collapse rule visible.

**Sign-offs:** plate spec; NeuroSpace copy; retrofit choice.

**Draft kickoff prompt:**

```
You are the same motion-director profile as Session 8, continuing on
eec-portfolio. Start in plan mode: read SESSION-PLAN.md (Session 9 + Standing
rules), the Session 8 cinematic system and governance addendum in
site/DESIGN-SYSTEM.md, site/src/sheets/ (P101 as the pattern), NeuroSpace
sources in content/blog-catalog.json and the live app. Build P-102 NeuroSpace
cinematic; derive and document the plate spec (the lighter default for the
remaining eight sheets); ask me the P-104 retrofit decision with AskUserQuestion
and execute it. Flip registries with dated issue entries. Preview-verify
(console, mobile, PRM static plates, throttled scroll perf) and /code-review.
Do NOT run any git write commands; end your final message with (1) a proposed
commit summary I can paste into git, (2) the changed/created file list,
(3) everything needing my sign-off.
```

## Session 10 · Plate Foundry I: the computation record

**Goal:** The computation lens completes: Huddle, Lungs, lEgoarCh, podcast.

**Scope:** Four plate-spec sheets. Specials: P-105 Lungs: self-hosted
screen-capture video is the primary proof; the Railway link demotes to TRY IT
with an honest cold-start note. P-106 lEgoarCh: max 8 figures from the 45-file
booklet; resist the gallery urge. P-107 podcast: audio-first variant: Spotify
embed/link + pull-quotes from the Cleo Valentine conversation (the BIM origin
story) instead of METHOD/LISTING. Attribution woven into prose throughout per
the Session 7 rule (myPart data; no labeled lines).
Registry flips x4; the Notebook collapse rule earns its keep.

**Sign-offs:** four sheets' copy.

**Draft kickoff prompt:**

```
You are a research editor and front-end engineer on eec-portfolio. Start in plan
mode: read SESSION-PLAN.md (Session 10 + Standing rules), the plate spec in
site/DESIGN-SYSTEM.md, a Session 9 sheet as the pattern, and
content/blog-catalog.json. Write plate sheets for P-103 The Huddle, P-105 The
Lungs (self-hosted demo video primary, Railway demoted to TRY IT with an honest
note), P-106 lEgoarCh (max 8 figures), and P-107 Optimizing for the Mind
(audio-first: pull-quotes + Spotify, no METHOD/LISTING). Copy in my voice,
draftCopy, attribution woven into prose per the Session 7 rule (no labeled
lines). Flip the four registry statuses + dated issue
entries; verify the same-month collapse renders correctly. Preview-verify
(console, mobile, PRM) and /code-review. Do NOT run any git write commands; end
your final message with (1) a proposed commit summary I can paste into git,
(2) the changed/created file list, (3) everything needing my sign-off.
```

## Session 11 · Thought Notes: the mind in writing

**Goal:** Every thought becomes an open-able written note: words only, as short
or as long as it wants to be.

**Scope:** Route `/thoughts/:id`: narrow serif leaf on mylar, dated, lowercase
serif-italic title, optional n.b. dots, NO figures. Registry: thought entries
gain a note status analogous to sheets. Links: Notebook rows, bench-roll thought
entries, EXPLORE info card gains OPEN NOTE > when a note exists. Sheet-number
chrome decision for the new routes (proposal: T-101.. series, or none; Emilie
decides). Draft all 10 notes in her voice at earned length (bim and
comfort-as-data run long; solvers may be three sentences), ALL draftCopy.
Graph order/tags untouched.

**Sign-offs:** T-series decision; all 10 notes listed individually.

**Preamble (added 2026-07-08):** (a) if incoming/neurospace/ holds the
slider-tour capture, encode it via the video pipeline and insert the pending
P-102 video plate (Session 9 tail); (b) rolling sign-off batch #1: the small
accumulated microcopy flags from Sessions 4-6 (error-boundary wording, About
toolkit pointer, Lungs label, softened About sentence, figcaption pick,
MiniSheet note, collapse wording, nav labels, prefix removal, axis
normalization, asterisk look) walked in one AskUserQuestion batch, approved
flags removed. Dates, crops, and full sheet copy stay with later batches.

**Draft kickoff prompt:**

```
You are an essayist-engineer on eec-portfolio: half writer, half React. Start in
plan mode: read SESSION-PLAN.md (Session 11 + Standing rules),
site/DESIGN-SYSTEM.md, site/src/data/registry.ts (thought entries),
content/blog-catalog.json, and the issued sheets for cross-reference. Build the
thought-note format (/thoughts/:id, words-only notebook leaf), registry note
status, links from Notebook rows, bench-roll entries, and the EXPLORE info card
(OPEN NOTE >). Ask me the sheet-number question (T-series or none) with
AskUserQuestion. Draft all 10 notes in my voice at whatever length each earns,
every one draftCopy. Do NOT touch EXPLORE graph order or tags. Use design:ux-copy
for tone spot-checks; preview-verify (console, mobile, PRM); /code-review.
Do NOT run any git write commands; end your final message with (1) a proposed
commit summary I can paste into git, (2) the changed/created file list,
(3) everything needing my sign-off, listing all 10 notes.
```

## Session 12 · Landing I: The Surface (council first)

**Goal:** The network becomes an embeddable, fallback-proof, append-safe,
touch-tested surface, shipped on /explore first. Home stays untouched.

**Scope:** (a) GATE: /llm-council pressure-tests the L2 concept (network-as-hero
vs the recruiter 10-second scan, carbon-on-mylar ground logic, depth-level
navigation). A muddy verdict stops the session with findings, not code.
(b) ExploreSurface: the scene refactored into an embeddable component (full-page
/explore keeps working). (c) Poster pipeline: build script renders the frozen
layout (makeGraph() coords) to a static image via the image pipeline;
regenerates every build per the standing poster contract. (d) Fallback matrix:
no-WebGL, PRM, save-data, low-power all get the poster, final state, with the
hero copy overlay intact. (e) Touch pass: tap-to-focus verified, preload on
touchstart, frame rate on a throttled mid-range profile (>= 30fps standing
budget). (f) Two-pass append layout: freeze the 21 shipped coordinates as
constants, relax appendees against the frozen field; EXPECTED_ID_ORDER becomes a
prefix check; `standalone: true` support so future appended thoughts can float
unconnected. DoD: a TEST-ONLY append leaves the frozen 21 byte-identical (then
reverted). (g) Governance edit: the relocated showcase sanction wording lands in
DESIGN-SYSTEM.md.

**Sign-offs:** council verdict; poster look; sanction wording.

**Draft kickoff prompt:**

```
You are a WebGL/three.js specialist with a performance-engineering streak, on
eec-portfolio. Start in plan mode: read SESSION-PLAN.md (Session 12 + Standing
rules, perf budgets, poster contract), site/src/explore/ (graph.ts contract
comments especially), site/src/data/registry.ts, site/DESIGN-SYSTEM.md. FIRST
run /llm-council on the L2 landing concept as specified in the session; if the
verdict is muddy, stop and report findings instead of building. Then: refactor
the scene into an embeddable ExploreSurface; build the build-time poster
generator from makeGraph() output; implement the full fallback matrix (no-WebGL/
PRM/save-data/low-power = poster, final state); do the touch pass (tap-to-focus,
touchstart preload, >= 30fps at 4x CPU throttle); implement the two-pass append
layout + standalone flag with the test-only-append byte-identical proof; update
the showcase sanction wording in DESIGN-SYSTEM.md. Ship it all on /explore; do
not touch Home. Preview-verify everything incl. PRM and mobile; /code-review.
Do NOT run any git write commands; end your final message with (1) a proposed
commit summary I can paste into git, (2) the changed/created file list,
(3) everything needing my sign-off.
```

## Session 13 · Landing II: The Mind is the Landing

**Goal:** Home is rebuilt around the network hero. One reviewable commit Emilie
can hold or revert.

**Scope:** Compose the landing: ExploreSurface hero with the locked hero line
overlaid (NO open-to status: FLAG-01 retired it sitewide in Session 5; verify
against the ten-second checklist in content/RECRUITER-CALIBRATION.md section 7,
and if the award claim still lacks a public anchor, surface FLAG-03 at the
gate); WRITTEN depth-level spec as a deliverable (how landing > focus > full EXPLORE
replaces the READ/EXPLORE toggle; what the header shows now); proof pair one
scroll down; capped roll (~12 newest, all kinds) ending in the OPEN THE ARCHIVE
card; Kicker relocation + its one-shot draw-in; footer; final de-numbered nav.
Perf budgets verified on BOTH paths (poster and WebGL). The Home swap lands as
one coherent commit.

**Sign-offs:** hero composition on Emilie's phone; the depth-level spec; roll
cap contents.

**Draft kickoff prompt:**

```
You are a design-director-grade front-end engineer on eec-portfolio. Start in
plan mode: read SESSION-PLAN.md (Session 13 + Standing rules + perf budgets),
the Session 12 ExploreSurface and depth-level council findings,
site/DESIGN-SYSTEM.md, site/src/pages/Home.tsx, components/BenchRoll.tsx,
components/TitleBlock.tsx, and the ten-second hero checklist in
content/RECRUITER-CALIBRATION.md section 7 (local git-ignored file, read-only).
Rebuild Home per L2: network hero + locked hero line overlaid (copy verbatim,
council-locked; NO open-to status anywhere per FLAG-01, retired in Session 5),
written depth-level spec as a deliverable file, proof pair, capped ~12-entry
roll + archive card, Kicker + draw-in, final nav. If the MaCAD award claim
still lacks a public anchor (dossier FLAG-03), say so in your sign-off list. Verify perf budgets on poster AND
WebGL paths (Lighthouse mobile preset), console, mobile, full PRM walk. Use
design:design-critique and design:accessibility-review on the composed landing,
then /code-review. Deliver the Home swap as ONE coherent commit proposal.
Do NOT run any git write commands; end your final message with (1) a proposed
commit summary I can paste into git, (2) the changed/created file list,
(3) everything needing my sign-off.
```

## Session 14 · Plate Foundry II: practice + explorations

**Goal:** The record completes; the last placeholder retires.

**Scope:** P-108 Towers at SOMA and P-109 Ring 4000 (practice lock: SOMA +
Marsception professional reframing only), P-110 Cappelletti, P-111 XR (text-plate
if assets are thin). Plate spec, attribution woven per the Session 7 rule,
registry flips x4. After this
session no MiniSheet renders anywhere (they remain as the pattern for FUTURE
projects).

**Sign-offs:** four sheets' copy.

**Draft kickoff prompt:**

```
You are a research editor and front-end engineer on eec-portfolio. Start in plan
mode: read SESSION-PLAN.md (Session 14 + Standing rules), the plate spec in
site/DESIGN-SYSTEM.md, a Session 10 sheet as the pattern, and the practice-lens
copy locks noted in the session. Write plate sheets for P-108 Towers at SOMA,
P-109 Ring 4000, P-110 Cappelletti Pavilion, P-111 XR for Education (text-plate
if assets are thin). Respect the practice copy lock (SOMA + Marsception
reframing only). Flip all four registry statuses; verify no route shows a
MiniSheet placeholder anymore. Copy draftCopy-flagged. Preview-verify (console,
mobile, PRM); /code-review. Do NOT run any git write commands; end your final
message with (1) a proposed commit summary I can paste into git, (2) the
changed/created file list, (3) everything needing my sign-off.
```

## Session 15 · The Career Commit Graph

**Goal:** The CV becomes the notebook's career view, with a PDF that can never
go stale again.

**Scope:** (a) /cv redesign: commit-graph year axis (education/roles/awards/
projects plotted with mono labels, echoing the final roll grammar; redline only
at the live NOW edge); detail sections below stay scannable and ATS-legible
(real text, semantic headings). Run /llm-council on the axis direction first if
it feels risky. (b) One data source: CV sections derive from registry.ts +
cv.ts joins with zero duplicated facts. (c) PDF pipeline: A4 print stylesheet
rendered to PDF at build time, replacing the interim file; ATS constraints
baked in: single-column text layer, no letter-spaced name, "Aug 2024 - Present"
date forms in the embedded text, current email; DOWNLOAD PDF always serves
current data.

**Sign-offs:** axis design; PDF proof (screenshot + a text-extraction parse test).

**Draft kickoff prompt:**

```
You are an information designer and build-pipeline engineer on eec-portfolio.
Start in plan mode: read SESSION-PLAN.md (Session 15 + Standing rules),
site/src/pages/CV.tsx, site/src/data/cv.ts and registry.ts,
site/DESIGN-SYSTEM.md. Redesign /cv around a commit-graph year axis (mono
labels, redline only at NOW; run /llm-council first if the direction feels
risky); unify CV facts onto registry + cv.ts joins with no duplication; build
the A4 print-stylesheet PDF pipeline regenerating
site/public/assets/cv-emilie-el-chidiac.pdf at build time with the ATS
constraints from the session spec; prove it with a text-extraction test. Keep
the page ATS-legible. Preview-verify (console, mobile, PRM, print preview);
/code-review. Show me the page and the PDF side by side. Do NOT run any git
write commands; end your final message with (1) a proposed commit summary I can
paste into git, (2) the changed/created file list, (3) everything needing my
sign-off.
```

## Session 16 · Persona + The Postcard

**Goal:** The human layer lands, and the site travels designed.

**Scope:** (a) About pass: final headshot (Emilie provides; image pipeline),
staged persona copy edits. (b) NOW: dated data file (building/reading/thinking,
3-5 lines) rendered on About + emitted as the newest bench-roll entry kind;
updating it = editing one file; N-001 sheet-number decision. (c) THE SHELF:
annotated reading list (title, author, one irreverent line each, draftCopy),
cross-linked to thought notes where reading fed thinking. (d) Share layer: OG
master card + per-sheet template via canvas-design (Pen Table grammar: mylar
ground, ink type, one redline accent, no lens color without ticks); build-time
per-route meta prerender driven by the registry (sheet number, title, figure);
favicon audit at 16/32/180.

**Sign-offs:** headshot; NOW + shelf copy; OG cards; N-001 decision.

**Draft kickoff prompt:**

```
You are a brand designer and front-end engineer on eec-portfolio. Start in plan
mode: read SESSION-PLAN.md (Session 16 + Standing rules), site/DESIGN-SYSTEM.md,
site/src/pages/About.tsx, the registry, and site/index.html meta. Implement:
About pass with my headshot (I provide the file; pipeline it), the NOW module
(dated data file > About + newest bench-roll entry; ask me N-001 vs none), THE
SHELF (annotated, draftCopy, cross-linked to thought notes), then the share
layer: use anthropic-skills:canvas-design for the OG master + per-sheet card
template in the Pen Table system, wire build-time per-route og/twitter meta from
the registry, audit the favicon at 16/32/180. Verify share cards with a
link-preview check and everything else with the preview tools (console, mobile,
PRM). Run design:design-critique on the cards, /code-review at the end. Do NOT
run any git write commands; end your final message with (1) a proposed commit
summary I can paste into git, (2) the changed/created file list, (3) everything
needing my sign-off.
```

## Session 17 · The Hardening Audit (solo)

**Goal:** The accumulated system is verified against its own rules.

**Scope:** (a) /code-review at high effort over the site code; fix what survives
verification. (b) design:accessibility-review: keyboard-only walk landing >
depth levels > sheet > thought note > network and back; contrast including
anno-on-mylar mono at its real rendered sizes and the carbon surfaces; SR labels
on the network hero and poster fallback; heading hierarchy; the full PRM sweep
including scroll plates and the landing. (c) Performance vs the standing
budgets: bundle per route, heaviest images, landing LCP both paths; fix cheap
wins, report the rest. (d) Cross-browser: Firefox (no view transitions), Safari,
real touch device.

**Draft kickoff prompt:**

```
You are a principal engineer running a release-hardening pass on eec-portfolio.
Start in plan mode: read SESSION-PLAN.md (Session 17 + Standing rules + perf
budgets) and site/DESIGN-SYSTEM.md. Then: /code-review at high effort and fix
verified findings; design:accessibility-review per the session's walk list
(keyboard, contrast at real sizes, SR labels on the network hero/poster, full
PRM sweep including scroll plates); performance vs the standing budgets with a
per-route bundle and LCP report on both landing paths; cross-browser checks
(Firefox, Safari, touch). Fix cheap wins, report everything else with numbers.
Preview tools throughout. Do NOT run any git write commands; end your final
message with (1) a proposed commit summary I can paste into git, (2) the
changed/created file list, (3) everything needing my sign-off, including any
findings you deliberately did not fix.
```

## Session 18 · The Sweep (Emilie present)

**Goal:** Every draft flag retires with Emilie in the loop; the notebook is
signed.

**Scope:** Walk every `dateDraft`/`draftCopy` grouped by surface in
AskUserQuestion batches: registry dates, sheet numbers P-101..P-111 plus the
T/N series, n.b. + margin + thought + shelf copy, image.position crops. Apply
answers, remove flags as approved. Closeout: mark v2 complete in this file,
re-surface the custom-domain option.

**Draft kickoff prompt:**

```
You are a meticulous managing editor on eec-portfolio; I am present for this
entire session. Start in plan mode: read SESSION-PLAN.md (Session 18 + Standing
rules), then grep every dateDraft and draftCopy flag across site/src. Walk me
through them in AskUserQuestion batches grouped by surface (registry dates,
sheet numbers incl. T/N series, n.b./margin/thought/shelf copy, crop positions).
Apply my answers and remove flags only as I approve them. Preview-verify each
surface after its batch. Finish by marking SESSION-PLAN.md v2 complete and
re-surfacing the custom-domain add-on. Do NOT run any git write commands; end
your final message with (1) a proposed commit summary I can paste into git,
(2) the changed/created file list, (3) anything I declined to sign off, left
flagged.
```
