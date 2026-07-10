// THE MASTER CONTENT INDEX (G1). One file per project in this folder; this
// index assembles them in the canonical lens order the old projects store
// used (computation heroes, then practice, then explorations). Adding a
// project = one registry entry + one master file here (THE ECONOMY).
import type { ProjectMaster } from './types'
import sensi from './sensi'
import neurospace from './neurospace'
import huddle from './huddle'
import lungs from './lungs'
import legoarch from './legoarch'
import ballooningMarket from './ballooning-market'
import podcast from './podcast'
import somaTowers from './soma-towers'
import marsception from './marsception'
import cappelletti from './cappelletti'
import xrLab from './xr-lab'

export type { ProjectMaster } from './types'

export const ALL_PROJECT_MASTERS: ProjectMaster[] = [
  sensi,
  neurospace,
  huddle,
  lungs,
  legoarch,
  ballooningMarket,
  podcast,
  somaTowers,
  marsception,
  cappelletti,
  xrLab,
]

export const MASTERS_BY_SLUG: Record<string, ProjectMaster> = Object.fromEntries(
  ALL_PROJECT_MASTERS.map(p => [p.slug, p]),
)
