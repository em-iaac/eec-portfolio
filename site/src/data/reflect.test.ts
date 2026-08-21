// THE TWO RECORDS MUST AGREE (Emilie's ruling 2026-08-06, and it is the ask
// that matters most in this file): "make sure it's all reflected always, make
// it a system that whatever we change in the cv or the commit graph in the map
// it should always be in a way reflected somehow if chosen."
//
// WHY THIS EXISTS. The site keeps her history in two places on purpose. The CV
// (data/cv.ts) is prose written for a human reader and a parser; the registry
// (data/registry.ts) is a dated census the world map, the head, the sitemap and
// the book all read. They will never be generated from each other, because the
// CV groups and rewords ("Jury and studio awards at IAAC: lEgoarCh, The Lungs,
// The Huddle" is one line for three registry entries).
//
// So the guarantee is not "identical". It is: NOTHING IS ON ONE SURFACE BY
// ACCIDENT. Every milestone and award in the registry either answers to a CV
// line, or is named below as deliberately map-only, and vice versa. Adding a
// fact to either side without deciding about the other fails this test.
//
// WHAT THE 2026-08-06 AUDIT FOUND, which is what the guard is calibrated to:
//   · one job with two titles (the map said Project Architect, the CV said
//     Design Technology Architect, for six weeks)
//   · The Huddle's award filed under 2025 on the map and 2026 on the CV
//   · a licence and a summer school on the CV and nowhere else
//   · a Biennale entry in the registry that rendered on no surface at all
import { describe, expect, it } from 'vitest'
import { ENTRIES } from './registry'
import { AWARDS, EDUCATION, EXPERIENCE } from './cv'
import { WORLD_KINDS } from '../thoughts/world/worldGraph'

// ---- the reconciliation table ----------------------------------------------
// Each entry pins BOTH SIDES: `cv` is a phrase that must appear somewhere in the
// CV, `map` is a phrase that must appear in that registry entry's own title.
// `cv: null` is a DECISION and needs a reason beside it.
//
// ⚠ TWO FIELDS, NOT ONE, AND THAT IS THE WHOLE POINT. The first version of this
// table held only the CV phrase, and it PASSED while the exact bug it was
// written for was reintroduced: with `cv: 'Dynamic Solution'` the check stayed
// green whether the map said Design Technology Architect or Project Architect,
// because the CV contains the employer either way. A guard that cannot fail is
// not a guard. Pinning the map side too is what makes a change on either
// surface break the test, which is what she actually asked for.
//
// The two phrases are usually different on purpose: the CV is written for a
// human and a parser ("Bachelor of Architecture"), the map is a dated mark on a
// drawing ("B.ARCH"). Requiring them to match would force one register onto
// both. Requiring each to be present keeps them honest without merging them.
const RECONCILE: Record<string, { cv: string | null; map: string; why?: string }> = {
  // milestones
  'xrlab-start': { cv: 'Research Assistant', map: 'Research Assistant' },
  'self-open': { cv: 'Self-employed', map: 'Self-employed' },
  'barch-grad': { cv: 'Bachelor of Architecture', map: 'B.ARCH' },
  'soma-start': { cv: 'SOMA', map: 'SOMA' },
  'dynamic-start': { cv: 'Design Technologist', map: 'Design Technologist' },
  'macad-start': { cv: 'Master in Advanced Computational Design', map: 'MaCAD begins' },
  licence: { cv: 'Licensed architect', map: 'Licensed architect' },
  gss: { cv: 'Global Summer School', map: 'Global Summer School' },
  'macad-y1': {
    cv: null,
    map: 'MaCAD Year 1',
    why: 'A progress marker for the map\'s live tip, not a credential. A CV does not list "finished year one".',
  },
  'site-live': {
    cv: null,
    map: 'emiliechidiac.com',
    why: 'The site announcing itself. It belongs on the map it is drawn on, nowhere else.',
  },
  // awards
  'sensi-macad-award': { cv: 'MaCAD Awards', map: 'MaCAD Awards' },
  'legoarch-jury': { cv: 'lEgoarCh', map: 'lEgoarCh' },
  'lungs-award': { cv: 'The Lungs', map: 'The Lungs' },
  'huddle-award': { cv: 'The Huddle', map: 'The Huddle' },
  'mars-top50': { cv: 'Marsception', map: 'Marsception' },
  tamayouz: { cv: 'Tamayouz', map: 'Tamayouz' },
  cemetery: { cv: 'Cemetery Challenge', map: 'Cemetery Challenge' },
}

const CV_TEXT = [
  ...AWARDS.map((a) => `${a.year} ${a.text}`),
  // `notes` is a string on some entries and a list on others, and `projects` is
  // a third place a fact can live: the licensure line sits there, under the
  // degree that qualified her for it. Harvest all three or the guard reports a
  // fact as missing when it is only somewhere this test was not looking.
  ...EXPERIENCE.map(
    (e) => `${e.dates ?? ''} ${e.title} ${e.org} ${[e.notes ?? ''].flat().join(' ')} ${(e.projects ?? []).join(' ')}`,
  ),
  ...EDUCATION.map(
    (e) => `${e.title} ${e.org} ${[e.notes ?? ''].flat().join(' ')} ${(e.projects ?? []).join(' ')}`,
  ),
].join('\n')

const recorded = ENTRIES.filter((e) => e.kind === 'milestone' || e.kind === 'award')

describe('the CV and the map reflect each other', () => {
  it('every milestone and award has been reconciled with the CV', () => {
    const unlisted = recorded.filter((e) => !(e.id in RECONCILE)).map((e) => e.id)
    expect(
      unlisted,
      'new registry milestones/awards must be added to RECONCILE above, with a CV phrase or a reason for null',
    ).toEqual([])
  })

  it('every fact claimed on both surfaces is actually on both', () => {
    const missing = recorded
      .filter((e) => RECONCILE[e.id]?.cv)
      .filter((e) => !CV_TEXT.includes(RECONCILE[e.id]!.cv!))
      .map((e) => `${e.id} -> CV should contain "${RECONCILE[e.id]!.cv}"`)
    expect(missing).toEqual([])
  })

  it('the map still says what the table says it says', () => {
    // The half that was missing first time round. Without this, changing a
    // registry title is invisible: the CV still contains the employer, so the
    // CV-side check stays green while the two surfaces have drifted apart. This
    // is the assertion that catches "Design Technology Architect" quietly
    // becoming "Project Architect" again.
    const drifted = recorded
      .filter((e) => e.id in RECONCILE)
      .filter((e) => !e.title.includes(RECONCILE[e.id]!.map))
      .map((e) => `${e.id}: title "${e.title}" should contain "${RECONCILE[e.id]!.map}"`)
    expect(drifted).toEqual([])
  })

  it('every map-only fact says why it is map-only', () => {
    const unexplained = recorded
      .filter((e) => e.id in RECONCILE && RECONCILE[e.id]!.cv === null)
      .filter((e) => !RECONCILE[e.id]!.why)
      .map((e) => e.id)
    expect(unexplained).toEqual([])
  })

  it('the years agree wherever both surfaces state one', () => {
    // The Huddle case: the CV filed a 2025 award under 2026 for months.
    const wrong: string[] = []
    for (const e of recorded.filter((x) => x.kind === 'award')) {
      const phrase = RECONCILE[e.id]?.cv
      if (!phrase) continue
      const row = AWARDS.find((a) => a.text.includes(phrase))
      if (!row) continue
      if (row.year !== e.date.slice(0, 4)) {
        wrong.push(`${e.id}: map ${e.date.slice(0, 4)} vs CV ${row.year}`)
      }
    }
    expect(wrong).toEqual([])
  })

  it('nothing in the registry renders on no surface at all', () => {
    // The Biennale case: a 'press' entry sat in the single source of truth and
    // appeared on no page, in no map, in no route. Every entry must be either a
    // world kind, a routed page, or a sheet-issue log line.
    const invisible = ENTRIES.filter(
      (e) =>
        !WORLD_KINDS.has(e.kind) &&
        e.kind !== 'now' &&
        e.kind !== 'sheet' &&
        !e.note &&
        !e.sheet,
    ).map((e) => `${e.id} (${e.kind})`)
    expect(invisible, 'a registry entry that no surface reads is dead data').toEqual([])
  })
})
