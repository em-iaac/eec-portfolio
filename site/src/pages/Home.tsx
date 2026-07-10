// A-000 · THE LANDING (Session R1). The mind is the landing: an all-dark,
// full-bleed, non-scrolling mind-graph of Emilie's projects and thoughts, with
// the honest DOM hero (name, subtitle, fact line, nav, jump bar) painted over
// it. Replaces the Session 13 three.js network hero; the separate /explore
// surface retired with it (App.tsx redirects the old URLs to /). The whole
// composition lives in src/landing/.
import LandingCover from '../landing/LandingCover'

// The landing PINS DARK (DESIGN-LANGUAGE.md §2): the cover is carbon in every
// mode; the [data-theme] wrapper makes any nested DL v2 glass resolve dark.
export default function Home() {
  return (
    <div data-theme="dark">
      <LandingCover />
    </div>
  )
}
