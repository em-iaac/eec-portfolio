import SheetPage from '../components/SheetPage'
import ProjectCard from '../components/ProjectCard'
import { Legend, LENSES, LensTick, type Lens } from '../components/Lens'
import { HEROES, PRACTICE, EXPLORATIONS, type Project } from '../data/projects'

const SECTIONS: { lens: Lens; projects: Project[]; note?: string }[] = [
  { lens: 'computation', projects: HEROES },
  {
    lens: 'practice',
    projects: PRACTICE,
    note: 'A curated few from professional practice, each read through its technical angle.',
  },
  { lens: 'explorations', projects: EXPLORATIONS, note: 'Small, sharp, fun.' },
]

export default function Work() {
  return (
    <SheetPage sheet="A-101" title="Work">
      <div className="pt-10 pb-4 sm:pt-14">
        <h1 className="mb-3 text-2xl font-semibold tracking-[-0.01em]">Work</h1>
        <p className="mb-6 max-w-[62ch] font-serif text-[16px] leading-relaxed">
          Organized by what the work proves, not when it happened. Three lenses: the color is the category, the shape
          makes it legible without the color.
        </p>
        <Legend mode="anchors" />
      </div>

      {SECTIONS.map(({ lens, projects, note }) => (
        <section key={lens} id={lens} aria-labelledby={`${lens}-heading`} className="border-t border-ink/20 py-8">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2
              id={`${lens}-heading`}
              className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.12em] text-ink"
            >
              <LensTick lens={lens} />
              {LENSES[lens].label.toUpperCase()}
            </h2>
            {note && <p className="font-serif text-[14px] text-anno italic">{note}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} priority={lens === 'computation' && i < 2} />
            ))}
          </div>
        </section>
      ))}
    </SheetPage>
  )
}
