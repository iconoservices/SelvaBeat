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
        <div className="fixed bottom-28 left-6 right-6 z-[100] animate-in slide-in-from-bottom-full duration-700">
            <div className="glass-card p-6 rounded-[2.5rem] premium-shadow relative overflow-hidden ring-1 ring-white/10">
                {/* Glow decorativo esmeralda */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-5 right-5 text-white/20 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
                            <img src="/pwa-icon-192.png" className="w-10 h-10 object-contain inv-h" alt="logo" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white leading-tight">SelvaBeat Pro</h3>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em]">Versión Soberana</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-white/60 text-sm leading-relaxed">
                            ¿Cansado de ver sugerencias? Instala <span className="text-white font-bold">SelvaBeat Premium</span> para una navegación 100% limpia, ahorro de datos y acceso instantáneo.
                        </p>

                        {isIos ? (
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest text-center">Protocolo iPhone</p>
                                <div className="flex items-center justify-center gap-6">
                                    <div className="flex flex-col items-center gap-1.5 opacity-60">
                                        <Share size={18} className="text-white" />
                                        <span className="text-[9px] font-bold">Compartir</span>
                                    </div>
                                    <div className="w-px h-6 bg-white/10"></div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <PlusSquare size={18} className="text-white" />
                                        <span className="text-[9px] font-bold">A Inicio</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleInstallClick}
                                className="w-full bg-white text-black font-black py-4 rounded-2xl active:scale-95 transition-transform shadow-xl hover:bg-emerald-50 transition-colors"
                            >
                                INSTALAR VERSIÓN PRO 🌴
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallModal;
