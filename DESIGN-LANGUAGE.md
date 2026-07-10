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
