// P-111 · XR for Education (explorations). S2 FIX ROUND (2026-07-16): the
// spine rewritten from Emilie's own telling. Her two guiding questions,
// near-verbatim, are the WHY ("chem students dont have the best
// visualization skills so how can we teach them something crucial... in a
// visual way? and how to make something relatively boring and too technical
// into something immersive and fun"); the pipeline is the HOW (reactions
// modeled and animated in 3ds Max and Maya, imported into Unity, run on
// Oculus headsets); the OUTCOME keeps her ceiling exactly: engagement was
// visibly higher in the trials, the research never went deeper, she
// graduated and left the team. Her LinkedIn record (Research Assistant, XR
// Learning Experiences, LAU, Sep 2021 - Jan 2023) backs the frame,
// including contributions to research papers and documentation.
// HONESTY red line held: no personal C# claim, no measured-outcome claim.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMeta } from './types'

const xrLab: ProjectMeta = {
  slug: 'xr-lab',
  title: 'XR for Education',
  lens: 'explorations',
  meta: 'LAU XR LAB · RESEARCH ASSISTANT · 2021-23',
  dek: 'Where the XR thread started: point a phone at a molecule and watch it react in the room.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14). Question + dot set SIGNED
  // by Emilie (REINDEX batch C, 2026-07-16); the S2 HOW/OUTCOME beats
  // SIGNED at the S2 sign-off, 2026-07-17.
  question: 'Can AR and VR change how we learn?',
  tech: 'MAYA · 3DS MAX · UNITY · OCULUS',
  links: [],
  // S2 cover: a hover-play cut of the SN2 reaction render (still at rest).
  image: {
    slug: 'xr',
    name: 'reaction-cover',
    alt: 'An SN2 reaction rendered for AR: the chloride ion leaves the molecule as methanol forms, ball and stick in gray space',
  },
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default xrLab
