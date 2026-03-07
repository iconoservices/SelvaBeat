import React from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, X, Music2 } from 'lucide-react';

/**
 * 🎵 MiniPlayer v5.0.0 - "Espectro Flotante"
 * 
 * Basado en el modelo premium: Glassmorphism puro, bordes suaves
 * y controles que parecen flotar sobre la navegación.
 */
const MiniPlayer = () => {
    const { videoData, isPlaying, togglePlaying, closePlayer, currentTime, duration, isLoading, isMinimized, toggleMinimized } = usePlayerStore();

    if (!videoData || !isMinimized) return null;

    const progress = (currentTime / duration) * 100 || 0;

    return (
        <div
            onClick={toggleMinimized}
            className="fixed bottom-[110px] left-6 right-6 h-16 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-2xl shadow-2xl z-[45] flex items-center overflow-hidden animate-in slide-in-from-bottom-8 duration-700 cursor-pointer group premium-shadow ring-1 ring-white/5"
        >
            {/* 📊 Barra de Progreso Minimalista (Inferior) */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                <div
                    className={`h-full transition-all duration-300 ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* 🖼️ Thumbnail Circular Artístico */}
            <div className="w-12 h-12 ml-2 rounded-xl overflow-hidden shrink-0 relative shadow-lg">
                <img src={videoData.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="thumb" />
                {isLoading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* 📝 Metadata Midnight */}
            <div className="flex-1 px-4 overflow-hidden">
                <h4 className="text-[11px] font-black truncate text-white uppercase tracking-tight leading-tight mb-0.5">{videoData.title}</h4>
                <div className="flex items-center gap-1.5">
                    <Music2 size={8} className="text-emerald-500" />
                    <p className="text-[8px] text-white/30 font-bold uppercase tracking-[0.2em] truncate">{videoData.uploader}</p>
                </div>
            </div>

            {/* 🎮 Controles de Vidrio */}
            <div className="flex items-center gap-1 pr-3">
                <button
                    onClick={(e) => { e.stopPropagation(); togglePlaying(); }}
                    className="w-10 h-10 flex items-center justify-center text-white active:scale-75 transition-all hover:bg-white/5 rounded-full"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); closePlayer(); }}
                    className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-500 transition-colors active:scale-50"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default MiniPlayer;
