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

// GitHub Pages project site: https://hi-em.github.io/eec-portfolio/
// Base applies to builds only (dev serves at /); switch to '/' when a
// custom domain lands.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/eec-portfolio/' : '/',
  plugins: [react(), tailwindcss(), ghPagesSpaFallback()],
}))
