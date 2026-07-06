# eec-portfolio

Emilie El Chidiac | Design Technology Architect. Live at
[em-iaac.github.io/eec-portfolio](https://em-iaac.github.io/eec-portfolio/).

The site lives in [`site/`](site/) (React + Vite + Tailwind v4) and deploys to
GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`.

```bash
cd site
npm ci
npm run dev     # local dev server
npm run build   # type-check + production build
npm run images  # regenerate the responsive image manifest (sharp)
```

## How the site stays fresh

Everything dated (projects, thoughts, milestones, awards, sheet issues) is one
entry in [`site/src/data/registry.ts`](site/src/data/registry.ts). The Home
bench-roll timeline, the Notebook archive, the `/sheets/:id` routes, and the
EXPLORE graph all read from it. Shipping something new = add one registry
entry (+ assets, + a sheet file in `site/src/sheets/` when it's written).
Mind the invariants documented at the top of the registry: EXPLORE node order
is frozen (the 3D layout is a seeded simulation), and sheet numbers are owned
by the registry.

Design governance (tokens, redline rules, motion tiers) lives in
[`site/DESIGN-SYSTEM.md`](site/DESIGN-SYSTEM.md) and the `@theme` block of
[`site/src/index.css`](site/src/index.css). The Session 3 design contract is
in [`design_handoff_eec_portfolio/`](design_handoff_eec_portfolio/).
