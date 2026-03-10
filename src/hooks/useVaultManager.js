import { useState } from 'react';
import { offlineDB } from '@/utils/db';
import { getVideoStreams } from '@/api/musicService';
import { useToastStore } from '@/store/useToastStore';

/**
 * 🔐 useVaultManager - "Bóveda de Descargas Offline"
 * 
 * Se encarga de conectarse al Worker/Real-Debrid, bajar el stream crudo (audio)
 * y meterlo en la bóveda IndexedDB del navegador para escucharlo sin internet.
 */
export const useVaultManager = () => {
    const [downloadingIds, setDownloadingIds] = useState(new Set());
    const addToast = useToastStore(state => state.addToast);

    const checkIsDownloaded = async (id) => {
        const item = await offlineDB.get(id);
        return !!item;
    };

    const downloadToVault = async (track, type = 'audio') => {
        if (!track || !track.id) return;

        try {
            setDownloadingIds(prev => new Set(prev).add(track.id));
            addToast(`📥 Iniciando secuestro seguro: ${track.title}...`, "info");

            // 1. Pedir a Cloudflare Worker / Real-Debrid el link del MP3
            // Extra: Si el usuario pidiera video, le podríamos pasar un parámetro al worker, 
            // pero para SelvaBeat (Música) bajamos Audio MP3 de alta compresión.
            const streams = await getVideoStreams(track.id);
            if (!streams || !streams.workerUrl) {
                throw new Error("No se pudo obtener el link de extracción del Worker.");
            }

            // 2. Descargar el archivo físicamente en memoria del navegador
            const res = await fetch(streams.workerUrl);
            if (!res.ok) throw new Error("Fallo al descargar el archivo desde el servidor.");

            // Convertimos la música a Blob (burbuja de datos binaria puro)
            const blob = await res.blob();

            // 3. Guardarlo en la Bóveda Local (IndexedDB)
            await offlineDB.save(track.id, blob, track);

            addToast(`✅ ${track.title} guardado en la bóveda offline.`, "success");

        } catch (error) {
            console.error("Fallo al guardar en bóveda:", error);
            addToast(`❌ Fallo en la descarga: ${error.message}`, "error");
        } finally {
            setDownloadingIds(prev => {
                const next = new Set(prev);
                next.delete(track.id);
                return next;
            });
        }
    };

    return {
        downloadToVault,
        downloadingIds,
        checkIsDownloaded
    };
};
