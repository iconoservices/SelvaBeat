import { useRef, useEffect, useState, useMemo } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { offlineDB } from '@/utils/db';
import { useToastStore } from '@/store/useToastStore';
import { getVideoStreams } from '@/api/youtubeService';

/**
 * useAudioEngine - El Motor de Audio Global (v1.0.0 - Paso 11)
 * 
 * "Guerrilla Version": Proxy de audio, Youtube Embed de Fallback y Sincronización.
 */
export const useAudioEngine = () => {
    const {
        videoData, streams, isPlaying, isMinimized, systemStatus,
        setPlaying, setLoading, setAudioMetrics, setOfflineState,
        isOfflineMode, blobUrl, nextVideo, prevVideo, closePlayer,
        loadVideo
    } = usePlayerStore();

    const videoRef = useRef(null);
    const [storedTime, setStoredTime] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const [forceLowQuality, setForceLowQuality] = useState(false);
    const [useEmbedFallback, setUseEmbedFallback] = useState(false);
    const [playbackTimeout, setPlaybackTimeout] = useState(null);
    const addToast = useToastStore(state => state.addToast);

    /** 🧹 RAM Clean Protocol */
    const cleanRAM = () => {
        if (blobUrl) {
            console.warn("🧹 Liberando ObjectURL (RAM Clean Protocol)...");
            URL.revokeObjectURL(blobUrl);
            setOfflineState(false, null);
        }
    };

    /** 🔄 Actualizar Stream o Cambiar a Embed */
    const refreshStream = async () => {
        if (!videoData?.id) return;

        // Si ya intentamos 2 veces con Piped y falla, saltamos al Embed de YouTube (Modo al Toque)
        if (retryCount >= 2) {
            console.warn("🛡️ Modo Ultra-Resiliencia: Activando Youtube Embed...");
            setUseEmbedFallback(true);
            setLoading(false);
            return;
        }

        console.warn(`🔄 Reintentando obtención de stream para ${videoData.id} (Intento ${retryCount + 1})...`);
        try {
            setRetryCount(prev => prev + 1);
            setForceLowQuality(true);
            const newStreams = await getVideoStreams(videoData.id);
            loadVideo(videoData, newStreams);
        } catch (e) {
            setUseEmbedFallback(true);
        }
    };

    /** 🔋 Verificación de Contenido Offline e Inicio de Carga (v3.9.3) */
    useEffect(() => {
        if (!videoData?.id) return;

        // Reset de estados
        setUseEmbedFallback(false);
        setRetryCount(0);
        setForceLowQuality(false);

        const initPlayback = async () => {
            // 1. Check Offline
            const item = await offlineDB.get(videoData.id);
            if (item && item.blob) {
                const url = URL.createObjectURL(item.blob);
                cleanRAM();
                setOfflineState(true, url);
                console.log("🔋 Motor: Fuente Offline detectada.");
                return;
            }

            // 2. Si no hay offline, pedir Stream al Worker
            if (!streams) {
                try {
                    setLoading(true);
                    console.log("🛰️ Motor: Solicitando flujo a InocoOS...");
                    const newStreams = await getVideoStreams(videoData.id);
                    loadVideo(videoData, newStreams);
                } catch (e) {
                    console.error("🚨 InocoOS falló. Watchdog activará rescate.");
                }
            }
        };
        initPlayback();
    }, [videoData?.id]);

    /** 📡 Selección de Fuente (Blob, Directo o Embed) */
    const currentSource = useMemo(() => {
        if (isOfflineMode && blobUrl) return { type: 'blob', url: blobUrl };
        if (useEmbedFallback && videoData?.id) {
            return {
                type: 'embed',
                url: `https://www.youtube-nocookie.com/embed/${videoData.id}?autoplay=1&enablejsapi=1&origin=${window.location.origin}&widget_referrer=${window.location.origin}`
            };
        }

        if (!streams) return null;

        // Migración a InocoOS: Usamos directamente la URL extraía por Cobalt (Paso 13)
        if (streams.workerUrl) {
            return { type: 'direct', url: streams.workerUrl };
        }

        // --- Red Soberana v4.0.0 ---
        // Eliminamos fallbacks locales para evitar conflictos.
        return null;
    }, [streams, isMinimized, blobUrl, isOfflineMode, forceLowQuality, useEmbedFallback, videoData?.id]);

    /** 🛰️ Watchdog Estratégico v4.0.2 (Dosificación Real) */
    useEffect(() => {
        if (!videoData?.id || streams || isOfflineMode || useEmbedFallback) return;

        console.log("🛰️ Motor: Negociando flujo con InocoOS (Paciencia: 6s)...");
        const timeoutId = setTimeout(() => {
            if (!streams) {
                console.warn("🚨 InocoOS demorado. Saltando a YouTube Embed para garantizar audio.");
                setUseEmbedFallback(true);
                setLoading(false);
            }
        }, 6000); // Subimos a 6 segundos para dar margen real a la conexión

        return () => clearTimeout(timeoutId);
    }, [videoData?.id, streams, isOfflineMode]);

    /** 🔁 Sincronización de Tiempo y Carga */
    useEffect(() => {
        if (currentSource?.type !== 'embed' && currentSource?.url && videoRef.current) {
            const prevTime = videoRef.current.currentTime;
            setStoredTime(prevTime > 0 ? prevTime : 0);

            setLoading(true);
            videoRef.current.src = currentSource.url;
            videoRef.current.load();

            if (playbackTimeout) clearTimeout(playbackTimeout);
            const timeoutId = setTimeout(() => {
                if (videoRef.current && videoRef.current.readyState < 3 && !isOfflineMode) {
                    refreshStream();
                }
            }, 6000);
            setPlaybackTimeout(timeoutId);

            if (isPlaying) videoRef.current.play().catch(() => { });
        }
    }, [currentSource?.url]);

    /** 🛰️ Media Session API */
    useEffect(() => {
        if (!('mediaSession' in navigator) || !videoData) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: videoData.title,
            artist: videoData.uploader || 'SelvaBeat Premium',
            artwork: [{ src: videoData.thumbnail || videoData.img, sizes: '512x512', type: 'image/png' }]
        });

        navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
        navigator.mediaSession.setActionHandler('stop', () => closePlayer());

        return () => {
            ['play', 'pause', 'stop'].forEach(h => {
                try { navigator.mediaSession.setActionHandler(h, null); } catch (e) { }
            });
        };
    }, [videoData?.id]);

    /** ⏯️ Play/Pause Sync */
    useEffect(() => {
        if (videoRef.current && currentSource?.type !== 'embed') {
            if (isPlaying) videoRef.current.play().catch(() => { });
            else videoRef.current.pause();
        }
    }, [isPlaying, currentSource?.type]);

    useEffect(() => {
        return () => {
            cleanRAM();
            if (playbackTimeout) clearTimeout(playbackTimeout);
        };
    }, []);

    return {
        videoRef,
        isEmbed: currentSource?.type === 'embed',
        embedUrl: currentSource?.type === 'embed' ? currentSource.url : null,
        handleMetadataLoaded: () => {
            if (videoRef.current && storedTime > 0) {
                videoRef.current.currentTime = storedTime;
            }
            setAudioMetrics(videoRef.current.currentTime, videoRef.current.duration);
            setLoading(false);
            if (playbackTimeout) clearTimeout(playbackTimeout);
        },
        handleTimeUpdate: (e) => {
            setAudioMetrics(e.target.currentTime, e.target.duration);
        },
        handleError: () => {
            console.error("🚨 Error de Stream. Activando rescate...");
            refreshStream();
        },
        cleanRAM
    };
};
