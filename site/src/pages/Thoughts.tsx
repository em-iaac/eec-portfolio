// /thoughts (the meta build, 2026-07-11; REINDEX 2026-07-16, Emilie's IA
// gate): the NEURAL WORLD only — the whole record as one anatomical neural
// map, the mind IN TIME (the landing stays the mind at rest; two views of
// one mind). The G2 reading room RETIRED at the reindex: the thoughts LIST
// lives on /work now (THE THOUGHTS section, the printed index's rows), and
// the old ?view=words corridor strips its param and lands here — the static
// host serves /thoughts.html for any query, so the old URL can never 404.
import { Navigate, useSearchParams } from 'react-router-dom'
import NeuralWorld from '../thoughts/world/NeuralWorld'

export default function Thoughts() {
  const [params] = useSearchParams()
  if (params.get('view')) return <Navigate to="/thoughts" replace />
  return <NeuralWorld />
}
