# CONTENT-STRATEGY.md · the content / portfolio / SEO rules of record

**Status: decided 2026-07-13 (S2, THE STRATEGY SESSION), with Emilie, every fork chosen
with a visual in front of her.** This file governs the remaining content sessions (S1
quick-wins, S3 searchability, S4 work-rework, S5 content). It is the CONTENT authority the
way `REDESIGN-SPEC.md` is the CONCEPT authority and `DESIGN-LANGUAGE.md` is the VISUAL
authority. Where this file and those touch, CONTENT decisions here win; VISUAL skin defers to
`DESIGN-LANGUAGE.md`; the honesty/privacy/economy/floors rules bind all three.

Private career specifics (target roles, geographies, work-rights, search intensity) live ONLY
in the local, git-ignored `content/RECRUITER-CALIBRATION.md`. Nothing confidential is copied
here. This file is safe to commit.

---

## 0 · The binding (non-negotiable; restated in every session prompt)

- **HONESTY.** Attribution is woven into prose as ordinary sentences, never labelled lines or
  percentages (Sensi = "project lead, team credited, team of four"; Marsception credits
  Charles Abi Chahine). Neuro-tool verbs are **score / estimate / model**, never *measure*;
  no clinical claims. lEgoarCh's "93% supported" is an instructive failure, never a result.
  Lungs is "designed to filter" (proposal tense). ML projects use team-context framing.
- **PRIVACY.** No public job-search signals anywhere on the site.
  `content/RECRUITER-CALIBRATION.md` is LOCAL and git-ignored: read from disk, never commit,
  quote, or paraphrase its confidential content into any committed file.
- **ECONOMY.** `site/src/data/registry.ts` + the per-project master files
  (`site/src/content/projects/`) are the SINGLE source; the card, the showcase, the book
  spread, and the CV line are RENDITIONS of them. Appends only; the CI snapshot test + the
  validator stay green.
- **FLOORS.** Accessibility + honest reduced-motion states are non-negotiable. Emilie's voice
  (rigor + play, honest, funny). **NO em dashes, ever.** Anything drafted in her voice ships
  `draftCopy: true` / `showcaseDraft: true` until she signs it.
- **LOCKED COPY.** The hero question ("how will this space make someone feel?") and the
  "Behavior Information Modeling" spine are content; challenge only as an explicit flagged
  recommendation, never a silent rewrite.
- **PROCESS.** Before building any page, VISUALISE its locked decisions in chat for Emilie's
  confirmation, THEN build.
- **PREVIEW-VERIFY.** Verify in the browser: console clean, mobile (390px), both modes,
  reduced motion.

---

## 1 · The seven decisions

### D1 · Depth — one tight showcase per project
One layer, not a story-behind-a-page. The opened showcase IS the project; there is no separate
long case-study page. Depth (full method, code, long read) lives in the linked repo / blog /
live app. "A portfolio, not a blog." This ratifies what G1 built and matches the 2026 norm:
reviewers spend under two minutes on the first pass and reward a tight, outcome-first summary
with links out over a long scroll.

### D2 · Order, feature, add — a FEATURED tier, strongest-first
`/work` stops being a flat equal grid and gains hierarchy. Reviewers weight the first sixty
seconds, so the strongest work leads at full size.

- **Featured heroes (lead, largest, first):** Sensi · NeuroSpace · lEgoarCh · The Lungs ·
  The Huddle · Optimizing for the Mind (the podcast). This is the MaCAD award + live-app +
  research core. Within the tier, still lead with the three strongest: Sensi, NeuroSpace,
  lEgoarCh (awards + live proof + the BIM→Behavior spine).
- **Supporting:** the remaining current projects (Ballooning Market, Cappelletti, Towers at
  SOMA, Rings of Mars, XR for Education).
- **ADD, from the IAAC blog (currently invisible on the site):** Narkomfin (Graph ML) ·
  Urban Risk (ML pipeline) · Speckle Bucketing · plus the three extras Data-Geometry
  (Rhino.Inside Revit) · Tsukiji (environmental analysis) · Pelagñou (AI theory).
- **ADD, mini-explorations (Emilie provides assets):** the complex-forming class pieces — a
  math surface, a Kangaroo inflated playground, a chair-design simulation — surfaced as light
  "explorations" entries, not full heroes.
- **DEFERRED:** professional computational-workflow projects that shipped in practice. Not a
  priority now, and gated on the SOMA / Dynamic Solution NDA check before any imagery ships.
- The mind graph (`/`) and the neural world (`/thoughts`) keep showing EVERYTHING; the
  featured tier is a `/work` reading-order idea, not a curation of the record. "Everything
  forever" is unchanged; hierarchy is added only where a recruiter scans.

*Why add the ML/Speckle work:* it surfaces the tool vocabulary that screeners filter for
(graph machine learning, ML pipeline, Speckle, data-driven design) and the applied-research
signal, all in honest team-context framing. Bucketing carries the cleanest efficiency claim
Emilie owns (a review cut from 25-30 minutes to under three).

### D3 · Card mechanic — unfold the story, redesign the showcase to the BOOK one-pager
Keep the card-on-top overlay (the andrewheumann mechanism Emilie chose). Two changes:

1. **Drop the "THE STORY" toggle.** The signed spine (WHAT · WHY · HOW · WHAT CAME OF IT)
   reads straight down under the proof media. The outcome and the woven role — what reviewers
   most want — are visible immediately, not one tap away. Fewer clicks, book-like.
2. **The showcase adopts the A4-landscape BOOK one-pager layout: "everything at a glance."**
   Dominant asset + title + the one-line question/claim + the woven credit sentence + the mono
   tools strip + the award recognition line + the links out, composed as one readable spread.
   The single addition over the printed page is a **flip-through asset gallery** (page through
   the images/video in place).

This makes card, on-screen showcase, and printed book spread ONE layout logic driven by the
one master file. It deepens the economy rule and is the primary aim of S4.

### D4 · One question per project — yes, every project
Every project is framed as the one plain-language question it answers, in standard vocabulary
(e.g. Sensi: "Can a copilot score how a floor plan will feel?"; Narkomfin: "What does a
building's plan look like as a graph?"). The question is authored once and does triple duty:
the on-screen claim/dek, the per-route `<meta name="description">` seed, and the reach hook for
question-style search. It echoes Emilie's own hero question, so the whole site asks and answers.
Questions are drafted in S4/S5 in her voice and ship flagged until she signs them.

### D5 · The fluff bar (the minimal-words rule)
Every sentence must do at least one of: (a) state what / why / how / what-came-of-it, (b)
credit honestly, or (c) carry a real keyword in natural prose. If a sentence does none of
those, cut it. Specifically fluff, cut on sight: evidence-free adjectives ("innovative",
"cutting-edge", "passionate"), sentences that restate the title, generic mission statements,
and anything reproducing method or code that already lives in the repo/blog. The bar is
"portfolio, not a blog": tight, concrete, voiced.

### D6 · ATS · reviewer · brand · SEO — do the full searchability build (S3)
The single biggest gap on the live site is that it is invisible to crawlers per route. The
build:

- **Per-route prerender** to real static HTML, each route carrying a **unique `<title>`, a
  unique `<meta name="description">` (the project's question), a self-referencing absolute
  `<link rel="canonical">`, and per-route Open Graph + Twitter `summary_large_image` tags**
  with a per-route OG image. (Today these are stale/shared across routes.)
- **JSON-LD structured data.** A `Person` node in the site head (homepage/About) with `name`,
  `alternateName` carrying BOTH "Emilie El Chidiac" and "Emilie Chidiac", `jobTitle`,
  `knowsAbout` (neuroarchitecture, computational design, behavior information modeling), and a
  full `sameAs` array (LinkedIn, GitHub, Spotify/podcast, Google Scholar if any). An `@id`-
  linked `Article`/`CreativeWork` per project and per thought, `author` referencing that
  Person — one entity graph across the site.
- **`sitemap.xml`** listing every public route, referenced from `robots.txt`, submitted in
  **Google Search Console** (verify the domain — essential and the fastest path to indexing
  under the name). Keep `robots.txt` from blocking JS/assets; keep the signed 404 a true 404.
- **Topical authority for the niche.** Keep every thought essay and project write-up as real
  crawlable on-site text (do not link out for the words). One definitive **"Behavior
  Information Modeling" definition/pillar surface** using the exact phrase in the `<title>`,
  `<h1>`, URL slug, first line, and `knowsAbout`; the thoughts and projects internally link to
  it and back. A coined term with near-zero volume is won by being its canonical source.
- **Image SEO.** Descriptive alt text on every meaningful image, 80-140 chars, context not
  just contents, 1-2 keywords naturally; decorative images get `alt=""`; descriptive filenames.
- **Analytics: GoatCounter, already live** (`gc.zgo.at/count.js`). Verify it counts SPA route
  changes (call `goatcounter.count()` on navigation), not just first load. No second tool.
- **The CV stays a PDF only.** The build-time single-column, text-layer A4 PDF from `cv.ts`
  already parses in every major modern ATS. Keep it single-column, standard headings, contact
  as plain body text (no header/footer block), no icon glyphs, real selectable text (not
  vector-outlined). Mirror each application's exact tool keywords at apply time. DOCX deferred
  until a real application demands it.

Name-ranking reality (uncommon name): page-1 for the name itself is realistic within days to
a few weeks of indexing + consistent profiles; name-plus-niche in ~2-4 months of consistent
on-site publishing. The levers, in order: entity consistency across LinkedIn/GitHub/Spotify
(same name string, same one-line title, same link cluster) → a clean name in `<title>`/`<h1>`
→ tier-1 backlinks where she is the subject (podcast/IAAC/speaker pages) → Search Console.

### D7 · Flag policy — sign per-session
New copy ships `draftCopy` / `showcaseDraft` until signed. Each build session signs ITS OWN
new copy in-session, visualised for Emilie before it locks: **S4 signs the new projects' copy
and the question lines; S5 signs the essays, the pillar copy, and the About-invitation revisit.**
`NOW` (`now.ts`) and the CV `FOCUS` line stay perpetually flagged by design — they move with
life. Honesty flags are binding facts, never "draft". The G4 sign-off already cleared the
existing spines/deks/notes; this policy governs everything NEW from here.

---

## 2 · The research basis (2026, cited; full reports on file this session)

- **Portfolio norms (EU design-technology, 2026):** 4-6 featured projects (target ~5),
  strongest-first and bookended; each ~one screen, outcome + role on top, then problem →
  approach → result, with links OUT; a live/deployed tool or a 2-3 min walkthrough is the
  single highest-leverage asset; name individual contribution on every team project; show one
  AI/agentic workflow openly and avoid a suspiciously over-polished all-AI-render look.
- **SEO for a name + niche, 2026:** `Person` JSON-LD + `sameAs` is the top lever (feeds the
  Knowledge Graph / entity disambiguation, not a visual rich card); `Article` per route can
  drive article results; entity consistency across profiles is the #1 name-ranking factor;
  keep long-form niche text on-site for topical authority; Search Console + sitemap essential;
  alt text 80-140 chars; GoatCounter/Plausible are privacy-friendly and consent-banner-free.
- **ATS, 2026:** >75% of firms screen; single-column + standard headings + real text layer +
  verbatim tool keywords is the safe format; columns/tables/headers-footers/icons/text-in-
  images are the parse killers; a clean text-PDF parses in every major modern ATS.

*One adaptation:* the research's "My role:" labelled-line convention is overridden by Emilie's
HONESTY rule — contribution is woven into prose, never a labelled line. The intent (state your
specific part on every team project) is kept; the form is woven sentences.

---

## 3 · Swept gaps (things we had not accounted for, now assigned)

| Gap | Where it lands |
|---|---|
| FLAG-03: the MaCAD award has no public anchor to link | S1 (wire the link + LinkedIn once Emilie posts the announcement) |
| LinkedIn alignment with the new site (name, title, featured links, entity consistency) | S1 |
| SOMA / Dynamic Solution NDA on professional imagery | S4 gate, before any professional asset ships |
| Sensi repo mirror (faculty permission) | S4, ask before mirroring |
| Image alt-text sweep across existing assets | S1 (quick pass) + S3 (per-route + new work) |
| GoatCounter SPA route-change counting | S3 verification |
| The About-invitation text-revisit (interim draft since the Contact Sheet session) | S5 |
| Bucketing inclusion (confirm it ships with Narkomfin + Urban Risk) | S4 |
| Mini-exploration assets + the podcast script | Emilie provides before S4/S5 touch them |
| Per-route OG images (one per project/thought) | S3 |

---

## 4 · The four kickoff prompts (paste one into a fresh Claude Code session)

Each is self-contained: the decisions baked in, the skills/connectors/flags named, the binding
restated, and the ending contract. Run one at a time; each ends by handing Emilie a commit
summary to paste (no session runs git writes).

### THE BINDING BLOCK (each prompt restates this)

> BINDING (non-negotiable): HONESTY — attribution woven as ordinary sentences, never labelled
> lines or percentages (Sensi = "project lead, team credited, team of four"; Marsception
> credits Charles Abi Chahine); neuro verbs score/estimate/model, never measure; no clinical
> claims; lEgoarCh's "93% supported" is an instructive failure; Lungs "designed to filter";
> ML work in team-context framing. PRIVACY — no public job-search signals anywhere;
> `content/RECRUITER-CALIBRATION.md` is LOCAL, git-ignored: read from disk, never commit/
> quote/paraphrase it. ECONOMY — `registry.ts` + the per-project master files are the single
> source; card, showcase, book spread, CV line are renditions; appends only; CI snapshot +
> validator stay green. FLOORS — a11y + honest reduced-motion; Emilie's voice; NO em dashes;
> new copy ships draftCopy until she signs it. LOCKED COPY — the hero question and the
> "Behavior Information Modeling" spine are content; challenge only as a flagged
> recommendation. PROCESS — visualise the page's locked decisions in chat for Emilie's
> confirmation BEFORE building. PREVIEW-VERIFY — console clean, mobile 390px, both modes,
> reduced motion. ENDING CONTRACT — run NO git write commands; end with (1) a proposed commit
> summary to paste, (2) the changed/created file list, (3) everything needing her sign-off.

---

### S1 · QUICK WINS

```
You are a senior SEO-literate information architect + brand strategist. This is S1, the
QUICK-WINS session: small, high-value, low-risk changes to the LIVE site
(https://emiliechidiac.com) that need no architectural rework. Nothing here waits on the S3
prerender.

READ FIRST: CONTENT-STRATEGY.md (the rules of record, especially D6 + the swept-gaps table)
and content/RECRUITER-CALIBRATION.md (local, git-ignored; positioning ground truth, never
commit or quote it). Walk the live site in both modes.

DO, each verified in the browser:
1. Per-route <head> hygiene that CAN ship client-side today: a unique <meta name="description">
   per route (not the stale landing value), a self-referencing absolute <link rel="canonical">
   per route, and a correct per-route og:url. (The full per-route prerender is S3; this is the
   client-side stopgap so shared links are less wrong meanwhile.)
2. robots.txt: keep it from blocking JS/assets; add a Sitemap: reference line (the sitemap
   file itself is generated in S3, but wire the reference and confirm the path).
3. Google Search Console: give Emilie the exact verification steps (DNS TXT or the HTML-file
   method for GitHub Pages) and what to submit. She performs the account actions; you prepare
   everything.
4. GoatCounter: confirm it counts SPA route changes (goatcounter.count() on navigation), not
   just first load; if it only counts first load, wire route-change counting.
5. Image alt-text sweep: descriptive alt on every meaningful image (80-140 chars, context not
   just contents, 1-2 natural keywords), alt="" on decorative ones. Fix the worst offenders.
6. FLAG-03: the MaCAD award needs a public anchor. Draft (in Emilie's voice, draftCopy) the
   award announcement she can post, and prepare the site + LinkedIn to link to it the moment
   it exists. Wire the award line's anchor hook (registry refId is already the single source).
7. LinkedIn alignment (prepare, Emilie executes): a checklist to make her LinkedIn name,
   headline, and featured links match the site for entity consistency (same name string, same
   one-line title, same link cluster). No public open-to badge on the site; the recruiters-
   only setting is hers alone. Do NOT put any job-search signal on the site.

SKILLS: design:accessibility-review (the alt-text + a11y pass). Connectors: none required.
Preview tools: walk the live site as evidence.

[PASTE THE BINDING BLOCK HERE]
```

---

### S3 · SEARCHABILITY

```
You are an SEO-literate information architect + build engineer. This is S3, the SEARCHABILITY
session: build the per-route prerender + structured-data + sitemap layer so the site returns
real content per route to crawlers and link-unfurlers and can rank for Emilie's name and niche.
This is REDESIGN-SPEC R9, now scoped by CONTENT-STRATEGY D6.

READ FIRST: CONTENT-STRATEGY.md (D6 in full, the research basis, the swept-gaps table),
REDESIGN-SPEC.md §11 (per-route prerender + the master-file renditions) and §16 R9, and the
existing build scripts (scripts/render-pdfs.mjs shows the headless-Chrome machinery already in
the repo). content/RECRUITER-CALIBRATION.md is local; read for positioning, never commit/quote.

DESIGN THE PLAN FIRST with engineering:system-design (or engineering:architecture as an ADR):
per-route prerender reuses the book/CV headless-render investment. Then VISUALISE the head/
schema plan for Emilie before building.

BUILD:
1. Per-route prerender to real static HTML at build time. Each route emits a unique <title>,
   a unique <meta name="description"> (the project's QUESTION from D4), a self-referencing
   absolute canonical, and per-route Open Graph + Twitter summary_large_image tags with a
   per-route OG image (one per project/thought; reuse the OG machinery).
2. JSON-LD: a Person node (name; alternateName carrying BOTH "Emilie El Chidiac" and "Emilie
   Chidiac"; jobTitle; knowsAbout = neuroarchitecture, computational design, behavior
   information modeling; a full sameAs array = LinkedIn, GitHub, Spotify podcast, Scholar if
   any) in the site head; an @id-linked Article/CreativeWork per project and per thought with
   author referencing that Person. One entity graph. Single-sourced from the registry/master
   files (economy rule); add a validator clause so every route emits its schema.
3. sitemap.xml listing every public route, referenced from robots.txt. Keep the signed 404 a
   real 404 (not a soft-404 serving SPA content).
4. The "Behavior Information Modeling" pillar surface: one definitive on-site definition using
   the exact phrase in title/h1/slug/first-line/knowsAbout; thoughts + projects link to it and
   back (topical authority). Keep all niche long-form text ON the site, crawlable.
5. Verify GoatCounter counts SPA route changes.

FLAGS: honesty/economy bind the schema (no invented claims; single source; appends-only). Any
new visible copy ships draftCopy. The CV stays a plain single-column text-layer PDF (do not
touch its ATS-safe shape).

SKILLS: engineering:system-design or engineering:architecture (the plan/ADR); the pdf skill
only if the OG/print pipeline needs it. Connectors: none required. Preview tools: verify the
prerendered HTML (view source per route), console, both modes, mobile; check the OG cards
render.

[PASTE THE BINDING BLOCK HERE]
```

---

### S4 · WORK REWORK

```
You are a portfolio + design-technology strategist and front-end builder. This is S4, the WORK
REWORK session: rebuild how projects present, add the missing work, and frame each around its
question. This is the primary content build.

READ FIRST: CONTENT-STRATEGY.md (D1-D5 + D7 + the swept-gaps table), REDESIGN-SPEC.md §4-5 +
§10-11 (the gallery, the adaptive showcase, the book one-pager, the master-file renditions),
site/src/content/projects/ (the master files + types.ts) and site/src/components/work/
(WorkCard, WorkOverlay, Lightbox), and content/blog-catalog.json (the source of truth for the
new projects' facts, credits, tech, and assets). content/RECRUITER-CALIBRATION.md is local;
read for the claims ceilings + MYPART lines + keyword targets, never commit/quote it.

VISUALISE FIRST, then build, in this order:

1. THE SHOWCASE = THE BOOK ONE-PAGER (D3). Redesign the opened card to the A4-landscape
   one-pager layout, "everything at a glance": dominant asset + title + the one-line QUESTION/
   claim + the woven credit sentence + the mono tools strip + the award recognition line + the
   links out, as one readable spread. DROP the "THE STORY" toggle: the spine (WHAT · WHY · HOW
   · WHAT CAME OF IT) reads straight down, outcome + role visible immediately. Add a
   flip-through asset gallery (page through images/video in place; keep the Lightbox for full
   size). Card + showcase + book spread stay ONE layout logic off the one master file.

2. THE FEATURED TIER (D2). /work gains hierarchy: the six heroes (Sensi, NeuroSpace, lEgoarCh,
   The Lungs, The Huddle, Optimizing for the Mind) lead at full size, strongest three first
   (Sensi, NeuroSpace, lEgoarCh); the current supporting projects follow; explorations
   (including the new mini-explorations) read lighter. The mind graph + neural world still show
   EVERYTHING; hierarchy is a /work reading-order idea only.

3. ADD the hidden work as new master files + registry entries (appends only; validator green):
   Narkomfin (Graph ML), Urban Risk (ML pipeline), Speckle Bucketing, and the three extras
   (Data-Geometry, Tsukiji, Pelagñou). Facts/credits/tech/assets from blog-catalog.json. ML
   work in TEAM-CONTEXT framing; Bucketing may carry its clean efficiency claim (25-30 min to
   under 3). Then the mini-explorations (math surface, Kangaroo inflated playground,
   chair-design simulation) as light exploration entries when Emilie provides assets.
   DEFER professional computational-workflow projects; do NOT ship SOMA/Dynamic imagery until
   the NDA is cleared (ask Emilie).

4. ONE QUESTION PER PROJECT (D4). Author each project's plain-language question (in Emilie's
   voice); it becomes the on-screen claim AND the meta-description seed. Ships draftCopy.

5. THE FLUFF BAR (D5) on every line. Honest woven credits; NO labelled "my role" lines.

COPY SIGN-OFF (D7): sign the new projects' copy + question lines with Emilie IN THIS SESSION,
visualised before it locks. Ask about the Sensi repo mirror (faculty permission) if it comes up.

SKILLS: design:design-critique (the showcase/one-pager direction), design:ux-copy (the
questions + deks + woven credits), the pdf skill (the book one-pager reference). Connectors:
GitHub (optional) to pull the new projects' READMEs/assets straight from her repos, if Emilie
authorizes it via /mcp in this session; otherwise blog-catalog.json + incoming/ suffice.
Preview tools: verify /work + a rebuilt showcase; console, mobile, both modes, reduced motion,
keyboard, tap.

[PASTE THE BINDING BLOCK HERE]
```

---

### S5 · CONTENT

```
You are a portfolio content strategist + UX writer. This is S5, the CONTENT session: the words.
The thoughts/essays, the pillar copy, the About-invitation revisit, and a whole-site fluff pass.

READ FIRST: CONTENT-STRATEGY.md (D4 the questions, D5 the fluff bar, D6 the pillar + topical
authority, D7 sign per-session), site/src/thoughts/ (the reading room + notes + openings.ts),
the About page, and content/blog-catalog.json (facts). content/RECRUITER-CALIBRATION.md is
local; read for the voice ceilings + claims grades, never commit/quote it.

VISUALISE the copy in batches for Emilie, then lock what she signs:

1. THE THOUGHTS / ESSAYS: keep them real, crawlable, on-site long-form text (topical authority,
   D6). Each carries its niche terms in natural prose; internally link the neuro/comfort/BIM
   thoughts to the "Behavior Information Modeling" pillar surface and back.
2. THE PILLAR COPY: the definitive on-site "Behavior Information Modeling" definition (what it
   is, why she coined it, one gesture to proof) using the exact phrase; sits next to the
   podcast + NeuroSpace as evidence. (The pillar's technical wiring is S3; its WORDS are here.)
3. THE ABOUT INVITATION revisit: the interim draft since the Contact Sheet session gets its
   proper pass, in Emilie's voice, an invitation with no job-search status (privacy). Complete
   the landing's "what's in yours?" callback. Sign it in-session.
4. THE FLUFF PASS: run D5 across every visible line touched this session; cut evidence-free
   adjectives, title-restating, mission statements. Honest woven credits everywhere.

Where any claim needs a fresh external source, use the deep-research skill to verify before
writing it; never invent a number or a clinical claim (verbs stay score/estimate/model).

COPY SIGN-OFF (D7): sign each batch with Emilie in-session; visualise before locking. NOW +
CV FOCUS stay flagged by design.

SKILLS: design:ux-copy (the writing + microcopy), deep-research (only where a claim needs a
citation). Connectors: none required. Preview tools: verify the thoughts + About + pillar read
correctly; console, mobile, both modes.

[PASTE THE BINDING BLOCK HERE]
```

---

## 5 · Sequencing note

Recruiter-and-findability value first: **S1 (quick wins) → S3 (searchability) → S4 (work
rework) → S5 (content)** is the default order, but S1 and S4 are independent and can swap if
Emilie would rather rebuild the work before the SEO plumbing. S3 (prerender) is the one
architectural piece the OG/JSON-LD/sitemap wins all hang off. Each session is one sitting and
ends by handing Emilie a commit summary to paste.
