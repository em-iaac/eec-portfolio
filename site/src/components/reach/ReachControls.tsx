// THE ROOM'S TOOLS, WITHIN REACH (Emilie's ruling 2026-08-03: "let's go for the
// drawer, for both, the work and the cv").
//
// Four shapes were built and tried on her own phone — the tools frozen into the
// header band, a bar across the foot, a side pill, and this drawer. The drawer
// won. The other three and the switcher that compared them are deleted; this is
// the whole of what survives.
//
// THE RULE THAT KEEPS IT FROM BECOMING CHROME, and the answer to her own worry
// that she might be "trying to fix a problem that isn't really there": a reach
// control is not navigation. It is the room's TOOLS, and a room with no verbs
// passes no set and shows nothing at all. /contact and /rights never get one.
// The doors stay in the pill at the top, where she says she can reach them.
import { lazy, Suspense } from 'react'
import type { ReachSet } from './verbs'

// Lazy for the same reason every other page-specific surface is: a room that
// carries no tools should not pay for the code that draws them.
const ReachDrawer = lazy(() => import('./ReachDrawer'))

/** Renders the room's reach controls, or nothing where a room has no verbs. */
export default function ReachControls({ set }: { set?: ReachSet }) {
  if (!set || set.verbs.length === 0) return null
  return (
    <Suspense fallback={null}>
      <ReachDrawer set={set} />
    </Suspense>
  )
}
