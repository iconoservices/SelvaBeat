/**
 * 📡 InocoOS youtubeService v4.1.0 - "Soberanía de Datos"
 * 
 * Centraliza todas las peticiones a la Red Soberana en Cloudflare.
 */

const INOCOOS_BASE_URL = 'https://icono-proxy.jnmcsky.workers.dev';
const INOCOOS_AUTH_TOKEN = 'selva_master_key_2026_premium';

const getHeaders = () => ({
    'Accept': 'application/json',
    'x-selva-auth': INOCOOS_AUTH_TOKEN
});

/**
 * Normaliza un objeto de video para que toda la app use las mismas llaves.
 */
const normalizeTrack = (raw) => ({
    id: raw.videoId || raw.id,
    title: raw.title || 'Sin Título',
    uploader: raw.uploaderName || raw.uploader || raw.author || 'Artista Desconocido',
    thumbnail: `${INOCOOS_BASE_URL}/img?v=${raw.videoId || raw.id}&key=${INOCOOS_AUTH_TOKEN}`,
    duration: raw.duration || 0,
});

/**
 * Obtiene el stream de audio directo desde el Worker (vía Cobalt).
 */
export const getVideoStreams = async (videoId) => {
    try {
        const workerUrl = `${INOCOOS_BASE_URL}/beat/stream?v=${videoId}`;
        const res = await fetch(workerUrl, { headers: getHeaders() });

        if (!res.ok) throw new Error(`HTTP_${res.status}`);

        const data = await res.json();
        const streamUrl = data.url || data.data?.url || (data.audio && data.audio[0]?.url);

        if (!streamUrl) throw new Error("NO_STREAM_URL");

        return { workerUrl: streamUrl };
    } catch (error) {
        console.error("🚨 Error obteniendo stream:", error);
        throw error;
    }
};

/**
 * Busca canciones a través del Worker Maestro (Titanium Scraper v1.4)
 */
export const searchVideos = async (query) => {
    try {
        const url = `${INOCOOS_BASE_URL}/beat/search?q=${encodeURIComponent(query)}&key=${INOCOOS_AUTH_TOKEN}`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) return [];

        const data = await res.json();
        return (Array.isArray(data) ? data : (data.items || [])).map(normalizeTrack);
    } catch (e) {
        return [];
    }
};

/**
 * Obtiene las tendencias a través del Worker Maestro (Titanium Scraper v1.4)
 */
export const getTrending = async (region = 'PE') => {
    try {
        const url = `${INOCOOS_BASE_URL}/beat/trending?region=${region}&key=${INOCOOS_AUTH_TOKEN}`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error("TRENDING_FAIL");

        const data = await res.json();
        return (Array.isArray(data) ? data : []).map(normalizeTrack);
    } catch (e) {
        console.warn("⚠️ Usando Shadow Content por fallo masivo de red (Tendencias).");
        return [];
    }
};
