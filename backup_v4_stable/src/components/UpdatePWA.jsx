import React, { useEffect, useState } from 'react';
import { RefreshCcw, X } from 'lucide-react';

/**
 * UpdatePWA - El Protocolo de Actualización (Paso 7)
 * 
 * Gestiona el ciclo de vida del Service Worker. Detecta instalaciones en espera
 * y permite actualizar la App sin fricción ni pérdida de datos en IndexedDB.
 */
const UpdatePWA = () => {
    const [waitingWorker, setWaitingWorker] = useState(null);
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        // Escuchar cambios en el controlador actual
        navigator.serviceWorker.getRegistration().then((reg) => {
            if (!reg) return;

            // 1. Si ya hay uno esperando al cargar
            if (reg.waiting) {
                setWaitingWorker(reg.waiting);
                setShowUpdate(true);
            }

            // 2. Si se instala uno nuevo mientras la App está abierta
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        setWaitingWorker(newWorker);
                        setShowUpdate(true);
                    }
                });
            });
        });

        // Escuchar cuando el nuevo SW tome el control
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    }, []);

    const handleUpdate = () => {
        if (waitingWorker) {
            console.log("📲 Enviando SKIP_WAITING al nuevo Service Worker...");
            waitingWorker.postMessage('SKIP_WAITING');
        }
    };

    if (!showUpdate) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1001] w-[calc(100%-3rem)] max-w-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-primary text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20 shadow-primary/20">
                <div className="bg-white/20 p-3 rounded-2xl shrink-0">
                    <RefreshCcw className="animate-spin-slow" size={24} />
                </div>

                <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-black uppercase tracking-tighter">Actualización lista</h4>
                    <p className="text-[10px] opacity-90 truncate font-mono">Nueva versión de SelvaBeat 🔋</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleUpdate}
                        className="bg-white text-black text-xs font-black px-4 py-3 rounded-2xl active:scale-95 transition-transform"
                    >
                        ACTUALIZAR
                    </button>
                    <button
                        onClick={() => setShowUpdate(false)}
                        className="p-3 bg-black/10 rounded-2xl text-white/50 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePWA;
