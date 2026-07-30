# eec-portfolio

Emilie El Chidiac | Design Technology Architect. Live at
[emiliechidiac.com](https://emiliechidiac.com/).

The site is a hand-built React app rather than a template, and the landing page is a drawn
mind graph you can touch. It also prints: the same content renders a designed A4 book and a
one-page ATS-readable CV, both regenerated and asserted on every build.

The app lives in [`site/`](site/) (React + Vite + Tailwind v4) and deploys to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

```bash
cd site
npm ci
npm run dev      # local dev server
npm run build    # tests + type-check + build + prerender + both PDFs
npm run images   # regenerate the responsive image ladders (sharp)
npm run videos   # re-encode the demo videos (ffmpeg, per-item crop filters)
```

## The rooms

| Route | What it is |
|---|---|
| `/` | the landing: an SVG mind graph, every node a door |
| `/work` | the index. 21 projects as ink plates that reveal their cover on hover |
| `/work/:id` | a project page. One spine: what, why, how, what came of it |
| `/thoughts` | the essays, laid out as a neural world |
| `/thoughts/:id` | one essay |
| `/behavior-information-modeling` | the pillar page for the term |
| `/cv`, `/contact` | the record and the ways in. `/cv` prints |
| `/rights` | ownership, credit and what the site collects. Linked from the footline only |
| `/print/book`, `/print/cv` | the print surfaces the build renders to PDF |

## How it stays consistent

**One registry.** Everything dated (projects, essays, milestones, awards) is a single entry in
[`site/src/data/registry.ts`](site/src/data/registry.ts). The index, the world, the CV timeline
and the printed book all read from it, so `/work` and the book's index page cannot drift apart.
Adding work means adding one registry entry plus a content file in
[`site/src/content/projects/`](site/src/content/projects/).

**The build is the reviewer.** `npm run build` runs the tests, then prerenders every route,
generates the OG cards, and renders both PDFs, asserting as it goes: the CV must fit one page,
its name must read contiguously in the text layer, `Rhino Compute` must keep its space, the
book must have no empty pages, and neither document may contain an em dash. A failed assertion
fails the deploy.

**Governance lives in docs, not in habits.** [`DESIGN-LANGUAGE.md`](DESIGN-LANGUAGE.md) holds
the tokens, motion tiers and interaction grammar. [`REDESIGN-SPEC.md`](REDESIGN-SPEC.md) is the
design of record and the decision log. [`CONTENT-STRATEGY.md`](CONTENT-STRATEGY.md) covers
content and search.

**A guard runs before the build.** A term list held as a repository secret is grepped against
the checkout on every deploy, and a local pre-push hook does the same before anything leaves
the machine. Its job is to make sure personal data never ships, which is a thing you only build
after it nearly does.

## Honest notes

- **The prettiest version was the slowest one.** The hover-reveal covers on `/work` were
  originally full-weight images and the grid lagged. Each plate now rests as a small static
  frame and only loads its animated cover on hover, and phones plus reduced-motion never get
  the animation at all.
- **Superseded image versions were rewritten out of history.** Old versions of a few app
  screenshots and one screen recording carried a browser window and a teammate's session in
  frame. The working tree was fixed first and history was rewritten afterwards, which is the
  wrong order and the reason the guard above exists.

## Not open source

The code is public so it can be read. The writing, the drawings and the project content are
mine and are not offered for reuse. There is deliberately no `LICENSE` file: the default is
all rights reserved, and for a repository that is mostly sentences the default is the right
answer. Ask if you want to use something.

Most of the work shown here was made with other people, and every collaborator is named in
the prose of the project they worked on. Employer work belongs to the practice that paid for
it and says so in its credit row. The four typefaces are under the SIL Open Font License and
their notice travels with the files, at
[`site/src/assets/fonts/OFL.txt`](site/src/assets/fonts/OFL.txt). The full picture is at
[`/rights`](https://emiliechidiac.com/rights).
