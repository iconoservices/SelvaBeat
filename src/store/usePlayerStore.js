import { create } from 'zustand'

/**
 * usePlayerStore - Gestor de estado global del Reproductor
 * 
 * Basado en las Reglas Arquitectónicas:
 * 1. Cero mutabilidad innecesaria: Actualizaciones atómicas.
 * 2. Cero estados derivados redundantes: Una sola fuente de verdad para el modo visual.
 * 3. videoData inicial como null para evitar colapsos visuales.
 */

export const usePlayerStore = create((set) => ({
    // --- ESTADO ---
    videoData: null,    // Metadata (Title, Uploader, etc.)
    streams: null,      // Objeto con audioStreams y videoStreams de Piped
    isPlaying: false,   // Control de flujo (Play/Pause)
    isMinimized: true,  // Fuente de verdad para UI
    isLoading: false,   // Para el buffering del cambio de stream (Ley B)
    storageFree: true,  // Estado del radar de cuota
    systemStatus: 'checking', // 'ok' | 'degraded' | 'offline' (Paso 18)

    // --- METRICAS DE AUDIO (Paso 9) ---
    currentTime: 0,
    duration: 0,
    isOfflineMode: false,
    blobUrl: null,

    // --- ACCIONES ---

    /**
     * Carga los metadatos y los flujos obtenidos de Piped.
     */
    loadVideo: (metadata, streams) => set({
        videoData: metadata,
        streams: streams,
        isPlaying: true,
        isMinimized: false,
        isLoading: false,
        currentTime: 0,
        duration: 0
    }),

    setPlaying: (status) => set({ isPlaying: status }),
    togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),

    /**
     * Cambia entre modo Minimizado (Barra inferior) y Maximizado.
     */
    setIsMinimized: (status) => set({ isMinimized: status, isLoading: true }), // Activa loading al switchar
    setLoading: (status) => set({ isLoading: status }),

    toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),

    /**
     * Navegación entre videos (Playlist logic)
     */
    nextVideo: () => { console.log("⏭️ Next..."); },
    prevVideo: () => { console.log("⏮️ Prev..."); },

    checkStorage: async () => {
        if (!navigator.storage?.estimate) return;
        const { quota, usage } = await navigator.storage.estimate();
        const percentFree = ((quota - usage) / quota) * 100;
        set({ storageFree: percentFree > 15 });
    },

    /**
     * Resetea el reproductor (Cierre completo)
     */
    closePlayer: () => set({
        videoData: null,
        streams: null,
        isPlaying: false,
        isMinimized: true,
        currentTime: 0,
        duration: 0,
        isOfflineMode: false,
        blobUrl: null
    }),

    setAudioMetrics: (current, duration) => set({
        currentTime: current || 0,
        duration: duration || 0
    }),

    setOfflineState: (isOffline, url) => set({
        isOfflineMode: isOffline,
        blobUrl: url
    }),

    setSystemStatus: (status) => set({ systemStatus: status }),
}))
