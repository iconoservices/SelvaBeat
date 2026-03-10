import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
                // Ignoramos el sw.js manual anterior para que el plugin genere el nuevo indestructible
                navigateFallback: '/index.html'
            },
            manifest: {
                name: 'SelvaBeat Premium',
                short_name: 'SelvaBeat',
                description: 'Música soberana sin límites.',
                theme_color: '#10b981',
                background_color: '#050505',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    optimizeDeps: {
        include: ['react-window']
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 9191,
        strictPort: true,
        // Eliminamos proxies locales para evitar cortocircuitos con el Worker (v4.0.0)
        watch: {
            ignored: ['**/legacy/**']
        }
    },
    build: {
        rollupOptions: {
            external: [/^legacy\/.*/] // Tu barrera física contra el código viejo
        }
    }
})
