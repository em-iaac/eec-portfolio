// The develop ledger (Session 8 extraction). One module-level Set shared by
// the one-shot develop (useDevelopOnce) and the scroll-scrubbed plate
// develop (CinemaPlate), so a print developed by EITHER ceremony stays
// developed across route returns within the visit. Keys are image
// identities ('slug/name'); a fresh page load starts the visit over.
const developed = new Set<string>()

export const hasDeveloped = (key: string): boolean => developed.has(key)

export const markDeveloped = (key: string): void => {
  developed.add(key)
}
