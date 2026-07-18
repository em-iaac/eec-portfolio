// THE THOUGHT NOTES (Session 11). One written leaf per EXPLORE thought,
// rendered by ThoughtRoute inside ThoughtLeaf. Words only: plain <p> (the leaf
// styles them) plus optional inline <NB> hover dots under rule 8's
// five-per-leaf cap (G1: the Pen Table NBDot retired with the sheet tier;
// the glass NB is a drop-in with the same props and mechanics). ALL ten
// notes were SIGNED by Emilie at G4 (2026-07-12); new notes ship draftCopy
// in the registry until she signs them.
//
// Binding copy rules (Session 11): no em dashes; no
// '{' anywhere; the verbs are score / estimate / model, never "measure", and
// no clinical claims (this matters most in bim, comfort, respond); tier-3
// domain terms (neuroarchitecture, evidence-based design) are woven in, and
// the coined phrase "Behavior Information Modeling" never stands alone, it sits
// next to Building Information Modeling and one gesture from NeuroSpace.
import { type ReactNode } from 'react'
import NBDot from '../components/ui/NB'
import SketchDot from './SketchDot'

const RED_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

// THE OPENINGS (G2) live in openings.ts (JSX-free so index surfaces can
// import them without pulling this prose into their chunk). Each string there
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

  // T-111 · THE FIRST THOUGHT (S5, 2026-07-18): her LAU charcoal year, dated
  // before every other entry, voiced from before the tools existed. The
  // confession + the close are woven from her verbatim reflections; the
  // three sketch dots bloom the drawings (SketchDot, her signed mechanism).
  charcoal: (
    <>
      <p>
        When the art class was asked who here dislikes drawing, mine was the only hand that went
        up. Awkward. My instruments were always music and writing; charcoal belonged to other
        people. But the studies kept coming, so I kept going back, and going back is where it gets
        interesting.
      </p>
      <p>
        The poetics of a curve live in what you leave out. Shade the big shapes honestly, let the
        small truths stay foggy, and the figure reads clearer, not less: which is how seeing works
        anyway. Nobody takes a room in detail by detail; you catch the big picture and your mind
        fills in the rest.
        <SketchDot
          name="torso"
          alt="Charcoal figure study from the LAU drawing year: a classical torso built from big tonal shapes, the details left soft"
          drop={-30}
        />
      </p>
      <p>
        Listening is the same lesson from the other side. An ear has no lid; it stays open all
        night, hearing while you sleep, so the privilege was never hearing, it's attention: someone
        arriving with a story to tell, a question to ask, and you choosing to receive it. And the
        anatomy is in on it: the three smallest bones in the body live in there, next to the sense
        of balance. The organ that listens is the organ that keeps you standing.
        <SketchDot
          name="ear"
          alt="Charcoal study of an ear from the LAU drawing year, drawn close and slow, folds and shadows carrying all the detail"
          drop={-20}
        />
      </p>
      <p>
        Maybe that's the real subject: not the things, the space between them. Drawing a figure
        pulling on a rope, what comes out is the pull itself: no face, the rope barely there,
        everything leaning toward a force you can't draw directly, only show. The connection is the
        drawing. Draw the middle, and the rest explains itself.
        <SketchDot
          name="tension"
          alt="Charcoal sketch of a seated figure pulling a rope, face and rope left vague so the tension itself becomes the subject"
          drop={-30}
        />
      </p>
      <p>
        So no, I still wouldn't call drawing mine. But go back to a thing often enough, look at it
        long enough, and something connects, something works out, and you catch yourself thinking:
        maybe, what if? I am connecting the dots. (an artist?)
      </p>
    </>
  ),

  // T-112 · her reading of the team theory project (credits woven in
  // sentence one; the whole note declares itself a reading). The desire
  // path centered at her direction (2026-07-18).
  pelagnou: (
    <>
      <p>
        Some projects hand you a tool; Pelagñou handed me a library card. A theory project with
        Aditya Kossambe and Eleni Maglari for the AI in Architecture Theory course at IAAC,{' '}
        <a href="https://blog.iaac.net/pelagnou/" target="_blank" rel="noreferrer" className={RED_LINK}>
          an archipelagic reading of technoculture
          <span className="sr-only"> (opens in new tab)</span>
        </a>
        , and this note is only my reading of our reading, mostly of the thinkers it introduced me
        to: Ari Melenciano, Édouard Glissant, an internet full of footprints.
      </p>
      <p>
        The idea that refuses to leave is the desire path: the shortcut worn into the grass where
        people actually walk, truer than the pavement anyone planned. We pave paths for each other
        constantly, mostly by walking them first, one person daring the shortcut and the next one
        trusting the flattened grass. I had never thought of the digital world that way: the
        internet as a field of trails, every link a footprint, whole cultures following each
        other's shortcuts until they harden into roads.
        <NBDot note="nobody designs a desire path. that's the whole point of it." align="right" />
      </p>
      <p>
        I keep relating it to my own unusual threads. The connections in my head, the ones this
        site draws as lines between projects and thoughts, were never planned like pavements; they
        got worn in by walking the same what-if twice, then a third time. And Glissant's right to
        opacity is the caution at the edge of the field: not every path wants to be mapped. Some
        things should stay islands. Not everything wants to be a dataset.
      </p>
    </>
  ),

  // T-113 · her named thought, SIGNED 2026-07-18 ("for now").
  explain: (
    <>
      <p>
        How do you explain a complex, honestly boring technical subject so someone leans in
        instead of glazing over? I think about this constantly, because the gap between the people
        who build technical things and the people who live with their consequences is mostly an
        explanation gap.
      </p>
      <p>
        The trick, as far as I can tell, is that fun is not decoration on the explanation; it is
        the explanation. A LEGO brick explains discrete aggregation better than a lecture. A film
        of a cathedral solving into bricks explains a pipeline better than the diagram of the
        pipeline. When an idea lands, it's usually because someone found the toy inside the
        concept.
        <NBDot note="if the demo needs a manual, the demo isn't done." align="right" />
      </p>
      <p>
        So I hold my own work to it: if I can't make the boring part captivating, I don't
        understand it well enough yet. And it matters beyond taste. The subjects that decide how
        buildings treat people read as the most boring ones, standards, data layers, scoring
        models, and they'll only get argued about by more than five people if someone makes them
        worth looking at.
      </p>
    </>
  ),
}
