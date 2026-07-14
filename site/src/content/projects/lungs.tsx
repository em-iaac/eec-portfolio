// P-105 · The Lungs. Card copy migrated verbatim from data/projects.tsx
// (locked blurb; dek signed 2026-07-10). Spine authored fresh from the
// public blog post. Framing rules bind: "designed to filter" (proposal
// tense, never built performance); DATA TEAM OF 3 is deliberate (Emilie's
// ruling: three people did not design the whole hyperbuilding).
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMaster } from './types'

const lungs: ProjectMaster = {
  slug: 'lungs',
  title: 'The Lungs',
  lens: 'computation',
  meta: 'MACAD STUDIO · DATA TEAM OF 3 · LIVE APP',
  award: 'STUDIO AWARD',
  myPart: 'Data team of three: we built the app that ran the studio.',
  dek: "The studio's data was the architecture: a live app running a hyperbuilding designed to filter a city's air.",
  dekSigned: true,
  // THE QUESTION (D4): DEFERRED to the question-discovery session (Emilie,
  // 2026-07-13). Candidate parked: "What if the data running a studio was the
  // architecture?" (leads with the ownable claim, the data team's app, not the
  // building's filtration). The signed dek serves meanwhile.
  stat: 'TRACKED · 3 TEAMS × 10 WEEKS',
  blurb: (
    <>
      Santiago has an air problem, the kind that sits in the valley like a guest who won't leave. The Lungs is a
      hyperbuilding that filters 12 million m³ of air a year. We turned the studio itself into a web app, because the
      data <em>was</em> the architecture.
    </>
  ),
  tech: 'VUE 3 · VITE · TAILWIND · SPECKLE',
  // The cold-start label "LIVE APP · WAKES IN ~30S" is APPROVED (Session 11,
  // batch #1); free-tier Railway sleeps and the label says so. The myPart
  // credit line signed at G4 (2026-07-12); the blurb above stays locked.
  links: [
    { label: 'LIVE APP · WAKES IN ~30S', href: 'https://bimscstudiohb1-production.up.railway.app/' },
    { label: 'BLOG', href: 'https://blog.iaac.net/building-the-nervous-system-how-we-turned-a-hyper-building-studio-into-a-web-app/' },
  ],
  image: { slug: 'lungs', name: 'tower', alt: 'The Lungs hyperbuilding tower over Santiago' },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  spreadAssets: [{ slug: 'lungs', name: 'tower' }],

  what: (
    <>
      Santiago has an air problem, the kind that sits in the valley like a guest who will not
      leave. The Lungs is a hyperbuilding designed to filter 12 million m³ of air a year, and the
      data team of three (María Sánchez Domínguez, Lakzhmy Mari Zaro, and me) built the live web
      app the whole studio ran on while designing it.
    </>
  ),
  why: (
    <>
      The studio's data was the architecture. Three design teams, ten weeks, one shared organism:
      somebody had to build its nervous system, and that turned out to be the most architectural
      thing in the room.
    </>
  ),
  how: [
    <>
      Build the platform in Vue 3, Vite, and Tailwind: KPIs, timelines, and team status, live for
      everyone instead of buried in spreadsheets.
    </>,
    <>Stream the 3D models in through Speckle, so performance data sits on geometry, not beside it.</>,
    <>
      Keep it running while the studio designs on top of it: the app was not documentation, it
      was the project's operating system.
    </>,
  ],
  outcome: (
    <>
      The platform tracked three design teams across the full ten-week studio. Building a
      platform alongside the project it supports is messy, and the mess is the lesson: the
      building breathes, so does the app.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default lungs
