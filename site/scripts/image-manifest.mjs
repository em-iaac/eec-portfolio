// Curated picks from incoming/<slug>/ (git-ignored staging) → web assets.
// role: 'hero' (card + case-study lead), 'gallery' (case-study body), 'gif' (kept as-is
// if small enough, else first frame + link), 'video' (poster frame only for READ mode).
// Paths are relative to repo-root/incoming/.
export const MANIFEST = {
  sensi: [
    { src: 'sensi/app-screenshots/06-shape.png', role: 'hero', name: 'app-shape' },
    { src: 'sensi/app-screenshots/01-onboarding.png', role: 'gallery', name: 'onboarding' },
    { src: 'sensi/app-screenshots/11-report.png', role: 'gallery', name: 'report' },
    { src: 'sensi/app-screenshots/13-report.png', role: 'gallery', name: 'report-detail' },
  ],
  neurospace: [
    { src: 'neurospace/Images/landing page.png', role: 'hero', name: 'landing' },
    { src: 'neurospace/Images/view page.png', role: 'gallery', name: 'view' },
    { src: 'neurospace/Images/score01.png', role: 'gallery', name: 'score-1' },
    { src: 'neurospace/Images/score02.png', role: 'gallery', name: 'score-2' },
  ],
  huddle: [
    { src: 'huddle/IMAGES/axonometric.jpg', role: 'hero', name: 'axonometric' },
    { src: 'huddle/IMAGES/persp-01.png', role: 'gallery', name: 'perspective-1' },
    { src: 'huddle/IMAGES/persp-02.jpeg', role: 'gallery', name: 'perspective-2' },
    { src: 'huddle/IMAGES/wind01.png', role: 'gallery', name: 'wind-study' },
    { src: 'huddle/IMAGES/axonometric-zoom.jpg', role: 'gallery', name: 'axonometric-zoom' },
  ],
  lungs: [
    { src: 'lungs/Lungs_Hero1.png', role: 'hero', name: 'tower' },
    { src: 'lungs/HB01_publicinterface.png', role: 'gallery', name: 'public-interface' },
    { src: 'lungs/HB01_controlroom_0.png', role: 'gallery', name: 'control-room' },
    { src: 'lungs/HB01_controlroom_3.png', role: 'gallery', name: 'control-room-kpis' },
  ],
  legoarch: [
    { src: 'legoarch/images/sagrada_fam_lia_barcelona_antoni_gaud-render.png', role: 'hero', name: 'sagrada-render' },
    { src: 'legoarch/images/views/07-mesh-vs-lego.png', role: 'gallery', name: 'mesh-vs-lego' },
    { src: 'legoarch/images/views/08-booklet-view.png', role: 'gallery', name: 'booklet' },
    { src: 'legoarch/images/views/10-shelf-3d.png', role: 'gallery', name: 'shelf' },
    { src: 'legoarch/blog/assets/slide-outputs.png', role: 'gallery', name: 'outputs' },
  ],
  cappelletti: [
    { src: 'cappelletti/working files/Images/poster-01.jpeg', role: 'hero', name: 'poster' },
    { src: 'cappelletti/GIFS or videos/inner-structure-cell-type.gif', role: 'gif', name: 'lattice' },
  ],
  // professional-era images from the old site (repo /images, not incoming/)
  professional: [
    { src: '../images/pic-citywalk.png', role: 'gallery', name: 'citywalk' },
    { src: '../images/pic-escape.png', role: 'gallery', name: 'marsception' },
    { src: '../images/pic-culinary.png', role: 'gallery', name: 'culinary' },
  ],
  'ballooning-market': [
    { src: 'ballooning-market/IMAGES/BALLOONING-MARKET-RENDER (1).jpeg', role: 'hero', name: 'render-1' },
    { src: 'ballooning-market/IMAGES/BALLOONING-MARKET-RENDER (3).jpeg', role: 'gallery', name: 'render-3' },
    { src: 'ballooning-market/IMAGES/BALLOONING-MARKET-RENDER (5).jpeg', role: 'gallery', name: 'render-5' },
    { src: 'ballooning-market/GIFS/process.gif', role: 'gif', name: 'process' },
    { src: 'ballooning-market/GIFS/epic-fails.gif', role: 'gif', name: 'epic-fails' },
  ],
  // S4b · THE FIVE (2026-07-14): sources are Emilie's public IAAC blog posts,
  // downloaded into incoming/<slug>/ (her approval at the session gate). New
  // items carry an authored `alt` (80-140 chars, context not contents); it
  // rides images.json into the strip alts (data/work.ts prefers it over the
  // derived name). Older items keep their derived alts untouched.
  narkomfin: [
    {
      src: 'narkomfin/Blog_GraphML_G02_Maria_Lakzhmy_Charles_Emilie.png', role: 'hero', name: 'voxel-graph',
      alt: 'The Narkomfin building rebuilt as translucent voxel volumes on black, spatial graph nodes and edges reaching out of the massing',
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
      src: 'narkomfin/simplified-3d-exploded.png', role: 'gallery', name: 'exploded-axo',
      alt: 'Simplified Narkomfin massing exploded level by level, the geometry the team sampled into spatial graphs',
    },
  ],
  'urban-risk': [
    {
      src: 'urban-risk/ui-gif.gif', role: 'gif', name: 'assessment-ui',
      alt: "The team's street safety assessment interface scoring a neighborhood's segments from OpenStreetMap features",
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0018-scaled.jpg', role: 'gallery', name: 'model-performance',
      alt: 'Three regression models flatlining on crime prediction, the run that showed spatial form alone predicts crime poorly',
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0012-scaled.jpg', role: 'gallery', name: 'london-data',
      alt: 'The London training data: 921,753 police incidents mapped citywide and broken down by crime type',
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0024-scaled.jpg', role: 'gallery', name: 'risk-score',
      alt: 'The composite risk score weighting lighting, visibility, connectivity, enclosure and transit per street segment',
    },
    {
      src: 'urban-risk/Group01_RiskAssessment_Charles-Emilie-Lakzhmy-Maria_page-0005-scaled.jpg', role: 'gallery', name: 'safety-theories',
      alt: 'Six urban safety theories, Jacobs to Space Syntax, that the team encoded into measurable spatial features',
    },
  ],
  'data-geometry': [
    {
      src: 'data-geometry/image-301.png', role: 'hero', name: 'workflow',
      alt: "The data team's workflow: a Speckle model and parameter sheets flowing through Grasshopper into versioned Revit models and IFC",
    },
    {
      src: 'data-geometry/image-302.png', role: 'gallery', name: 'thermal-family',
      alt: 'A parametric Revit family for the thermal panel, shared parameters carrying analysis results into the model',
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
  tsukiji: [
    {
      src: 'tsukiji/1-6-scaled.jpg', role: 'hero', name: 'site-maps',
      alt: 'The 19-hectare Tsukiji site in Tokyo: location maps, the nearest weather data hub and the 1979 land use plan',
    },
    {
      src: 'tsukiji/3-5-scaled.jpg', role: 'gallery', name: 'site-model',
      alt: 'The Tsukiji development brief and the Rhino site model, the venue massed at 74 m among Chuo City towers',
    },
    {
      src: 'tsukiji/2-4-scaled.jpg', role: 'gallery', name: 'market-visit',
      alt: 'A rainy visit to the Tsukiji outer market, the crowds and food stalls the redevelopment has to live beside',
    },
    {
      src: 'tsukiji/ea-blogpost-design-exploration.gif', role: 'gif', name: 'form-iterations',
      alt: 'Design exploration iterations reshaping the market hall after small tweaks barely moved environmental performance',
    },
    {
      src: 'tsukiji/ea-blogpost-galapagos-scaled.gif', role: 'gif', name: 'galapagos',
      alt: "Galapagos evolutionary search running on the roof form, hunting a geometry that performs in Tokyo's humid climate",
    },
  ],
  // (Pelagñou was ingested here in S4b then pulled at Emilie's gate call:
  // parked as a THOUGHT candidate, see data/registry.ts. Its sources stay in
  // incoming/pelagnou/ for that future session.)
}

// Output size ladder per role (max widths; smaller sources stay at native width).
export const SIZES = {
  hero: [640, 1024, 1600],
  gallery: [640, 1024],
  gif: [640],
}
