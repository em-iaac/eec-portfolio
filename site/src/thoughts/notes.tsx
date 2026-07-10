// THE THOUGHT NOTES (Session 11). One written leaf per EXPLORE thought,
// rendered by ThoughtRoute inside ThoughtLeaf. Words only: plain <p> (the leaf
// styles them) plus optional inline <NB> hover dots under rule 8's
// five-per-leaf cap (G1: the Pen Table NBDot retired with the sheet tier;
// the glass NB is a drop-in with the same props and mechanics). ALL copy
// here is a DRAFT in Emilie's voice pending her sign-off (each thought entry
// carries draftCopy in the registry).
//
// Binding copy rules (Session 11 + the calibration dossier): no em dashes; no
// '{' anywhere; the verbs are score / estimate / model, never "measure", and
// no clinical claims (this matters most in bim, comfort, respond); tier-3
// domain terms (neuroarchitecture, evidence-based design) are woven in, and
// the coined phrase "Behavior Information Modeling" never stands alone, it sits
// next to Building Information Modeling and one gesture from NeuroSpace.
import { type ReactNode } from 'react'
import NBDot from '../components/ui/NB'

// THE OPENINGS (G2) live in openings.ts (JSX-free so the CV career graph can
// import them without pulling this prose into its chunk). Each string there
// is the VERBATIM opening of its note here; update both together or the
// index lies about the note.
export { THOUGHT_OPENINGS } from './openings'

export const THOUGHT_NOTES: Record<string, ReactNode> = {
  // T-101 · runs long: this is the spine of the whole research direction.
  bim: (
    <>
      <p>
        For thirty years we've been getting very good at Building Information Modeling: every beam,
        every duct, every clash, tracked to the millimeter. It's a magnificent way to describe a
        building, and it says almost nothing about the person standing inside it.
      </p>
      <p>
        I keep circling one reframing. Keep the letters, change the noun. Building Information
        Modeling becomes Behavior Information Modeling: the same rigor and the same appetite for
        data, pointed at how a room acts on the body instead of how the structure holds itself up.
        Ceiling height, daylight, the curve of a wall, the plants in the corner. None of that is
        decoration. It's input, and the mind has outputs.
        <NBDot note="same four letters. i just changed which information we mean." align="right" />
      </p>
      <p>
        The honest version of the claim is small. I can't measure your cortisol from a floor plan
        and I'll never pretend to. What I can do is score a design against the neuroarchitecture and
        evidence-based design research that already exists, estimate the direction it pushes you, and
        show my work so you can argue back.
        <NBDot note="a score you can argue with beats a number you have to trust." />
      </p>
      <p>
        NeuroSpace was the first crack at it and Sensi was the second. Neither is finished science.
        But the data layer is real, it's buildable today, and somebody has to teach our models that a
        facade is a public health decision before we pour the next one.
      </p>
    </>
  ),

  // T-102
  neuroaes: (
    <>
      <p>
        Neuroaesthetics is the unglamorous name for a question everyone already feels: why does one
        room settle you and another keep you on edge? The field has spent years building actual
        evidence for it, complexity and coherence in a facade, the pull of a curve over a hard
        corner, the way a long sightline changes your breathing.
      </p>
      <p>
        Architecture mostly files this under taste, which is a polite way of saying we don't have to
        be accountable for it. I'd rather treat it as evidence-based design: findings you can point
        to, cite, and score a plan against.
        <NBDot note="taste is just a finding we haven't written down yet." />
      </p>
      <p>
        I'm not claiming a formula for beauty. I'm claiming that a lot of what we call intuition is
        neuroarchitecture research waiting to be used, and that a designer who reads it is holding a
        sharper instrument than one who guesses.
      </p>
    </>
  ),

  // T-103 · three sentences, by design.
  solvers: (
    <>
      <p>
        A physics solver is the most honest collaborator I have: it doesn't care what I intended,
        only what I actually built. I set the goals, collision, pressure, an anchor, a load, and let
        it settle until the geometry stops arguing with itself. The good ones feel less like running
        a tool and more like negotiating with a material that has read the manual.
      </p>
    </>
  ),

  // T-104
  genai: (
    <>
      <p>
        Generative AI made the inspired gesture free. Anyone can produce a thousand renders before
        lunch, and a render is a promise, not a product: you can't snap a JPEG together on your
        living-room floor.
      </p>
      <p>
        So the interesting work moved downstream, to verification. On lEgoarCh the diffusion model
        was the easy half; the real project was the deterministic pass that checked whether the
        pretty thing was connected, supported, and made of bricks that actually exist.
        <NBDot note="the model proposes. the solver refuses." align="right" />
      </p>
      <p>
        I use these tools constantly, and I trust them exactly as far as I can check them. My edge was
        never generating the image. It was knowing which promise to keep and which to throw away.
      </p>
    </>
  ),

  // T-105
  xreal: (
    <>
      <p>
        I started in a lab strapping headsets onto students to see whether a lesson lands harder when
        you can walk around inside it. Extended reality is still the most physical way I know to test
        an idea: you don't read the space, you stand in it, and your body tells you within seconds
        whether it works.
      </p>
      <p>
        The hype cycle has been unkind to XR, and mostly it earned that. But the education case never
        went away: some things are impossible to explain and trivial to experience.
        <NBDot note="a section drawing is a promise a walkthrough keeps." />
      </p>
      <p>
        I keep it in my pocket as a way of thinking, not a gadget: build the thing at full scale
        before it's real, then let someone move through it and be honest about what they felt.
      </p>
    </>
  ),

  // T-106 · runs long: the ethics live here.
  comfort: (
    <>
      <p>
        You don't walk into a room and average your experience. You walk in and the thing that's
        wrong is the thing you notice: the glare, the echo, the cold draft on the back of your neck.
        Comfort isn't a single number, and it's definitely not the mean of six of them.
      </p>
      <p>
        Comfort as data is my attempt to take that seriously. Sensi scores a floor plan across six
        senses, thermal, visual, acoustic, spatial, olfactory, tactile, calibrated to one person
        rather than a code-book average, and it keeps a coupling matrix so that warming a room and
        watching the acoustics shift is a fact the tool has to face instead of hide.
        <NBDot note="you don't average a room. neither should the software." align="right" />
      </p>
      <p>
        Here's the part I lose sleep over. The moment you make comfort legible you make it easy to
        prescribe, and a tool that says this room scores badly is one short step from this room is not
        allowed. I built Sensi to estimate and to explain, never to diagnose, and I wrote agreement is
        not truth into the notes so the warning ships with the product.
      </p>
      <p>
        None of this measures a body. It scores a design against what the research suggests and hands
        you a reading you're free to overrule. That distinction is the whole ethic of the thing.
      </p>
    </>
  ),

  // T-107
  drawiface: (
    <>
      <p>
        For most of my life the drawing was the output. You designed the thing, then you drew it to
        prove it existed. Lately I've started to think the drawing is the interface: the place where
        the thinking actually happens, not the receipt you print afterward.
      </p>
      <p>
        This portfolio is the argument. It's built like a notebook because that's how the work really
        goes: a line, a note in the margin, a fix, a better line.
        <NBDot note="the honest version of a process keeps the crossings-out." />
      </p>
      <p>
        When the drawing is live, when moving a slider redraws the room and the score answers back,
        the gap between deciding and drawing closes. That gap is where most bad buildings are born, in
        the lag between what you meant and what you finally documented.
      </p>
    </>
  ),

  // T-108
  evosearch: (
    <>
      <p>
        Evolutionary search is what I reach for when a problem is too tangled to solve head on:
        describe what good looks like, then let a population of designs breed, mutate, and compete
        until something clever falls out. It's optimization with the humility built in, because
        you're admitting you don't know the answer, only how to recognize it.
      </p>
      <p>
        On the Cappelletti pavilion it handed us two lattice topologies we'd never have drawn by hand,
        both stable, one noticeably lighter.
        <NBDot note="the machine isn't creative. it's tireless. at scale those look the same." align="right" />
      </p>
      <p>
        The catch is the fitness function. The search gives you exactly what you asked for, so the
        real design work is being honest about what you actually want before you let it run.
      </p>
    </>
  ),

  // T-109
  heritage: (
    <>
      <p>
        The usual choice with an old building is a trap: treat it as a museum piece no one may touch,
        or drop a glass-and-steel box in the middle and call it modern. Both give up on the harder,
        more interesting thing, which is a real conversation between old fabric and a new idea.
      </p>
      <p>
        On the Bab al-Luq market I tried to make new technology behave like a respectful guest. The
        historic steel frame stays exactly as it is; a roof of pressure-packed balloons settles into
        it, borrowing the structure without drilling a single new hole.
        <NBDot note="the frame is the client. the balloons are the tenants." />
      </p>
      <p>
        Heritage meets new tech works when the tech is in service of the memory, not staged on top of
        it. The computation is only there to let something light touch something old, very gently.
      </p>
    </>
  ),

  // T-110 · runs a little long: it's the horizon the rest points at.
  respond: (
    <>
      <p>
        Right now a building is a fixed guess. Someone chose the ceiling height and the window size
        years before you arrived, and you live inside their averaged assumptions whether they fit you
        or not.
      </p>
      <p>
        Buildings that respond is the future I'm actually working toward: rooms that model their
        effect on the people inside them and adjust, that treat a facade as a variable and not a
        verdict. Not a smart home full of gadgets, something quieter, a structure that scores how its
        defaults are landing and has a way to shift them.
        <NBDot note="if your building could think about you, it would probably start with a few more plants." align="right" />
      </p>
      <p>
        I want to be careful here, because this is exactly where the field oversells. I'm not
        promising a building that reads your mind or heals your stress. I'm describing one that
        estimates, out loud and arguably, how its choices push you, and hands you the controls. The
        dumb version of this is surveillance. The good version is a room that finally asks how it's
        making you feel, and is willing to change its answer.
      </p>
    </>
  ),
}
