import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Le plugin Tailwind est indispensable : sans lui, `@import "tailwindcss"`
  // n'injecte que le reset et le theme, la couche `utilities` reste vide et
  // les pages ecrites en classes utilitaires (Renovation, PaiementDon)
  // s'affichent sans mise en page.
  plugins: [react(), tailwindcss()],
  build: {
    cssMinify: 'esbuild',
  },
})
