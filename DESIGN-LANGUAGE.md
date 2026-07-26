# DESIGN-LANGUAGE.md · the visual language of record (v2)

**Status: LOCKED by Emilie, 2026-07-09 (visualised + confirmed in chat).** This
is the forward visual language for the eec-portfolio. It is a **new skin on the
same soul**: the concept from REDESIGN-SPEC.md (the mind graph, the notebook, the
research-lab framing, the "Behavior Information Modeling" spine) is unchanged;
what changes is the *shape and surface* of the UI. It supersedes the Pen Table
skin (angular drawing-set: hard corners, heavy hairlines, mono-everything) for
all NEW and re-skinned surfaces. Anything Pen Table that this file does not carry
forward is retired on the surfaces it touches.

This file is DESIGN ONLY. It does not itself rebuild any page; each page is
re-skinned to this language in its own focused session (see §9).

> **AMENDMENTS (Emilie, 2026-07-10, DL-0 session; each visualised + confirmed
> in chat, never a silent rewrite):**
> 1. **CV mode (supersedes the §2 "CV pins LIGHT" pin):** the CV FOLLOWS the
>    mode on screen, so there is no light island between dark pages. Light is
>    pinned only where it leaves the screen: `@media print` and the PDF
>    artifact (ATS reads the PDF, not the site).
> 2. **/work soft pin (settles the §2 ambiguity):** /work opens DARK for
>    everyone, continuity with the landing, and goes light only when the
>    visitor EXPLICITLY toggles light. The OS setting alone does not release
>    it (`.lang-lean-dark` in language.css; applied at DL-2).
> 3. **Header (pulled forward from DL-1):** one floating glass pill above
>    every interior page: the EEC mark (routes home), the four doors, a
>    hairline divider, the round 44px ModeToggle. The drawing-set title block
>    (logo cell + name cell + rules + draw-in ceremony) retires; name and role
>    leave the chrome (the landing carries identity).
> 4. **Card face (refines §5):** the card is a SQUARE, `--r-card` fillet; the
>    image fills the top ~80% edge to edge; the bottom band holds name + lens
>    pill + up to TWO tags; the award pill rides the image corner. (The §5
>    "inset `--r-image` image" reading is superseded.)
>
> **AMENDMENTS (Emilie, 2026-07-10, DL-1 session; visualised + confirmed in
> chat):**
>
> 5. **One mode, whole site, EXECUTED (supersedes amendment 2):** the §2
>    one-mode amendment is now built. The landing's dark pin, the interior
>    shells' temporary light shim, and the `/work` soft pin (amendment 2,
>    `.lang-lean-dark`) are all retired; `/work` simply follows the mode like
>    everything else. PRINT/PDF stays the only pin. Until each page re-skins
>    (DL-2..5) the Pen Table light tokens are mode-aware (the `light-dark()`
>    bridge in `site/src/index.css` @theme): dark mode shows "the pen table at
>    night" (mylar to carbon, ink to ink-dark, anno to anno-dark, redline to
>    wire, lens pens to wires). The mind-graph landing renders in both grounds
>    (dark: light ink on carbon; light: dark ink on cool white; lens accents
>    wire on dark, darker pen on light).
> 6. **Page transitions EXECUTED + the morph naming convention (implements
>    the §3 amendment):** every navigation and the mode flip run the soft
>    ~250ms crossfade on `--ease-soft`; shared-element morphs use
>    `view-transition-name: page-<route-slug>` (the destination route with
>    slashes as hyphens: `page-work-sensi`, `page-sheets-p-101`,
>    `page-thoughts-bim`). The routed page's hero carries its own name; a
>    source face (WORK card, the active mind-graph node) adopts it. At most
>    ONE element per name per rendered state (a duplicate aborts the whole
>    transition). Helper + docs: `site/src/lib/viewTransition.ts`; DL-2+
>    re-skins attach their morphs by carrying the same names. Reduced motion:
>    every transition is an instant swap. The Pen Table carbon-flood ceremony
>    ("the light table switches off") retired with one mode: home navigations
>    ride the same crossfade.
>
> **AMENDMENT (Emilie, 2026-07-11, the Neural Studio session; decided over
> live animated prototypes; the concept ruling lives in REDESIGN-SPEC §6):**
>
> 7. **The NEURAL vocabulary (for the /thoughts WORLD; the landing is
>    unchanged for now, and any landing adoption is /llm-council-gated).**
>    Nodes may be drawn as ANATOMICAL NEURONS: a soma keeping the
>    established mark grammar (filled dot = project [+ lens nucleus],
>    hollow ring = thought, star = award, plain commit dot = milestone),
>    with organic branching dendrites. A CONNECTION is TENSION + TOUCH: two
>    reaches wander from their somas, meet at a synapse bud, and FIRE (a
>    travelling pulse in the later piece's lens colour). Connection threads
>    are anatomical too (wander, taper, twigs): the surface reads as ONE
>    drawing. The career commit graph may ride beneath as the SKELETON in
>    its shipped design language (straight runs, clean S-curve
>    forks/merges, open ring tips, the one red LIVE tip): **the ruler is
>    geometric and faint, the nerve is organic and bright; the contrast is
>    the design; the mind owns all motion** (the skeleton never animates
>    except the live tip's slow beat). Motion set: dendrite GROWTH
>    (one-shot draw-in, chronological), synapse FIRE (hover/tap + the
>    growth replay), idle DRIFT (slow sway, rare spontaneous fire;
>    PRM-gated). Reduced motion renders the complete grown, connected,
>    labelled still. Red stays liveness only; lens colour enters through
>    nuclei and synapse buds; every neuron is a labelled reachable link
>    with a 44px+ target.
>
> **AMENDMENT (Emilie, 2026-07-11, the meta build; every gate signed live;
> the concept record lives in REDESIGN-SPEC §6):**
>
> 8. **The PROXIMITY REVEAL (built; the /thoughts world's motion law).**
>    At REST the world is quiet points in time: somas + labels at 62% ink
>    (the 55% dial fails AA on the light ground; the a11y floor binds:
>    62% = 4.9:1 light / 6.4:1 dark, flagged for Emilie), the faint ruler
>    beneath, NO fibres drawn. Attention is the only
>    grower: neurons within the wake radius build (dendrites out of the
>    soma, correlations to the synapse, which pops and fires once) and
>    settle when it leaves. The signed feel: radius 180 canvas units ·
>    build 1400ms · decay 3000ms · REACH OUT (a waking neuron's threads
>    build to their far ends; the far label brightens and names the
>    correlation). One anatomy: a connection fibre is a dendrite that found
>    a partner (same widths, same twigs); a tie's strength 1..3 grows that
>    many fibres from each end (the braid), and the synapse bud grows with
>    the bond. On touch: tap-to-wake parks attention, a pan's grabbed spot
>    glows in the hand, armed-tap opens. The chronological WATCH IT GROW
>    replay is the one theatrical moment, opt-in. Reduced motion: the
>    engine never runs; the world renders as the fully-grown, connected,
>    labelled still. Amendment 7's "growth (one-shot draw-in,
>    chronological)" reads through this: growth is attention-driven now;
>    the chronological sweep lives in the replay.
>
> **AMENDMENT (Emilie, 2026-07-12, G4 the final sweep; decided over the
> findings board + sign-off ledger):**
>
> 9. **One room-sign grammar + the cover's control tier (G4).** Every
>    interior room opens kicker › h1: a mono 10px uppercase room sign
>    (`X · THE Y`) above a plain or voiced h1. Signed set: WORK · THE
>    PROOF, THOUGHTS · ONE WORLD · EVERYTHING, IN TIME (the world),
>    THOUGHTS · THE WRITING (the reading room), CV · THE RECORD (screen
>    only, never prints), ABOUT · THE PERSON, 404 · NOT A PAGE. The About
>    pivot h1 retired (plain "About"). The LANDING keeps its identity
>    chrome (no pill header; the hero carries the name) but gains the same
>    44px ModeToggle every room carries, seated in the jump-pill row; the
>    jump bar itself is 44px. The warm 404 is a room like any other.
>    Floors clarified at G4: text that renders at rest holds at least the
>    62% rest ink (the world's date labels ride the same rest as titles;
>    hierarchy comes from size, never sub-AA ink); "faint" ink is reserved
>    for non-text decoration. The CV consumes `--lang-*` tokens like every
>    surface (the Pen Table utility classes left their last live page).
>
> **AMENDMENT (Emilie, 2026-07-12, the contact-sheet session; five gates
> decided over in-chat mockups; the concept record lives in REDESIGN-SPEC):**
>
> 10. **About = THE CONTACT SHEET + the NODE CURSOR (§4.6).** About re-skins
>     from the G3 two-column story page to ONE SCREEN, NO SCROLL: an open-air
>     column centred on BOTH axes (fits every viewport >= ~634px tall), room
>     sign › a VOICED h1 ("Say hi", signed; the one room whose h1 is not the
>     room's name, so sign and title never repeat) with the constellation
>     cube beside it › the signed short bio › the callback + invitation. On
>     roomy viewports the sheet steps up one size via the `tall:` variant
>     (index.css: min-height 760px AND min-width 1024px — height protects
>     short laptops, width protects phones): 17px›19px prose, 3xl›4xl h1,
>     64px›88px cube, 62ch›66ch measure. The page carries NO pill row and no glass of its
>     own: **the FOOTER is the contact row** (name lockup + the three pills
>     as the sheet's signature line; `footerCompact` on SheetPage/Footer
>     pulls it close). The headshot, the NOW module and the CV pointer leave
>     the page (now.ts renders only as the registry/CV live tip). And the
>     site gains its one pointer ceremony: the sitewide node cursor, §4.6.

>
> **AMENDMENTS (Emilie, 2026-07-18, WORK PAGE · LOOK & ORDER; the owed
> entries, written at S5; the concept record lives in REDESIGN-SPEC §13):**
>
> 10.5. **THE PLATES (the /work resting faces).** Every work tile RESTS as a
>     hand-designed signed INK ARTIFACT (`site/src/components/work/
>     artifacts.tsx`, one SVG parti per project in the Pen Table stroke
>     grammar, one lens-pen accent via `--plate-accent`); hover/focus reveals
>     the real cover (gif covers flip through the assets), reduced motion
>     rests calm with an instant swap. Plates render everywhere, mobile
>     included. This supersedes the §5 image-forward Card reading ON /WORK
>     ONLY (the card face elsewhere is unchanged): the grid coheres as
>     calm-ink-at-rest, life-on-interaction — the site's soul made literal.
>     The plates are SCREEN-ONLY: the printed book and the OG cards keep the
>     true covers (screen and print share DATA, not faces).
> 10.6. **THE FULL-WIDTH ONE-PAGE /WORK GRID.** /work leaves the centred
>     column: `SheetPage wide` (cap 1920px), a plain-CSS `.work-grid`
>     stepping to the printed index's exact 7-across geometry at >=1400px
>     (21 tiles = 3 rows; Tailwind arbitrary `min-[...]` variants do not
>     generate in this repo, custom breakpoints use plain media queries),
>     THE THOUGHTS closing the page in columns (xl = 4 since the thoughts
>     grew to 13), the opening reveal floating on a glass slip so hover
>     never grows the page, and the Footer's `wide` prop aligning its card
>     with the grid. The promise: zero vertical scroll at >=1280×800.
> 10.7. **THE WORK HEADER BAR (`SheetPage headerBar` slot).** On lg+ /work
>     collapses its header stack into ONE full-width sticky glass-2 bar
>     (`components/work/WorkHeaderBar.tsx`): nav + room sign (the page's
>     real h1) + filters + ✦ legend + book link + ModeToggle, one row wide
>     (~58px at >=1500px), two when narrow; below lg the floating pill +
>     stacked header return. The slot is opt-in per page; every other page
>     keeps the floating pill. Only one h1 ever enters the a11y tree.
>
> **AMENDMENTS (Emilie, 2026-07-18, S5 the words session):**
>
> 11. **THE SKETCH DOT (the one figure mechanism in thought notes).** The
>     G2 "words on the ground, no figures" rule holds AT REST; a note may
>     carry an NB-grammar dot that blooms a FRAMELESS drawing floating in
>     the margin on hover/focus/tap (`site/src/thoughts/SketchDot.tsx`):
>     charcoal lifted off its scanned paper by `mix-blend-mode: multiply`
>     on the light ground, `invert(1)` + `screen` on carbon (the chalk
>     version; explicit mode blocks, the §4.6 cursor pattern). One drawing
>     floats at a time; narrow viewports step it into the flow, centred;
>     interaction grammar is NB's verbatim (44px, pin, Escape, outside-tap,
>     PRM instant). First user: T-111 "connecting the dots".
> 12. **The pillar page carries NO room sign** (Emilie: "fluff"): the one
>     recorded exception to amendment 9's kicker › h1 grammar. The pillar
>     is not a nav room; its lowercase serif h1 IS the sign, and the
>     endmatter's THE SPINE label keeps the identity. Every nav room keeps
>     its kicker.
> 13. **Hero ink tokens.** The landing hero's two special inks are tokens
>     now: `--lang-hero-muted` (the adjective line; dark value deliberately
>     brighter than ink-muted for the scrim floor) and `--lang-hand-warm`
>     (the handwritten voice line). No raw hex in components; the lens-pen
>     definitions in `ui/Pill.tsx` remain their canonical source.
>
> **AMENDMENTS (Emilie, 2026-07-19/20, THE DESIGN AUDIT + REDESIGN; every
> ruling decided over live builds on her screen, three review rounds; the
> audit board + fork picks recorded in chat):**
>
> 14. **The sign lines RETIRED (supersedes amendment 9).** The room-sign
>     kicker tier (`WORK · THE PROOF`, `CV · THE RECORD`, `ABOUT · THE
>     PERSON`, `THOUGHTS · ONE WORLD…`, `404 · NOT A PAGE`) is gone
>     sitewide: the nav says where you are, the title says it once, a third
>     repetition is scaffolding. The pillar's amendment-12 exception is now
>     the rule. ONE survivor: the 404 keeps a bare mono `404` because the
>     status number is real information its voiced h1 lacks.
> 15. **THE FROZEN FRAME (SheetPage rebuilt).** Every interior page is
>     exactly one viewport tall: a frozen HEADER LINE, a middle CONTENT band
>     that scrolls on an INVISIBLE wheel when it overflows (`.no-scrollbar`)
>     and centres when it fits, and a frozen FOOTER LINE. The header and
>     footer never move, on any page, at any scroll. Pages opt out of the
>     footer where it would repeat their content (/cv, /about); the world
>     (/thoughts) insets its canvas between the two lines (`.nw-stage`
>     top/bottom insets; its fade scrims retired, nothing hides under
>     chrome).
> 16. **ONE PILL, ANCHORED LEFT + TOOLS ON THE HEADER LINE (supersedes
>     amendments 3's centering and 10.7's headerBar; the bar and every
>     variant retired).** The nav pill is pixel-identical on every page
>     (mark · four doors · divider · ModeToggle), anchored LEFT so it never
>     jumps between rooms. A page's own tools ride the SAME header line to
>     the right, bare on the ground, never inside the pill and never a
>     second bar: /work = lens filters + the book chip (the ✦ RECOGNITION
>     legend retired, self-explanatory); /cv = reach-me links + the CV
>     chip; a thought leaf = its meta + its three controls. Below lg, /work
>     falls back to its stacked tools; pages whose tools must survive
>     mobile keep them on the line.
> 17. **THE MAGNIFIER (the site's pointer ceremony on controls).** The
>     "you are here" cue is a LIQUID-GLASS LENS (`.nav-lens`): it rests on
>     the current door, SLIDES to whatever the pointer or keyboard focus is
>     over (the home mark included) gently magnifying it, then returns.
>     Clicking rides the universal crossfade. The mechanism is reusable
>     (`ui/LensGroup.tsx` + `.lens-pop`): one lens grammar now also rides
>     the footer contact row, the About link cluster (it slides across
>     rows), and the landing's door row. It does NOT ride selection
>     controls (the /work filters keep solid-ink = selected; the thought
>     controls keep their icon+colour) so "pointing" and "selected" never
>     blur. Reduced motion: instant placement, no slide, no magnify; the
>     bold ink label always carries the state without motion.
> 18. **The FOOTER = a frozen wide pill.** Near-full-width with a breath of
>     margin, the same stadium as the header pill (never edge-to-edge
>     full-bleed), one height everywhere it appears: name lockup + role
>     left, the contact pills right (with the lens). /cv and /about drop it
>     (their contact lives elsewhere); the world's footer line carries its
>     legend + drag hint instead of the lockup.
> 19. **ONE DOWNLOAD AFFORDANCE (`ui/DownloadChip.tsx`).** Every download
>     sitewide is the same chip: hairline pill + tray-arrow icon, mono
>     label, ink at rest, interaction hue on hover/focus, 44px floor. The
>     red-underline book link and the bordered CV button both retired into
>     it.
> 20. **THE CV = the landscape record (screen only; the PDF unchanged).**
>     /cv is full-width, THREE columns, no scrolling system: Education +
>     Certificates | Experience | Awards + Skills. Section titles carry an
>     icon + an accessible accent colour each (mode-aware light-dark pairs,
>     all AA on both grounds; red stays interaction-only). Name + locked
>     role line lead the content; the reach-me links + DownloadChip ride
>     the header line; the FOCUS phrase left the screen (it survives in the
>     ATS PDF, which stays the plain portrait single column). No footer.
> 21. **ABOUT = the landscape contact split.** One centred sheet, split:
>     LEFT the person (cube + "Say hi" + the short script), a hairline
>     divider, RIGHT the contact (the signed callback + ALL the links:
>     three socials + both DownloadChips, under one lens). No footer. The
>     script from her 2026-07-19 brief ships draftCopy until signed.
> 22. **THE THOUGHT LEAF inside the frame.** The header line carries the
>     thought's meta (kind · date · lens · number) AND its three controls,
>     each an icon + its own AA accent: ALL THOUGHTS (list glyph, indigo),
>     IN TIME (clock, amber), NEXT (arrow, teal). The pillar door retired
>     from the leaf. Only the title (morph name intact) and the words live
>     in the content band. The world's own canvas carries NO words at all
>     ("points in time" + the meta line retired; the h1 is sr-only for
>     readers + SEO).
> 23. **THE MOTION VOCABULARY (2026-07-26).** Emilie: *"the transitions are
>     very laggy and barely existent... find a real way to tie all of this
>     website together once and for all."* The old baseline was a 250ms
>     opacity crossfade of the WHOLE root. On a frozen frame whose pill,
>     edges and footer are pixel-identical on every page, that spent itself
>     fading identical pixels into themselves, with no transform and no
>     timing offset. Two equal opposing fades read as a flicker, and
>     rasterising the full viewport twice is what made it cost.
>     The replacement is ONE IDEA: **there is one content surface on this
>     site, and it changes what it holds.**
>     - **Layers.** A `view-transition-name` lifts an element OUT of the
>       root snapshot, so the chrome is named and therefore stops
>       travelling: `chrome-pill` (header pill), `page-foot` (footer pill),
>       `chrome-lens` (the magnifier). Static names live in `language.css`;
>       per-route morph names stay inline where they are derived. Do NOT
>       force `animation: none` on the chrome: /work carries a footer and
>       /about does not, and an unpaired name would hold full opacity and
>       then vanish in one frame. The default fade is already correct.
>     - **The magnifier is the one moving piece of chrome.** It SLIDES from
>       the old door to the new one across the navigation. Amendment 17's
>       lens grammar, carried over the seam.
>     - **The page's own tools count as FRAME, not content.** They ride the
>       header line beside the pill; unnamed, they travelled with the page
>       while the pill held, and tore the header line in half. But the name
>       must carry a PER-TOOL-SET key (`page-tools-work` / `-cv` / `-world`
>       / `-leaf`, TitleBlock's `toolsKey`), NOT one shared name. A shared
>       name across differently-sized boxes makes the browser MORPH one into
>       the other: /work's 794px filter row was being squashed into
>       /thoughts' 149px WATCH IT GROW button, stretching the old snapshot
>       to 19% of its width as it faded, and THAT squash is what read as
>       lag. Two surfaces share a key only when their tools are literally
>       the same thing (/work and /work/:id). **General rule: a shared
>       view-transition-name is a promise that the two boxes are the same
>       object. If they are not, give them different names.**
>     - **A DIRECTIONAL SLIDE ON THE DOOR AXIS WAS BUILT AND DROPPED**
>       (Emilie, same day). The content slid in the direction the magnifier
>       travels: coherent, and still wrong. 24px over 300ms sits in the DEAD
>       ZONE where the eye reads "something shifted" instead of "I
>       travelled", which is what read as a glitch; committing harder would
>       only have made it a phone-app push, a grammar this drawing-led site
>       does not speak. The magnifier already carries direction, quietly, in
>       her own language. **Do not re-propose it.**
>     - **What survives is one lift, and ONE exception**, written to
>       `<html data-vt>` BEFORE navigation (`lib/navIntent.ts`; the old
>       snapshot is captured the instant `startViewTransition` runs, so
>       anything set after it is too late): `stay`, a change inside one room
>       (the /work card over its own gallery), which must NOT move or the
>       gallery slides out from under the card you just opened, so a short
>       opacity pass only and the morph carries the meaning.
>     - **Out is fast (140ms), in is slower (300ms) and starts at 80ms.**
>       Never two equal opposing fades. Transform + opacity only, so the
>       compositor does the work and nothing repaints.
>     - `mix-blend-mode: normal` is pinned on root's old/new. Chrome's
>       default plus-lighter is built for symmetric cross-fades of the same
>       content; two different pages on a light ground wash bright.
>     - The direction is four EXPLICIT rules, not a custom property read
>       inside the keyframes: the `::view-transition` tree's inheritance is
>       not something to bet the site's motion on when it cannot be
>       inspected in a dev tool.
>     - **The arrival ceremony plays once per visit.** The cover's 3.4s
>       draw-in was replaying in full on every return home, repainting the
>       whole SVG every frame via `stroke-dashoffset` while the page
>       transition ran. It now uses the develop ledger (`lib/develop.ts`).
>     - **A blank Suspense hold is not a transition.** Every route is lazy;
>       a cold navigation faded into an empty `MylarScreen` and then hard
>       cut when the chunk landed. `lib/preloadRoute.ts` warms the chunk
>       first, always AFTER `load` so it can never compete with the
>       landing's LCP.
>     - Reduced motion is unchanged and still absolute: every group, old
>       and new, `animation: none`. An instant, complete swap.
> 24. **THE WIDTH AXIS · ONE STEP, NEVER A FREE PARAMETER (2026-07-26).**
>     Archivo ships `wdth 62-125` and the site used none of it. Verified real
>     in the shipped file: the same string runs 83px at 62% and 157px at 125%.
>     It is adopted as ONE token, `--wdth-fit: 87.5%` (index.css `@theme`), for
>     exactly one job: **fitting a KNOWN string to a KNOWN measure**, where the
>     alternative is a wrap or a hand-tuned magic size. Everywhere else stays
>     100%. Scattered ad-hoc widths are what make type look unresolved.
>     **What it buys, measured on the landing's 436px column:** Archivo 14px is
>     465px at width 100 (wraps) and 420px at width 87.5 (fits, 15.5px slack).
>     The axis is the only reason a 14px single line is reachable at all;
>     without it the ceiling is 12px. It buys a whole TYPE STEP, not a nicety.
>     87.5% is a 12.5% narrowing: enough to buy the step, subtle enough that it
>     does not read as a condensed style. 75% starts to read as one.
>     **THE DESCRIPTOR ROW resolved (Emilie's pick C).** It was 562px of Martian
>     Mono in a 436px column, wrapping to two lines on desktop. Mono cannot be
>     made to fit at ANY setting (547px at zero tracking, 511px even at 10px),
>     so the row had to leave mono or lose a signed word. It keeps all four
>     words and becomes Archivo 14 / .04em / `--wdth-fit`, 12px on phones (every
>     option wraps to two lines at 390 anyway, and 14px there would cost ~3px on
>     a page already 22px past the fold). The face change is deliberate: mono
>     read as a technical tag, Archivo reads as a subtitle, and at 27% larger
>     plus full ink the row finally reads as information rather than decoration.
>     **The slack is 15.5px, so the row is now measure-bound: any longer word
>     wraps.** If the copy grows, dial the token, do not add a size.
>     STILL OPEN: the h1's `41.83px` is a fit-by-trial number (it measures
>     exactly 389px against exactly 389px of space beside the mark, tuned to a
>     hundredth of a pixel, and breaks the day the logo or name changes).
>     `46px @ --wdth-fit` is 385px: round, 10% bigger, same box. NOT SHIPPED,
>     awaiting her ruling.
> 25. **THE SMALL TYPE SCALE (2026-07-26).** 31 distinct screen sizes and
>     zero size tokens became **9 named steps + 12 pinned exceptions**.
>     **The numbers are NOT a mathematical ratio, deliberately.** The site
>     sets four faces and they are not optically comparable: Martian Mono at
>     13px reads far larger than Source Serif at 13px, and Caveat reads ~30%
>     smaller than Archivo at the same value. One ratio ladder would force a
>     face to be wrong. The steps are instead **the sizes the site already
>     agreed with itself about**, so 85 call sites kept their exact size and
>     only gained a name, and the 22 that moved went by 0.5-1px.
>     `--text-micro 9` (mono meta) · `--text-label 10` (mono labels, doors,
>     chips) · `--text-nav 12` (kickers, pills, the landing nav) ·
>     `--text-small 13` (compact serif) · `--text-body 15` · `--text-prose 17`
>     (the reading measure) · `--text-lead 21` (a surface's own title) ·
>     `--text-display 27` (SERIF titles: pillar, thought leaf) ·
>     `--text-title 30` (ARCHIVO page titles: /work, /about). The last two are
>     separate on purpose: different faces do not share a rung.
>     **Emilie's two calls:** 11 merged UP into 12, not down, so the five
>     kicker/pill sites gain legibility and the recruiter-critical landing nav
>     is not touched at all. 27 stays where it is rather than being pulled to
>     30, because it is the signed serif title size.
>     **THE PINNED TWELVE** are not stragglers; each is bound to something the
>     scale cannot know: the name (45/30) and the descriptor row (14/12) are
>     MEASURE-BOUND via `--wdth-fit` (amendment 24) and moving them wraps the
>     line; the voice line (30.97/21) and the n.b. wink (18/16) are Caveat,
>     and the voice line is additionally the measured LCP element and the
>     printed book's cover subtitle; About's `tall:` bumps (19 prose, 36 h1)
>     are responsive comfort variants, not roles; the 404 numeral (64/80) is
>     one decorative glyph. The whole `src/print/` tree is a separate `pt`
>     system and is out of scope.
>     **A LESSON WORTH KEEPING: a `text-[Npx]` inventory is not the inventory.**
>     The page titles were using STANDARD Tailwind classes (`text-3xl`,
>     `text-2xl`), which that grep misses completely, and that is how /cv's h1
>     came to be 24px while /work's and /about's are 30px. Always grep the
>     standard scale AND the raw `font-size:` declarations in CSS too.
>     STILL OPEN: /cv's h1 is `text-2xl` (24px) against `--text-title` (30px)
>     everywhere else. NOT CHANGED, awaiting her ruling.
>     ALSO OPEN: ten raw `font-size:` declarations in index.css / language.css
>     (7.5 · 8 · 9 · 9.5 · 10 · 12.5 · 15) that style the two SVG fields'
>     labels. They are canvas-space, not page type; they were left alone.
> 26. **ONE SYSTEM (the design-system + critique audit, 2026-07-26).** Emilie:
>     *"I want to simplify, and have a real solid system."* The audit scored
>     the system 72/100 and found the problem was not gaps but DUPLICATION:
>     an older vocabulary was never removed when the new one landed.
>     - **ONE COLOUR SYSTEM.** There were two. `--lang-*` had 237 consumers;
>       the Pen Table screen colours had 6. **And they disagreed:**
>       `--color-mylar` was `#f7f7f4` while `--lang-ground` is `#f5f6f7`, so
>       `body` painted a DIFFERENT WHITE from every surface on it. Proof it
>       was live, not academic: LandingCover and NeuralWorld each patched
>       `html.style.background` on mount to compensate. `--color-mylar`,
>       `--color-ink` and `--color-redline` are deleted, `body` and
>       `::selection` join `--lang-*`, the Suspense hold is
>       `--lang-ground` (it was `bg-mylar`, the wrong white), and **both
>       runtime patches are gone**. What survives under `--color-*` is only
>       what `--lang-*` does not name: the six lens pen/wire pairs, and the
>       four dark constants `landing/palette.ts` mirrors for the Node
>       prerender and drift-guards at runtime.
>     - **ONE LENS MARK.** Four things drew one shape: `LensGlyph`,
>       `LensTick`, Pill's internal `Chip`, `LensMark`. `LensTick` and
>       `LensMark` were the same component with different plumbing and one
>       consumer each. Now: `LensGlyph` is the GEOMETRY (single source) and
>       `LensMark({lens, size, active})` is the only screen component.
>       Print keeps its own six-line `PrLensTick` reading the same geometry:
>       paper has its own type, tokens and pinned ground, and the audit's
>       finding was one GEOMETRY, not one wrapper.
>     - **ONE SCRIM.** `rgba(11,14,19,x)` was hand-written EIGHT times at four
>       weights across Lightbox and WorkOverlay. Now `--lang-scrim-rest /
>       -hover / -soft / -faint`. Mode-INDEPENDENT on purpose: a photograph is
>       a photograph in either mode.
>     - **"CHIP" RETIRED as a rival noun.** `Pill` and `Chip` both named the
>       `--r-pill` geometry. `DownloadChip` is now `DownloadPill`. The lens
>       shape is a `LensMark`. One noun per shape.
>     - **THE PAGE TITLE settled.** `/cv`'s h1 was `text-2xl` (24px) against
>       30px on `/work` and `/about`: same face, same job, 25% apart. All
>       three are `--text-title` now. `/work`'s h1 staying `lg:sr-only` while
>       `/about`'s shows is CORRECT and was checked: `/work`'s is a room label
>       the pill already provides, `/about`'s is content.
>     - **NINE TOKEN PREFIXES, deliberately not renamed.** `--lang- --r-
>       --text- --font- --ease- --wdth- --cursor- --color- --pr-`. Each maps to
>       one real category; renaming is high churn for no visual gain.
>     - **FLAGGED, NOT DONE: `SheetPage` is a switchboard, not a shell.** Five
>       props produce six page shapes for six pages, so every surface is a
>       special case and the shell cannot tell you what a page IS. The fix is
>       2-3 named presets (`reading` / `gallery` / `canvas`) replacing raw
>       booleans. It touches all six pages, the gain is entirely internal, and
>       it cannot be verified by looking: **it needs its own session.**
> 27. **THE FOREVER-TWINKLE RETIRED (2026-07-26).** The landing ran **14
>     animations for as long as the tab was open** (7 award halos + 7 sparkles,
>     `infinite`), on battery, to say something a static mark can say. Measured
>     live before the change: `iterations: Infinity` on all 14.
>     - **THE RESTING STATE IS NOW A STATIC HALO** at `opacity: 0.3`. The halo
>       used to be `opacity: 0` at rest, which is exactly WHY it had to loop
>       forever to be visible at all. Recognition now reads with no motion.
>     - **ARRIVAL: two slow breaths, then it settles.** `iterations: 2`, `both`
>       so the fill holds the 100% keyframe, and the keyframes now begin and
>       end ON the resting value (0.3) so the pulse lands with no step. The
>       per-node negative delay still desyncs them, which now also means they
>       do not all fall still in lockstep (endTimes 8400 / 7670 / 6940 ...).
>     - **HOVER GIVES ONE BREATH BACK**, quicker (2.4s). Adding `.active`
>       restarts it, so it re-arms every time the mark is woken. This is the
>       motion the loop was standing in for: a reward for looking, not a tic.
>     - **A TRAP WORTH REMEMBERING: a bare inline `animationDelay` applies to
>       EVERY animation the element will ever run.** The award star's draw-in
>       stagger was leaking into the hover breath and starting it up to 2s
>       late. Delays that belong to ONE animation must be named custom
>       properties (`--mg-in-delay`, `--mg-halo-delay`) that only that rule
>       reads. Verified after: hover is `2.4s ease-in-out both`, no delay, and
>       plain marks keep their 2666ms draw-in stagger.
>     - Reduced motion needs no special case any more: the resting halo IS the
>       state, and every animation lives inside the no-preference block.
>     - **ONE infinite animation survives, deliberately:** `nw-livebeat` on
>       /thoughts, a single element, the live NOW tip. A pulse there MEANS
>       live; it is one element, not fourteen, and it is PRM-gated.
> 28. **THE PHONE FIELD MADE HONEST (REDESIGN-SPEC §3.4, 2026-07-26).**
>     Measured at 390x844: the 1440x860 canvas is sliced at **scale 0.451**, so
>     a mark core renders **5x5px**, an award star **5x5px** (the spec's own
>     words: "an un-tappable smudge"), and label type set at 8 canvas units
>     lands at **3.6px**.
>     - **THE RULE THIS SETTLES: the WORDS in the drawing render at the same
>       PHYSICAL size whatever the viewport; only the DRAWING scales.** Canvas
>       type is therefore sized per breakpoint, not once. Node labels go to 22
>       (mono) / 24 (serif) canvas units on phones = 9.9 / 10.8px; thread names
>       to 18 = 8.1px, matching desktop's 8.4px.
>     - **The phone field is a CONSTELLATION.** Resting node labels are hidden
>       below 640px: at 3.6px they are not small, they are illegible, and they
>       fuzz the drawing. ONE name shows at a time, and because only one is ever
>       visible, enlarging it cannot collide with another.
>     - **THE "START HERE" STATE, promised and never built, now exists.** One
>       mark (the first award node, SENSI) arrives with its NAME showing, so the
>       field says "these dots are things" before any input. It is deliberately
>       NOT the full bloom: setting `active` would flip the stage to `is-focus`
>       and dim every other thread to 0.08, the opposite of the spec's "never a
>       dead grey field". Verified: threads stay at 0.28, `is-focus` false. It
>       retires on first touch and hands the label to the tapped node.
>     - **Gate both halves on the SAME query.** The invitation was first gated
>       on `pointer: coarse` while the CSS used `max-width: 639px`; a narrow
>       DESKTOP window then got no rest labels AND no invitation, i.e. a field
>       of anonymous dots. The rest labels vanish because of SCALE, which is a
>       function of width, so width governs both.
>     - **THE 44px TARGET WAS ALREADY MET, by a different mechanism than the
>       spec named.** `onPointerDown` picks the NEAREST node within 80 canvas
>       units: a **72px effective diameter** with NO dead zones between marks.
>       The `r=15` hit circle (13.5px) is the MOUSE target, which is what
>       earlier audits were measuring.
>     - NO COORDINATE MOVED: type size, opacity and one state class only. The
>       frozen layout snapshot stays green.
>     - **THE PHONE GETS ITS OWN CAMERA (Emilie's ruling, 2026-07-26). The
>       spec's pinch/zoom + pan is RESOLVED OUT and must not be re-raised.**
>       FIRST PASS WAS WRONG AND SHE CAUGHT IT: "declare the crop a deliberate
>       detail view" was recorded as DOCUMENTATION and changed no pixels, so
>       the phone still showed the whole drawing, just small. "Detail view" is
>       a fair thing to read as "zoom into a chosen area", and the options
>       should have separated the two before anything was written down.
>       WHAT SHIPPED: a phone-specific `viewBox` of `530 200 557 554`
>       (`PHONE_VIEWBOX`, swapped by a matchMedia LISTENER so a rotation
>       re-frames instead of stranding the wrong camera). Scale goes 0.451 ->
>       0.70, so project marks go 3.2px -> 5.0px. It frames the dense middle
>       (Sensi, NeuroSpace, lEgoarCh, The Lungs, The Huddle, Ring 4000) with
>       **18 marks and 5 of the 7 awards**, and deliberately drops the lower
>       shelf of older work. A viewBox is a CAMERA, not geometry: no coordinate
>       moved, the frozen snapshot stayed green.
>       **TWO COSTS, both accepted knowingly.** (1) All six THREAD NAMES anchor
>       at the far right of the canvas (x ~1337) and fall outside the window,
>       so the phone shows the threads but not their names; reaching them needs
>       a ~850-unit window, i.e. back to the 0.46 scale this frame exists to
>       escape. (2) The phone canvas TYPE is calibrated to 0.70 and must be
>       re-calibrated if the window ever changes: 22 units read ~10px at 0.451
>       and would read 15.4px at 0.70. The sizes and the frame are one decision.
>       THE OLD MEASUREMENT, kept because it is why the camera exists:
>       The measurement: `preserveAspectRatio="slice"` renders the 1440 canvas
>       to 650px and crops **130px off each side**, so ~60% of the width is
>       visible and **6 of 35 marks and ALL FIVE thread names sit outside the
>       frame** at 390px. Fitting the whole canvas instead (`meet`) would drop
>       the scale to 0.271 and make every mark **3px**, which is worse.
>       The reasoning: at 388px tall under a text column the phone graph is not
>       an exploration surface, it is a tappable texture; pan would fight the
>       page scroll; and every node is already reachable on a phone by the jump
>       bar and by the screen-reader nav. The phone shows a DETAIL of the
>       drawing, on purpose.
> 29. **THE MAGNIFIER ON THE DRAWING: BUILT AND REVERTED (2026-07-26).**
>     Amendment 17's lens grammar was let onto the field: a 74-unit glass
>     circle following the pointer, magnifying the drawing 2.2x and revealing
>     the names that rest too small to read. It obeyed the standing rule (it
>     added nothing to the artwork, it only magnified what was already drawn),
>     it was structurally correct, and it was cheap: the clone rendered ONCE
>     and a pointer move cost 0.013ms and zero React re-render.
>     **Emilie saw it and did not like it. Reverted the same day, in full.**
>     **DO NOT RE-PROPOSE A LENS OVER THE FIELD.** The idea is not blocked on
>     execution quality, cost, or a technical flaw; it was judged on sight and
>     declined. Rebuilding it better is not an answer to it.
>     WORTH KEEPING from the attempt, because they generalise:
>     - clip on the OUTER group, transform on the INNER: both on one group
>       scales the clip too, so the lens GROWS instead of magnifying;
>     - `translate(p * (1 - k)) scale(k)` magnifies ABOUT a point, so the thing
>       under the cursor stays put;
>     - a magnifier over a drawing needs its OWN opaque ground, or the
>       magnified copy composites over the original as a double exposure;
>     - a cloned layer must NOT reuse the live layer's classes: those carry
>       state (is-focus dimming, rest opacity, draw-in animations) that has no
>       meaning in a clone, and scoping it away costs a pile of `!important`.
> 30. **THE OVERTURE (2026-07-26).** The identity column gets its own
>     entrance: five tiers arriving in READING ORDER (mark+name, descriptors,
>     the voice line, the doors, the controls) over **~1.1s** (5 x 120ms
>     stagger + 620ms), so the eye is led DOWN the column instead of meeting
>     all of it at once.
>     - **THE NON-NEGOTIABLE: TEXT RISES, TEXT NEVER FADES.** A text tier that
>       starts at `opacity: 0` is text that PAINTS LATE, and the late-painting
>       thing here is the sentence a recruiter came to read. The handwritten
>       voice line is the measured LCP element; animating its opacity would
>       push the one number the landing is judged on. A transform costs LCP
>       NOTHING: the element paints on frame one at full opacity, merely
>       translated. So `ov-rise` moves and touches opacity nowhere.
>       **Verified programmatically, not by eye:** all five tiers compute to
>       `opacity: 1`, and the `ov-rise` keyframes contain zero opacity
>       declarations.
>     - The single exception is the MARK, which is a graphic, not a sentence,
>       and may fade + scale.
>     - **Layout-neutral by construction.** Transform only, so no reflow and no
>       CLS: measured, the column is 328px tall with the overture armed and
>       328px without it.
>     - **ONCE PER VISIT** (`lib/develop.ts`, the same ledger as the draw-in and
>       the develop ceremony). An entrance that replays every time you come home
>       is the opposite of the site being one continuous place. Verified: on a
>       return to `/` the animation is `none` and the column is simply in place.
>       This is the one place the brief's "CSS only" was knowingly exceeded, and
>       the six lines of state buy that.
>     - Reduced motion: the whole block lives inside `no-preference`, so PRM
>       renders the column in its final position at full opacity. Complete, and
>       by construction rather than by a second rule that could drift.
>     - **THE LANDING COMPOSITION QUESTION remains PARKED.** It was ranked last
>       on every council ballot and is not reopened by this; the overture is an
>       entrance for the composition that exists.
> 31. **THE WOVEN QUESTION: RESOLVED OUT (Emilie, 2026-07-26).**
>     REDESIGN-SPEC §3.1 asked for the locked line to run along the COMFORT
>     thread as a textPath, "faint, a reward for looking". It was never built
>     and `QUESTION` / `QUESTION_FULL` sat in mindGraph.ts unimported for four
>     sessions. **Both constants are now DELETED. Do not re-add them.**
>     The brief expected an editorial ruling (does text IN the drawing count as
>     "on top of the artwork"?). Drawn on the real spline, the answer turned out
>     to be GEOMETRIC: **COMFORT drops 560 canvas units while moving only 45
>     sideways**, so a textPath on it reads TOP TO BOTTOM. Every variant failed:
>     - on COMFORT at 62% ink (amendment 9's floor): right weight, vertical;
>     - on COMFORT faint (the spec's own word): vertical AND in direct
>       collision with amendment 9, which says text at rest holds >=62% ink and
>       reserves "faint" for non-text decoration;
>     - on the NEURO thread: reads left-to-right, but NEURO is not the comfort
>       thread, so the line no longer sits on the idea it names, which was the
>       only reason it existed.
>     The spec asked for something the geometry will not give. Deleted rather
>     than left as a promise nobody can keep.
> 32. **VERIFICATION FINDING: a MediaQueryList 'change' event is not enough.**
>     Caught auditing the phone camera, not theorised. On a 390 -> 1280 resize
>     `matchMedia('(max-width: 639px)').matches` flipped to false and the CSS
>     media query re-evaluated correctly, but the `change` event never fired,
>     so the phone `viewBox` stayed on a desktop viewport. **Anything mirroring
>     a media query into JS state must listen to `resize` as well as `change`.**
>     React bails out of a re-render when the value is unchanged, so the second
>     listener costs a boolean compare. Verified after the fix in BOTH
>     directions without a reload.
>     The general lesson: CSS media queries are guaranteed by the platform, a
>     JS mirror of one is not. Prefer CSS; where JS must mirror it (an SVG
>     `viewBox` cannot be set from CSS), belt AND braces.

---

## 0 · What binds (unchanged, non-negotiable)

The BINDING block still rules over everything here: HONESTY (woven attribution,
no percentages, verbs score/estimate/model never measure, lEgoarCh's "93%
supported" is a failure not a result), PRIVACY (no public job-search signals;
`content/RECRUITER-CALIBRATION.md` stays local, never committed), THE ECONOMY
(`site/src/data/registry.ts` single source; cheap to update), FLOORS
(accessibility + honest reduced-motion states; Emilie's voice; NO em dashes;
`draftCopy` until signed), LOCKED COPY (hero question + BIM spine are content).

A11y is a floor this language must clear, not soften: **text on glass must still
meet WCAG AA contrast** (translucency is decorative; legibility wins), touch
targets stay >= 44px, and lens colour never carries meaning alone (the shape-chip
survives, §5).

---

## 1 · The core idea

Soft, filleted, glass. The reference points Emilie named: Apple Intelligence /
"liquid glass". Filleted edges everywhere; pills for compact metadata;
translucent frosted surfaces layered over a ground; low information density
(the eye meets the *work*, detail lives one layer in). But it stays a
**computational-design lab** in feel, not a generic premium template: mono
micro-labels, the award recognition, lens colour, and faint hairlines survive as
quiet research accents ("the lab, softened", Emilie's pick 2026-07-09).

---

## 2 · Two grounds, one mode system

A real **light + dark mode system** (Emilie, 2026-07-09), because liquid glass
lives on dark but the CV must stay light for ATS + print.

- **Mode source:** `prefers-color-scheme` by default, overridable by a
  `[data-theme="light|dark"]` attribute on `<html>` (a user toggle sets it;
  persisted). Semantic tokens (§3) switch by mode; components never hardcode a
  ground.
- **ONE mode for the WHOLE site, the landing included (Emilie amendment,
  2026-07-09).** The landing FOLLOWS the mode (it is light or dark like every
  other surface, and whatever it opens in, the whole site matches — "if it starts
  dark, everything is dark by default"). The mind-graph artwork survives both
  grounds (dark = light-ink threads on carbon "the mind at night"; light =
  dark-ink threads on cool-white "the mind on paper"; lens colours use their wire
  variants on dark, their darker pen variants on light). This RETIRES the earlier
  "landing pins DARK" rule and the "/work leans dark" default; both simply follow
  the mode now.
- **The ONE pinned exception is PRINT/PDF output:** the CV's downloadable PDF and
  any print stylesheet pin LIGHT (ATS + print legibility). The CV *screen*
  follows the mode like everything else.
- Any pin = wrap in a `[data-theme]` container; never hardcode hex.

**Light (default, cool clean):** ground `#f5f6f7` (Emilie chose cool-clean over
warm-mylar, 2026-07-09). **Dark:** ground `#0b0e13` (carbon, the landing).

---

## 3 · Tokens (implemented in `site/src/styles/language.css`)

Semantic, mode-switching CSS custom properties. Values below; the CSS file is the
source of truth.

### Grounds + ink (per mode)
| token | light | dark |
|---|---|---|
| `--lang-ground` | `#f5f6f7` | `#0b0e13` |
| `--lang-ink` | `#16181d` | `#e8eaed` |
| `--lang-ink-muted` | `#565b63` | `#8a919c` |
| `--lang-ink-faint` | `#8a919c` | `#6b727e` |
| `--lang-hairline` | `rgba(22,24,29,.10)` | `rgba(255,255,255,.10)` |
| `--lang-interaction` | `#be123c` | `#ff4d6d` |

### Glass tiers (per mode)
Three elevations. `backdrop-filter: blur(var(--lang-glass-blur))` where supported;
`@supports not` falls back to the same fill at full opacity (never a see-through
mush). Blur is capped and applied to bounded panels only (perf).
| tier | light fill / border | dark fill / border | use |
|---|---|---|---|
| glass-1 (raised) | `rgba(255,255,255,.65)` / `rgba(22,24,29,.10)` | `rgba(255,255,255,.05)` / `rgba(255,255,255,.12)` | cards, panels |
| glass-2 (floating) | `rgba(255,255,255,.85)` / `rgba(22,24,29,.14)` | `rgba(255,255,255,.09)` / `rgba(255,255,255,.18)` | overlays, sheets, menus |
| `--lang-glass-blur` | `16px` | `16px` | backdrop blur cap |

### Fillet scale (radii, mode-independent)
`--r-pill: 999px` · `--r-control: 12px` · `--r-image: 14px` · `--r-card: 20px` ·
`--r-sheet: 28px`. Nothing angular; no single-sided rounded borders.

### Motion
`--ease-soft: cubic-bezier(.2,.8,.3,1)`; durations 200-320ms; springy, soft.
Every ceremony one-shot and renders its final state under `prefers-reduced-motion`
(the floor from REDESIGN-SPEC §8 carries over verbatim).

**Page transitions (Emilie amendment, 2026-07-09): no hard cuts.** Navigation uses
the **View Transitions API** with a SHARED-ELEMENT morph where a source element
maps to a destination: a mind-graph NODE morphs into the project/thought page it
opens; a WORK card morphs into its overlay and into its full page (matching
`view-transition-name`s on the paired elements). Where no shared element exists
(generic page-to-page) or the browser lacks support (e.g. Firefox), it falls back
to a **soft crossfade** (~250ms, `--ease-soft`); the same crossfade smooths the
dark↔light mode flip. Under `prefers-reduced-motion` every transition is an
instant swap. Springy and soft, never showy.

---

## 4 · Type (carries over, unchanged)

Archivo (display/UI), Source Serif 4 (prose), Martian Mono (numbers + micro
labels, still <= 0.875rem), Caveat (margin notes only). The pivot is shape +
surface, not type. Mono is now a *quiet accent* (P-numbers, tech, status labels),
not the dominant texture it was in Pen Table.

---

## 4.5 · The emblem (CE, the constellation cube; approved 2026-07-12)

The EEC mark is a graph cube: the 2022 iso cube rebuilt as a small constellation,
chosen from a three-direction exploration (neuron / cube / "em" monogram) and
three cube rounds. It supersedes the A1 graph cube (2026-07-06).
`site/src/components/LogoMark.tsx` is the geometry of record; `public/favicon.svg`
carries the same geometry with beefed weights for tab sizes.

- **Letter anatomy** (Emilie's canonical mapping, unchanged): E1 = left face,
  E2 = top face, C = right face. New in CE: E2's spine sits on the edge it
  shares with E1 (the two E's grow from one stroke), and E2's far bar is the
  same stroke as the C's top arm.
- **Three depths of line**: the outer shell heavy (w7); every thread that
  touches the redline node thin (w4); the two back-right edges that only close
  the cube as a 45% ghost (w3.2). The object converges into its live point.
- **Nodes**: 6 corner nodes (r13) + 2 dash-tip nodes (r8), ink. The redline
  node (r15) stays at the vertex where all three letters meet, and rides
  `--lang-interaction` (red = interaction/liveness, §6; the mark's one red).
- **Mode-aware always**: ink is `--lang-ink`, red is `--lang-interaction`.
  There is no tone prop and no ground-pinned variant; the mark is correct on
  both grounds everywhere (the old `tone="wire"` pin is what made the landing
  mark vanish in light mode).
- **Static always**: no plot-in, no hover ceremony (unchanged since Session 4).
- **Derivatives**: `favicon.svg` self-themes via `prefers-color-scheme`;
  `favicon-16/32.png` fallbacks + `apple-touch-icon.png` (light ground) ship
  the light-mode pair; `og.png` (1200x630) sets the mark at 360px on the light
  ground next to the name. Regenerate all of them together if the geometry
  ever changes.
- `aria-label="EEC"`, `role="img"` (a11y floor).

---

## 4.6 · The cursor (the node cursor; approved 2026-07-12, sitewide)

The pointer is part of the drawing: a **soma** (ink node, r5 core with a
ground-contrast outline + a 55% halo ring, 24px, hotspot-centred) at rest, and
the **red live node** (`--lang-interaction` hue per mode) over anything
clickable — red = interaction, the same law as the graph. The visitor is a
point in time moving through the mind.

- **Tokens**: `--cursor-rest` / `--cursor-live` in `language.css`, mode-aware
  (explicit `prefers-color-scheme` + `[data-theme]` blocks; `light-dark()`
  cannot wrap `url()`). Each carries its native keyword fallback
  (`default` / `pointer`), so unsupporting browsers and forced-colors users
  keep the OS cursor.
- **Scope**: sitewide (Emilie's call over world-only, 2026-07-12, with the
  a11y trade-off stated: a custom cursor overrides OS cursor-size schemes).
- **Semantics survive, non-negotiable**: text fields keep the I-beam, the
  world keeps grab/grabbing, /work's lightbox keeps zoom-in. Touch devices
  are unaffected.
- Consumers: `body` rides rest; `a/button/[role=button]/select/summary/
  .cursor-pointer` + `.mg-node/.mg-edge/.nw-node` ride live.

---

## 5 · Components (specs; primitives ship in `site/src/components/ui/`)

- **Pill** (`Pill.tsx`) — the compact metadata unit, `--r-pill`. Variants:
  - `lens` — lens colour fill+border at low alpha, **with a shape-chip** (square /
    diamond / triangle) so colour never means alone (a11y rule carried from Pen
    Table). Label in mono.
  - `tag` — neutral glass fill, muted ink, sentence-case label.
  - `status` — `live` (a small `--lang-interaction` dot + "live"), `award`
    (`✦` + wording, e.g. `✦ MaCAD '26`). Award is ink/recognition, never a box, never red.
  - `filter` — the gallery facet control; active = solid ink fill, rest = glass.
- **Surface** (`Surface.tsx`) — the glass panel wrapper: `tier` (1 raised / 2
  floating), applies fill + border + blur + radius from tokens, mode-aware.
- **Card** (per-surface, built on Surface) — image-forward: a `--r-image`
  developing image, then name (Archivo) + a pill row (lens + up to ~2 tags). The
  dek / tech / story / full recognition live in the preview, not on the face
  (Emilie: "the gallery is too busy"). Award may show as a `status:award` pill on
  the image corner.
- **ModeToggle** — sun/moon control that sets `[data-theme]` + persists; lives in
  the header. (Built + verified in the foundation session, §9.)

---

## 6 · Colour governance (carried from Pen Table, adapted)

- **Redline = interaction + liveness ONLY** (`--lang-interaction`), never a
  category. The `live` dot and interactive affordances; nothing else.
- **Lens colours** (cyan = Computation & Research, magenta = Design & Practice,
  yellow = Explorations) always ship with a shape-chip + label. Open set.
- **Award = recognition, ink, `✦`, no box, never red.**
- Glass tints are neutral (white/ink alpha); colour enters only through lens
  pills and the interaction accent.

---

## 7 · Density

Low. A surface shows the least that lets the visitor choose; the next layer holds
the detail. Gallery card = name + type + tags. This recycles everywhere: the
notebook row, the CV, the about page all inherit "quiet surface, detail one layer
in".

---

## 8 · Folders

Deferred, not rejected (Emilie, 2026-07-09: "maybe both, not sure, maybe not this
page"). `/work` stays on **filter pills**. A folder element (folder-tabs, or a
Finder-like open) is a candidate for a *different* surface (the notebook, or a
projects index) and gets its own visualise-first session before it ships.

---

## 9 · The rebuild sequence (each its own session, visualise-first)

The language is locked; the pages are not yet re-skinned. Recommended order:

| # | Session | Scope |
|---|---|---|
| DL-0 | **Foundation** | Build + live-verify the mode system (toggle + persistence + pinned surfaces), the `Pill` / `Surface` / `Card` / `ModeToggle` primitives, and the glass/blur + contrast + PRM behaviour across both modes. Everything downstream consumes this. |
| DL-1 | **Header + footer** | Re-skin the shared chrome to glass + pills + the mode toggle; both modes. |
| DL-2 | **WORK** | Re-skin the R2 gallery (structure already built) to the glass card (name+type+tags), dark default, pill filters; card-on-top becomes a glass-2 sheet. |
| DL-3 | **Notebook** | Re-skin to the language; evaluate the folder element here. |
| DL-4 | **About** | Re-skin; the headshot + pivot story in the soft language. |
| DL-5 | **CV** | Re-skin light-pinned; keep ATS/print plainness intact (glass is screen-only; the PDF stays plain). |

REDESIGN-SPEC.md remains the CONCEPT of record; this file is the VISUAL language
of record. Where the two disagree on skin (corners, surfaces, density), this file
wins; where they touch concept, REDESIGN-SPEC wins. REDESIGN-SPEC §4-8 should be
annotated to point here (a small follow-up, like the R1 refinements).
