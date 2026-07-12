// P-101 · Sensi. Card copy migrated verbatim from data/projects.tsx (locked
// blurb; dek + awardShort signed 2026-07-10). The spine is TRIMMED from the
// retired P-101 sheet (abstract / method / bench findings): listings and the
// cinema plates did not migrate; the code lives in the public repo, the long
// read on the blog. Attribution woven per the Session 7 ceiling: project
// lead, team credited, team of four, no percentages, never a labeled line.
// Verb rule: Sensi SCORES and ESTIMATES comfort, never measures.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import NB from '../../components/ui/NB'
import type { ProjectMaster } from './types'

const sensi: ProjectMaster = {
  slug: 'sensi',
  title: 'Sensi',
  lens: 'computation',
  meta: 'MACAD STUDIO · TEAM OF 4',
  award: 'MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER',
  awardShort: "MACAD '26 WINNER",
  dek: 'Comfort, designed on purpose: a copilot scores a plan across six senses, calibrated to a person, not an average.',
  dekSigned: true,
  myPart: 'Project lead, A to Z. Built with a team of four.',
  stat: 'LLM BENCH · 2 PROVIDERS × 3 SCENES',
  blurb:
    "Comfort is usually the thing we hope shows up after the design is done. Sensi makes it a design layer: a copilot that reads your floor plan and scores it across six senses (thermal, visual, acoustic, spatial, olfactory, tactile), calibrated to a person, not an average. Because you don't walk into a room and average your experience; the thing that's wrong is the thing you notice.",
  tech: 'PYTHON · LANGGRAPH · FASTAPI · REACT',
  links: [
    { label: 'BLOG', href: 'https://blog.iaac.net/sensi-making-comfort-a-design-layer/' },
    { label: 'GITHUB', href: 'https://github.com/sclebow/AIA26_Studio/tree/main/team_02' },
  ],
  image: { slug: 'sensi', name: 'app-shape', alt: 'Sensi interface scoring a floor plan across six senses' },

  what: (
    <>
      Every tool in the stack could tell us how a building performs. None of them would say how a
      room feels. Sensi closes that gap: a copilot that reads a floor plan and scores comfort
      across six senses (thermal, visual, acoustic, spatial, olfactory, tactile), calibrated to
      one person at a time, not an average. Project lead, A to Z, built with a team of four:
      Lakzhmy Mari Zaro, María Sánchez Domínguez, Charles Abi Chahine, and me.
    </>
  ),
  why: (
    <>
      Comfort is usually the thing we hope shows up after the design is done. I wanted it to be a
      layer you can interrogate while the plan is still soft, because you do not walk into a room
      and average your experience: the thing that is wrong is the thing you notice.
    </>
  ),
  how: [
    <>
      Onboarding calibrates the copilot to the person in the room, their thermal grudges, their
      noise tolerance. Comfort without a subject is just weather.
    </>,
    <>
      One action classifier, a single LLM call per turn, routes each request through a LangGraph
      state graph: analyze, edit, preview, audit.
    </>,
    <>
      A coupling matrix ripples every change into the neighbouring senses, so a fix that quietly
      breaks another score gets flagged, not hidden.
      <NB note="the six scores argue like a family. the coupling matrix is the dinner table." />
    </>,
    <>
      The copilot suggests edits the layout can absorb, previews them without committing, then
      renders the comparison and hands over the report.
    </>,
  ],
  outcome: (
    <>
      We benched the judgment before trusting it: two LLM providers scored the same three scenes
      end to end, including a living room arranged to fail. They mostly agreed, and it would have
      been easy to call that validation. We wrote agreement is not truth into the notes instead,
      and kept every disagreement as data.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default sensi
