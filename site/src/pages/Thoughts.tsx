// /thoughts (the meta build, 2026-07-11, every gate Emilie's): the NEURAL
// WORLD — the whole record as one anatomical neural map, the mind IN TIME
// (the landing stays the mind at rest; two views of one mind). The G2
// reading room survives one corridor away at ?view=words (gate 3): same
// address family, no new door, the row→note morphs intact.
import { useSearchParams } from 'react-router-dom'
import NeuralWorld from '../thoughts/world/NeuralWorld'
import ReadingRoom from '../thoughts/ReadingRoom'

export default function Thoughts() {
  const [params] = useSearchParams()
  if (params.get('view') === 'words') return <ReadingRoom />
  return <NeuralWorld />
}
