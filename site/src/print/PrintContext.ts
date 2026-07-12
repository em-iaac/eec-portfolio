// G5 · PRINT. A component that renders on both screen and paper reads this
// flag to pick its print rendition (today: NB, whose hover dot is dead on
// paper and steps into the line as a handwritten wink instead). Default
// false: the screen site never notices the print surface exists.
import { createContext, useContext } from 'react'

export const PrintContext = createContext(false)

export function useIsPrint(): boolean {
  return useContext(PrintContext)
}
