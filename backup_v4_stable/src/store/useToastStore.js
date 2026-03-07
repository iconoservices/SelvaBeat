import { create } from 'zustand'

/**
 * useToastStore - Sistema de notificaciones amigables pero informativas.
 * Clasifica errores para el desarrollador mientras mantiene la UX limpia.
 */

export const useToastStore = create((set) => ({
    toasts: [],

    /**
     * Añade una notificación a la cola.
     * @param {string} title - Texto amigable para el usuario.
     * @param {string} type - 'error' | 'success' | 'info'
     * @param {string} technical - Detalle técnico para consola.
     */
    addToast: (message, type = 'info', technical = '') => {
        const id = Date.now();

        if (technical && type === 'error') {
            console.error(`[API ERROR] ${technical}`);
        }

        set((state) => ({
            toasts: [...state.toasts, { id, message, type }]
        }));

        // Auto-eliminación tras 4 segundos
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }));
        }, 4000);
    },

    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    }))
}))
