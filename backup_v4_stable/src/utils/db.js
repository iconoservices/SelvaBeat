import { get, set, del, keys } from 'idb-keyval';

/**
 * 🔋 Motor Offline (IndexedDB) - Versión de Resiliencia 1.7
 * Gestiona el almacenamiento de binarios con manejo de errores de conexión.
 */

export const offlineDB = {
    /**
     * Verifica si la base de datos está disponible y no bloqueada.
     */
    verifyStatus: async () => {
        try {
            // Intentamos una operación simple para despertar a la DB
            await keys();
            return true;
        } catch (error) {
            console.error("🚨 Error crítico de IndexedDB (Bloqueo de pestañas o Versión incompatible):", error);
            return false;
        }
    },

    save: async (id, blob, metadata) => {
        try {
            const data = { blob, metadata, timestamp: Date.now() };
            await set(id, data);
            console.log(`💾 Escrito en Bóveda: ${id}`);
        } catch (error) {
            throw new Error(`DB_WRITE_FAIL: ${error.message}`);
        }
    },

    get: async (id) => {
        try {
            return await get(id);
        } catch (error) {
            console.warn(`⚠️ Falló recuperación de ${id}:`, error);
            return null;
        }
    },

    remove: async (id) => {
        try {
            await del(id);
        } catch (error) {
            console.error(`❌ Error al borrar ${id}:`, error);
        }
    },

    getLibrary: async () => {
        try {
            const allKeys = await keys();
            const library = [];
            for (const key of allKeys) {
                const item = await get(key);
                if (item?.metadata) {
                    library.push({ id: key, ...item.metadata, timestamp: item.timestamp });
                }
            }
            return library;
        } catch (error) {
            console.error("📚 Error cargando biblioteca:", error);
            return [];
        }
    }
};
