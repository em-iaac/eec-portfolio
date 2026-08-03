// THE ROUTE HOLD · what a room looks like before its chunk lands
// (Emilie's ruling 2026-08-04, the phone pass part three).
//
// Her report from the deployed site: "first time, landing to any door shows a
// white screen for about a second, then the page". The white screen was
// `GroundHold`, an empty ground-coloured div standing in for the whole page
// while its lazy chunk resolved. lib/preloadRoute.ts fixes the WAIT (the doors
// now warm as soon as the fonts settle instead of two seconds after `load`);
// this fixes what is on screen for whatever wait is left.
//
// TWO THINGS, AND THE ORDER MATTERS.
//
//   · THE CHROME IS THERE AT ONCE. The header band and the pill render on the
//     first frame, with the magnifier already sliding to the door she pressed
//     (TitleBlock's `lastLensRect` carries the geometry across the remount, so
//     the hold's own header does the slide and the real page's header arrives
//     with it already in place). The tap is acknowledged instantly and the page
//     never loses its top edge. It costs ZERO EXTRA BYTES: the landing is not
//     lazy, so SheetPage and TitleBlock are already in the entry bundle.
//     The pill is live, not a picture — pressing another door during the hold
//     works.
//
//   · THE BODY WAITS 300ms. Nothing below the header appears before then.
//     A loading state visible for less than ~300ms reads as a glitch rather
//     than a wait, and Nielsen's thresholds put the "no indicator needed at
//     all" line at a full second. Then the skeleton FADES IN over 220ms, which
//     is also what makes the 400ms floor unnecessary: if the page lands mid-fade
//     the skeleton was never more than part visible, so it cannot flash. The
//     alternative — holding her content back to guarantee a minimum display
//     time — would make the site slower to prevent a flicker the fade already
//     prevents. Said plainly because it is a deliberate departure.
//
// TWO SHAPES ONLY, and both match measured geometry (390px, the built site):
// the tile grid is really 2 columns x 169px with a 12px gap, and the reading
// rooms are really a column of lines. A skeleton that does not match the layout
// it stands in for causes the very shift it exists to prevent, so a third,
// invented shape would be worse than either of these.
//
// `data-route-hold` IS A CONTRACT, NOT A STYLE (the phone pass, 2026-08-02).
// scripts/prerender.mjs waits for this attribute to leave before it snapshots a
// route; it used to look for a class name, the class was renamed, and six routes
// shipped their loading state to crawlers. Renaming anything else here is free.
// This attribute is not.
import TitleBlock from './TitleBlock'

/** The rooms that are a grid of tiles, and the rooms that are a column of text. */
export type HoldShape = 'grid' | 'lines'

// Enough to fill a 390x844 screen and no more: the rows below the fold would be
// skeleton nobody sees, animating on the device with the least to spend.
const TILES = 8
const LINES = [null, null, null, null, null, null, null]

function skin(row: number) {
  // The pulse is staggered by row so the grid breathes rather than blinking as
  // one block. The fade-in is NOT staggered: the whole body should arrive
  // together, it is only the resting motion that wants the offset.
  return { '--hold-stagger': `${row * 110}ms` } as React.CSSProperties
}

export default function RouteHold({ shape = 'lines' }: { shape?: HoldShape }) {
  return (
    // The frame is SheetPage's, verbatim, so the header sits exactly where the
    // real one will and nothing moves when the page replaces this.
    <div
      data-route-hold
      className="relative flex min-h-dvh flex-col bg-[var(--lang-ground)] lg:h-dvh lg:overflow-hidden"
    >
      <div className="frame-head pointer-events-none sticky top-0 z-40 lg:static lg:z-auto">
        <TitleBlock />
      </div>
      {/* The skeleton is decoration standing in for content that is not here
          yet: a screen reader must not meet it. The header above is the real
          one and stays announced. */}
      <div className="relative flex flex-1 flex-col px-5 sm:px-8" aria-hidden="true">
        {shape === 'grid' ? (
          <div className="mx-auto w-full max-w-[1920px]">
            <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: TILES }, (_, i) => (
                <li
                  key={i}
                  className="route-hold__skin aspect-video w-full"
                  style={skin(Math.floor(i / 2))}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl pt-6">
            {/* one taller block for the heading, then the measure of a page of
                prose; the widths are ragged on purpose, a column of identical
                bars reads as a table */}
            <div className="route-hold__skin h-8 w-2/3" style={skin(0)} />
            <div className="mt-6 flex flex-col gap-3">
              {LINES.map((_, i) => (
                <div
                  key={i}
                  className="route-hold__skin h-4"
                  style={{ ...skin(1 + Math.floor(i / 2)), width: i % 3 === 2 ? '72%' : '100%' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
