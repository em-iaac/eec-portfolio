// THE BIO'S VARIABLES (Emilie, 2026-08-06, the last pass).
//
// The closing line ends on "what is x doing to y?" and those two letters are
// VARIABLES, set in italic because roman read as a placeholder nobody filled in.
// LandingCover italicises them by splitting on the named tokens in
// BIO_VARIABLES, which means two things can silently go wrong later:
//
//   1. A new BIO edit introduces a stray standalone "x" or "y" as an ordinary
//      word, and it renders in italic for no reason.
//   2. Someone "fixes" the closing line by resolving the variables into an
//      example, which is exactly the edit she reversed by hand: "I actually
//      meant to keep the what is x doing to y, it is intentional wording."
//
// Neither shows up in a typecheck or a build. This is the guard.
import { describe, expect, it } from 'vitest'
import { BIO, BIO_VARIABLES } from './identity'

const ALL = BIO.join('\n')

describe('the landing bio', () => {
  it('carries exactly one standalone occurrence of each variable', () => {
    for (const v of BIO_VARIABLES) {
      const hits = ALL.match(new RegExp(`\\b${v}\\b`, 'g')) ?? []
      expect(hits.length, `standalone "${v}" in the bio`).toBe(1)
    }
  })

  it('still ends on the general form, not on an example', () => {
    const last = BIO[BIO.length - 1]!
    // The shape she wrote, with the variables adjacent to the verb. If someone
    // substitutes a room or a person back in, this stops being true.
    expect(last).toMatch(/what is x doing to y\?$/)
  })

  it('never italicises a word that is not a variable', () => {
    // The trap this exists for: "italicise any standalone single letter" would
    // have caught every "I" in the first paragraph. Prove the token list is
    // narrower than that.
    const singles = ALL.match(/\b[A-Za-z]\b/g) ?? []
    const notVariables = singles.filter((s) => !(BIO_VARIABLES as readonly string[]).includes(s))
    expect(notVariables.length, 'single letters that must stay roman').toBeGreaterThan(0)
    for (const s of notVariables) {
      expect((BIO_VARIABLES as readonly string[]).includes(s)).toBe(false)
    }
  })

  it('keeps the floor: no em dashes anywhere in it', () => {
    expect(ALL).not.toContain('—')
  })
})
