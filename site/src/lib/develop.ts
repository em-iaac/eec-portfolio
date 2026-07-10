// The develop ledger (Session 8 extraction; the scroll-scrubbed plate
// develop retired with the sheet tier at G1). A module-level Set behind the
// one-shot develop (useDevelopOnce), so a print stays developed across route
// returns within the visit. Keys are image identities ('slug/name'); a
// fresh page load starts the visit over.
const developed = new Set<string>()

export const hasDeveloped = (key: string): boolean => developed.has(key)

export const markDeveloped = (key: string): void => {
  developed.add(key)
}
