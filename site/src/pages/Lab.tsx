// THE PRIMITIVES LAB (DL-0) · dev-only, never built into prod (the route is
// gated on import.meta.env.DEV in App.tsx), never in the nav, never
// prerendered. One page where every DL v2 primitive renders in a
// mode-FOLLOWING ground plus both PINNED grounds, so the foundation can be
// live-verified: contrast, blur, fallback, touch targets, persistence, perf.
import { useState } from 'react'
import TitleBlock from '../components/TitleBlock'
import Surface from '../components/ui/Surface'
import Card from '../components/ui/Card'
import { FilterPill, LensPill, Pill, StatusPill } from '../components/ui/Pill'
import type { Lens } from '../components/Lens'

const LENSES: Lens[] = ['computation', 'practice', 'explorations']

// A stand-in "photograph" so the Card face reads image-forward without
// touching the asset pipeline: flat blocks, roughly a facade.
function FakePhoto({ dark = false }: { dark?: boolean }) {
  return (
    <svg viewBox="0 0 200 160" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <rect width="200" height="160" fill={dark ? '#151a21' : '#d3dade'} />
      <rect x="0" y="100" width="200" height="60" fill={dark ? '#242c35' : '#c3ccd2'} />
      <rect x="118" y="34" width="52" height="86" fill={dark ? '#303a45' : '#aab6be'} />
      <rect x="34" y="62" width="60" height="58" fill={dark ? '#3c4854' : '#96a4ad'} />
    </svg>
  )
}

// The lens-coloured threads that sit BEHIND glass panels, so translucency and
// blur have something real to prove themselves against.
function ThreadField() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 600 400" aria-hidden="true">
      <path d="M-10 90 C120 20 320 180 610 60" style={{ stroke: 'light-dark(#0e7490, #22d3ee)' }} strokeOpacity="0.55" strokeWidth="2" fill="none" />
      <path d="M-10 260 C180 340 380 190 610 300" style={{ stroke: 'light-dark(#a8186b, #f472b6)' }} strokeOpacity="0.5" strokeWidth="2" fill="none" />
      <path d="M-10 180 C220 120 420 260 610 170" style={{ stroke: 'light-dark(#7a5e00, #facc15)' }} strokeOpacity="0.45" strokeWidth="2" fill="none" />
      <circle cx="140" cy="70" r="7" style={{ fill: 'light-dark(#0e7490, #22d3ee)' }} fillOpacity="0.6" />
      <circle cx="420" cy="250" r="7" style={{ fill: 'light-dark(#a8186b, #f472b6)' }} fillOpacity="0.55" />
      <circle cx="300" cy="150" r="6" style={{ fill: 'light-dark(#7a5e00, #facc15)' }} fillOpacity="0.55" />
    </svg>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mt-10 mb-3 font-mono text-[11px] tracking-[0.12em] text-[var(--lang-ink-muted)]">
      {children}
    </h2>
  )
}

function PrimitiveSet({ dark = false, label }: { dark?: boolean; label?: string }) {
  const [facet, setFacet] = useState<Lens | null>(null)
  return (
    <div className="relative overflow-hidden rounded-[var(--r-sheet)] bg-[var(--lang-ground)] p-5 sm:p-7">
      <ThreadField />

      <div className="relative">
        <div className="mb-4 font-mono text-[10px] tracking-[0.14em] text-[var(--lang-ink-faint)]" data-lab="ground-label">
          {label ?? `GROUND ${dark ? 'DARK #0b0e13' : 'LIGHT #f5f6f7'}`}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Surface tier={1} radius="card" className="p-4">
            <div className="text-[15px] font-semibold text-[var(--lang-ink)]" data-lab="g1-ink">
              glass-1 · raised
            </div>
            <p className="mt-1 text-[13px] text-[var(--lang-ink-muted)]" data-lab="g1-muted">
              Cards and panels. The ground breathes through; the ink does the work.
            </p>
          </Surface>
          <Surface tier={2} radius="card" className="p-4">
            <div className="text-[15px] font-semibold text-[var(--lang-ink)]" data-lab="g2-ink">
              glass-2 · floating
            </div>
            <p className="mt-1 text-[13px] text-[var(--lang-ink-muted)]" data-lab="g2-muted">
              Overlays, sheets, menus. Brighter fill, stronger border.
            </p>
          </Surface>
        </div>

        {/* What a no-backdrop-filter browser renders: the solid tier fills.
            Same tokens the @supports-not block uses, measurable here. */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div
            className="rounded-[var(--r-card)] border-[0.5px] border-[var(--lang-glass-1-border)] p-4"
            style={{ background: 'var(--lang-glass-1-solid)' }}
          >
            <div className="text-[15px] font-semibold text-[var(--lang-ink)]" data-lab="g1solid-ink">
              glass-1 fallback · solid
            </div>
            <p className="mt-1 text-[13px] text-[var(--lang-ink-muted)]" data-lab="g1solid-muted">
              No blur support: same tone, fully opaque, always legible.
            </p>
          </div>
          <div
            className="rounded-[var(--r-card)] border-[0.5px] border-[var(--lang-glass-2-border)] p-4"
            style={{ background: 'var(--lang-glass-2-solid)' }}
          >
            <div className="text-[15px] font-semibold text-[var(--lang-ink)]" data-lab="g2solid-ink">
              glass-2 fallback · solid
            </div>
            <p className="mt-1 text-[13px] text-[var(--lang-ink-muted)]" data-lab="g2solid-muted">
              Mirrors the @supports-not path exactly.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2" data-lab="pills">
          {LENSES.map(l => (
            <LensPill key={l} lens={l} />
          ))}
          <Pill>sentence-case tag</Pill>
          <Pill mono>MONO TAG</Pill>
          <StatusPill kind="live">live</StatusPill>
          <StatusPill kind="award">MaCAD '26</StatusPill>
        </div>

        <div className="mt-3 flex flex-wrap items-center" data-lab="filters">
          <FilterPill active={facet === null} onClick={() => setFacet(null)}>
            ALL
          </FilterPill>
          {LENSES.map(l => (
            <FilterPill key={l} active={facet === l} onClick={() => setFacet(l)}>
              {l.toUpperCase()}
            </FilterPill>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3" data-lab="cards">
          <Card
            title="Sensi"
            lens="computation"
            tags={['ml', 'grasshopper', 'a third tag never shows']}
            award="MaCAD '26"
            image={<FakePhoto dark={dark} />}
            onOpen={() => console.info('[lab] card open: Sensi')}
          />
          <Card
            title="Marsception"
            lens="practice"
            tags={['rhino']}
            image={<FakePhoto dark={dark} />}
            onOpen={() => console.info('[lab] card open: Marsception')}
          />
          <Card title="Field notes" lens="explorations" tags={['sound']} onOpen={() => console.info('[lab] card open: notes')} />
        </div>
      </div>
    </div>
  )
}

export default function Lab() {
  return (
    <div className="min-h-dvh bg-[var(--lang-ground)] pb-24 text-[var(--lang-ink)]">
      <TitleBlock />
      <main className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <h1 className="mt-8 text-xl font-semibold">Primitives lab</h1>
        <p className="mt-1 max-w-[60ch] text-[14px] text-[var(--lang-ink-muted)]">
          Dev-only. This surface follows the mode; the two pinned strips below never move. Flip
          the toggle in the pill above and only this ground should change.
        </p>

        <SectionTitle>FOLLOWS THE MODE</SectionTitle>
        <PrimitiveSet label="GROUND · WHATEVER THE MODE SAYS" />

        <SectionTitle>PINNED DARK (THE LANDING RULE)</SectionTitle>
        <div data-theme="dark">
          <PrimitiveSet dark />
        </div>

        <SectionTitle>PINNED LIGHT (THE PRINT RULE)</SectionTitle>
        <div data-theme="light">
          <PrimitiveSet />
        </div>

        <SectionTitle>PERF FIELD · 12 BOUNDED BLUR PANELS</SectionTitle>
        <div className="relative overflow-hidden rounded-[var(--r-sheet)] bg-[var(--lang-ground)] p-5">
          <ThreadField />
          <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3" data-lab="perf-field">
            {Array.from({ length: 12 }, (_, i) => (
              <Surface key={i} tier={i % 2 === 0 ? 1 : 2} radius="card" className="p-4">
                <div className="font-mono text-[10px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
                  PANEL {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mt-1 text-[14px] font-semibold text-[var(--lang-ink)]">16px blur, bounded</div>
              </Surface>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
