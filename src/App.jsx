import React, { useState, useEffect } from 'react'
import { usePlayerStore } from '@/store/usePlayerStore'
import { offlineDB } from '@/utils/db'
import { Library as LibraryIcon, Search, TrendingUp, Radio } from 'lucide-react'

// Componentes
import ToastContainer from '@/components/ToastContainer'
import FloatingPlayer from '@/components/Player/FloatingPlayer'
import MiniPlayer from '@/components/Player/MiniPlayer'
import InstallModal from '@/components/InstallModal'
import UpdatePWA from '@/components/UpdatePWA'
import Home from '@/pages/Home'
import Library from '@/pages/Library'
import SearchPage from '@/pages/SearchPage'

/**
 * 🌴 SelvaBeat App v4.2.0 - "Arquitectura Soberana"
 */
function App() {
    const systemStatus = usePlayerStore(state => state.systemStatus);
    const setSystemStatus = usePlayerStore(state => state.setSystemStatus);
    const [currentView, setCurrentView] = useState('home');

    // 🕵️‍♂️ Bootstrap: Escaneo de Sistemas
    useEffect(() => {
        const bootstrap = async () => {
            console.log("🔍 SelvaBeat: Escaneando Búnker...");
            const dbOk = await offlineDB.verifyStatus();
            try {
                const res = await fetch('https://icono-proxy.jnmcsky.workers.dev/?key=selva_master_key_2026_premium');
                if (res.ok) {
                    setSystemStatus(dbOk ? 'ok' : 'degraded');
                } else {
                    setSystemStatus('degraded');
                }
            } catch (e) {
                setSystemStatus('offline');
            }
        };
        bootstrap();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            <ToastContainer />
            <UpdatePWA />
            <InstallModal />

            {/* Header / Brand */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Radio className="text-black" size={18} />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic">
                            Selva<span className="text-emerald-500">Beat</span>
                        </h1>
                    </div>

                    <div className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all duration-500 ${systemStatus === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                        systemStatus === 'degraded' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                            'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                        {systemStatus === 'ok' ? 'Radar: Conectado' :
                            systemStatus === 'degraded' ? 'Radar: Saturado' : 'Radar: Offline'}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-20 pb-32 max-w-5xl mx-auto px-6">
                {currentView === 'home' && <Home />}
                {currentView === 'library' && <Library />}
                {currentView === 'search' && <SearchPage />}
            </main>

            {/* Reproductor Global */}
            <FloatingPlayer />
            <MiniPlayer />

            {/* Navegación Inferior Estilo Premium */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-transparent pb-8 pt-4">
                <div className="max-w-md mx-auto px-6 flex justify-around items-center">
                    <NavButton
                        active={currentView === 'home'}
                        onClick={() => setCurrentView('home')}
                        icon={<TrendingUp size={24} />}
                        label="Explorar"
                    />
                    <NavButton
                        active={currentView === 'search'}
                        onClick={() => setCurrentView('search')}
                        icon={<Search size={24} />}
                        label="Buscar"
                    />
                    <NavButton
                        active={currentView === 'library'}
                        onClick={() => setCurrentView('library')}
                        icon={<LibraryIcon size={24} />}
                        label="Bóveda"
                    />
                </div>
            </nav>
        </div>
    )
}

function NavButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-all relative ${active ? 'text-emerald-500 scale-110' : 'text-white/40 hover:text-white/60'
                }`}
        >
            {active && (
                <div className="absolute -top-1 w-1 h-1 bg-emerald-500 rounded-full blur-[2px] animate-pulse" />
            )}
            {icon}
            <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>
                {label}
            </span>
        </button>
    )
}

export default App
