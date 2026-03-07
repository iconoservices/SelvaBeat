import React, { useState, useEffect } from 'react'
import { usePlayerStore } from '@/store/usePlayerStore'
import { offlineDB } from '@/utils/db'
import { getTrending } from '@/api/youtubeService'
import { Library as LibraryIcon, Search, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

// Componentes
import ToastContainer from '@/components/ToastContainer'
import FloatingPlayer from '@/components/Player/FloatingPlayer'
import MiniPlayer from '@/components/Player/MiniPlayer'
import InstallModal from '@/components/InstallModal'
import UpdatePWA from '@/components/UpdatePWA'
import Home from '@/pages/Home'
import Library from '@/pages/Library'

/**
 * App.jsx - Conexión Total v2.0
 * 
 * Limpieza de logos de Vite, integración de navegación y
 * sistema de diagnóstico de servidores (Ping Bypass).
 */
function App() {
    // Escucha selectiva para evitar bucles de renderizado (Dosificación v3.9.2)
    const systemStatus = usePlayerStore(state => state.systemStatus);
    const setSystemStatus = usePlayerStore(state => state.setSystemStatus);
    const setIsMinimized = usePlayerStore(state => state.setIsMinimized);

    // Vista actual para navegación simple
    const [currentView, setCurrentView] = useState('home');
    const [isAppReady, setIsAppReady] = useState(false);

    /** 🛰️ Check System Status (Radar InocoOS) */
    const checkSystems = async () => {
        console.log("🔍 Iniciando Escaneo de Sistemas...");
        setSystemStatus('checking');
        const INOCOOS_URL = "https://inocoos-proxy.jnmcsky.workers.dev/";

        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 5000); // 5 segundos de margen

            // Verificación asíncrona pero segura
            const dbPromise = offlineDB.verifyStatus().catch(() => false);

            // La Puerta de Cortesía no requiere cabeceras para el PING
            const workerPromise = fetch(INOCOOS_URL, {
                method: 'GET',
                signal: controller.signal
            }).then(r => r.ok).catch(() => false);

            const [dbOk, workerOk] = await Promise.all([dbPromise, workerPromise]);
            clearTimeout(timer);

            console.log(`📊 Reporte: DB:${dbOk ? 'OK' : 'FAIL'} | Worker:${workerOk ? 'OK' : 'FAIL'}`);

            if (!navigator.onLine) {
                setSystemStatus('offline');
            } else if (workerOk) {
                setSystemStatus('ok');
                console.log("✅ Radar InocoOS: Conexión Estable en el Edge.");
            } else {
                setSystemStatus('degraded');
                console.warn("⚠️ Radar: Worker no responde o bloqueado por CORS.");
            }
        } catch (e) {
            console.error("🚨 Fallo en el Radar:", e);
            setSystemStatus('degraded');
        } finally {
            setIsAppReady(true);
        }
    };

    useEffect(() => {
        checkSystems();
    }, []);

    // Resiliencia: Si no hay internet, forzamos la vista a la Bóveda (OfflineDB)
    useEffect(() => {
        if (!navigator.onLine && isAppReady) {
            setCurrentView('library');
        }
    }, [navigator.onLine, isAppReady]);

    if (!isAppReady) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-4">
                <div className="relative">
                    <div className="w-24 h-24 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white brightness-125">SelvaBeat</h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary animate-pulse">Iniciando Sincronización...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center overflow-x-hidden selection:bg-primary/30">
            {/* HUD de Seguridad y Toasts */}
            <ToastContainer />
            <InstallModal />
            <UpdatePWA />

            {/* CAPA MULTIMEDIA */}
            <FloatingPlayer />
            <MiniPlayer onClick={() => setIsMinimized(false)} />

            {/* BARRA SUPERIOR DE ESTADO (Status Ping) */}
            <header className="w-full max-w-4xl px-6 pt-6 flex items-center justify-between z-40">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] leading-none">Sistema PWA</span>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-white">Selva<span className="text-primary">Beat</span></h1>
                </div>
                <button
                    onClick={checkSystems}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border transition-all active:scale-95 ${systemStatus === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                        systemStatus === 'offline' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                        }`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${systemStatus === 'ok' ? 'bg-green-500 animate-pulse' : systemStatus === 'offline' ? 'bg-amber-500' : 'bg-red-500 animate-bounce'}`}></div>
                    {systemStatus === 'ok' ? 'Modo: Online (Bypass Activo)' : systemStatus === 'offline' ? 'Modo: Bóveda (Offline)' : 'Modo: Saturación (Emergencia)'}
                </button>
            </header>

            {/* CONTENEDOR DE VISTAS (SPA) */}
            <main className="w-full flex-1 pt-4 pb-32 animate-in fade-in duration-700">
                {currentView === 'home' && <Home />}
                {currentView === 'library' && (
                    <Library onBack={() => setCurrentView('home')} />
                )}
            </main>

            {/* TAB BAR (NAVEGACIÓN) */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-3xl border-t border-white/5 px-10 flex items-center justify-around z-50">
                <button
                    onClick={() => setCurrentView('home')}
                    className={`flex flex-col items-center gap-1 transition-all group ${currentView === 'home' ? 'text-primary scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                    <Search size={22} className={currentView === 'home' ? 'drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]' : ''} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Descubrir</span>
                </button>

                <button
                    onClick={() => setCurrentView('library')}
                    className={`flex flex-col items-center gap-1 transition-all group ${currentView === 'library' ? 'text-primary scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                    <LibraryIcon size={22} className={currentView === 'library' ? 'drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]' : ''} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Bóveda</span>
                </button>
            </nav>
        </div>
    )
}

export default App
