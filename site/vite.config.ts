import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The old gh-pages-spa-fallback plugin (index.html copied to 404.html so
// deep links load at all) retired at S3: every public route is now a real
// prerendered .html file (scripts/prerender.mjs), and 404.html is the
// SIGNED 404 page served with a true 404 status, exactly as it should be.

// Custom apex domain: https://emiliechidiac.com/ (CNAME in public/CNAME).
// Served at the domain root, so base is '/' for both dev and build.
// (Was '/eec-portfolio/' for the hi-em.github.io project-page era.)
export default defineConfig(() => ({
  base: '/',
  plugins: [react(), tailwindcss()],
}))
