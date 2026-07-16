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

> **Runnable session prompts are NOT stored in this file (Emilie's call, 2026-07-13).** This
> doc holds the GROUND TRUTH each session executes (§0 binding, §1 the seven decisions, §3
> swept gaps, §4 per-session scope). The self-contained kickoff prompts are engineered per
> session by the director and handed one at a time, so each reflects the latest state.

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

**Amendment (2026-07-16, S1): the featured-larger tier retired from the /work render.** Emilie
chose to make /work literally the printed book's INDEX — one UNIFORM tile grid, no size
hierarchy. The strongest-first ORDER and the eager-load survive (the award-and-live-app core still
leads, top-left), but the featured tiles are no longer larger; /work and the book index now share
one layout logic (`registry.thoughtIndexEntries()` + a `ThoughtIndexRows` component, screen +
print skins). THE THOUGHTS list closes the /work page (the reading-room list moved here; /thoughts
is the neural world only). The mind graph and the neural world still show everything.

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

**Amendment (2026-07-14, Finalize the Work Room): EXECUTED for all 15.** The parked
candidates went live as `question` in every master (one wording tune: lEgoarCh
"provably" → "actually" per the claim ceiling), each now the on-screen claim + the
route's meta description + the OG line. All 15 ship DRAFT pending Emilie's sign-off.

**Amendment (2026-07-13, S4a): the questions get their OWN discovery session.** In S4a Emilie
deferred the on-screen question. Drafting the candidates made clear the real work is *choosing*
the question a normal person would actually ask, which needs a collaborative pass: read each
project's blog, map the SET of questions it answers, quiz her, then pick the human one. So the
per-project candidates are PARKED as comments in the master files and the signed dek serves on
screen and as the `<meta name="description">` meanwhile (the head already prefers `question`
whenever one exists, so nothing regresses). One dedicated QUESTION-DISCOVERY session authors and
signs the questions for ALL projects at once, best run after S4b so the five new projects are in.

### D5 · The fluff bar (the minimal-words rule)
Every sentence must do at least one of: (a) state what / why / how / what-came-of-it, (b)
credit honestly, or (c) carry a real keyword in natural prose. If a sentence does none of
those, cut it. Specifically fluff, cut on sight: evidence-free adjectives ("innovative",
"cutting-edge", "passionate"), sentences that restate the title, generic mission statements,
and anything reproducing method or code that already lives in the repo/blog. The bar is
"portfolio, not a blog": tight, concrete, voiced.

**Amendment (2026-07-14): the fluff bar also cuts VISUAL fluff.** Emilie extended the minimal
rule to the visual layer: calm still covers (motion only on hover or inside the opened plate,
never an autoplaying grid tile), a tighter index-like grid, no decorative motion. Same test,
applied to pixels: if an element does not help a reviewer read the work faster, cut it or quiet it.

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

## 4 · Per-session scope (the ground truth each session executes)

The runnable kickoff prompts are engineered per session by the director and handed one at a
time; this section is the scope each one covers.

- **S1 · QUICK WINS** — low-risk, no-rework changes to the live site. Executes the
  ship-today slice of **D6** + swept gaps: client-side per-route `<head>` stopgap (unique
  description / canonical / og:url until S3's real prerender lands), `robots.txt` sitemap
  reference, Google Search Console prep (Emilie performs the account actions), GoatCounter
  SPA-count check, an image alt-text pass on the worst offenders, the **FLAG-03** award anchor
  + a draftCopy announcement to post, and the **LinkedIn alignment** checklist (she executes).
  No job-search signal on the site.
- **S3 · SEARCHABILITY** — the architectural SEO build (REDESIGN-SPEC R9). Executes **D6** in
  full: per-route prerender to real HTML (unique title / description = the project question /
  canonical / OG per route + a per-route OG image), `Person` + per-route `Article`/
  `CreativeWork` JSON-LD as one entity graph (with `sameAs`), `sitemap.xml` + `robots.txt`,
  the "Behavior Information Modeling" pillar surface wiring, and the GoatCounter verify. CV
  stays a plain text-layer PDF. Single-sourced from the registry/master files; validator clause
  per route.
- **S4 · WORK REWORK** — the primary content build. Executes **D1, D2, D3, D4, D5, D7**: the
  showcase = the book one-pager (drop the STORY toggle; spine straight down; flip-through
  gallery; card + showcase + book spread one layout logic); the featured tier + hierarchy on
  `/work`; ADD the hidden work (Narkomfin, Urban Risk, Speckle Bucketing, Data-Geometry,
  Tsukiji, Pelagñou) + the mini-explorations, from `blog-catalog.json`, in team-context
  framing, appends only; one question per project; the fluff bar; sign the new copy +
  questions in-session. Gated by the **NDA** answer (no SOMA/Dynamic imagery until cleared),
  the **Sensi mirror** permission, the **Bucketing** confirm, and the mini-exploration assets.
- **S5 · CONTENT** — the words. Executes **D4, D5, D6 (words), D7**: keep the thoughts/essays
  as real crawlable on-site long-form (topical authority), write the "Behavior Information
  Modeling" pillar copy, revisit the About invitation, and run a whole-site fluff pass; sign
  each batch in-session. `NOW` + CV `FOCUS` stay flagged by design.

---

## 5 · Sequencing note

**S1 (quick wins) → S3 (searchability) → S4 (work rework) → S5 (content).** Do NOT swap S4
ahead of S3: S3 is the only ungated session (S4 waits on the NDA + repo permission, S5 on the
mini-exploration assets + podcast script), it serves the top goal (rank for the name), and SEO
compounds with time — so run it early while the gated inputs are gathered. S4 before S5 stays
right: rebuild the container, then pour the final content into it. Each session is one sitting
and ends by handing Emilie a commit summary to paste; no session runs git writes.

**Amendment (2026-07-13): S4 SPLIT + a questions session inserted.** The work rework proved too
big to sign off well in one sitting, so S4 split into **S4a · The Work Room** (DONE 2026-07-13:
the book-plate showcase, the featured tier, the three UI wins) and **S4b · The Five** (the five
new blog projects). Emilie also deferred the per-project questions (D4 amendment above) to a
dedicated **question-discovery** session. Live order now: **S1 ✓ → S3 ✓ → S4a ✓ → S4b →
THE QUESTIONS (all projects) → S5.** The reasoning is unchanged (build the container, then fill
it; one bounded sign-off per sitting). S4b's gates before it runs: the image-ingestion path for
the five (their public IAAC blog images) and Emilie's exact role on the three with no calibration
ceiling yet (Data-Geometry, Tsukiji, Pelagñou).

**Amendment (2026-07-14): S4b shipped as THE FOUR; questions + galleries fused into FINALIZE THE
WORK ROOM; CV/LinkedIn split into Phase 2.** S4b added four (Narkomfin, Urban Risk, Data into
Geometry, Tsukiji), all signed with SHARED team credit (Urban Risk reads as machine learning;
Emilie declined the recorded individual slice and chose shared, knowingly); Pelagñou was pulled at
her gate as a reading of someone else's essay and parked as a THOUGHT candidate. At the post-S4b
review Emilie set a NORTH STAR — finalize + simplify the website first, THEN optimise the CV +
LinkedIn — and flagged the work page's visual fluff (a lone animated cover reads as distracting; a
tighter, book-like index; still-at-rest with motion only on hover). So the questions and the full
gallery refresh (all 15 projects; 186 blog images already staged in `incoming/`) fuse with that
visual pass into ONE **Finalize the Work Room** session: global cover/grid/visual-fluff gates
first, then per-project gallery + question (reading each blog once); may run two sittings.
CV/LinkedIn leave the website track into a **Phase 2** after S5. Live order: **S1 ✓ → S3 ✓ →
S4a ✓ → S4b ✓ → FINALIZE THE WORK ROOM → S5 (words) → Phase 2 (CV + LinkedIn).**
