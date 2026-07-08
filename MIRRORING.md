# MIRRORING.md · the Sensi repo mirror checklist (Session 7)

Status: **CONDITIONAL, not started.** The Sensi codebase lives in the course
repo under the instructor's account
(`github.com/sclebow/AIA26_Studio/tree/main/team_02`). Mirroring it to
`github.com/hi-em` happens ONLY if faculty says yes; Emilie asks first.
Nothing in this checklist runs before that answer.

Why mirror at all: today the portfolio's strongest awarded project points at a
repo Emilie does not control, whose README names no team. A mirror under her
own account gives the work a stable, credited, linkable home.

## Step 0 · The ask (Emilie, before anything else)

- [ ] Message the AIA Studio faculty (João M. Silva / Bao Trinh / Scott Lebow)
      and ask permission to publish a credited mirror of `team_02` under her
      GitHub account. Suggested wording, hers to edit:

> Hi! I'd like to host a mirror of our team_02 Sensi folder on my own GitHub
> (github.com/hi-em) so my portfolio can link to a stable, credited copy:
> full team + faculty credits in the README, a link back to the course repo,
> and no claim that it's anything other than our MaCAD studio work. Would
> that be okay with you? Happy to adjust whatever you'd like.

- [ ] Record the answer (yes / yes-with-conditions / no) and the date.

## If YES · the mirror checklist

- [ ] Create `github.com/hi-em/sensi` (public). Snapshot copy of `team_02`
      only (no course-repo history, no other teams' folders).
- [ ] **Secrets sweep before the first push:** grep the tree for `.env`, API
      keys, tokens (LangGraph / FastAPI / LLM provider configs are the likely
      spots). Nothing ships until this is clean.
- [ ] README, top to bottom:
  - [ ] One-paragraph summary (the copilot, six senses, coupling matrix).
  - [ ] **Credits block, above the fold:** Emilie El Chidiac, Lakzhmy Mari
        Zaro, María Sánchez Domínguez, Charles Abi Chahine · faculty João M.
        Silva, Bao Trinh, Scott Lebow · MaCAD 2025/26, IAAC.
  - [ ] Award line: MaCAD Awards 2026 · Design Copilots · winner.
  - [ ] Link back to the original course repo (provenance, not a fork claim).
  - [ ] Links: IAAC blog post, the live portfolio sheet when P-101 issues.
  - [ ] 2-4 screenshots from `team_02/docs/shots/` (graph, comfort, galaxy).
- [ ] License: ask faculty what the course repo allows; mirror it verbatim or
      mark "all rights reserved, published with permission" if unclear.
- [ ] Honor any conditions faculty attached.
- [ ] Then, in a site session: point the Sensi card's GITHUB link at the
      mirror (`site/src/data/projects.tsx`, both HEROES and HOME_FEATURED).
      Until then the card keeps the course-repo link.

## If NO · the fallback (per the session spec)

The README-credits objective does not die; it moves:

- [ ] The credits block above ships inside the future Sensi sheet (P-101,
      Session 8) as its own labeled section.
- [ ] The Sensi demo videos in Emilie's demos folder gain a credits slate
      (one frame: team + faculty + MaCAD 2025/26 IAAC) before any video is
      attached to posts or featured items.
- [ ] The card's GITHUB link stays pointed at the course repo, which remains
      the honest source.
