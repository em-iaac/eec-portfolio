// THE PRERENDER FLAG (Emilie's ruling 2026-08-02, the phone pass).
//
// scripts/prerender.mjs stamps `window.__EEC_PRERENDER__` via
// evaluateOnNewDocument, before any page script runs, so this is true ONLY
// inside the build's headless browser. It can never reach a visitor.
//
// It exists so a component can keep its purely DECORATIVE markup out of the
// snapshot when that markup is large and a crawler cannot read it anyway. Two
// consumers, both big inline SVG drawings that the SPA rebuilds from JavaScript
// the moment it boots (main.tsx uses createRoot, not hydrateRoot, so every
// prerendered node is thrown away):
//
//   NeuralWorld   /thoughts was 547KB raw / 118.5KB gzipped for the drawing
//                 alone, against 5 to 28KB for every other route.
//   MindGraphView the landing's graph is lazy behind `Suspense fallback={null}`,
//                 so whether it landed in the snapshot was a RACE: successive
//                 builds of the same commit produced 230.8KB and 212.2KB. A
//                 build that is not reproducible cannot be reasoned about.
//
// THE RULE, and it is not negotiable: only DECORATION may opt out. The readable
// record must always be in the snapshot. Both consumers are safe because both
// already ship a text alternative that renders unconditionally beside the
// drawing (WorldSrNav, MindGraphSrNav), which is the thing a crawler was ever
// going to read.
//
// Read once at module scope, never as live state: it cannot change.
export const PRERENDERING =
  typeof window !== 'undefined' &&
  (window as Window & { __EEC_PRERENDER__?: boolean }).__EEC_PRERENDER__ === true
