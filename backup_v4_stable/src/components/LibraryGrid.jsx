import React from 'react';
import { Play, Trash2, Clock, Music, Loader2 } from 'lucide-react';

/**
 * LibraryGrid - Sistema de Rejilla Amazónica (v2.0)
 * 
 * Implementa Branding Regionalista: Verdes profundos y acentos Neón Selva.
 * Diseño basado en Cards de alto impacto con micro-interacciones.
 */
const LibraryGrid = ({ items, loading, onPlay, onDelete }) => {

    // Skeleton State (Carga Fantasma Premium)
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-emerald-900/20 rounded-3xl overflow-hidden animate-pulse shadow-sm">
                        <div className="aspect-video bg-emerald-950/20" />
                        <div className="p-5 space-y-4">
                            <div className="h-4 bg-emerald-900/20 rounded-full w-3/4" />
                            <div className="flex justify-between items-center">
                                <div className="h-3 bg-emerald-950/30 rounded-full w-1/3" />
                                <div className="h-4 bg-emerald-900/10 rounded-full w-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 overflow-y-auto max-h-full pb-32">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="group relative bg-zinc-950/40 border border-emerald-900/20 rounded-3xl overflow-hidden hover:bg-emerald-950/10 hover:border-emerald-500/30 hover:shadow-[0_20px_40px_rgba(5,150,105,0.15)] transition-all duration-500 cursor-pointer ring-1 ring-white/5 active:scale-95"
                >
                    {/* THUMBNAIL TACTICO */}
                    <div className="relative aspect-video overflow-hidden" onClick={() => onPlay(item)}>
                        <img
                            src={item.thumbnail}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 blur-[2px] group-hover:blur-0"
                            alt="thumb"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent opacity-60" />

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="bg-emerald-500/20 backdrop-blur-md p-4 rounded-full border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                <Play size={24} className="text-emerald-400 fill-emerald-400 ml-1" />
                            </div>
                        </div>

                        {/* Tag de Bóveda Offline */}
                        <div className="absolute top-3 left-3 bg-emerald-500/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-400/20 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">En Bóveda</span>
                        </div>
                    </div>

                    {/* METADATA PREMIUM */}
                    <div className="p-5">
                        <div className="flex justify-between items-start gap-4 mb-3">
                            <h3
                                onClick={() => onPlay(item)}
                                className="text-sm font-black text-white leading-tight uppercase tracking-tighter truncate flex-1"
                            >
                                {item.title}
                            </h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                className="p-2 text-emerald-900 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-75"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Music size={10} className="text-emerald-500" />
                                </div>
                                <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest truncate max-w-[120px]">
                                    {item.uploader}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                                <Clock size={10} className="text-gray-600" />
                                <span className="text-[9px] font-mono font-bold text-gray-500">HI-FI</span>
                            </div>
                        </div>
                    </div>

                    {/* Efecto Neón Inferior */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/40 transition-all duration-1000" />
                </div>
            ))}
        </div>
    );
};

export default LibraryGrid;
