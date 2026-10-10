/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// VITE_BASE : "/" par défaut, "/<nom-du-repo>/" sur GitHub Pages.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = env.VITE_BASE || '/'
  const base = raw.endsWith('/') ? raw : `${raw}/`

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/icon.svg'],
        manifest: {
          name: 'Carnet de salle',
          short_name: 'Carnet',
          description: 'Suivi de musculation 100 % local.',
          lang: 'fr',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#F7F5FB',
          theme_color: '#AD96DC',
          scope: base,
          start_url: base,
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // Tout est précaché, polices auto-hébergées comprises : l'appli s'ouvre hors ligne dès la première visite.
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        },
      }),
    ],
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }
})
