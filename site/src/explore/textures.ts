// Word-sprite textures: projects set in Martian Mono caps with a lens tick,
// thoughts in Source Serif 4 italic lowercase at 78% alpha. Dual textures
// per node (norm + hot); hot is the redline hover state. Fonts MUST be
// loaded before measuring/drawing or sprites render in fallback faces.
import * as THREE from 'three'
import { LENSES, REDLINE_WIRE } from './palette'
import type { GraphNode } from './graph'

const PROJECT_FONT = "26px 'Martian Mono'"
const THOUGHT_FONT = "italic 30px 'Source Serif 4'"

export async function loadExploreFonts(): Promise<void> {
  const load = Promise.all([
    document.fonts.load(PROJECT_FONT, 'A BALLOONING MARKET'),
    document.fonts.load(THOUGHT_FONT, 'behavior information modeling'),
  ]).then(() => undefined)
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2000))
  try {
    await Promise.race([load, timeout])
  } catch {
    // fall through: worst case is fallback-font sprites, never a blank scene
  }
}

function drawTick(
  ctx: CanvasRenderingContext2D,
  lens: GraphNode['lens'],
  x: number,
  y: number,
  s: number,
) {
  ctx.beginPath()
  if (LENSES[lens].tick === 'square') ctx.rect(x, y - s / 2, s, s)
  else if (LENSES[lens].tick === 'diamond') {
    ctx.moveTo(x + s / 2, y - s / 2)
    ctx.lineTo(x + s, y)
    ctx.lineTo(x + s / 2, y + s / 2)
    ctx.lineTo(x, y)
    ctx.closePath()
  } else {
    ctx.moveTo(x, y + s / 2)
    ctx.lineTo(x + s, y + s / 2)
    ctx.lineTo(x + s / 2, y - s / 2)
    ctx.closePath()
  }
  ctx.fill()
}

export function makeTexture(
  n: GraphNode,
  red: boolean,
): { tex: THREE.CanvasTexture; w: number; h: number } {
  const isP = n.kind === 'project'
  const font = isP ? PROJECT_FONT : THOUGHT_FONT
  const c = document.createElement('canvas')
  const measure = c.getContext('2d')!
  measure.font = font
  const tw = measure.measureText(n.label).width
  const tick = 14,
    gap = 10,
    pad = 8
  c.width = Math.ceil(tw + tick + gap + pad * 2)
  c.height = 52
  const ctx = c.getContext('2d')!
  const color = red ? REDLINE_WIRE : LENSES[n.lens].wire
  ctx.globalAlpha = isP ? 1 : 0.78
  ctx.fillStyle = color
  drawTick(ctx, n.lens, pad, 27, tick * 0.7)
  ctx.font = font
  ctx.textBaseline = 'middle'
  ctx.fillText(n.label, pad + tick + gap - 4, 28)
  const tex = new THREE.CanvasTexture(c)
  tex.minFilter = THREE.LinearFilter
  return { tex, w: c.width, h: c.height }
}
