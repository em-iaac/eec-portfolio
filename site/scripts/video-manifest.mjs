// Curated video picks from incoming/<slug>/ (git-ignored staging) -> web
// mp4 + poster webp ladder (scripts/optimize-videos.mjs). Emilie's picks
// 2026-07-08: the scored Sensi demo + the silent report flow only (onboard
// and shape stay in staging, unencoded). audio: keep-and-transcode the
// source track; silent sources encode with -an. posterAt: seconds into the
// ENCODED clip for the representative poster frame. crf: the flagship demo
// encodes richer than flow captures.
export const VIDEOS = {
  sensi: [
    { src: 'sensi/demos/sensi-45s-16x9-scored.mp4', name: 'demo', audio: true, posterAt: 12, crf: 23 },
    { src: 'sensi/demos/report.mp4', name: 'flow-report', audio: false, posterAt: 3, crf: 25 },
  ],
}

// Output ceiling: 720p-class. Sheets render video at <= ~900 CSS px; 1280w
// covers desktop and DPR-3 phones, and CRF matters more than resolution for
// screen-capture text. Poster ladder matches the images.json gallery ladder.
export const MAX_W = 1280
export const POSTER_SIZES = [640, 1024]
