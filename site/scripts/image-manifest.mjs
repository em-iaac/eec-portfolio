// Curated picks from incoming/<slug>/ (git-ignored staging) → web assets.
// role: 'hero' (card + case-study lead), 'gallery' (case-study body), 'gif' (kept as-is
// if small enough, else first frame + link), 'video' (poster frame only for READ mode).
// Paths are relative to repo-root/incoming/.
//
// FINALIZE THE WORK ROOM (2026-07-14): the full gallery refresh. Every slug's
// flip-through was re-curated from the staged blog frames (incoming/<slug>/blog/),
// each frame honesty-checked (only the team's/hers ships; the Data into Geometry
// image-309 precedent binds), every entry now carries an authored alt (80-140
// chars, context not contents). Array order IS the plate's flip order (hero
// first, then the strip in manifest order). Cover + book-spread frame names
// never change (printBook census + width floor). Alts are DRAFT pending
// Emilie's sign-off. Privacy fix: legoarch's mesh-vs-lego / shelf / outputs
// swapped to clean crops (the old sources exposed personal browser tabs).
export const MANIFEST = {
  // SENSI (finalized with Emilie at the desk, 2026-07-14): the galaxy IS the
  // card cover (still constellation at rest, ripples on hover; web intermediate
  // galaxy-cover-web.webp cut from her galaxy-cover-dynamic master, 8s @ 8fps,
  // ffmpeg, local derived file like the pasta-atlas crop). The flip-through
  // runs in ACT ORDER behind the 45s scored demo video: onboard gif + shot,
  // shape shots, report gif + shot, galaxy UI gif, then the two idea frames.
  // Demo gif sources are the richer demos/blog gifs exports.
  sensi: [
    {
      src: 'sensi/app-screenshots/galaxy-cover-web.webp', role: 'gif', name: 'galaxy-cover', frame16x9: true, bg: '#424242',
      alt: "Sensi's relationship galaxy at rest: six senses as glowing constellations, every thread a coupling between two scores",
    },
    {
      src: 'sensi/demos/blog gifs/Sensi_Demo1.gif', role: 'gif', name: 'demo-onboarding',
      alt: 'Onboarding demo: the copilot interviews one person and reveals the persona it will design for, comfort with a subject',
    },
    {
      src: 'sensi/app-screenshots/01-onboarding.png', role: 'gallery', name: 'onboarding',
      alt: "Sensi's onboarding chat calibrating the comfort copilot to one person: their noise tolerance, their thermal grudges",
    },
    {
      src: 'sensi/app-screenshots/06-shape.png', role: 'hero', name: 'app-shape',
      alt: 'The Sensi workspace mid-edit: a floor plan scored across six senses, conflicts flagged while the layout is still soft',
    },
    {
      src: 'sensi/app-screenshots/09.2-shape.png', role: 'gallery', name: 'green-lens',
      alt: 'The green lens over a city apartment plan: what shapes nature here, the kitchen flagged thirsty for daylight and plants',
    },
    {
      src: 'sensi/demos/blog gifs/Sensi_Demo2.gif', role: 'gif', name: 'demo-report',
      alt: 'The vision report scrolling: room scores, the prompt they become, and the render the copilot hands back',
    },
    {
      src: 'sensi/app-screenshots/11-report.png', role: 'gallery', name: 'report',
      alt: 'The vision report Sensi hands over: comfort scores shaped for one person, with the edits the layout absorbed',
    },
    {
      src: 'sensi/demos/blog gifs/Sensi_Demo3.2.gif', role: 'gif', name: 'relationship-galaxy',
      alt: 'Animated relationship galaxy in Sensi, the comfort copilot, mapping how six sense scores pull on each other across a floor plan',
    },
    {
      src: 'sensi/blog/Screenshot-2026-06-28-074954.png', role: 'gallery', name: 'sensory-layer',
      alt: 'The missing layer drawn onto the BIM stack: six senses above energy, cost and structure, the claim Sensi is built on',
    },
    {
      src: 'sensi/blog/Screenshot-2026-06-28-080611.png', role: 'gallery', name: 'coupling-map',
      alt: 'The levers-to-senses coupling map, every link grounded in research from BS 8233 to ASHRAE before it entered the model',
    },
    {
      src: 'sensi/blog/Screenshot-2026-06-28-081039.png', role: 'gallery', name: 'act-2-flow',
      alt: 'Act 2 of the pipeline as a flowchart: score, edit, ripple and galaxy loops around the plan while it is still soft',
    },
  ],
  // NEUROSPACE (finalized with Emilie, 2026-07-15): the cover is a live cut
  // of the red room morphing under a slider drag (neuro-cover-web.webp,
  // ffmpeg 8s @ 8fps from the recording, cropped INSIDE the app: the raw
  // capture's browser chrome held personal tabs and never ships). Landing
  // moved into the strip; the cropped silent slider-tour video leads.
  neurospace: [
    {
      src: 'neurospace/Images/neuro-cover-web.webp', role: 'gif', name: 'demo-cover',
      alt: 'The red parametric room mid-morph as a slider drags, the NeuroScore answering live in the corner of the lab',
    },
    {
      src: 'neurospace/Images/landing page.png', role: 'hero', name: 'landing',
      alt: 'NeuroSpace landing page: enter the lab where sliders reshape a room and a live score estimates what it does to you',
    },
    {
      src: 'neurospace/Images/view page.png', role: 'gallery', name: 'view',
      alt: 'The NeuroSpace lab in the browser: sliders reshape a parametric room while the live score answers back instantly',
    },
    {
      src: 'neurospace/blog/image-408.png', role: 'gallery', name: 'pipeline',
      alt: 'Pipeline diagram: slider values ride to Rhino.Compute for geometry while the browser scores the behavior instantly on its own',
    },
    {
      src: 'neurospace/blog/image-409.png', role: 'gallery', name: 'score-formula',
      alt: 'The NeuroScore formula opened up: five weighted dimensions and every assumption behind the estimate, readable and arguable',
    },
    {
      src: 'neurospace/Images/score01.png', role: 'gallery', name: 'score-1',
      alt: 'Top of the NeuroSpace report: what this design predicts, hypothesis cards and the estimated wellbeing score dial',
    },
    {
      src: 'neurospace/Images/score02.png', role: 'gallery', name: 'score-2',
      alt: "The report's breakdown: contribution bars and a brain impact map behind the room's estimated wellbeing score",
    },
  ],
  // THE HUDDLE (Emilie, 2026-07-15): the cover is the WASP growth gif (the
  // method alive, still at rest + playing on hover); the axonometric moved
  // into the strip and stays the BOOK plate via its print rung.
  huddle: [
    {
      src: 'huddle/blog/studio2.gif', role: 'gif', name: 'wasp-growth', frame16x9: true, bg: '#ffffff',
      alt: 'Animated WASP growth study: modules aggregating along wind and program across the Punta Arenas plot',
    },
    {
      src: 'huddle/IMAGES/axonometric.jpg', role: 'hero', name: 'axonometric',
      alt: 'Axonometric of The Huddle, wind-formed modules aggregated into a research hub inside the Punta Arenas grid',
    },
    {
      src: 'huddle/IMAGES/persp-01.png', role: 'gallery', name: 'perspective-1',
      alt: 'Blizzard courtyard render inside The Huddle, turbines spinning between the wind-formed modules in Punta Arenas',
    },
    {
      src: 'huddle/blog/climate_puntaarenas.png', role: 'gallery', name: 'climate-wind',
      alt: 'Climate analysis for Punta Arenas with monthly wind roses and the westerly wind speeds that drive the aggregation',
    },
    {
      src: 'huddle/blog/19-1.jpg', role: 'gallery', name: 'global-index',
      alt: 'Global Index analysis matching Shield, Lens and Gill panels to daylight, wind and program across the envelope',
    },
    {
      src: 'huddle/blog/25.jpg', role: 'gallery', name: 'sectioned-model',
      alt: 'Sectioned aggregation model showing public and private modules under the continuous wind-formed skin',
    },
    {
      src: 'huddle/IMAGES/persp-02.jpeg', role: 'gallery', name: 'perspective-2',
      alt: 'Street-level render of the module cluster meeting the town, the Punta Arenas sign in the foreground',
    },
    {
      src: 'huddle/IMAGES/axonometric-zoom.jpg', role: 'gallery', name: 'axonometric-zoom',
      alt: 'Close-up of the aggregation at the gate, the three-panel envelope reading as a map of wind and light',
    },
  ],
  // THE LUNGS (finalized with Emilie, 2026-07-15, round 2): her ruling =
  // ALL blog frames EXCEPT image-485 (the architecture diagram), which also
  // ships the stress-test calmness leaderboard on her explicit include. The
  // cover is a live cut of the KPI dependency map; her 42.5s silent film
  // leads the plate (the live app is IAAC-gated, so the demo shows what the
  // login hides). Strip = inside-the-app first, then the public-page crops
  // (the full public-interface scroll left with 485; the tower collage stays
  // the BOOK plate via its print rung; the old control-room-kpis frame
  // showed the teammate logged in and never returns).
  lungs: [
    {
      src: 'lungs/lungs-cover-web.webp', role: 'gif', name: 'demo-cover',
      alt: 'The KPI dependency map of the live studio platform, data, program and structure indicators wired into one network',
    },
    {
      src: 'lungs/blog/image-480.png', role: 'gallery', name: 'kpi-dashboard',
      alt: 'The KPI dashboard mid-studio: nine indicators scored live against their targets, honest oranges included',
    },
    {
      src: 'lungs/blog/image-481-scaled.png', role: 'gallery', name: 'kpi-map',
      alt: 'The KPI dependency network: data, program and structure indicators tied into one system the studio steered by',
    },
    {
      src: 'lungs/blog/image-484.png', role: 'gallery', name: 'speckle-live',
      alt: "Speckle streams the design teams' tower model into the app, so performance gradients sit on the geometry itself",
    },
    {
      src: 'lungs/blog/image-482-scaled.png', role: 'gallery', name: 'timeline',
      alt: 'Ten weeks as a live timeline: three team tracks and the weekly deliverables the app kept honest',
    },
    {
      src: 'lungs/blog/image-483.png', role: 'gallery', name: 'stress-test',
      alt: 'The stress test tab, a calmness leaderboard the studio actually played; fewer pops means calmer',
    },
    {
      src: 'lungs/blog/image-478.png', role: 'gallery', name: 'discover',
      alt: "The Discover tab publishing the tower's vitals: three systems, one tower, and the numbers the studio stood behind",
    },
    {
      src: 'lungs/blog/image-479.png', role: 'gallery', name: 'why-how-what',
      alt: 'The concept strip on the public page: the core problem, the data logic and the architecture in three beats',
    },
  ],
  // LEGOARCH (finalized with Emilie, 2026-07-15, round 4): the cover is a
  // live cut of Saint Basil's solving into its brick layout; the flip-through
  // is SLIDES + APP SCREENSHOTS ONLY (her rule: explanation or web
  // screenshot, no product renders; the film + cover carry the visuals).
  // The golden sagrada-render left the web gallery but remains the BOOK
  // plate via its committed print rung (print-images.json).
  legoarch: [
    {
      src: 'legoarch/legoarch-cover-web.webp', role: 'gif', name: 'demo-cover',
      alt: "Saint Basil's Cathedral solving into a brick layout in lEgoarCh, the stage with no AI in it on purpose",
    },
    {
      src: 'legoarch/blog/pipeline.png', role: 'gallery', name: 'pipeline',
      alt: 'The lEgoarCh GenAI pipeline: FLUX and TRELLIS propose, deterministic code verifies the LEGO set as digitally buildable',
    },
    {
      src: 'legoarch/blog/slide-workflows.png', role: 'gallery', name: 'three-graphs',
      alt: 'Three ComfyUI graphs share one core: the render, the LoRA look and the 3D mesh stages of the lEgoarCh pipeline',
    },
    {
      src: 'legoarch/blog/slide-lora.png', role: 'gallery', name: 'lora-sweep',
      alt: 'LoRA strength sweep from 0 to 1 on the Sagrada Familia and La Muralla Roja: the LEGO set look snaps in at full strength',
    },
    {
      src: 'legoarch/blog/split-and-merge.png', role: 'gallery', name: 'split-and-merge',
      alt: 'The split and merge pass packing the voxel grid into the largest legal bricks, fewer parts holding the same shape',
    },
    {
      src: 'legoarch/blog/perceptual-colour.png', role: 'gallery', name: 'perceptual-colour',
      alt: 'Colour matching by CIEDE2000 instead of RGB distance, snapping every voxel to the nearest of 48 real LEGO colours',
    },
    {
      src: 'legoarch/blog/07-mesh-vs-lego.png', role: 'gallery', name: 'mesh-vs-lego',
      alt: 'The result page comparing generated mesh and placed bricks for the Sagrada Familia set, verified digitally buildable',
    },
    {
      src: 'legoarch/blog/slide-bilbao.png', role: 'gallery', name: 'honest-part',
      alt: 'The instructive failure: the Guggenheim prompt returned a voxel blob, structurally sound but not legible as architecture',
    },
    {
      src: 'legoarch/blog/slide-outputs.png', role: 'gallery', name: 'outputs',
      alt: 'Everything one prompt returns: render, mesh, digitally verified build, box art, booklet, parts list and price',
    },
    {
      src: 'legoarch/blog/slide-catalog.png', role: 'gallery', name: 'real-parts',
      alt: 'Real parts and real moulds: 44 BrickLink parts in 48 colours, the catalog the optimizer is allowed to build from',
    },
    {
      src: 'legoarch/blog/10-shelf-3d.png', role: 'gallery', name: 'shelf',
      alt: 'The collection shelf holding three boxed sets the pipeline produced: Sagrada, La Muralla Roja and the Guggenheim run',
    },
  ],
  // CAPPELLETTI (Emilie, 2026-07-15): the cover is the Galapagos optimization
  // gif (the method alive); the poster render dropped into the strip.
  cappelletti: [
    {
      src: 'cappelletti/blog/Recording-2025-12-18-182036.gif', role: 'gif', name: 'galapagos-run', frame16x9: true, bg: '#ffffff',
      alt: "Galapagos optimization running live, vertex octa lattice displacement traded against mass for the pavilion's outer shell",
    },
    {
      src: 'cappelletti/working files/Images/poster-01.jpeg', role: 'hero', name: 'poster',
      alt: 'Cappelletti Pavilion render: the pasta-derived lattice shell at human scale beside a pond, visitors underneath',
    },
    {
      src: 'cappelletti/blog/pasta-atlas-team-crop.png', role: 'gallery', name: 'pasta-atlas',
      alt: "The team's pasta atlas page: parametric equations of a cappelletti, the starting geometry for the pavilion's optimization",
    },
    {
      src: 'cappelletti/blog/Recording-2025-12-18-181501.gif', role: 'gif', name: 'equations-script',
      alt: 'Grasshopper and Python script translating cappelletti equations into the pavilion shell ahead of structural optimization',
    },
    {
      src: 'cappelletti/blog/Screenshot-2025-12-18-181944.png', role: 'gallery', name: 'optimization-map',
      alt: 'Workflow map of the structural optimization loop: Galapagos genomes, Alpaca4D analysis, mass and deflection fitness',
    },
    {
      src: 'cappelletti/GIFS or videos/inner-structure-cell-type.gif', role: 'gif', name: 'lattice',
      alt: 'Edge octa lattice displacement study inside the shell, the inner structure that landed at 87 kg of material',
    },
    {
      src: 'cappelletti/blog/Screenshot-2025-12-18-182225.png', role: 'gallery', name: 'two-topologies',
      alt: 'Structural optimization result: two lattice topologies, edge octa at 87 kg and vertex octa at 73 kg, both standing',
    },
  ],
  // professional-era images from the old site. FROZEN (optimize-images.mjs):
  // the /images sources were removed in the 2026-07-12 hygiene cleanup, so the
  // baked webps + manifest entries carry forward as-is; these src paths are
  // historical record only.
  professional: [
    { src: '../images/pic-citywalk.png', role: 'gallery', name: 'citywalk' },
    { src: '../images/pic-escape.png', role: 'gallery', name: 'marsception' },
    { src: '../images/pic-culinary.png', role: 'gallery', name: 'culinary' },
  ],
  // A BALLOONING MARKET (Emilie, 2026-07-15): the cover is the Kangaroo
  // inflation process gif (the method alive); render-1 dropped into the strip
  // and stays the BOOK plate via its print rung.
  'ballooning-market': [
    {
      src: 'ballooning-market/GIFS/process.gif', role: 'gif', name: 'process', frame16x9: true, bg: '#ffffff',
      alt: 'Four stages of the Kangaroo inflation: seeding the balloons, anchoring, settling, and threading the spine path',
    },
    {
      src: 'ballooning-market/IMAGES/BALLOONING-MARKET-RENDER (1).jpeg', role: 'hero', name: 'render-1',
      alt: 'Aerial render of the Bab al-Luq block, the settled balloon roof filling the historic steel frame with color',
    },
    {
      src: 'ballooning-market/blog/image-231.png', role: 'gallery', name: 'exploded-layers',
      alt: 'Exploded layer diagram of the pneumatic occupation: historic steel frame, spine tunnel, and the inflated balloon roof',
    },
    {
      src: 'ballooning-market/blog/image-232.png', role: 'gallery', name: 'algorithm',
      alt: 'The Grasshopper algorithm behind the inflation simulation, from constraints to Kangaroo goals to the settled cluster',
    },
    {
      src: 'ballooning-market/GIFS/epic-fails.gif', role: 'gif', name: 'epic-fails',
      alt: 'The honest outtakes: zero self-collision and mesh clipping, the failures on the way to a settled balloon roof',
    },
    {
      src: 'ballooning-market/blog/image-238.png', role: 'gallery', name: 'design-matrix',
      alt: 'Design-space matrix of Kangaroo inflation runs, tuning balloon scale, density and volume inside the frame',
    },
    {
      src: 'ballooning-market/blog/image-236.png', role: 'gallery', name: 'chromatic-study',
      alt: 'The chromatic coding study: overlapping ETFE balloons mix cyan, magenta and yellow light into market wayfinding',
    },
    {
      src: 'ballooning-market/IMAGES/BALLOONING-MARKET-RENDER (2).jpeg', role: 'gallery', name: 'souk-interior',
      alt: 'Render inside the souk under the settled balloon roof, daylight filtered through the colored membranes onto the stalls',
    },
    {
      src: 'ballooning-market/IMAGES/BALLOONING-MARKET-RENDER (3).jpeg', role: 'gallery', name: 'render-3',
      alt: 'Render of the playscape tunnel through the balloon field, a kid running the voronoi net spine',
    },
  ],
  // S4b · THE FIVE (2026-07-14): sources are Emilie's public IAAC blog posts,
  // downloaded into incoming/<slug>/ (her approval at the session gate).
  narkomfin: [
    {
      src: 'narkomfin/Blog_GraphML_G02_Maria_Lakzhmy_Charles_Emilie.png', role: 'hero', name: 'voxel-graph',
      alt: 'The Narkomfin building rebuilt as translucent voxel volumes on black, spatial graph nodes and edges reaching out of the massing',
    },
    {
      src: 'narkomfin/simplified-3d-exploded.png', role: 'gallery', name: 'exploded-axo',
      alt: 'Simplified Narkomfin massing exploded level by level, the geometry the team sampled into spatial graphs',
    },
    {
      src: 'narkomfin/building-graph_.5.png', role: 'gallery', name: 'plan-graph',
      alt: 'Narkomfin floor plates grid-sampled in red wireframe, stair links tying the levels into one walkable spatial graph',
    },
    {
      src: 'narkomfin/Ftype_building-graph_.5.png', role: 'gallery', name: 'type-f-graph',
      alt: 'Type F duplex levels of Narkomfin stacked as sampled grids, corridor connections running between the floors',
    },
    {
      src: 'narkomfin/blog/Blog_GraphML_G02_Maria_Lakzhmy_Charles_Emilie_page-0019.jpg', role: 'gallery', name: 'betweenness',
      alt: "Betweenness centrality over the team's spatial graph of Type K, one hot line showing every Narkomfin path crossing the corridor",
    },
    {
      src: 'narkomfin/blog/Blog_GraphML_G02_Maria_Lakzhmy_Charles_Emilie_page-0025.jpg', role: 'gallery', name: 'communities-f',
      alt: "Community detection across the three Type F levels, the spatial graph reading Ginzburg's duplexes as full-height vertical slices",
    },
    {
      src: 'narkomfin/blog/Blog_GraphML_G02_Maria_Lakzhmy_Charles_Emilie_page-0029.jpg', role: 'gallery', name: 'graphsage-f',
      alt: "The team's GraphSAGE room classifier reading conventional Type F rooms at 91.3 percent, graph machine learning as a plan reader",
    },
    {
      src: 'narkomfin/blog/Blog_GraphML_G02_Maria_Lakzhmy_Charles_Emilie_page-0027.jpg', role: 'gallery', name: 'graphsage-k',
      alt: "GraphSAGE prediction for the communal Type K unit at 67.9 percent, the team's model flagging the rooms that break domestic rules",
    },
  ],
  'urban-risk': [
    {
      src: 'urban-risk/ui-gif.gif', role: 'gif', name: 'assessment-ui', frame16x9: true, bg: '#ffffff',
      alt: "The team's street safety assessment interface scoring a neighborhood's segments from OpenStreetMap features",
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0005-scaled.jpg', role: 'gallery', name: 'safety-theories',
      alt: 'Six urban safety theories, Jacobs to Space Syntax, that the team encoded into measurable spatial features',
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0012-scaled.jpg', role: 'gallery', name: 'london-data',
      alt: 'The London training data: 921,753 police incidents mapped citywide and broken down by crime type',
    },
    {
      src: 'urban-risk/blog/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0020-scaled.jpg', role: 'gallery', name: 'pipeline',
      alt: "The team's pipeline from OpenStreetMap data fetching through feature checks and risk scoring to model training and deployment",
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0024-scaled.jpg', role: 'gallery', name: 'risk-score',
      alt: 'The composite risk score weighting lighting, visibility, connectivity, enclosure and transit per street segment',
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0018-scaled.jpg', role: 'gallery', name: 'model-performance',
      alt: 'Three regression models flatlining on crime prediction, the run that showed spatial form alone predicts crime poorly',
    },
    {
      src: 'urban-risk/blog/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0039.jpg', role: 'gallery', name: 'shap-explanations',
      alt: "SHAP plots the team used to explain every prediction, comparing what drives risk in Islington and Barcelona's Eixample",
    },
    {
      src: 'urban-risk/blog/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0044-scaled.jpg', role: 'gallery', name: 'spanish-neighborhoods',
      alt: 'The trained model scoring street segments in Poble Sec, Puente de Vallecas, and Triana, testing how the pipeline transfers',
    },
  ],
  'data-geometry': [
    {
      src: 'data-geometry/image-301.png', role: 'hero', name: 'workflow', frame16x9: true, bg: '#ffffff',
      alt: "The data team's workflow: a Speckle model and parameter sheets flowing through Grasshopper into versioned Revit models and IFC",
    },
    {
      src: 'data-geometry/image-302.png', role: 'gallery', name: 'thermal-family',
      alt: 'A parametric Revit family for the thermal panel, shared parameters carrying analysis results into the model',
    },
    {
      src: 'data-geometry/blog/image-305.png', role: 'gallery', name: 'thermal-in-model',
      alt: "Thermal comfort KPIs coloring the Hyperbuilding towers level by level, the team's Revit families carrying analysis into BIM",
    },
    {
      src: 'data-geometry/blog/image-307.png', role: 'gallery', name: 'air-spheres',
      alt: 'Air purification KPIs as pollutant spheres along the cores, sized from Speckle data through Grasshopper and Rhino.Inside Revit',
    },
    {
      src: 'data-geometry/image-308.png', role: 'gallery', name: 'data-team',
      alt: "The data team's four roles on Hyperbuilding 01: process, information structure, data translation and communication",
    },
    {
      src: 'data-geometry/image-310.png', role: 'gallery', name: 'control-room',
      alt: 'The web app control room: KPI dashboards, an interactive timeline and a health check the studio reported into',
    },
  ],
  // TSUKIJI (Emilie, 2026-07-15): the cover is the design-exploration gif (the
  // form reshaping, alive); the site-maps board dropped into the strip.
  tsukiji: [
    {
      src: 'tsukiji/ea-blogpost-design-exploration.gif', role: 'gif', name: 'form-iterations', frame16x9: true, bg: '#ffffff',
      alt: 'Design exploration iterations reshaping the market hall after small tweaks barely moved environmental performance',
    },
    {
      src: 'tsukiji/1-6-scaled.jpg', role: 'hero', name: 'site-maps', frame16x9: true, bg: '#ffffff',
      alt: 'The 19-hectare Tsukiji site in Tokyo: location maps, the nearest weather data hub and the 1979 land use plan',
    },
    {
      src: 'tsukiji/2-4-scaled.jpg', role: 'gallery', name: 'market-visit',
      alt: 'A rainy visit to the Tsukiji outer market, the crowds and food stalls the redevelopment has to live beside',
    },
    {
      src: 'tsukiji/3-5-scaled.jpg', role: 'gallery', name: 'site-model',
      alt: 'The Tsukiji development brief and the Rhino site model, the venue massed at 74 m among Chuo City towers',
    },
    {
      src: 'tsukiji/blog/7-2-scaled.jpg', role: 'gallery', name: 'climate-stress',
      alt: "UTCI thermal stress maps from the team's environmental analysis: Tokyo swings the site from cold stress to summer heat",
    },
    {
      src: 'tsukiji/blog/9-1-scaled.jpg', role: 'gallery', name: 'radiation-sun-hours',
      alt: 'Seasonal radiation and sun hour maps the team ran in Ladybug across the roof and facades of the proposed venue',
    },
    {
      src: 'tsukiji/blog/14-scaled.jpg', role: 'gallery', name: 'daylight-floors',
      alt: 'Floor by floor daylight factor runs that failed the inner corners, the result that made the team reshape the form',
    },
    {
      src: 'tsukiji/ea-blogpost-galapagos-scaled.gif', role: 'gif', name: 'galapagos',
      alt: "Galapagos evolutionary search running on the roof form, hunting a geometry that performs in Tokyo's humid climate",
    },
    {
      src: 'tsukiji/blog/8.jpg', role: 'gallery', name: 'form-evolution',
      alt: "Five form iterations from the team's environmental analysis, each revision answering a radiation, comfort or daylight study",
    },
  ],
  // OPTIMIZING FOR THE MIND (Emilie's design, 2026-07-16): the plate is a
  // QUOTE REEL. The card cover is a lighter gif of the reel (still at rest,
  // playing on hover); the crisp reel video leads the plate (video-manifest),
  // then the 7 verbatim quote cards flip individually, then the episode art.
  // Quote wording is VERBATIM from the transcript with true timestamps; the
  // blog science diagrams stay OUT (they render Dr. Valentine's methods).
  podcast: [
    {
      src: 'podcast/podcast-reel-web.webp', role: 'gif', name: 'demo-cover',
      alt: "The podcast quote reel: seven timestamped lines from the conversation on architecture and the brain, in Emilie and Dr. Valentine's words",
    },
    {
      src: 'podcast/cards/1-open.png', role: 'gallery', name: 'quote-icebreaker',
      alt: 'Quote card at 02:09, Emilie: we talk about smart buildings in terms of efficiency, but rarely in terms of feeling',
    },
    {
      src: 'podcast/cards/2-evidence.png', role: 'gallery', name: 'quote-evidence',
      alt: 'Quote card at 09:21, Dr. Cleo Valentine: architecture has fallen into the trap of being artistically informed, not evidence informed',
    },
    {
      src: 'podcast/cards/3-naming.png', role: 'gallery', name: 'quote-naming',
      alt: 'Quote card at 09:21, Dr. Cleo Valentine blessing the term Behavior Information Modeling, an elegant way of describing the work',
    },
    {
      src: 'podcast/cards/4-gameengines.png', role: 'gallery', name: 'quote-gameengines',
      alt: 'Quote card at 42:53, Emilie: what if the building does not exist yet and we want to test it, where game engines come in',
    },
    {
      src: 'podcast/cards/5-publichealth.png', role: 'gallery', name: 'quote-publichealth',
      alt: 'Quote card at 55:59, Dr. Cleo Valentine: the built environment is one of the most underutilized tools for public health',
    },
    {
      src: 'podcast/cards/6-upset.png', role: 'gallery', name: 'quote-upset',
      alt: 'Quote card at 59:30, Dr. Cleo Valentine: people in unhealthy spaces are entitled to be upset because we can do better',
    },
    {
      src: 'podcast/cards/7-close.png', role: 'gallery', name: 'quote-close',
      alt: 'Quote card at 1:01:54, Emilie closing: if spaces shape how you think and feel, maybe it is time we designed for that',
    },
    {
      src: 'podcast/blog/efficiency_vs_behavior.png', role: 'gallery', name: 'episode-art',
      alt: "Episode key art: a building cutaway splitting from grey efficiency into a warm, neuron-lit half, picturing the show's core question",
    },
  ],
  // (Pelagñou was ingested here in S4b then pulled at Emilie's gate call:
  // parked as a THOUGHT candidate, see data/registry.ts. Its sources stay in
  // incoming/pelagnou/ for that future session.)
}

// Output size ladder per role (max widths; smaller sources stay at native width).
// QUALITY PASS (Emilie, 2026-07-14): gallery gained the 1600 rung and gifs the
// 1024 rung. The plate stage was loading the 640 rung on retina screens (its
// sizes hint was missing, fixed in WorkOverlay); the taller ladders are what
// the fixed hint now picks from. The grid cards still request the small rungs.
export const SIZES = {
  hero: [640, 1024, 1600],
  gallery: [640, 1024, 1600],
  gif: [640, 1024],
}
