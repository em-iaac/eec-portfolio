// incoming/<slug>/... (git-ignored staging) -> public/assets/projects/<slug>/
// H.264 mp4 (mp4-only per Emilie 2026-07-08; the sources array in the
// manifest keeps a webm slot open) + a poster webp ladder grabbed from the
// ENCODED clip so poster and video always match. Emits src/data/videos.json
// for SheetVideo. Optional slug args (`npm run videos -- sensi`) process
// only those slugs and MERGE into the existing manifest; no args = full
// regeneration. ffmpeg-static carries the encoder; it ships no ffprobe, so
// duration parses from `ffmpeg -i` stderr and dimensions come from the
// poster grab via sharp. spawnSync with arg arrays only (never a shell:
// staging filenames contain spaces).
import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { VIDEOS, MAX_W, POSTER_SIZES } from './video-manifest.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const INCOMING = join(here, '..', '..', 'incoming')
const OUT = join(here, '..', 'public', 'assets', 'projects')
const DATA = join(here, '..', 'src', 'data')

// ffmpeg-static exports null on an unsupported platform/arch, and a blocked
// postinstall download leaves a path to a missing binary; either way, fail
// with a clear message instead of a bare TypeError or a misleading
// "ffmpeg failed" further down.
if (!ffmpegPath) throw new Error('ffmpeg-static provides no binary for this platform/arch')

const only = process.argv.slice(2)
// A typo'd slug must not be a silent successful no-op.
const unknown = only.filter((s) => !(s in VIDEOS))
if (unknown.length) {
  console.error(`unknown slug(s): ${unknown.join(', ')} — known: ${Object.keys(VIDEOS).join(', ')}`)
  process.exit(1)
}

const results = only.length
  ? JSON.parse(readFileSync(join(DATA, 'videos.json'), 'utf8'))
  : {}

const run = (args, opts = {}) => {
  const res = spawnSync(ffmpegPath, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  })
  // Distinguish a failure to LAUNCH (ENOENT, missing binary) from a non-zero
  // encode exit, which callers check via res.status.
  if (res.error) throw new Error(`could not launch ffmpeg (${ffmpegPath}): ${res.error.message}`)
  return res
}

// `ffmpeg -i` with no output exits non-zero by design; duration is on stderr.
function probeDuration(src) {
  const r = run(['-hide_banner', '-i', src])
  const m = /Duration: (\d+):(\d+):(\d+)\.(\d+)/.exec(String(r.stderr))
  if (!m) throw new Error(`no duration parsed for ${src}`)
  return Math.round(+m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 100)
}

for (const [slug, items] of Object.entries(VIDEOS)) {
  if (only.length && !only.includes(slug)) continue
  const outDir = join(OUT, slug)
  mkdirSync(outDir, { recursive: true })
  results[slug] = []

  for (const item of items) {
    const src = join(INCOMING, item.src)
    const mp4Name = `${item.name}-${MAX_W}.mp4`
    const mp4Out = join(outDir, mp4Name)

    const enc = run(
      [
        '-y', '-hide_banner', '-loglevel', 'error',
        '-i', src,
        // MAX_W is a CEILING: min(iw, MAX_W) so a sub-1280 source is not
        // lanczos-upscaled (mirrors sharp's withoutEnlargement on posters).
        // Single quotes keep the comma inside min() from splitting the arg.
        // item.vf runs FIRST (e.g. a crop that removes recorded browser
        // chrome, the 2026-07-15 neurospace privacy fix), then the scale.
        '-vf', `${item.vf ? `${item.vf},` : ''}scale='min(iw,${MAX_W})':-2:flags=lanczos`,
        '-r', '30',
        '-c:v', 'libx264',
        '-crf', String(item.crf ?? 25),
        '-preset', 'slow',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        ...(item.audio ? ['-c:a', 'aac', '-b:a', '96k', '-ac', '2'] : ['-an']),
        mp4Out,
      ],
      { stdio: ['ignore', 'inherit', 'inherit'] },
    )
    if (enc.status !== 0) throw new Error(`ffmpeg failed for ${item.src}`)

    // Poster from the ENCODED clip: scale and framing always match.
    const grab = run([
      '-hide_banner', '-loglevel', 'error',
      '-ss', String(item.posterAt ?? 1),
      '-i', mp4Out,
      '-frames:v', '1',
      '-f', 'image2pipe', '-c:v', 'png', 'pipe:1',
    ])
    if (grab.status !== 0 || !grab.stdout?.length)
      throw new Error(`poster grab failed for ${item.name}`)

    const meta = await sharp(grab.stdout).metadata()
    const poster = []
    for (const w of POSTER_SIZES.filter((w) => w <= meta.width)) {
      const name = `${item.name}-poster-${w}.webp`
      const r = await sharp(grab.stdout)
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(join(outDir, name))
      poster.push({ w, file: `assets/projects/${slug}/${name}`, kb: Math.round(r.size / 1024) })
    }

    const kb = Math.round(statSync(mp4Out).size / 1024)
    results[slug].push({
      name: item.name,
      aspect: +(meta.width / meta.height).toFixed(4),
      duration: probeDuration(mp4Out),
      audio: !!item.audio,
      sources: [
        { file: `assets/projects/${slug}/${mp4Name}`, type: 'video/mp4', w: meta.width, h: meta.height, kb },
      ],
      poster,
    })
    console.log(slug, item.name, `${meta.width}x${meta.height}`, `${kb}KB`,
      poster.map((p) => `${p.w}w:${p.kb}KB`).join(' '))
  }
}

// Merge mode carries forward slugs not in `only`; drop any that no longer
// exist in the manifest so a removed/renamed slug can't linger in videos.json
// (the on-disk existence test would otherwise fail a later build). Orphaned
// binaries are NOT auto-deleted: this outDir is shared with the image
// pipeline, so blind pruning would delete webp figures. Re-run the full
// pipeline or clean by hand after a rename.
for (const k of Object.keys(results)) if (!(k in VIDEOS)) delete results[k]

mkdirSync(DATA, { recursive: true })
writeFileSync(join(DATA, 'videos.json'), JSON.stringify(results, null, 2))
console.log(`\nTOTAL ${Object.values(results).flat().reduce((a, v) => a + v.sources[0].kb, 0)}KB of video`)
