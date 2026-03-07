/**
 * fetchSafe - Interceptor de Red con Auto-Redirección (Failover).
 * Blindaje contra el Error 429 (Rate Limit) y caídas de servidores.
 */
import { useToastStore } from '@/store/useToastStore';

/**
 * Realiza una petición con reintentos automáticos en espejos de respaldo.
 * @param {string|string[]} urls - Una URL única o un array de servidores de respaldo.
 * @param {Object} options - Opciones de fetch.
 */
export const fetchSafe = async (urls, options = {}) => {
    const addToast = useToastStore.getState().addToast;
    const urlList = Array.isArray(urls) ? urls : [urls];
    const defaultOptions = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        ...options
    };

    let lastError = null;

    for (let i = 0; i < urlList.length; i++) {
        const currentUrl = urlList[i];

        try {
            // AbortController para el Timeout Agresivo (3s) de 1.0.0 (Paso 10)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(currentUrl, {
                ...defaultOptions,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            // Si el servidor falla con 429 (Rate Limit) o 5xx (Error de Servidor)
            if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
                console.warn(`⚠️ Servidor ${i + 1} agotado (${response.status}). Buscando espejo...`);
                continue;
            }

            if (!response.ok) {
                // Errores que no ameritan reintento (401, 403, 404)
                if (response.status === 403) {
                    console.warn(`🚫 CORS/403 en ${currentUrl}. Probando siguiente...`);
                }
                throw new Error(`HTTP_ERR_${response.status}`);
            }

            return await response.json();

        } catch (error) {
            lastError = error;

            // Si es el último servidor de la lista y falló
            if (i === urlList.length - 1) {
                throw error;
            }
        }
    }

    throw lastError || new Error("Exploración fallida en todos los servidores.");
};
