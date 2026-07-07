// GoatCounter's count.js global (script tag in index.html). Only the one
// method the app calls is typed.
interface Window {
  goatcounter?: {
    count?: (vars?: { path?: string; title?: string; event?: boolean }) => void
  }
}
