import React, { useState, useEffect } from 'react'
import { usePlayerStore } from '@/store/usePlayerStore'
import { offlineDB } from '@/utils/db'
import { Library as LibraryIcon, Search, TrendingUp, Home as HomeIcon, Zap } from 'lucide-react'

// Componentes
import ToastContainer from '@/components/ToastContainer'
import FloatingPlayer from '@/components/Player/FloatingPlayer'
import MiniPlayer from '@/components/Player/MiniPlayer'
import InstallModal from '@/components/InstallModal'
import Home from '@/pages/Home'
import Library from '@/pages/Library'
import SearchPage from '@/pages/SearchPage'

/**
 * 🌴 SelvaBeat App v5.0.0 - "Sinfonía Midnight"
 */
function App() {
    const systemStatus = usePlayerStore(state => state.systemStatus);
    const setSystemStatus = usePlayerStore(state => state.setSystemStatus);
    const [currentView, setCurrentView] = useState('home');

    // 🕵️‍♂️ Bootstrap: Escaneo de Sistemas
    useEffect(() => {
        const bootstrap = async () => {
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
    }, [setSystemStatus]);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden">
            <ToastContainer />
            <InstallModal />

            {/* Main Content Area */}
            <main className="pb-32">
                {currentView === 'home' && <Home />}
                {currentView === 'library' && <Library />}
                {currentView === 'search' && <SearchPage />}
            </main>

            {/* Reproductor Global */}
            <FloatingPlayer />
            <MiniPlayer />

            {/* Navegación Inferior Estilo Premium v5.0 */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pb-6 pt-10 px-6">
                <div className="max-w-lg mx-auto bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-2 flex justify-between items-center premium-shadow">
                    <NavButton
                        active={currentView === 'home'}
                        onClick={() => setCurrentView('home')}
                        icon={<HomeIcon size={22} />}
                        label="Inicio"
                    />
                    <NavButton
                        active={currentView === 'search'}
                        onClick={() => setCurrentView('search')}
                        icon={<Search size={22} />}
                        label="Buscar"
                    />
                    <NavButton
                        active={currentView === 'library'}
                        onClick={() => setCurrentView('library')}
                        icon={<LibraryIcon size={22} />}
                        label="Biblioteca"
                    />
                    <NavButton
                        active={currentView === 'premium'}
                        onClick={() => setCurrentView('home')}
                        icon={<Zap size={22} />}
                        label="Premium"
                    />
                </div>
            </nav>

            {/* Decoración de Fondo (Selva Aura) */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none z-0" />
        </div>
    );
}

const NavButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-[2rem] transition-all duration-300 ${active ? 'text-emerald-500 bg-emerald-500/10' : 'text-white/40 hover:text-white/60'}`}
    >
        <div className={`mb-1 transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
            {React.cloneElement(icon, { strokeWidth: active ? 2.5 : 2 })}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-40'}`}>
            {label}
        </span>
    </button>
);

export default App;
