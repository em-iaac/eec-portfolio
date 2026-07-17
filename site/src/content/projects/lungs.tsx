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
  // THE QUESTION (D4 round 2, Emilie's direction 2026-07-14): the dashboard /
  // data-management vocabulary she asked for, still the data team's ownable
  // claim, never the building's filtration. Question + dot set SIGNED by Emilie (REINDEX batch A, 2026-07-16).
  question: 'Can a dashboard run an architecture studio?',
  alsoAnswers: [
    { q: 'What if the data running a studio was the architecture?', beat: 'why' },
    { q: 'Can a web app run a ten-week studio without the spreadsheets?', beat: 'what' },
    { q: 'How do you put performance data on the geometry instead of beside it?', beat: 'how' },
    { q: 'What does it take to keep three design teams honest for ten weeks?', beat: 'outcome' },
  ],
  stat: 'TRACKED · 3 TEAMS × 10 WEEKS',
  blurb: (
    <>
      Santiago has an air problem, the kind that sits in the valley like a guest who won't leave. The Lungs is a
      hyperbuilding that filters 12 million m³ of air a year. We turned the studio itself into a web app, because the
      data <em>was</em> the architecture.
    </>
  ),
  tech: 'VUE 3 · VITE · TAILWIND · SPECKLE',
  // The cold-start wording retired on Emilie's instruction (2026-07-15): the
  // link is plain LIVE APP and wears the liveness dot in the links row (the
  // film now carries the tour; the app itself is IAAC-gated anyway). The
  // myPart credit line signed at G4 (2026-07-12); the blurb stays locked.
  links: [
    { label: 'LIVE APP', href: 'https://bimscstudiohb1-production.up.railway.app/' },
    { label: 'BLOG', href: 'https://blog.iaac.net/building-the-nervous-system-how-we-turned-a-hyper-building-studio-into-a-web-app/' },
  ],
  // THE COVER = THE KPI MAP, ALIVE (Emilie's pick, 2026-07-15): the platform's
  // dependency network at rest, breathing on hover; cut from her StudioDemo
  // edit below the app header (the teammate login chip never ships). The
  // collage moved out of the web gallery; it stays the book plate below.
  image: { slug: 'lungs', name: 'demo-cover', alt: 'The analysis tower in the live viewer, program gradients in red and blue as the timeline scrubs across the studio platform' },
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
