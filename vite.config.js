import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // <-- Aquí está la magia de la v4
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
