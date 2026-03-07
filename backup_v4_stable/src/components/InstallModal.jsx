import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

/**
 * InstallModal - Componente PWA con Algoritmo de Cortejo (Refactorizado del Legacy).
 * No spamea al usuario; espera el momento psicológico correcto.
 */
const InstallModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIos, setIsIos] = useState(false);

    useEffect(() => {
        // 1. Detección de Plataforma
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isApple = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        setIsIos(isApple);

        if (isStandalone) return;

        // 2. Algoritmo de Cortejo (Lógica Legacy de La Yoyita)
        let visitCount = parseInt(localStorage.getItem('pwa_visit_count') || '0') + 1;
        localStorage.setItem('pwa_visit_count', visitCount);

        const lastVisit = parseInt(localStorage.getItem('pwa_last_visit') || '0');
        const now = Date.now();
        const timeSinceLastVisit = now - lastVisit;
        localStorage.setItem('pwa_last_visit', now);

        const shouldShow = () => {
            if (localStorage.getItem('pwa_installed')) return false;

            // Reglas Matemáticas de Frecuencia
            if (visitCount === 1) return true; // Primera impresión instantánea (5s)
            if (visitCount === 2) return false; // Esperar al scroll (evento externo)
            if (visitCount === 3) return false; // Esperar al temporizador (20s)

            if (visitCount >= 4) {
                const wait48h = timeSinceLastVisit > (48 * 60 * 60 * 1000);
                return (visitCount % 2 === 0) || wait48h;
            }
            return false;
        };

        // --- triggers ---

        // Trigger Visita 1 (5 segundos)
        if (visitCount === 1 && shouldShow()) {
            setTimeout(() => setIsVisible(true), 5000);
        }

        // Trigger Visita 2 (Scroll 50%)
        const handleScroll = () => {
            if (visitCount === 2 && !localStorage.getItem('pwa_banner_seen_v2')) {
                const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
                if (scrollPercent > 0.5) {
                    localStorage.setItem('pwa_banner_seen_v2', 'true');
                    setIsVisible(true);
                }
            }
        };

        // Trigger Visita 3 (20 segundos)
        if (visitCount === 3) {
            setTimeout(() => setIsVisible(true), 20000);
        }

        // Captura del Evento Nativo (Android/PC)
        const handleInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Si el algoritmo dice que sí, mostramos
            if (shouldShow()) setIsVisible(true);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);
        window.addEventListener('appinstalled', () => {
            localStorage.setItem('pwa_installed', 'true');
            setIsVisible(false);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in slide-in-from-bottom-full duration-500">
            <div className="bg-surface/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Glow de fondo */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20 shrink-0">
                        <Download className="text-white" size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">SelvaBeat en tu pantalla</h3>
                        <p className="text-gray-400 text-sm leading-tight mb-4">
                            Instala el clon premium para acceder más rápido y ahorrar datos en la selva.
                        </p>

                        {isIos ? (
                            /* Guía Especial para iOS (Apple's Prison) */
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2">
                                <p className="text-[11px] text-primary font-bold uppercase tracking-wider">Instrucciones para iPhone:</p>
                                <div className="flex items-center gap-2 text-xs text-gray-200">
                                    <Share size={14} className="text-blue-400" />
                                    <span>1. Toca el botón <b>Compartir</b></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-200">
                                    <PlusSquare size={14} className="text-gray-400" />
                                    <span>2. Selecciona <b>Añadir a pantalla de inicio</b></span>
                                </div>
                            </div>
                        ) : (
                            /* Botón Nativo (Android/Chrome) */
                            <button
                                onClick={handleInstallClick}
                                className="w-full bg-white text-black font-black py-4 rounded-2xl active:scale-95 transition-transform shadow-lg"
                            >
                                INSTALAR AHORA 🌴
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallModal;
