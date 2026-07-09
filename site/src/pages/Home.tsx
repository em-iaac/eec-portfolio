// A-000 · THE LANDING (Session R1). The mind is the landing: an all-dark,
// full-bleed, non-scrolling mind-graph of Emilie's projects and thoughts, with
// the honest DOM hero (name, subtitle, fact line, nav, jump bar) painted over
// it. Replaces the Session 13 three.js network hero; the separate /explore
// surface retired with it (App.tsx redirects the old URLs to /). The whole
// composition lives in src/landing/.
import LandingCover from '../landing/LandingCover'

export default function Home() {
  return <LandingCover />
}
