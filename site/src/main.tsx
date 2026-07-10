import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './App'
import './index.css'

// A DATA router (DL-1): the declarative <BrowserRouter> ignores the
// viewTransition flag on Link/navigate, so the soft crossfade + morphs
// (language.css) need the routes registered on createBrowserRouter.
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
