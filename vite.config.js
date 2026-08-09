import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://dmitriy-gviskar.github.io/zorgtech-site/
const githubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: githubPages ? '/zorgtech-site/' : '/',
})
