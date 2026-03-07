import React from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, X } from 'lucide-react';

/**
 * MiniPlayer - Barra de control persistente (Paso 9)
 * 
 * Flota sobre la navegación y detecta el progreso del audio引擎.
 */
const MiniPlayer = ({ onClick }) => {
    const { videoData, isPlaying, togglePlaying, closePlayer, currentTime, duration, isLoading, isMinimized } = usePlayerStore();

    if (!videoData || !isMinimized) return null;

    const progress = (currentTime / duration) * 100 || 0;

    return (
        <div
            onClick={onClick}
            className="fixed bottom-24 left-4 right-4 h-18 bg-zinc-950/95 backdrop-blur-3xl rounded-[1.25rem] border border-emerald-500/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-[998] flex items-center overflow-hidden animate-in slide-in-from-bottom-6 duration-700 cursor-pointer group ring-1 ring-white/5"
        >
            {/* Barra de Progreso Neón */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-emerald-950/50">
                <div
                    className={`h-full transition-all duration-300 ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Thumbnail con bordes bólido */}
            <div className="w-18 h-18 shrink-0 relative overflow-hidden">
                <img src={videoData.thumbnail || videoData.img} className="w-full h-full object-cover filter saturate-[1.2] brightness-75 group-hover:brightness-100 transition-all duration-500" alt="thumb" />
                {isLoading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Metadata Táctica */}
            <div className="flex-1 px-4 overflow-hidden">
                <h4 className="text-[12px] font-black truncate text-white uppercase tracking-tighter leading-none mb-1">{videoData.title}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-[7px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-sm font-black tracking-widest uppercase border border-emerald-500/10">Master</span>
                    <p className="text-[8px] text-emerald-900 font-bold truncate uppercase tracking-[0.15em]">{videoData.uploader || 'SELVA BEAT'}</p>
                </div>
            </div>

            {/* Controles de Búnker */}
            <div className="flex items-center gap-2 pr-4">
                <button
                    onClick={(e) => { e.stopPropagation(); togglePlaying(); }}
                    className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-black rounded-2xl active:scale-75 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105"
                >
                    {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-1" />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); closePlayer(); }}
                    className="p-2 text-white/10 hover:text-red-500 transition-colors active:scale-50"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default MiniPlayer;
