// Curated video picks from incoming/ (git-ignored staging; since the
// 2026-07-16 reorg every slug lives under academic/iaac/<slug>/) -> web
// mp4 + poster webp ladder (scripts/optimize-videos.mjs). Emilie's picks
// 2026-07-08: the scored Sensi demo + the silent report flow only (onboard
// and shape stay in staging, unencoded). audio: keep-and-transcode the
// source track; silent sources encode with -an. posterAt: seconds into the
// ENCODED clip for the representative poster frame. crf: the flagship demo
// encodes richer than flow captures.
export const VIDEOS = {
  // lEgoarCh 60s edit v2 (2026-07-15, Emilie's rounds: Sensi-45s film
  // grammar, REAL brand cards from incoming/legoarch/brand, sfx audio kept).
  // Master assembled from gen-ai-linked-01-base.mp4 (her sfx-only base) with
  // the browser chrome cropped OUT of every segment (privacy: the raw
  // recording shows personal tabs); cards carry silent tracks. Cards
  // regenerate from the session scratchpad script; card copy SIGNED by
  // Emilie (REINDEX batch A, 2026-07-16: the question card, the five act
  // cards and the award closer).
  legoarch: [
    { src: 'academic/iaac/legoarch/legoarch-60s-edit.mp4', name: 'demo', audio: true, posterAt: 22, crf: 23 },
  ],
  // (Optimizing for the Mind: the quote reel is the CARD-FACE cover only, a
  // gif in image-manifest with coverMontage: true, so the plate flips the 7
  // real quote cards instead of replaying the reel. No video entry, 2026-07-16.)
  // The Lungs 42.5s edit (2026-07-15, Emilie's spec: her StudioDemo_Edit
  // re-cut SILENT, sped 1.6x, title/credits cards dropped, the two
  // teammate-name segments SKIPPED (team cards + the Ready checklist), and
  // cropped below the app header so the logged-in teammate chip never ships
  // (crop=2560:1200:0:192; privacy, binding). The film leads the plate, which
  // also answers the IAAC-gated live app: the demo shows what the login hides.
  lungs: [
    { src: 'academic/iaac/lungs/lungs-45s-edit.mp4', name: 'demo', audio: false, posterAt: 15, crf: 23 },
  ],
  sensi: [
    { src: 'academic/iaac/sensi/demos/sensi-45s-16x9-scored.mp4', name: 'demo', audio: true, posterAt: 12, crf: 23 },
    { src: 'academic/iaac/sensi/demos/report.mp4', name: 'flow-report', audio: false, posterAt: 3, crf: 25 },
  ],
  // NeuroSpace slider-tour screen capture (Session 9 tail; RE-CUT 2026-07-15,
  // Emilie's pick at the gallery review): the motion beat for P-102, drag a
  // slider and the score answers. Silent (her confirmation: the track holds
  // nothing), flagship crf. THE CROP IS BINDING (privacy): the raw recording
  // includes the browser chrome with her personal tabs; crop=1280:630:0:56
  // slices exactly above the app so no re-encode can ever ship them again.
  neurospace: [
    { src: 'academic/iaac/neurospace/Images/neuro-recording-demo.mp4', name: 'slider-tour', audio: false, posterAt: 12, crf: 23, vf: 'crop=1280:630:0:56' },
  ],
}

// Output ceiling: 720p-class. Sheets render video at <= ~900 CSS px; 1280w
// covers desktop and DPR-3 phones, and CRF matters more than resolution for
// screen-capture text. Poster ladder matches the images.json gallery ladder.
export const MAX_W = 1280
export const POSTER_SIZES = [640, 1024]
