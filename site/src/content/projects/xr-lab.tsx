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
import type { ProjectMaster } from './types'

const xrLab: ProjectMaster = {
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
  alsoAnswers: [
    { q: 'What if the lesson could stand in the room with you?', beat: 'what' },
    { q: 'Can a phone camera make a chemistry reaction visible?', beat: 'what' },
    { q: 'How does a molecule get from Maya into a VR headset?', beat: 'how' },
    { q: 'Did the students actually engage more?', beat: 'outcome' },
  ],
  blurb:
    'AR and VR chemistry lessons built at the LAU XR Lab: reactions modeled and animated in 3ds Max and Maya, brought into Unity, and run on Oculus headsets, so a student can stand inside the reaction instead of squinting at a diagram. Where the XR thread in my work started.',
  tech: 'MAYA · 3DS MAX · UNITY · OCULUS',
  links: [],
  // S2 cover: a hover-play cut of the SN2 reaction render (still at rest).
  image: {
    slug: 'xr',
    name: 'reaction-cover',
    alt: 'An SN2 reaction rendered for AR: the chloride ion leaves the molecule as methanol forms, ball and stick in grey space',
  },

  what: (
    <>
      Research assistant work at the LAU XR Lab, turning chemistry into something you can stand
      inside. We researched the reactions themselves to model them accurately, animated them in
      3ds Max and Maya, and shipped them two ways: as AR lessons a phone summons through QR
      codes, seven reaction models in the set, and as VR experiences built in Unity for Oculus
      headsets. I also contributed to the lab&rsquo;s research papers and documentation on XR in
      education.
    </>
  ),
  why: (
    <>
      Two questions drove the whole experiment. Chemistry students do not always have the best
      visualization skills, so how do you teach them something crucial and deeply technical in a
      visual way? And how do you turn a subject that reads as boring and technical into
      something immersive you can interact with?
    </>
  ),
  how: [
    <>Research each reaction until the chemistry is right, then model and animate it in 3ds Max
      and Maya.</>,
    <>Publish the animations as AR lessons behind QR codes, so the molecule appears in the room
      through a phone camera.</>,
    <>Import the models into Unity and build the VR versions for Oculus headsets, interactive
      and walkable.</>,
  ],
  outcome: (
    <>
      It stayed honestly experimental: the students we tested with were visibly more engaged,
      but the research never went deeper than those trials. I graduated and left the team, and
      the XR thread in my work starts here.
    </>
  ),
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default xrLab
