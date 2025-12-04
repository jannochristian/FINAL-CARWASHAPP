import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(),tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Carwash Book App',
        short_name: 'Carwash Book',
<<<<<<< HEAD
        description: 'Professional car care at your fingertips.',
=======
        description: 'Discover movie details and trailers',
>>>>>>> 51aac6625647178ec14f5a84c3f3247e1cbb6c76
        theme_color: '#000000',
        background_color: '#111111',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'logo192.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});