import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves 404.html for unknown paths; shipping index.html as
// 404.html lets BrowserRouter deep links (/work, /cv) load for visitors.
function ghPagesSpaFallback(): Plugin {
  return {
    name: 'gh-pages-spa-fallback',
    closeBundle() {
      copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'))
    },
  }
}

// Custom apex domain: https://emiliechidiac.com/ (CNAME in public/CNAME).
// Served at the domain root, so base is '/' for both dev and build.
// (Was '/eec-portfolio/' for the hi-em.github.io project-page era.)
export default defineConfig(() => ({
  base: '/',
  plugins: [react(), tailwindcss(), ghPagesSpaFallback()],
}))
