// Build-time poster of the frozen EXPLORE constellation (Session 12).
//
// The standing poster contract: the landing/first-paint poster is generated
// from makeGraph() output at build time, never hand-exported, so an appended
// node can never stale it. It is the pre-WebGL first paint of ExploreSurface AND
// the universal fallback (no-WebGL / reduced-motion / save-data / low-power).
//
// Pipeline: esbuild bundles the pure graph + palette modules under Node (their
// Lens imports are type-only, so no three.js/DOM/React is pulled), we project
// every node with the SAME resting orthographic camera the scene uses, emit an
// SVG (carbon ground, faint edges, lens-tick + label per node in the shipped
// type grammar), and sharp rasterizes it to webp with the repo's brand fonts
// registered via a throwaway fontconfig config (libvips/pango reads the woff2
// directly). Legend-free and hero-text-free: the hero line is composited as live
// DOM in Session 13, never baked into the image.
import { build } from 'esbuild'
import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SITE = resolve(here, '..')
const toPosix = (p) => p.split('\\').join('/')

// ---- fonts: register the repo woff2 so pango draws the brand faces ----------
// libvips text goes through pango + fontconfig; a minimal config pointing at the
// fonts dir lets it find 'Martian Mono' / 'Source Serif 4' by family name.
// Written to the OS temp dir so the repo stays clean. Must be set before the
// first sharp text render. If it fails, text falls back but the build survives.
function registerFonts() {
  const fontsDir = toPosix(join(SITE, 'src/assets/fonts'))
  const cacheDir = toPosix(join(tmpdir(), 'eec-poster-fontcache'))
  mkdirSync(cacheDir, { recursive: true })
  const conf = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontsDir}</dir>
  <cachedir>${cacheDir}</cachedir>
</fontconfig>`
  const confPath = join(tmpdir(), 'eec-poster-fonts.conf')
  writeFileSync(confPath, conf)
  process.env.FONTCONFIG_FILE = confPath
}

async function loadGraph() {
  const result = await build({
    stdin: {
      contents: `export { GRAPH } from './src/explore/graph.ts'\nexport { LENSES } from './src/explore/palette.ts'\nexport { CARBON, EDGE } from './src/explore/palette.ts'`,
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

// ---- projection: the scene's resting orthographic camera --------------------
// Mirror scene.ts exactly: sprite world pos = (x*1.12, y*0.72, z*1.12); camera
// at (140,115,140) looking at the origin, ortho half-height F, zoom 1. Equal
// x/y pixel scale falls out of aspect = W/H, so the constellation is undistorted.
const F = 150
const EYE = [140, 115, 140]
const TARGET = [0, 0, 0]
const UP = [0, 1, 0]

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

function makeCamera(aspect) {
  const z = norm(sub(EYE, TARGET))
  const x = norm(cross(UP, z))
  const y = cross(z, x)
  return (p) => {
    const rel = sub(p, EYE)
    const cx = dot(rel, x),
      cy = dot(rel, y),
      cz = dot(rel, z)
    // Orthographic NDC (zoom 1); screen maps like scene.screenPos().
    return { ndcx: cx / (F * aspect), ndcy: cy / F, depth: cz }
  }
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function tickSvg(shape, cx, cy, s, color, opacity) {
  const h = s / 2
  if (shape === 'square')
    return `<rect x="${(cx - h).toFixed(1)}" y="${(cy - h).toFixed(1)}" width="${s}" height="${s}" fill="${color}" opacity="${opacity}"/>`
  if (shape === 'diamond')
    return `<path d="M${cx} ${cy - h} L${cx + h} ${cy} L${cx} ${cy + h} L${cx - h} ${cy} Z" fill="${color}" opacity="${opacity}"/>`
  return `<path d="M${cx} ${cy + h} L${cx + h} ${cy + h} L${cx} ${cy - h} Z" fill="${color}" opacity="${opacity}"/>`
}

function buildSvg({ GRAPH, LENSES, CARBON, EDGE }, W, H) {
  const aspect = W / H
  const project = makeCamera(aspect)
  const world = (n) => [n.x * 1.12, n.y * 0.72, n.z * 1.12]

  const scale = W / 1600 // type sized against a 1600px reference canvas
  const projPx = 26 * scale
  const thoughtPx = 30 * scale
  const gap = 9 * scale

  const pts = GRAPH.nodes.map((n) => {
    const pr = project(world(n))
    return {
      n,
      x: (pr.ndcx * 0.5 + 0.5) * W,
      y: (-pr.ndcy * 0.5 + 0.5) * H,
      depth: pr.depth,
    }
  })

  // Fit-to-frame, LABEL-AWARE: the box spans the tick + the label text (which
  // rides to the RIGHT of each node), so no word clips the canvas edge. Uniform
  // 2D transform, framing only; the constellation's geometry never changes.
  const fontPx = (p) => (p.n.kind === 'project' ? projPx : thoughtPx)
  const charW = (p) => (p.n.kind === 'project' ? projPx * 0.62 : thoughtPx * 0.42)
  const left = (p) => p.x - 6 * scale
  const right = (p) => p.x + gap + p.n.label.length * charW(p)
  const top = (p) => p.y - fontPx(p) * 0.7
  const bottom = (p) => p.y + fontPx(p) * 0.7
  const minX = Math.min(...pts.map(left)),
    maxX = Math.max(...pts.map(right)),
    minY = Math.min(...pts.map(top)),
    maxY = Math.max(...pts.map(bottom))
  const spanX = maxX - minX || 1,
    spanY = maxY - minY || 1
  const fit = Math.min((W * 0.92) / spanX, (H * 0.92) / spanY)
  const cxData = (minX + maxX) / 2,
    cyData = (minY + maxY) / 2
  const tx = (p) => (p.x - cxData) * fit + W / 2
  const ty = (p) => (p.y - cyData) * fit + H / 2

  // Depth range for a subtle back-to-front opacity gradient (front = brighter),
  // floored so far words stay legible.
  const depths = pts.map((p) => p.depth)
  const dMin = Math.min(...depths),
    dMax = Math.max(...depths)
  const depthAlpha = (d) => {
    const t = dMax === dMin ? 1 : (d - dMin) / (dMax - dMin) // 0 far .. 1 near
    return 0.66 + 0.34 * t
  }

  // Faint edges first (the network read), then labels on top.
  const edgeSvg = GRAPH.edges
    .map((e) => {
      const a = pts[e.a],
        b = pts[e.b]
      const op = (0.10 * Math.min(depthAlpha(a.depth), depthAlpha(b.depth))).toFixed(3)
      return `<line x1="${tx(a).toFixed(1)}" y1="${ty(a).toFixed(1)}" x2="${tx(b).toFixed(1)}" y2="${ty(b).toFixed(1)}" stroke="${EDGE}" stroke-width="${(1 * scale).toFixed(2)}" opacity="${op}"/>`
    })
    .join('\n')

  // Painter's order: far nodes first.
  const ordered = [...pts].sort((p, q) => p.depth - q.depth)
  const labelSvg = ordered
    .map((p) => {
      const isP = p.n.kind === 'project'
      const lens = LENSES[p.n.lens]
      const color = lens.wire
      const a = depthAlpha(p.depth)
      const x = tx(p),
        y = ty(p)
      const tick = tickSvg(lens.tick, x, y, 9 * scale, color, (isP ? 1 : 0.85) * a)
      const label = isP
        ? `<text x="${(x + gap).toFixed(1)}" y="${(y + projPx * 0.35).toFixed(1)}" font-family="Martian Mono" font-size="${projPx.toFixed(1)}" letter-spacing="${(0.5 * scale).toFixed(2)}" fill="${color}" opacity="${a.toFixed(3)}">${esc(p.n.label)}</text>`
        : `<text x="${(x + gap).toFixed(1)}" y="${(y + thoughtPx * 0.34).toFixed(1)}" font-family="Source Serif 4" font-style="italic" font-size="${thoughtPx.toFixed(1)}" fill="${color}" opacity="${(0.78 * a).toFixed(3)}">${esc(p.n.label)}</text>`
      return tick + label
    })
    .join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${CARBON}"/>
${edgeSvg}
${labelSvg}
</svg>`
}

// ---- run --------------------------------------------------------------------
// Register fonts BEFORE sharp/libvips loads, then import it dynamically, so
// pango reads the brand woff2 instead of eagerly initialising fontconfig
// without them (fixes off-brand text on eager-init platforms, e.g. CI Linux).
registerFonts()
const sharp = (await import('sharp')).default
const mod = await loadGraph()
const data = { GRAPH: mod.GRAPH, LENSES: mod.LENSES, CARBON: mod.CARBON, EDGE: mod.EDGE }

const OUT = join(SITE, 'public', 'assets')
mkdirSync(OUT, { recursive: true })

// Square retina canvas: covers both wide and tall viewports gracefully under
// object-fit cover (the surface's framing). Type scales with W (scale = W/1600).
const W = 2048,
  H = 2048
const svg = buildSvg(data, W, H)
const svgBuf = Buffer.from(svg)

// One webp; the surface scales it with object-fit cover. Flat carbon + thin
// type compresses tiny, well under the LCP budget.
const target = join(OUT, 'explore-poster.webp')
const info = await sharp(svgBuf).webp({ quality: 82, effort: 5 }).toFile(target)
console.log(
  `poster ${info.width}x${info.height} -> public/assets/explore-poster.webp (${Math.round(info.size / 1024)}KB, ${data.GRAPH.nodes.length} nodes)`,
)
