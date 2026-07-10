// A-000 · THE LANDING (Session R1; one-mode since DL-1). The mind is the
// landing: a full-bleed, non-scrolling mind-graph of Emilie's projects and
// thoughts, with the honest DOM hero (name, subtitle, fact line, nav, jump
// bar) painted over it. The whole composition lives in src/landing/.
//
// The landing FOLLOWS the mode like every other surface (Emilie amendment,
// executed DL-1 2026-07-10): carbon "mind at night" in dark, cool-white
// "mind on paper" in light. The old data-theme="dark" pin retired with the
// rest of the screen pins; only print/PDF stays pinned light (language.css).
import LandingCover from '../landing/LandingCover'

export default function Home() {
  return <LandingCover />
}
