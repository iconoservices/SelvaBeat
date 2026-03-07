const INOCOOS_BASE_URL = 'https://inocoos-proxy.jnmcsky.workers.dev';
const INOCOOS_AUTH_TOKEN = 'selvabeat_premium_2026'; // Llave maestra del búnker (Paso 19)

const getHeaders = () => ({
    'Accept': 'application/json',
    'x-inocoos-auth': INOCOOS_AUTH_TOKEN
});

export const getVideoStreams = async (videoId) => {
    const workerUrl = `${INOCOOS_BASE_URL}/?v=${videoId}`;

    const res = await fetch(workerUrl, {
        headers: getHeaders()
    });

    if (!res.ok) throw new Error(`InocoOS Worker Falló con status: ${res.status}`);

    const data = await res.json();

    // Captura Flexible de Cobalt: Acepta múltiples estructuras de respuesta
    const streamUrl = data.url || data.data?.url || (data.audio && data.audio[0]?.url);

    if (!streamUrl) throw new Error("No se encontró URL de stream válida en la respuesta");

    return { workerUrl: streamUrl };
};

/**
 * Busca videos en YouTube a través de la infraestructura soberana.
 * @param {string} query - Término de búsqueda.
 * @returns {Promise<Object>} Resultados de búsqueda.
 */
export const searchVideos = async (query) => {
    const url = `${INOCOOS_BASE_URL}/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error("FALLO_METADATA_SEARCH");
    return await res.json();
};

/**
 * Obtiene videos en tendencia a través de la infraestructura soberana.
 * @param {string} region - Código de región.
 * @returns {Promise<Object>} Lista de videos trending.
 */
export const getTrending = async (region = 'MX') => {
    const url = `${INOCOOS_BASE_URL}/trending?region=${region}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error("FALLO_METADATA_TRENDING");
    return await res.json();
};
