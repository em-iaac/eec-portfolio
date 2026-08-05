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
import {
  AdjacencyFigure,
  BimFigure,
  ComfortFigure,
  ComputationFigure,
  DrawifaceFigure,
  EvosearchFigure,
  ExperienceFigure,
  ExplainFigure,
  GenaiFigure,
  HeritageFigure,
  LatentFigure,
  LlmFigure,
  NeuroaesFigure,
  RespondFigure,
  ScoreFigure,
  SolversFigure,
  XrealFigure,
} from './figures'
import Ref from './Ref'


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
        I keep circling one reframing. Keep the letters, change the noun. What if the B was never
        the building? Building Information Modeling becomes Behavior Information Modeling: the
        same rigor and the same appetite for data, pointed at how a room acts on the body instead
        of how the structure holds itself up. Ceiling height, daylight, the curve of a wall, the
        plants in the corner. None of that is decoration. It's input, and the mind has outputs.
        <NBDot note="same four letters. i just changed which information we mean." align="right" />
      </p>
      {BimFigure}
      <p>
        The honest version of the claim is small. I can't measure your cortisol from a floor plan
        and I'll never pretend to. What I can do is score a design against the neuroarchitecture and
        evidence-based design research that already exists, estimate the direction it pushes you, and
        show my work so you can argue back.
        <NBDot note="a score you can argue with beats a number you have to trust." />
      </p>
      <p>
        <Ref id="neurospace">NeuroSpace</Ref> was the first crack at it and{' '}
        <Ref id="sensi">Sensi</Ref> was the second. Neither is finished science.
        But the data layer is real, it's buildable today, and somebody has to teach our models that a
        facade is a public health decision before we pour the next one.
      </p>
    </>
  ),

  // T-102
  //
  // draftCopy: THE THIRD ITEM IN THE TRIPLE REPLACED AT THE WALK (2026-08-04),
  // SIGNED by Emilie 2026-08-04. It read "the way a long sightline changes your breathing", inside
  // a sentence that explicitly claims the field has evidence. The first two
  // items are well supported (contour preference: Vartanian et al., PNAS 2013,
  // plus 2019 and 2021). RESPIRATION IS NOT A MEASURE THIS LITERATURE REPORTS:
  // it reports cortisol, heart rate, skin conductance and EEG, with enclosed
  // rooms raising cortisol and heart rate against open ones (Frontiers 2023,
  // systematic review of architectural form and physiological stress). So the
  // claim was swapped for one the same research actually makes. The opening
  // sentence in openings.ts is untouched: the edit is in the second sentence.
  neuroaes: (
    <>
      <p>
        Neuroaesthetics is the unglamorous name for a question everyone already feels: why does one
        room settle you and another keep you on edge? The field has spent years building actual
        evidence for it, complexity and coherence in a facade, the pull of a curve over a hard
        corner, the way a closed room puts cortisol in your blood.
      </p>
      {NeuroaesFigure}
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
        a tool and more like negotiating with a material that has read the manual. Which raises the
        obvious problem: it read the manual I wrote.
      </p>
      {SolversFigure}
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
        So the interesting work moved downstream, to verification. On{' '}
        <Ref id="legoarch">lEgoarCh</Ref> the diffusion model was the easy half; the real project
        was the deterministic pass that checked whether the pretty thing was connected, supported,
        and made of bricks that actually exist.
        <NBDot note="the model proposes. the solver refuses." align="right" />
      </p>
      <p>
        I use these tools constantly, and I trust them exactly as far as I can check them. My edge
        was never generating the image. It was being willing to bin a thousand of them.
      </p>
      {GenaiFigure}
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
      {XrealFigure}
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
      {ComfortFigure}
      <p>
        Comfort as data is my attempt to take that seriously. <Ref id="sensi">Sensi</Ref> scores a
        floor plan across six senses, thermal, visual, acoustic, spatial, olfactory, tactile,
        calibrated to one person rather than a code-book average, and it keeps a coupling matrix so
        that warming a room and watching the acoustics shift is a fact the tool has to face instead
        of hide.
        <NBDot note="you don't average a room. neither should the software." align="right" />
      </p>
      <p>
        None of this measures a body. It scores a design against what the research suggests and hands
        you a reading you're free to overrule. That distinction is the whole ethic of the thing, and
        the rest of that argument has a note of its own:{' '}
        <Ref id="scoring">when the tool scores people</Ref>.
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
      {DrawifaceFigure}
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
        On the <Ref id="cappelletti">Cappelletti Pavilion</Ref> it handed us two lattice topologies
        we'd never have drawn by hand, both stable, one noticeably lighter.
        <NBDot note="the machine isn't creative. it's tireless. at scale those look the same." align="right" />
      </p>
      {EvosearchFigure}
      <p>
        The catch is the fitness function, and writing one is harder than it sounds. Good has to
        become a number before the search will believe it, so every quality you cannot count quietly
        drops out of the competition. Lighter is easy. Legible is not.
      </p>
    </>
  ),

  // T-109
  //
  // ONE WORD CHANGED AT THE WALK, SIGNED by Emilie 2026-08-04. "steel"
  // became "iron". Bab al-Louq opened 1 May 1912 on the Les Halles model and
  // the sources on it (Cluster Cairo, Daily News Egypt) all describe an iron
  // truss roof. Emilie ruled iron over dropping the material entirely.
  heritage: (
    <>
      <p>
        The usual choice with an old building is a trap: treat it as a museum piece no one may touch,
        or drop a glass-and-steel box in the middle and call it modern. Both give up on the harder,
        more interesting thing, which is a real conversation between old fabric and a new idea.
      </p>
      <p>
        On <Ref id="ballooning">the Bab al-Luq market</Ref> I tried to make new technology behave
        like a respectful guest. The
        historic iron frame stays exactly as it is; a roof of pressure-packed balloons settles into
        it, borrowing the structure without drilling a single new hole.
        <NBDot note="the frame is the client. the balloons are the tenants." />
      </p>
      {HeritageFigure}
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
      {RespondFigure}
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

  // T-112 pelagñou CUT (Emilie, 2026-07-29). See the registry for the why.
  // Its one genuinely original passage, the desire path worn into the grass,
  // is recorded here in case it ever wants a home of its own: it is a good
  // image and it belonged to a note that was mostly other people's thinking.

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
        the explanation. A LEGO brick explains discrete aggregation better than a lecture. The{' '}
        <Ref id="legoarch">lEgoarCh</Ref> film, a cathedral solving into bricks, explains that
        pipeline better than the diagram of the pipeline does. When an idea lands, it's usually
        because someone found the toy inside the concept.
        <NBDot note="if the demo needs a manual, the demo isn't done." align="right" />
      </p>
      {ExplainFigure}
      <p>
        So I hold my own work to it: if I can't make the boring part captivating, I don't
        understand it well enough yet. And it matters beyond taste. The subjects that decide how
        buildings treat people read as the most boring ones, standards, data layers, scoring
        models, and they'll only get argued about by more than five people if someone makes them
        worth looking at.
      </p>
    </>
  ),

  // T-114 · the MaCAD Module 03 graph work. Written as a NOTE, not a project
  // entry: Emilie's ruling (2026-07-26) is that the notebook scaffolds came from
  // the IAAC GraphML course and she adapted them, so the honest subject is the
  // analysis and the judgement, not a build. Authorship is stated in the first
  // paragraph rather than buried in a credit line. Ships draftCopy until signed.
  adjacency: (
    <>
      <p>
        A floor plan tells you which rooms touch. It will not tell you which rooms you can
        actually reach, and the gap between those two drawings is where the architecture is
        hiding. In a graph machine learning course at IAAC I took a police station in Salt,
        Spain and rebuilt it three times as a graph: once for which rooms touch, once for
        which rooms you can walk between, once for which rooms can see each other. The
        notebook scaffolds came with the course. The building, the argument for choosing it,
        and every analysis on top of it were mine.
      </p>
      <p>
        A police station is an extreme case of designed spatial control. Its plan keeps three
        groups of people apart, public, staff and detainees, whose paths are not supposed to
        cross by accident, and it rations every crossing through a door. Officers need to
        survey rooms they are not standing in. If a plan encodes a protocol anywhere, it
        encodes one here, which makes it the right thing to point a graph at.
      </p>
      <p>
        The first graph connects any two rooms that share a wall. The second connects them
        only if there is a door in that wall. Subtract one from the other and what is left is
        not noise, it is the design: every place where two rooms were allowed to touch and
        deliberately not allowed to connect. Adjacency is not access. The interesting result
        was a gap, not a number, which is why both graphs are built and not just the useful
        one.
        <NBDot note="the third graph, sightlines, is the one that argues with the other two." />
      </p>
      {/* THE FIRST PLATE (THE WORDS, 2026-07-28). It lands HERE, immediately
          after the paragraph that spends its whole length describing two
          graphs and their difference in words, which is the clearest signal a
          note can give that it wants a drawing. */}
      {AdjacencyFigure}

      <p>
        The weakest link is worth saying out loud, because nobody would find it on their own.
        Rooms are sorted into public, private, circulation and cell by matching keywords
        against the layer names in the Rhino file. It works, and it means the entire analysis
        quietly inherits whoever named those layers. One careless layer moves a room into the
        wrong zone and nothing raises an error, nothing turns red, the graph just draws a
        confident picture of a building that is not there. A robust version would classify on
        geometry and connectivity instead of on strings. The failure modes that do not throw
        are the expensive ones.
      </p>
    </>
  ),

  // ---- THE WORDS (2026-07-28): four notes explaining the vocabulary of her
  // field the way she would explain it at a table. Her ask, her list, her
  // shortlist: "some technical words related to my domain but explained in my
  // own way", starting from her own seed, "we learn by experiences as humans,
  // experiences = data, machines also learn from data, is that a coincidence?"
  //
  // Written to the voice rules in .claude/skills/emilie-voice: the question
  // asked mid-paragraph and left unanswered · the immediate undercut · three
  // concrete things · the one-word punchline · no summarising last sentence.
  // Honesty: T-116 and T-117 describe how these systems work and never claim
  // she trains them (ML stays applied and team-context); T-118 makes no
  // clinical claim and reuses her own signed "agreement is not truth".
  // All four ship draftCopy until she signs them.

  // T-115 · her seed, and the one she asked for first.
  learning: (
    <>
      <p>
        You learned what a room does to you by being in rooms. Nobody sat you down with a
        dataset. You walked into a low dark corridor, your shoulders went up, and thirty years
        later your shoulders still go up and you call it instinct.
      </p>
      <p>
        Then somebody says a model learns from data and it sounds like a different kind of
        thing entirely. It is not, quite. Experience is what data is called when it happens to
        a body. The corridor was the example. Your shoulders were the label. Is that a
        coincidence, or did we just describe one process twice in two vocabularies?
        <NBDot note="the corridor was the example. your shoulders were the label." align="right" />
      </p>
      {ExperienceFigure}
      <p>
        Where it stops being the same is what gets thrown away. You kept the corridor because
        something below your attention decided it mattered, and you were not consulted. A model
        keeps whatever was in the folder. Nobody curated your training set, which is either the
        most careless data collection in history or the only honest one.
      </p>
      <p>
        This is not an idle parallel, it is the premise under everything I build. Scoring a
        room against neuroarchitecture research is only ever saying: other bodies have been in
        rooms like this one, here is what happened to them, would you like to know before you
        pour the concrete? The research is the dataset. It is small and awkward and full of
        holes, and it is still more than a hunch.
      </p>
      <p>
        What I cannot decide is whether that makes the tool a colleague or a very well read
        stranger who has never once been in the room.
      </p>
    </>
  ),

  // T-116 · the word she is asked about most, explained by someone who builds
  // with them daily and is not impressed by them.
  //
  // ONE SENTENCE ADDED AT THE WALK, SIGNED by Emilie 2026-08-04. It closes
  // the emergence paragraph with the argument that the jump may be an artifact
  // of the marking scheme (Schaeffer et al., NeurIPS 2023: score pass/fail and
  // you get a cliff, score partial credit and the same models climb smoothly).
  // The rest of the note stays signed from the walk of 2026-07-29. A second
  // sentence was drafted and CUT by her: it claimed she wanted the jump to be
  // real, which is an interior state she never reported. If a self-correction
  // has to be explained, it is not hers.
  llm: (
    <>
      <p>
        LLM stands for large language model, which is to say a large model of language. Thank
        you, very helpful. It might be the least informative acronym in a field with a lot of
        competition, so let me come at it backwards and start with what it is not.
      </p>
      <p>
        It is not a database. When you ask it something it is not looking anything up: no drawer,
        no row, no record with your answer already sitting in it. It has read more than any person
        could and it remembers none of it the way you remember a phone number.
      </p>
      <p>
        It is not understanding you either. It has no idea what a wall is. What it has is an
        extremely good statistical sense of which words tend to follow <em>load bearing</em>,
        which is exactly why it can hand you a sentence that sounds like structural advice and is
        wrong, without anything registering that a mistake occurred.
        <NBDot note="it is not lying to you. it does not have the concept." />
      </p>
      {LlmFigure}
      <p>
        And here is the part I cannot tidy away, because this would be a better note if I could
        stop at three: it is not just autocomplete either. Guessing the next word, at that scale,
        produced things nobody put in on purpose. It writes working code. It holds an argument
        across paragraphs. Not one of the people who built it can tell you why that showed up.
        Though people argue about whether it was ever a jump: mark the answers right or wrong
        and you get a cliff, mark how close they got and the same models climb smoothly.
      </p>
      <p>
        So I work with it the way you would work with a very fast, very well read colleague who
        has never once said I do not know. I check. Every time I have not checked I have paid for
        it later, and the bill always arrives after you have told someone it is fine.
      </p>
      <p>
        We built something that guesses, and the guessing turned out to be enough for most of what
        we ask of it. I still cannot tell whether that is a fact about the machine or about the
        questions.
      </p>
    </>
  ),

  // T-117 · the borrowed word. Filed on the GEOMETRY thread rather than AI,
  // because the thread a note rides is meant to be the subject it actually
  // belongs to, and this note's whole claim is that this is a spatial idea.
  latent: (
    <>
      <p>
        Machine learning borrowed the word space from us, and I would like to check what it did
        with it.
      </p>
      <p>
        A model turns everything it has seen into points. Not pictures, not words: coordinates,
        in a space with hundreds or thousands of axes, none of which anyone chose or can name.
        Things that behave alike end up near each other. That is the entire trick, and it is a
        spatial argument made almost entirely by people who do not think of themselves as
        spatial.
      </p>
      {LatentFigure}
      <p>
        Near means similar. Direction means something even when nobody can say what. There are
        neighbourhoods, there are dense parts and thin parts, and the thin parts are exactly
        where a model will invent something with total confidence.
        <NBDot note="an axis nobody named is still an axis." align="right" />
      </p>
      <p>
        I want to be careful not to oversell the metaphor. A latent space has no floor, no
        gravity and no up. You cannot stand in it and it does not care about your body, which
        is precisely what makes it useful and precisely why I would not hand it a room and walk
        away.
      </p>
      <p>
        Still. We are the discipline that has spent three thousand years on what near means.
        Somebody from here should probably be in that room.
      </p>
    </>
  ),

  // T-118 · the one she has been circling since `comfort as data`, written out.
  // No clinical claim anywhere; the worry is allocation, not health.
  scoring: (
    <>
      <p>
        I build things that give a room a score. The obvious next question, and the one I would
        ask me, is what happens the day somebody uses that score to decide who gets the room.
      </p>
      <p>
        A score is small, portable and confident. That is what makes it useful and it is also
        the entire problem: it travels much further than the caveats attached to it, and
        nobody, ever, forwards the methodology.
        <NBDot note="nobody forwards the methodology." />
      </p>
      {ScoreFigure}
      <p>
        The version I actually lose sleep over is not a villain. It is a spreadsheet. Somebody
        sorts by the column, the low scoring floor quietly becomes the cheap floor, and a
        number I wrote to help a designer argue is suddenly doing allocation. I did not build
        the thing that does that. I built the column.
      </p>
      <p>
        So the tools say out loud what they are. They score and they estimate, they never
        measure and never diagnose, the weights are public so you can disagree with them, and I
        wrote agreement is not truth into the notes so the warning ships with the product. That
        is not a disclaimer. It is a design constraint, and it costs something every time.
      </p>
      <p>
        None of it stops the spreadsheet. It only means that when somebody opens the file, the
        argument is already in there waiting for them.
      </p>
    </>
  ),

  // FOUR WORDS CHANGED AT THE WALK, SIGNED by Emilie 2026-08-04. "where I
  // first met it" became "where it kept finding me". The date ruling put this
  // note at 2025-10 and `evolutionary search` at 2025-11, so "first" made the
  // note claim a sequence its own dates contradict. The new phrasing makes no
  // temporal claim at all and inverts the agency the way her solver and model
  // lines already do ("it read the manual I wrote").
  //
  // T-119 · the word she asked for by name (2026-07-29), and the one genuinely
  // missing from her original shortlist once `llm`, `latent` and the safety
  // note were written. Its turn is the lEgoarCh incident: the anti-claim ruling
  // binds here, so the failure is narrated WITHOUT its percentage and never as
  // a result, and the credit stays shared ("we"), because lEgoarCh was a duo.
  rules: (
    <>
      <p>
        Computation is not the same as using a computer, and separating the two took me longer
        than I would like to admit. You can draw in software for ten years and never compute
        anything.
      </p>
      <p>
        The difference is what you hand over. Drawing means deciding where the wall goes.
        Computing means describing the rule that decides where the wall goes, and then living
        with what that rule does at the eightieth wall, when you are no longer watching.
        <NBDot note="the drawing is the answer. the rule is the argument." align="right" />
      </p>
      {ComputationFigure}
      <p>
        Which sounds like losing control and is mostly the opposite. A rule can be argued with.
        You hand it to someone, they find the case you did not think of, and the disagreement is
        about reasoning instead of taste. Try having that argument about a line.
      </p>
      <p>
        The catch is the one every optimiser teaches you eventually, and{' '}
        <Ref id="evosearch">evolutionary search</Ref> is where it kept finding me. On{' '}
        <Ref id="legoarch">lEgoarCh</Ref> a brick model came back satisfying every constraint it
        had been given: connected, supported, made of parts that exist. It had also stopped reading
        as architecture. The machine had not failed. It had done exactly what we asked, and we had
        described the problem badly.
      </p>
      <p>
        So computation moves the work upstream, into saying what you actually want, which turns
        out to be the hardest sentence anyone in this field ever has to write. Is that still
        drawing?
      </p>
    </>
  ),
}
