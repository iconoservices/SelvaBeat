import { useRef, useEffect, useState, useMemo } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { offlineDB } from '@/utils/db';
import { useToastStore } from '@/store/useToastStore';
import { getVideoStreams } from '@/api/youtubeService';

/**
 * 🏎️ useAudioEngine v4.1.0 - "Solid State"
 * 
 * Motor de reproducción híbrido (Offline -> Directo -> Rescate).
 * Un sistema de estados lineal para evitar "cortocircuitos".
 */
export const useAudioEngine = () => {
    const {
        videoData, streams, isPlaying, isMinimized,
        setPlaying, setLoading, setAudioMetrics, setOfflineState,
        isOfflineMode, blobUrl, loadVideo
    } = usePlayerStore();

    const videoRef = useRef(null);
    const [storedTime, setStoredTime] = useState(0);
    const [useEmbedFallback, setUseEmbedFallback] = useState(false);
    const [playbackTimeout, setPlaybackTimeout] = useState(null);
    const addToast = useToastStore(state => state.addToast);

    const cleanRAM = () => {
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setOfflineState(false, null);
        }
    };

    /**
     * 🟢 FASE 1: Inicialización de la pista
     */
    useEffect(() => {
        if (!videoData?.id) return;

        // Reset Total
        setUseEmbedFallback(false);
        setLoading(true);

        const bootstrapTrack = async () => {
            const trackId = videoData.id;
            console.time(`[Radar] Carga: ${trackId}`);

            // 1. Prioridad: Almacén Local (Sin internet) - Búsqueda en paralelo
            const localCheck = offlineDB.get(trackId);

            // 2. Internet: Solicitar flujo al Worker (Lanzamos la petición ya mismo)
            const cloudCheck = getVideoStreams(trackId);

            try {
                const item = await localCheck;
                if (item?.blob) {
                    console.log("🔋 Motor: ¡Hit en Bóveda Local!");
                    const url = URL.createObjectURL(item.blob);
                    cleanRAM();
                    setOfflineState(true, url);
                    setLoading(false);
                    console.timeEnd(`[Radar] Carga: ${trackId}`);
                    return;
                }

                // Si no está local, esperamos al worker (que ya lanzamos arriba)
                const newStreams = await cloudCheck;
                console.log("📡 Motor: Stream recibido del Worker.");
                loadVideo(videoData, newStreams);
            } catch (e) {
                console.warn("🚨 Fallo en secuencia de carga:", e.message);
            } finally {
                setLoading(false);
                console.timeEnd(`[Radar] Carga: ${trackId}`);
            }
        };

        bootstrapTrack();
    }, [videoData?.id]);

    /**
     * �️ FASE 2: Selección de Fuente (Híbrida)
     */
    const source = useMemo(() => {
        if (isOfflineMode && blobUrl) return { type: 'local', url: blobUrl };

        if (useEmbedFallback && videoData?.id) {
            // URL Clásica (Más permisiva para LocalDev)
            const url = new URL(`https://www.youtube.com/embed/${videoData.id}`);
            url.searchParams.set('autoplay', '1');
            url.searchParams.set('mute', '1');
            url.searchParams.set('rel', '0');
            url.searchParams.set('origin', window.location.origin);
            return { type: 'embed', url: url.toString() };
        }

        if (streams?.workerUrl) return { type: 'direct', url: streams.workerUrl };

        return null;
    }, [videoData?.id, streams, isOfflineMode, blobUrl, useEmbedFallback]);

    /**
     * � FASE 3: Watchdog (Paciencia de 7 segundos)
     */
    useEffect(() => {
        if (!videoData?.id || streams || isOfflineMode || useEmbedFallback) return;

        const timer = setTimeout(() => {
            if (!streams && !isOfflineMode) {
                console.error("🚨 Rescate: Tiempo de espera agotado. Activando YouTube Embed.");
                setUseEmbedFallback(true);
                setLoading(false);
            }
        }, 7000);

        return () => clearTimeout(timer);
    }, [videoData?.id, streams, isOfflineMode, useEmbedFallback]);

    /**
     * � FASE 4: Sincronización del Elemento Media
     */
    useEffect(() => {
        if (source?.type !== 'embed' && source?.url && videoRef.current) {
            const el = videoRef.current;
            const prev = el.currentTime;
            setStoredTime(prev > 0 ? prev : 0);

            setLoading(true);
            el.src = source.url;
            el.load();

            if (isPlaying) el.play().catch(() => { });
        }
    }, [source?.url]);

    /**
     * � FASE 5: Media Session (Control de Audífonos/Bloqueo)
     */
    useEffect(() => {
        if (!('mediaSession' in navigator) || !videoData) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: videoData.title,
            artist: videoData.uploader,
            artwork: [{ src: videoData.thumbnail, sizes: '512x512', type: 'image/jpg' }]
        });

        navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));

        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
        };
    }, [videoData?.id]);

    return {
        videoRef,
        isEmbed: source?.type === 'embed',
        embedUrl: source?.type === 'embed' ? source.url : null,
        handleMetadataLoaded: () => {
            if (videoRef.current && storedTime > 0) {
                videoRef.current.currentTime = storedTime;
            }
            setLoading(false);
        },
        handleTimeUpdate: (e) => {
            setAudioMetrics(e.target.currentTime, e.target.duration);
        },
        handleError: () => {
            setUseEmbedFallback(true);
        },
        cleanRAM
    };
};
