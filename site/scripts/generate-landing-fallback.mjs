// Build-time STATIC FALLBACK of the landing mind-graph (Session R1; replaces the
// retired three.js explore-poster pipeline).
//
// The frozen-layout guardrail migrated onto the mind-graph: the layout is frozen
// in src/landing/mindGraph.ts (+ its snapshot test), and this script regenerates
// the static fallback from that SAME model, so an appended node can never stale
// it. Output is the FINAL composition (no draw-in) as a plain SVG at
// public/assets/mind-graph.svg: the no-JS / crawler fallback of the SVG cover,
// and the picture the per-route prerender (R9) can inline. It is SVG (not a
// raster): the cover itself is SVG/DOM, so the fallback needs no WebGL and no
// font rasterisation.
//
// esbuild bundles the pure model + palette under Node (their only non-type import
// is the registry, which is DOM/three-free), we call MIND once, and emit the SVG.
import { build } from 'esbuild'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SITE = resolve(here, '..')

async function loadModel() {
  const result = await build({
    stdin: {
      contents:
        "export { MIND, THREADS, VIEWBOX, spline, starPath } from './src/landing/mindGraph.ts'\n" +
        "export { CARBON, EDGE, ANNO_DARK, LENSES } from './src/landing/palette.ts'",
      resolveDir: SITE,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  return import(url)
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function buildSvg(m) {
  const { MIND, THREADS, VIEWBOX, spline, starPath, CARBON, EDGE, ANNO_DARK, LENSES } = m

  const threads = THREADS.map(
    (t) =>
      `<path d="${spline(t.pts)}" fill="none" stroke="${EDGE}" stroke-width="1.2" stroke-linecap="round" opacity="0.28"/>`,
  ).join('\n')

  const edgeLabels = THREADS.filter((t) => t.label)
    .map(
      (t) =>
        `<text x="${t.label[0]}" y="${t.label[1]}" text-anchor="${t.anchor}" font-family="Martian Mono" font-size="8" letter-spacing="1.1" fill="${ANNO_DARK}">${esc(t.id)}</text>`,
    )
    .join('\n')

  const nodes = MIND.nodes
    .map((n) => {
      const isProject = n.kind === 'project'
      let mark
      if (n.award) {
        mark = `<path d="${starPath(n.x, n.y, 5.6)}" fill="${EDGE}"/>`
      } else if (isProject) {
        mark = `<circle cx="${n.x}" cy="${n.y}" r="3.6" fill="${EDGE}"/>`
      } else {
        mark = `<circle cx="${n.x}" cy="${n.y}" r="3.2" fill="none" stroke="${EDGE}" stroke-width="1.4"/>`
      }
      const label = n.rest
        ? isProject
          ? `<text x="${n.x + n.d[0]}" y="${n.y + n.d[1]}" text-anchor="${n.a}" font-family="Martian Mono" font-size="8" letter-spacing="0.8" fill="${EDGE}">${esc(n.label)}</text>`
          : `<text x="${n.x + n.d[0]}" y="${n.y + n.d[1]}" text-anchor="${n.a}" font-family="Source Serif 4" font-style="italic" font-size="9.5" fill="${ANNO_DARK}">${esc(n.label)}</text>`
        : ''
      return mark + label
    })
    .join('\n')

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX.w}" height="${VIEWBOX.h}" viewBox="0 0 ${VIEWBOX.w} ${VIEWBOX.h}" role="img" aria-label="A dark constellation of Emilie El Chidiac's projects and thoughts, connected by shared idea threads.">\n` +
    `<rect width="${VIEWBOX.w}" height="${VIEWBOX.h}" fill="${CARBON}"/>\n` +
    threads +
    '\n' +
    edgeLabels +
    '\n' +
    nodes +
    '\n</svg>\n'
  )
}

const m = await loadModel()
const svg = buildSvg(m)
const OUT = join(SITE, 'public', 'assets')
mkdirSync(OUT, { recursive: true })
const target = join(OUT, 'mind-graph.svg')
writeFileSync(target, svg)
console.log(
  `landing fallback -> public/assets/mind-graph.svg (${Math.round(svg.length / 1024)}KB, ${m.MIND.nodes.length} nodes)`,
)
