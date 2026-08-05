// THE REFERENCE LINK (THE WORDS, Emilie's ruling 2026-07-29): when a note
// names a project or another note, the name itself is the door.
//
// "if a thought mentions a project let the project name be a link same system
// as the cv, so everything feels connected" ... and then, importantly:
// "we should also add links if thoughts are mentioned inside thoughts and we
// should encourage actually that, because thoughts are also connected and
// that's the whole idea of the mind, and how you form new neurons."
//
// So this deliberately does NOT distinguish the two. One component, one look:
// naming a project and naming a thought are the same gesture, and the site's
// argument is that they are the same kind of thing. Cross-referencing between
// notes is something to reach for, not to ration.
//
// SAME SYSTEM AS THE CV, in spirit: there the linkable name is the LEADING
// word of a bullet and the rest of the sentence stays flat, so the record
// still reads as a document rather than a link farm (data/cv.ts,
// splitProjectLink). Here the equivalent restraint is that only the NAME is
// live, never the clause around it, and a note should not name the same thing
// twice as a link.
//
// THE ROUTE IS DERIVED, NEVER TYPED. It reads the registry, which is the
// single source for both /work/:id and /thoughts/:id, so a note can never
// point at an address that does not exist. An unknown id renders as plain
// text rather than a dead link, and refs.test.ts fails the build for it, so
// the failure is loud at build time and harmless at run time.
import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ENTRIES } from '../data/registry'
// QUIET_LINK_TAP, not RED_LINK (Emilie, 2026-08-05). A note that names four
// projects in red is four things pulling the eye off the argument, on the one
// page whose job is to be read. This is the CV's recipe, which is what the
// header comment above already said this component followed "in spirit": now it
// follows it in paint too. The _TAP variant keeps the 44px touch floor that
// RED_LINK alone never had here.
import { QUIET_LINK_TAP } from '../lib/linkStyles'

/**
 * Resolve a registry id to the route that shows it: a thought's leaf, or a
 * project's showcase. Exported so the test can assert every id a note uses.
 */
export function routeForRef(id: string): string | undefined {
  const e = ENTRIES.find((x) => x.id === id)
  if (!e) return undefined
  if (e.kind === 'thought') return e.note?.status === 'drafted' ? e.note.route : undefined
  if (e.kind === 'project') return `/work/${e.id}`
  return undefined
}

export default function Ref({ id, children }: { id: string; children: ReactNode }) {
  const to = routeForRef(id)
  // A thought whose note was cut, or a mistyped id: the words survive, the
  // link does not. Better a flat sentence than a 404 inside an essay.
  if (!to) return <>{children}</>
  return (
    <Link to={to} viewTransition className={QUIET_LINK_TAP}>
      {children}
    </Link>
  )
}
