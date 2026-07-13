// THE MASTER CONTENT FILE (G1, 2026-07-10; REDESIGN-SPEC §11). ONE file per
// project under content/projects/ is the canonical home of everything the
// project SAYS: the card copy that used to live in data/projects.tsx plus the
// showcase spine. The /work card, the opened showcase, and later the book
// spread and the CV line are RENDITIONS of this one object. The registry
// (data/registry.ts) stays the single INDEX: dates, numbers, tags, joins.
//
// THE SPINE (signed by Emilie in the G1 director session, 2026-07-10):
// WHAT · WHY · HOW · WHAT CAME OF IT, then the tools, then the links out.
// WHAT and WHY are authored for every project. HOW and OUTCOME render only
// where real material exists: a thin project is honestly short, never padded
// (no slot begs to be filled). Winks ride inline as the <NB> hover dot, one
// per project at most, only where a good one already exists.
//
// Copy rules that bind every field (REDESIGN-SPEC §0): attribution woven into
// prose as ordinary sentences, never labelled lines or percentages; verbs
// score / estimate / model, never measure; Lungs "designed to filter";
// lEgoarCh's instructive fail is narrated without its percentage; Emilie's
// voice, NO em dashes; new prose ships showcaseDraft: true until she signs it.
import type { ReactNode } from 'react'
import type { Lens } from '../../components/Lens'

export interface ProjectMaster {
  slug: string
  title: string
  lens: Lens
  meta: string
  award?: string
  // The card face's corner-pill short wording (DL-2); the full award line
  // still renders verbatim in the showcase.
  awardShort?: string
  // The record/index short text (locked copy where noted in the file).
  blurb: ReactNode
  tech: string
  links: { label: string; href: string }[]
  // `position` = CSS object-position for the uniform 4:3 crop (escape hatch
  // when center-crop cuts the important part of a wide screenshot).
  image?: { slug: string; name: string; alt: string; position?: string }
  draftCopy?: boolean
  // Session 7 rulings: myPart NEVER renders as a labeled line; it is woven
  // into `what` as an ordinary sentence. `stat` = the one defensible number.
  myPart?: string
  stat?: string
  // The card's ONE authored "what it proves" line; the showcase's claim.
  dek?: string
  dekSigned?: boolean
  // THE QUESTION (D4, authored in S4/S5, signed before it ships): the one
  // plain-language question this project answers. The moment it exists it
  // automatically becomes the route's <meta name="description"> and the
  // JSON-LD description (lib/headData.ts prefers it over the dek); S4 also
  // makes it the on-screen claim. Until then the signed dek serves.
  question?: string
  // The listening member's hero line (the podcast leads with a pull-quote).
  pullQuote?: { text: string; source: string }

  // ---- The showcase spine (G1) --------------------------------------------
  // WHAT: the story under the claim, 2-4 sentences, credits woven in.
  what: ReactNode
  // WHY: one short beat, why it matters or why she did it.
  why: ReactNode
  // HOW: 3-5 tight numbered steps; the full method stays in the blog/repo.
  how?: ReactNode[]
  // WHAT CAME OF IT: only where real (a finding, an instructive fail, what
  // it changed). Never invented to fill the slot.
  outcome?: ReactNode
  // The new spine prose is unsigned until Emilie signs it (Section 14).
  showcaseDraft: boolean

  // ---- Future renditions (declared now so the shape is complete) ----------
  cvLine?: string
  spreadAssets?: { slug: string; name: string }[]
}
