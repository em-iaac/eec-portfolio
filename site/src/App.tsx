import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import CV from './pages/CV'

// On PUSH navigation: scroll to top (or hash target) and move focus to the
// main region so keyboard/screen-reader users land on the new page. POP
// (back/forward) keeps the browser's own scroll restoration; first mount
// leaves the initial position alone.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  const firstMount = useRef(true)
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    if (navType === 'POP') return
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      const main = document.getElementById('main')
      main?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, navType])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/cv" element={<CV />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
