/**
 * 📡 InocoOS youtubeService v4.1.0 - "Soberanía de Datos"
 * 
 * Centraliza todas las peticiones a la Red Soberana en Cloudflare.
 */

const INOCOOS_BASE_URL = 'https://icono-proxy.jnmcsky.workers.dev';
const INOCOOS_AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || 'selva_master_key_2026_premium';

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
 * Obtiene el stream de audio directo (Resiliencia de Triple Capa: Worker -> Mirror 1 -> Mirror 2)
 */
export const getVideoStreams = async (videoId) => {
    const methods = [
        // 1. Worker Soberano de JuanMa (Pre-sanitizado)
        async () => {
            const res = await fetch(`${INOCOOS_BASE_URL}/beat/stream?v=${videoId}`, { headers: getHeaders() });
            const text = await res.text();
            try {
                const data = JSON.parse(text);
                const url = data.url || data.data?.url || (data.audio && data.audio[0]?.url);
                if (!url) throw new Error("NO_URL");
                return { workerUrl: url };
            } catch (e) { throw new Error("INVALID_JSON_WORKER"); }
        },

        // 2. Mirror de Emergencia: Cobalt (Q-O PRO)
        async () => {
            const res = await fetch("https://cobalt.q-o.pro/api/json", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}`, isAudioOnly: true })
            });
            const data = await res.json();
            if (data.url) return { workerUrl: data.url };
            throw new Error("MIRROR_1_FAIL");
        },

        // 3. Nodo de Rescate Final: Cobalt (WUK)
        async () => {
            const res = await fetch("https://co.wuk.sh/api/json", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}`, isAudioOnly: true })
            });
            const data = await res.json();
            if (data.url) return { workerUrl: data.url };
            throw new Error("MIRROR_2_FAIL");
        }
    ];

    for (const fetchMethod of methods) {
        try {
            const stream = await fetchMethod();
            console.log("💎 Sintonía lograda.");
            return stream;
        } catch (e) {
            console.warn("🔻 Nodo caído, re-intentando por ruta alterna...");
        }
    }

    throw new Error("RADAR_TOTAL_LOSS");
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
 * Radar Híbrido (Catálogo Limpio Apple -> YouTube Extractor)
 * Busca música oficial en Apple Music para evitar mixes y basura visual.
 */
export const searchCleanCatalog = async (query) => {
    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=24`;
        const res = await fetch(url);
        if (!res.ok) return [];

        const data = await res.json();
        return data.results.map(track => ({
            id: `HYBRID_${track.trackId}`, // Marcador especial
            hybridQuery: `${track.artistName} ${track.trackName} official audio`,
            title: track.trackName,
            uploader: track.artistName,
            thumbnail: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '600x600bb') : '',
            duration: track.trackTimeMillis ? Math.floor(track.trackTimeMillis / 1000) : 0,
            isHybrid: true
        }));
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
