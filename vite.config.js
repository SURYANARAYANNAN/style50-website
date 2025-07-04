import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this base property for GitHub Pages deployment
  base: '/style50-website/', // IMPORTANT: Replace 'style50-website' with your actual repository name
})