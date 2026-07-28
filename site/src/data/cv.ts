// Web CV. Source: old material/Emilie El Chidiac - Résumé.pdf (Feb 2025)
// + MaCAD year additions per PORTFOLIO-REBRAND-BRIEF.md. G5 (2026-07-12):
// the downloadable PDF renders FROM THIS FILE at build time
// (src/print/PrintCV.tsx + scripts/render-pdfs.mjs), so editing here
// regenerates it on the next build and it can never go stale. The build's
// ATS parse test extracts the PDF's text layer and fails if the dates,
// email, or section order stop reading plainly.
// G3 (2026-07-10, REDESIGN-SPEC §9): real ATS-readable dates ("Aug 2024 -
// Present", plain hyphens, no em dashes anywhere), skills regrouped to the
// four spec groups ("Rhino Compute" spelled with a space once, on purpose),
// certificates carry the full issuer name.
//
// THE CV PASS (2026-07-27, Emilie's rulings live in-session). What changed:
//
// 1. PROJECTS ARE NAMED IN PLACE. There is no SELECTED WORK section and there
//    will not be one: every project sits under the degree or the role that
//    produced it (the `projects` field), so nothing can repeat itself and each
//    one arrives with its context already attached. Her call, and it also let
//    the six newer projects (Homage, Encounter, Falcon, and the explorations)
//    onto the CV at no structural cost.
// 2. EDUCATION LEADS. Her call. Eye-tracking research puts the highest-
//    attention slot right after the name, and her most recent role is the one
//    whose project work cannot be disclosed; MaCAD + the 2026 award belong
//    there instead.
// 3. THE AWARDS BLOCK SURVIVES but holds every recognition ONCE. Projects are
//    named bare above; the recognitions live here, each naming its project.
//    FLAG-07: externally verifiable ones carry the context that makes them
//    checkable (Tamayouz's 422 teams), course-internal ones name IAAC plainly.
//    Weight comes from detail, not from a subhead that would demote the MaCAD
//    win (which is course-internal AND her headline claim).
// 4. THE DEGREE STRING IS NOW VERBATIM off the diploma. Never "official
//    master's degree" (it is a título propio; 90 ECTS, and that is honestly
//    claimable, but the word "official" is not).
// 5. SKILLS keep their four tier labels and change their contents: the AI group
//    re-weights onto what still discriminates in 2026 (agents, and evaluation
//    and benchmarking), because AI-assisted development is now table stakes.
//    Two new groups: DOMAIN (the vocabulary a hiring manager actually uses for
//    this subject) and WRITING & RESEARCH (which answers "can she communicate"
//    and "is there a research cycle", both previously blank).
// 6. FOCUS became a headline + a summary and now renders on the SCREEN too,
//    not just the PDF.
//
// draftCopy: FOCUS, every `projects` string, the DOMAIN and WRITING & RESEARCH
// groups, and the re-weighted award lines are all DRAFTED, unsigned.
//
// Honesty ceilings that bind this file (verified 2026-07-27 against the
// project masters and the local calibration): Tamayouz is Top 100, never
// "winner" · Marsception is Top 50, duo-credited to Charles Abi Chahine ·
// Sensi is "project lead, team of four", no percentages · lEgoarCh is
// "digitally verified buildable", never physically assembled · The Lungs stays
// proposal tense ("designed to filter") · FALCON SQUARE CARRIES NO
// RECOGNITION (Emilie's ruling 2026-07-27; the dossier's S2 ruling 2 had
// conflated it with The Encounter's Cemetery Challenge certificate) · the neuro
// verbs are score / estimate / model, never "measure" · Dynamic Solution is the
// current job, so the role appears and its project work does not.

// One record entry. `projects` is the in-place project line added at the CV
// pass: optional, because Dynamic Solution (the current job) cannot name its
// work and two of the older roles have none worth a line.
export type CvEntry = {
  // Education carries no dates at all (her call, 2026-07-27): years live in
  // EXPERIENCE and AWARDS, where a reader is actually computing tenure.
  dates?: string
  title: string
  org: string
  // Optional: education uses it for the honours line, experience skips it and
  // goes straight to bullets.
  notes?: string
  // ONE PROJECT PER LINE (her review, 2026-07-27): an array, not a run-on
  // string. She asked for bullet grammar so each project is scannable on its
  // own line, elaborated as far as one line allows.
  projects?: string[]
}

// DATE FORMAT, one rule, no exceptions (her audit, 2026-07-27): EXPERIENCE
// carries month + year on every entry, EDUCATION carries none at all. The
// earlier hybrid (months on the recent roles, bare years on the older two)
// was defensible on parsing grounds and still read as an inconsistency to a
// human, which is the reader who was going to notice.
// EVERY BULLET IS ONE PRINTED LINE (her call, 2026-07-27). A bullet that wraps
// for the sake of two words reads as sloppy, so each string below is written
// to a measured ceiling of roughly 118 characters at 8.6pt across the A4
// measure. If you edit one, re-measure: the build's overflow probe only
// catches the page total, never a single ugly widow.
export const EDUCATION: CvEntry[] = [
  {
    // "Lifelong Learning" removed at her call (2026-07-27). It IS printed on
    // the diploma above the title, and one council reviewer argued dropping it
    // is an omission a European screener will discover anyway. Her decision,
    // taken with that risk stated. The operating rule is unchanged elsewhere:
    // never write "official master's degree" on a legal or immigration form.
    // OPEN: whether the thesis year is written "II" (her suggestion) and
    // whether the programme's current name replaces the diploma's wording.
    // The "II" is the official programme name for the thesis year, confirmed
    // by her. NOTE this is the RENAMED programme title, not the string printed
    // on the diploma ("Master's Degree in Advanced Computation for Architecture
    // & Design"); IAAC renamed the course and the old URL redirects. Both are
    // true, this is the current one.
    title: 'Master in Advanced Computational Design for Architecture II',
    org: 'IAAC, Barcelona',
    // Mirrors the bachelor's honours line (her call): what the school judged.
    // Scholarship name confirmed by her.
    notes: 'MaCAD Awards 2026 winner. IAAC Women in Tech scholarship.',
    projects: [
      // "agentic" earns its place here rather than in a skills row: Sensi IS
      // an agentic copilot, so the fastest-growing term in this cluster is
      // evidence-backed rather than fashionable.
      'Sensi, an agentic copilot scoring a floor plan across six senses, calibrated to a person. Project lead, team of four.',
      "The Lungs, the deployed app that ran the studio: a hyperbuilding designed to filter a city's air. Data team of three.",
      'lEgoarCh, a pipeline turning generative images into brick sets verified buildable against the real catalogue.',
      'Methods: agent orchestration, generative pipelines, Rhino Compute, machine learning applied in teams.',
    ],
  },
  {
    title: 'Bachelor of Architecture (NAAB & NASAD accredited)',
    org: 'Lebanese American University, Byblos',
    notes: "Dean's Distinction List. Honor scholarship all consecutive terms.",
    projects: [
      "The Homage, bachelor thesis: an adaptive reuse of Oscar Niemeyer's unfinished Rachid Karami Fair in Tripoli.",
      // LICENSURE (her call, 2026-07-27): a real, externally verifiable
      // credential that European practices ask about directly, and it was
      // missing entirely. It sits under the bachelor's because that is the
      // degree that qualified her for it.
      // Issuing body and date confirmed by her, 2026-07-27.
      'Licensed architect, Order of Engineers and Architects of Beirut, issued Mar 2024.',
    ],
  },
]

export const EXPERIENCE: CvEntry[] = [
  {
    dates: 'Aug 2024 - Present',
    // Her actual employment title (her review, 2026-07-27), not "Project
    // Architect": this is the anchor title, already true on a payslip, and it
    // is the single most valuable line on the page.
    title: 'Design Technology Architect',
    org: 'Dynamic Solution Co., Kuwait',
    // Written from her own account of the job (2026-07-27). No client is
    // named: brand SECTORS, team size and method are disclosable under
    // ordinary NDA practice, project names are not. This block also now
    // carries Rhino, Grasshopper, Kangaroo, computational, parametric and
    // generative design, which is what let the CRAFT skills row retire: the
    // craft is evidenced by a job rather than asserted by a list.
    projects: [
      // VERBS LEAD ON DUTY BULLETS, present tense for the current job. Named
      // projects elsewhere keep the NAME first: the name is the scannable
      // thing and a verb in front of it would bury it.
      // "parametric design" and "generative design" are spelled WHOLE on
      // purpose: the build's keyword check reads literal strings, and
      // "parametric and generative design" does not contain either of them.
      'Drive parametric design and generative design for exhibitions and brand experiences: Rhino, Grasshopper, Kangaroo.',
      'Direct generative AI from text to image and text to deck, and judge which outputs are worth keeping.',
      'Prototype web and VR experiences for clients, designed human-centered and detailed for disassembly.',
      'Prepare and present concept and pitch for sports, F&B and automotive brands. Studio of ten, interdisciplinary teams.',
    ],
  },
  {
    dates: 'Aug 2023 - Jul 2024',
    title: 'Design Architect',
    org: 'SOMA, Dubai | Beirut',
    // Project names lead (her review): they are the scannable part.
    projects: [
      'Verve City Walk, District O, Enara, Saria: led facade and massing studies in Rhino and Grasshopper.',
      // LOD 300 confirmed by her as true of the SOMA delivery too, 2026-07-27,
      // so the keyword is back on the project that earned it.
      'Delivered those studies into the Revit BIM set at LOD 300: floorplans, interiors, masterplan documentation.',
    ],
  },
  // BIM Modeler, BIM International, Beirut (Jun-Aug 2023) was CUT at her call
  // (2026-07-27), following a 4-of-5 council vote: a two-month stint makes a
  // reader stop and wonder why, and costs more attention than it returns. Its
  // LOD 300 keyword survives in the SOMA entry's "Revit BIM set".
  {
    dates: 'Jan 2022 - Present',
    title: 'Design Architect',
    org: 'Self-employed',
    projects: [
      // Extended at the audit: the line was 73 characters on a 118-character
      // measure, so it had the room to say what the work actually was. SubD
      // and the AI workflows are both on the project's own tech row.
      'Rings of Mars: Ring 4000, a Marsception entry with Charles Abi Chahine: SubD modeling and generative AI.',
      // Workshops dropped: she ATTENDS them, and attending a workshop is not a
      // self-employed activity. Only the research claim survives.
      'Ongoing independent research in computational design and emerging technologies.',
    ],
  },
  {
    // Title aligned to Emilie's LinkedIn + the project pages (S2 ruling,
    // confirmed at the design audit 2026-07-19): "Architectural Designer",
    // not "Intern". MONTH + YEAR on every experience entry (her audit
    // 2026-07-27): mixing "Aug 2024 - Present" with a bare "2022" read as an
    // inconsistency, and it also costs a parser its tenure precision.
    dates: 'Jan 2022 - Aug 2022',
    title: 'Architectural Designer',
    org: 'Jemma Chidiac Architects, Beirut',
    // EXACTLY TWO LINES at her request. The casualty: "research for the
    // Abdullatif Al Fozan Award on mosque architecture", which was the third
    // strand and is now gone. Raised with her rather than dropped silently.
    projects: [
      'The Encounter, an Anfeh cemetery in planted tomb terraces: shaped the concept, landscape and tomb details. Finalist.',
      'Falcon Square, an Al Khobar monument: takeoff lines mirrored into a steel falcon, led from the first sketch.',
    ],
  },
  {
    dates: 'Sep 2021 - Jan 2023',
    title: 'Research Assistant',
    // Full institution name (her review): "LAU" alone means nothing to a
    // European screener.
    org: 'Lebanese American University XR Lab, Byblos',
    projects: [
      'Modelled and animated chemical reactions for AR learning, and researched VR integration in education.',
    ],
  },
]

// ---- THE PROJECT NAME IS A DOOR (board B1, her ruling 2026-07-28) ----------
//
// The web CV's one interactive move, and it needed no new data: because every
// project is NAMED IN PLACE under the degree or role that produced it, the
// link was already written into the bullets above. It just was not clickable.
//
// Only the LEADING name of a bullet is live. The rest of the sentence stays
// flat text, so the record still reads as a document rather than a link farm,
// and a reader's eye lands on the same word it would have landed on anyway.
//
// WHY THIS IS A MAP AND NOT A FIELD ON `projects`: the bullets are also the
// PRINTED CV (src/print/PrintCV.tsx renders these exact strings, and the
// build's ATS parse test reads the resulting text layer). Threading a link
// type through them would push a web-only concern into the one artifact that
// must stay plain text. A lookup keeps the strings untouched and the print
// page entirely unaware this exists.
//
// The AWARDS block is deliberately NOT linked. Its lines name projects too,
// but they name them mid-sentence and every target except The Huddle is
// already reachable from a bullet above; linking them would put seven links
// into six short lines and turn the recognitions into navigation.
//
// The keys are matched as PREFIXES and validated at build time: cv.test.ts
// asserts every key leads exactly one bullet and every value is a real work
// entry, so a reworded bullet fails the build instead of silently going dead.
export const CV_PROJECT_LINKS: Record<string, string> = {
  Sensi: 'sensi',
  'The Lungs': 'lungs',
  lEgoarCh: 'legoarch',
  'The Homage': 'homage',
  // The showcase is filed under the practice that made them, not under one of
  // the four tower names the bullet lists.
  'Verve City Walk': 'soma',
  'Rings of Mars: Ring 4000': 'mars',
  'The Encounter': 'encounter',
  'Falcon Square': 'falcon',
}

// Longest key first, so "The Homage" can never be shadowed by a shorter key
// that happens to prefix it. Computed once.
const LINK_KEYS = Object.keys(CV_PROJECT_LINKS).sort((a, b) => b.length - a.length)

/**
 * Split a bullet into its linkable leading project name and the rest, or null
 * when the bullet does not open with one (the duty bullets, the methods line,
 * the licensure line). The character after the name must be punctuation or a
 * space, so a name is never matched inside a longer word.
 */
export function splitProjectLink(
  bullet: string,
): { name: string; id: string; rest: string } | null {
  for (const key of LINK_KEYS) {
    if (!bullet.startsWith(key)) continue
    const next = bullet.charAt(key.length)
    if (next !== '' && next !== ',' && next !== ':' && next !== '.' && next !== ' ') continue
    return { name: key, id: CV_PROJECT_LINKS[key]!, rest: bullet.slice(key.length) }
  }
  return null
}

// ONE block, every recognition exactly once, each naming its project (the
// projects above stay bare so nothing is said twice). FLAG-07: the externally
// verifiable ones carry the context that makes them checkable; the
// course-internal ones name IAAC so a reader can tell the difference without
// a subhead demoting the MaCAD win. Superlative retired Session 7 (AWD-02).
// Restructured at her review (2026-07-27) after the council flagged that eight
// entries at two years' experience read as padding rather than credibility.
// The MaCAD win keeps its own line; the three remaining course-internal awards
// collapse into ONE line that names IAAC plainly, so a reader can weigh them
// without a subhead demoting anything. Biennale removed at her call.
// The exhibition is CONFIRMED by her (2026-07-27): the work is shown in the
// IAAC annual exhibition, on display for the coming year, and the Sensi award
// was presented at that ceremony. So it is a genuine second claim, not a
// restatement of the award, and it earns its place on the winner's line.
export const AWARDS = [
  {
    year: '2026',
    text: 'MaCAD Awards at IAAC, Design Copilots category winner: Sensi. Shown in the IAAC annual exhibition',
  },
  {
    year: '2026',
    // BIMSC and ACESD dropped to keep this on one printed line: course codes,
    // meaningless outside IAAC, and the projects are named.
    // The "(Artificial Intelligence in Architecture)" gloss ALSO dropped at the
    // audit. It existed to stop an American reader parsing "AIA" as the
    // American Institute of Architects. Nothing on this CV writes "AIA" any
    // more, so the gloss was explaining an abbreviation that is not there.
    text: 'Jury and studio awards at IAAC: lEgoarCh, The Lungs, The Huddle',
  },
  // The Global Summer School moved here from Education (her call): it reads as
  // a recognition, not as a degree, and it was awkward hanging under the
  // degrees. Certificate on disk, July 2025, Barcelona node.
  {
    year: '2025',
    text: 'IAAC Global Summer School, Circular Construction: Shifting Value, Barcelona',
  },
  {
    year: '2024',
    text: 'Volume Zero Marsception: Top 50, with Charles Abi Chahine (Rings of Mars: Ring 4000)',
  },
  {
    year: '2023',
    text: 'Tamayouz Excellence Award: Top 100 graduation projects of 2023, from 422 teams (The Homage)',
  },
  {
    year: '2022',
    text: 'Ctrl Act Design, The Cemetery Challenge: shortlisted finalist (The Encounter)',
  },
]

// The four §9 tier groups, plus two added at the CV pass. Every item is carried
// over from the approved Session 4 list, the shipped project tech rows, or the
// calibration keyword bank; nothing is claimed new here.
// draftCopy: the DOMAIN and WRITING & RESEARCH groups await Emilie's sign-off.
// CRAFT RETIRED (her call, 2026-07-27). The row asserted a craft the CV can
// now evidence: Rhino, Grasshopper, Kangaroo, computational design, parametric
// design and generative design all live inside the Dynamic Solution and SOMA
// entries, where they are attached to a job rather than to a claim. Verified
// against the rendered PDF text, not the source (comments give false
// positives): only "design automation" lost its home, so it moved into AI
// WORKFLOWS below.
export const SKILLS = [
  {
    // Re-weighted 2026-07-27: AI-assisted development is table stakes now, so
    // this group leads with what still discriminates. "Prompt engineering"
    // never appears (retired term).
    group: 'AI workflows',
    items:
      'AI agents and copilots (LangGraph) · evaluation and benchmarking of model output · GenAI pipelines (ComfyUI · ControlNet · LoRA · FLUX) · AI-augmented design workflows · design automation',
  },
  {
    // Speckle restored (a named filter term for consultancy roles, and The
    // Lungs genuinely used it); WebGL sits beside Three.js. TAILWIND DROPPED at
    // the audit: the row overran its line by one word, leaving "Compute"
    // stranded alone on the next, and a CSS framework is the least-screened
    // term in the row.
    group: 'Ships with',
    items:
      'Python · React · Vue · TypeScript · Three.js · WebGL · FastAPI · Speckle · Rhino.Inside · Rhino Compute',
  },
  {
    // The vocabulary a hiring manager uses for this subject, plus the research
    // and communication words her widened targets screen on and the CV carried
    // nowhere. Neuroarchitecture itself stays in the narrative, never in a
    // skills row (it has no hiring market as a term).
    group: 'Domain',
    items:
      'human experience · occupant wellbeing · daylighting · evidence-based design · research design · evaluation methods · benchmarking · human-AI interaction · demo and narrative craft',
  },
]

// PROFESSIONAL RECORD (Revit · BIM (LOD 300) · construction documents · V-Ray ·
// D5 Render · Lumion · Adobe Suite) was RETIRED at her review: "these are
// mentioned in the experience". True of Revit and BIM; NOT true of V-Ray, D5
// Render, Lumion or the Adobe Suite, which now appear nowhere. Raised with her.

// Its own section, not a skills row: it answers "can she communicate" and "is
// there a research cycle", which the CV previously left blank. Counts verified
// 2026-07-27 (14 notes in thoughts/notes.tsx, 12 blog.iaac.net links across the
// project masters).
// THE COUNTS CANNOT GO STALE. They stay literal numbers here (importing the
// registry or the project masters into the CV chunk would drag the whole
// content graph, prose and all, into this page's bundle for two integers), and
// printBook.test.tsx ASSERTS them against the real sources: the registry's
// thought entries and the project masters carrying a blog.iaac.net link.
// Publish a new essay and the build fails until this number is corrected,
// which is the same guarantee as deriving it, at none of the cost.
// 14 -> 18 (THE WORDS, 2026-07-28). THE ONLY CHANGE THIS SESSION MADE TO THE
// CV, and it was not a copy decision: the CV was explicitly out of scope
// ("I don't want to touch anything in the CV anymore"). Four new thought notes
// shipped, printBook.test.tsx asserts this integer against the registry's real
// thought count, and the build fails until it agrees. So the number moved and
// nothing else on the document did. Visible effect: the WRITING & RESEARCH
// line now reads "18 essays" instead of "14 essays", on the page and in the
// PDF. Flagged to her rather than changed quietly.
export const ESSAY_COUNT = 18
export const BLOG_COUNT = 12

// ---- THE WRITING LINE RESOLVES (board B2, her ruling 2026-07-28) -----------
//
// This section NAMED two addresses and linked neither, which is the one thing
// a printed CV is forced to do and a web page has no excuse for. The line is
// now three PARTS, each with the span that should be a destination isolated
// from the prose around it.
//
// WRITING is still assembled from those parts and is BYTE-IDENTICAL to the
// string it was before, because the print page and the build's ATS parse test
// both read it: the structure is added for the screen and costs the paper
// nothing. cv.test.ts pins the joined string so a future edit to a part cannot
// quietly change what the PDF says.
//
// `to` is an internal route, `href` an external site. FLAG: blog.iaac.net has
// no author archive that I could find, so that one lands on the blog's front
// page rather than on her twelve write-ups. If IAAC has an author URL, it
// belongs here.
export type WritingPart = {
  before: string
  link: string
  after: string
  to?: string
  href?: string
}

export const WRITING_PARTS: WritingPart[] = [
  {
    before: `${ESSAY_COUNT} essays at `,
    link: 'emiliechidiac.com/thoughts',
    after: '',
    to: '/thoughts',
  },
  {
    before: `${BLOG_COUNT} project write-ups on `,
    link: 'blog.iaac.net',
    after: '',
    href: 'https://blog.iaac.net',
  },
  {
    before: 'MaCAD Theory Podcast, co-hosted with Charles Abi Chahine: ',
    link: 'Optimizing for the Mind',
    after: ', with Dr. Cleo Valentine',
    to: '/work/podcast',
  },
]

export const WRITING = WRITING_PARTS.map((p) => p.before + p.link + p.after).join(' · ')

export const LANGUAGES = 'Arabic (native) · English (advanced) · French (advanced)'

// RETIRED FROM THE CV at her review, on a unanimous council call: four
// workshop certificates are the lowest-value lines on the page, a CERTIFICATES
// heading reads junior, and every keyword inside them (ControlNet, ComfyUI,
// Rhino.Inside) already sits in the skills rows. Still exported because the
// printed book's record page renders it.
export const CERTIFICATES = [
  'PAACADEMY · AI-Augmented Creative Workflows: Generative Techniques',
  'PAACADEMY · Taking Control 4.0: ControlNet x ComfyUI in Architecture',
  'PAACADEMY · Synthetic Vernacular using Artificial Intelligence 2.0',
  'PAACADEMY · Revit Flow 3.0 with Rhino.Inside: Dynamic Facades',
]

// draftCopy: the summary under the header, unsigned. Structure is a headline
// (the locked title string, rendered separately) plus this summary: research is
// consistent that they are different instruments and that pairing them beats
// choosing one. The "of course" is Emilie's and it is load-bearing: it concedes
// the table-stakes thing in two words so the actual claim can land.
// "computational design" and "parametric design" are NOT here on purpose; they
// live in the CRAFT row, which is what the build's keyword assertion reads.
// The one phrase that must never split across lines: it is the joke, and a
// joke broken in half is not one. Both renderers wrap this exact substring in
// a nowrap span. A non-breaking space was tried first and FAILED, because the
// hyphen in "AI-assisted" is itself a break opportunity and Chrome took it.
export const FOCUS_NOBREAK = 'AI-assisted, of course.'

export const FOCUS =
  'I build tools in Rhino, Grasshopper and code that score how a space works on the people inside it. AI-assisted, of course. The judgment about what they get wrong is mine.'

// THE STAMP IS DERIVED, NOT TYPED (2026-07-27). It used to be a hardcoded
// string, which meant it was wrong the day after anyone forgot to bump it.
//
// It cannot be the DOWNLOAD date: the PDF is rendered once at build time and
// served as a static file, so nothing executes when a visitor downloads it.
// The build date is the honest equivalent and answers the same question, how
// current is this file, because the file is regenerated on every deploy.
//
// Evaluated when the print page renders, which under `npm run build` is the
// moment headless Chrome prints the PDF. Safe from hydration drift because no
// screen route displays it: /cv dropped the stamp deliberately.
// Long form, because the BOOK renders it as "UPDATED JULY 2026" via
// toUpperCase(). The CV dropped its own stamp entirely (her call 2026-07-27:
// the date is not important enough to spend a line on), so this export now
// serves the book alone.
export const UPDATED = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
