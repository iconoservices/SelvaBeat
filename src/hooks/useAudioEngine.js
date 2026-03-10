import { useEffect, useMemo } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { offlineDB } from '@/utils/db';
import { useToastStore } from '@/store/useToastStore';

/**
 * 🏎️ useAudioEngine v5.1.0 - "Clean State"
 * Motor que orquesta ReactPlayer de manera invisible.
 * CORREGIDO: Sin loops. Si ya hay streams, los usa directamente.
 */
export const useAudioEngine = () => {
    const {
        videoData, streams, isPlaying,
        setPlaying, setLoading, setAudioMetrics, setOfflineState,
        isOfflineMode, blobUrl
    } = usePlayerStore();

    const addToast = useToastStore(state => state.addToast);

    const cleanRAM = () => {
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setOfflineState(false, null);
        }
    };

    /**
     * FASE 1: Cuando carga un nuevo track, verificar bóveda offline.
     * NO vuelve a hacer getVideoStreams porque SearchPage/Home ya lo manda con loadVideo.
     */
    useEffect(() => {
        if (!videoData?.id) return;

        const checkOffline = async () => {
            const item = await offlineDB.get(videoData.id);
            if (item?.blob) {
                const url = URL.createObjectURL(item.blob);
                cleanRAM();
                setOfflineState(true, url);
            }
            setLoading(false);
        };

        checkOffline();
    }, [videoData?.id]);

    /**
     * FASE 2: Selección de Fuente Híbrida
     * - Si hay blob local → audio local
     * - Si streams.workerUrl empieza con 'yt:' → ReactPlayer modo YouTube
     * - Si streams.workerUrl es una URL directa → audio nativo
     */
    const source = useMemo(() => {
        if (isOfflineMode && blobUrl) return { type: 'local', url: blobUrl };
        if (streams?.workerUrl?.startsWith('yt:')) {
            const videoId = streams.workerUrl.replace('yt:', '');
            return { type: 'youtube', url: `https://www.youtube.com/watch?v=${videoId}` };
        }
        if (streams?.workerUrl && streams.workerUrl.startsWith('http')) {
            return { type: 'direct', url: streams.workerUrl };
        }
        return null;
    }, [videoData?.id, streams, isOfflineMode, blobUrl]);

    /**
     * FASE 3: Media Session (Notificaciones de sistema / auriculares)
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
        source,
        handleTimeUpdate: (currentTime) => {
            const dur = usePlayerStore.getState().duration;
            setAudioMetrics(currentTime, dur);
        },
        setAudioDuration: (dur) => {
            const cur = usePlayerStore.getState().currentTime;
            setAudioMetrics(cur, dur);
            setLoading(false);
        },
        cleanRAM
    };
};

