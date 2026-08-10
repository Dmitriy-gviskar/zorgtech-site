import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://dmitriy-gviskar.github.io/zorgtech-site/
const githubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: githubPages ? '/zorgtech-site/' : '/',
  build: {
    // Route modules are already lazy; keep framework/runtime and the large,
    // route-only catalog data out of the home entry for better cache reuse.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/motion')) return 'motion'
          if (id.endsWith('/products.json') || id.endsWith('/categories.json')) return 'catalog-data'
          if (id.endsWith('/projects.json')) return 'projects-data'
          if (id.endsWith('/solutions.json')) return 'solutions-data'
          if (id.endsWith('/areas.json')) return 'areas-data'
          if (id.endsWith('/pages.json')) return 'pages-data'
        },
      },
    },
    // The largest route-only payload is baked catalog content (~550 kB raw,
    // ~68 kB gzip), deliberately isolated as `catalog-data`.
    chunkSizeWarningLimit: 650,
  },
})
