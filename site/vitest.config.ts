import { defineConfig } from 'vitest/config'

// Standalone on purpose: when vitest.config.ts exists, vitest ignores
// vite.config.ts entirely, so react()/tailwindcss()/the Pages fallback plugin
// and the GH Pages `base` never run in tests. JSX in imported .tsx modules is
// compiled by the esbuild transform; the jsx block pins the automatic runtime
// explicitly so tests never depend on tsconfig discovery.
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
