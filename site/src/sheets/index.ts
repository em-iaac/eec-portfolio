// Built sheets, keyed by lowercase sheet number. Registry entries whose
// sheet.status is 'issued' must have a component here; adding a sheet =
// one content file + one line in this map (+ flip the registry status).
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export const SHEETS: Record<string, LazyExoticComponent<ComponentType>> = {
  'p-104': lazy(() => import('./P104')),
}
