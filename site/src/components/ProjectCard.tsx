import type { Project } from '../data/projects'
import { LensTick, LENSES } from './Lens'
import Img from './Img'

// Card is NOT one big link: title links to the primary href, action links are
// discrete (a11y). Image rests grayscale and colors on hover/focus-within:
// color arriving = data speaking (the old site's one piece of real equity).
export default function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const primary = project.links[0]
  return (
    <article className="group flex flex-col border border-ink/35 bg-mylar">
      {project.image && (
        // Uniform 4:3 crops sitewide (Session 3 memo). Per-image reframing via
        // the optional `position` escape hatch on Project.image.
        <div className="aspect-[4/3] overflow-hidden border-b border-ink/35">
          <Img
            slug={project.image.slug}
            name={project.image.name}
            alt={project.image.alt}
            priority={priority}
            style={project.image.position ? { objectPosition: project.image.position } : undefined}
            className="block h-full w-full object-cover grayscale transition-[filter] duration-[400ms] group-hover:grayscale-0 group-focus-within:grayscale-0 motion-reduce:transition-none"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[9px] tracking-[0.1em] text-anno">
          <span className="inline-flex items-center gap-1.5">
            <LensTick lens={project.lens} size={8} />
            {LENSES[project.lens].label.toUpperCase()}
          </span>
          <span aria-hidden="true">·</span>
          <span>{project.meta}</span>
          {project.award && (
            <>
              <span aria-hidden="true">·</span>
              {/* Awards are status, not interaction: ink, per governance rule 1 */}
              <span className="font-medium text-ink">{project.award}</span>
            </>
          )}
        </div>
        <h3 className="mb-1.5 text-lg font-semibold text-ink">
          {primary ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline group-hover:underline group-hover:decoration-redline group-hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-redline"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="mb-3 max-w-[62ch] flex-1 font-serif text-[15px] leading-relaxed text-ink">{project.blurb}</p>
        <div className="mb-3 font-mono text-[9px] tracking-[0.04em] text-anno">{project.tech}</div>
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {project.links.map(l => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="-m-2.5 p-2.5 font-mono text-[10px] tracking-[0.1em] text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
              >
                {l.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
