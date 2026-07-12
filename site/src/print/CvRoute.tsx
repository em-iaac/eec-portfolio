// G5 · /print/cv — the chrome-less surface headless Chrome prints to the
// A4-portrait ATS CV PDF every build (scripts/render-pdfs.mjs). See
// BookRoute for the @page / theme-pin / readiness notes.
import { useSearchParams } from 'react-router-dom'
import { PrintContext } from './PrintContext'
import usePrintDoc from './usePrintDoc'
import PrintCV from './PrintCV'
import './print.css'

export default function CvRoute() {
  const [params] = useSearchParams()
  const bw = params.get('bw') === '1'
  const ready = usePrintDoc('Emilie El Chidiac · CV')

  return (
    <PrintContext.Provider value={true}>
      <style>{'@page { size: 210mm 297mm; margin: 0; }'}</style>
      <div
        className={`pr-doc${bw ? ' pr-bw' : ''}`}
        data-theme="light"
        data-print-ready={ready ? '' : undefined}
      >
        <PrintCV />
      </div>
    </PrintContext.Provider>
  )
}
