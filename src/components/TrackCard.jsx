import React, { useEffect, useState } from 'react';
import { Play, Music, Clock, CloudDownload, Check, Loader2 } from 'lucide-react';
import { useVaultManager } from '@/hooks/useVaultManager';

/**
 * 🎴 TrackCard - Tarjeta Premium v4.2.0 (Con Bóveda)
 * 
 * Normalizada para el Motor Soberano y Descargas Offline.
 */
const TrackCard = ({ track, onPlay }) => {
    const { downloadToVault, downloadingIds, checkIsDownloaded } = useVaultManager();
    const [isDownloaded, setIsDownloaded] = useState(false);
    const isDownloading = downloadingIds.has(track.id);

    useEffect(() => {
        checkIsDownloaded(track.id).then(setIsDownloaded);
    }, [track.id, checkIsDownloaded, isDownloading]);

    const handleDownload = (e) => {
        e.stopPropagation(); // Evitar que se reproduzca la canción al pulsar el botón de descargar
        if (!isDownloaded && !isDownloading) {
            downloadToVault(track);
        }
    };
    return (
        <div
            onClick={onPlay}
            className={`group relative bg-white/5 border ${isDownloaded ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-white/5'} rounded-3xl overflow-hidden active:scale-95 transition-all cursor-pointer hover:bg-white/10 hover:border-emerald-500/20 hover:shadow-2xl shadow-black/80 ring-1 ring-white/5`}
        >
            {/* THUMBNAIL */}
            <div className="relative aspect-square overflow-hidden transform-gpu">
                <img
                    src={track.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="thumbnail"
                    loading="lazy"
                />
                {/* ACCIONES RÁPIDAS (Hover) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                    {/* Botón Play (Online) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onPlay(); }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20 active:scale-90 transition-all"
                    >
                        <Play size={24} fill="black" className="ml-1" />
                    </button>

                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Escuchar Online</span>
                </div>

                {/* BOTÓN BÓVEDA (DESCARGAR) - Siempre visible pero sutil */}
                <button
                    onClick={handleDownload}
                    disabled={isDownloaded || isDownloading}
                    className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-all z-20 ${isDownloaded
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500'
                        : 'bg-black/40 border-white/10 text-white hover:bg-white/20'
                        } ${isDownloading ? 'animate-pulse' : ''}`}
                    title={isDownloaded ? "En la Bóveda" : "Bajar a la Bóveda"}
                >
                    {isDownloading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : isDownloaded ? (
                        <Check size={18} />
                    ) : (
                        <CloudDownload size={18} />
                    )}
                </button>

                {/* DURACION (Si existe en metadata) */}
                {track.duration > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1 border border-white/10">
                        <Clock size={12} className="text-emerald-500" />
                        {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                )}
            </div>

            {/* METADATA */}
            <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <h3 className="text-[11px] font-black text-white leading-tight truncate uppercase tracking-tighter flex-1">
                        {track.title}
                    </h3>
                    {isDownloaded && (
                        <div className="shrink-0 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                            <Check size={8} className="text-black" strokeWidth={4} />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[9px] text-white/30 font-black uppercase truncate tracking-widest leading-none">
                        {track.uploader}
                    </p>
                    <div className={`flex items-center gap-1 ${isDownloaded ? 'text-emerald-500' : 'text-emerald-500/30'}`}>
                        <Music size={10} />
                        <span className="text-[7px] font-black uppercase tracking-widest">{isDownloaded ? 'Bóveda' : 'Premium'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackCard;
