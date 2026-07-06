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
}

// Output size ladder per role (max widths; smaller sources stay at native width).
export const SIZES = {
  hero: [640, 1024, 1600],
  gallery: [640, 1024],
  gif: [640],
}
