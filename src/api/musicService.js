/**
 * 🎵 InocoOS musicService v5.0.0 - "Sinfonía Soberana"
 * 
 * Centraliza la búsqueda en Catálogos Pro (Apple/Spotify) y la resolución de audio.
 */

const INOCOOS_BASE_URL = 'https://icono-proxy.jnmcsky.workers.dev';
const INOCOOS_AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || 'selva_master_key_2026_premium';

const getHeaders = () => ({
    'Accept': 'application/json',
    'x-selva-auth': INOCOOS_AUTH_TOKEN,
    'x-inocoos-auth': INOCOOS_AUTH_TOKEN
});

/**
 * Normaliza un objeto de pista para el estándar de la Selva.
 */
const normalizeTrack = (raw) => ({
    id: raw.videoId || raw.id,
    title: raw.title || 'Sin Título',
    uploader: raw.uploaderName || raw.uploader || raw.author || 'Artista',
    thumbnail: raw.thumbnail || `${INOCOOS_BASE_URL}/img?v=${raw.videoId || raw.id}&key=${INOCOOS_AUTH_TOKEN}`,
    duration: raw.duration || 0,
});

/**
 * Obtiene el flujo de audio (Ahora delega al Reproductor Híbrido Interno)
 */
export const getVideoStreams = async (videoId) => {
    // Ya no dependemos de las APIs públicas que caen. 
    // Le pasamos la antorcha al React Player en el cliente.
    console.log("💎 Frecuencia sintonizada directo al motor cliente.");
    return { workerUrl: `yt:${videoId}` };
};

/**
 * Rastrear en la red interna (Bypass Directo sin Worker)
 * Extrae la ID de YouTube pero se camufla como búsqueda interna.
 */
export const searchInternal = async (query) => {
    const proxies = [
        `https://corsproxy.io/?https://m.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        `https://api.allorigins.win/raw?url=https://m.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        `https://cors-anywhere.herokuapp.com/https://m.youtube.com/results?search_query=${encodeURIComponent(query)}`
    ];

    for (const url of proxies) {
        try {
            const res = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });

            if (!res.ok) continue;

            const html = await res.text();
            const match = html.match(/ytInitialData = ({.*?});/);

            if (match) {
                const data = JSON.parse(match[1]);
                const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;

                if (contents) {
                    return contents.filter(c => c.videoRenderer).map(c => {
                        const v = c.videoRenderer;
                        let dur = 0;
                        if (v.lengthText) {
                            const durText = v.lengthText.simpleText || v.lengthText.runs?.[0]?.text || "0:00";
                            const p = durText.split(':').reverse();
                            if (p[0]) dur += parseInt(p[0], 10);
                            if (p[1]) dur += parseInt(p[1], 10) * 60;
                            if (p[2]) dur += parseInt(p[2], 10) * 3600;
                        }

                        return normalizeTrack({
                            id: v.videoId,
                            title: v.title?.runs?.[0]?.text || "Sin Título",
                            uploader: v.ownerText?.runs?.[0]?.text || "Desconocido",
                            duration: dur,
                            thumbnail: v.thumbnail?.thumbnails?.[0]?.url || ""
                        });
                    }).slice(0, 5);
                }
            }
        } catch (e) {
            continue;
        }
    }
    console.warn("🔻 Fallo en el ByPass Soberano");
    return [];
};

/**
 * 🍏 Catálogo Oficial (Búsqueda Premium estilo Spotify/Apple)
 * Evita basura, videos y mixes. Solo música pura.
 */
export const searchCleanCatalog = async (query) => {
    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`;
        const res = await fetch(url);
        if (!res.ok) return [];

        const data = await res.json();
        return data.results.map(track => ({
            id: `PRO_${track.trackId}`,
            hybridQuery: `${track.artistName} ${track.trackName} official audio`,
            title: track.trackName,
            uploader: track.artistName,
            thumbnail: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '800x800bb') : '',
            duration: track.trackTimeMillis ? Math.floor(track.trackTimeMillis / 1000) : 0,
            isHybrid: true
        }));
    } catch (e) {
        return [];
    }
};

/**
 * Tendencias (Resolución vía Catálogo Pro)
 */
export const getTrending = async () => {
    return await searchCleanCatalog('top hits 2024 oficial');
};
