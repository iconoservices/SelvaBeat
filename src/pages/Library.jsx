import React, { useState, useEffect } from 'react';
import { offlineDB } from '@/utils/db';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useToastStore } from '@/store/useToastStore';
import {
    Library as LibraryIcon, Search, AlertTriangle,
    Music, ArrowLeft
} from 'lucide-react';
import LibraryGrid from '@/components/LibraryGrid';

/**
 * Library.jsx - Evolución Visual v2.0 (Paso 14)
 * 
 * Migración total de lista virtualizada a Sistema de Rejilla Amazónica.
 * Diseño Premium-Regionalist con Skeletons y micro-interacciones.
 */
const Library = ({ onBack }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { loadVideo } = usePlayerStore();
    const addToast = useToastStore(state => state.addToast);

    const loadLibrary = async () => {
        setLoading(true);
        // Pequeño delay artificial para apreciar los Skeletons (UX Psicológico)
        const [data] = await Promise.all([
            offlineDB.getLibrary(),
            new Promise(r => setTimeout(r, 800))
        ]);
        setItems(data.sort((a, b) => b.timestamp - a.timestamp));
        setLoading(false);
    };

    useEffect(() => {
        loadLibrary();
    }, []);

    const handleDelete = async (id) => {
        await offlineDB.remove(id);
        addToast("Pista eliminada de la memoria local 🗑️", "success");
        setDeleteConfirm(null);
        loadLibrary();
    };

    const handlePlay = (item) => {
        loadVideo(item, null);
    };

    return (
        <div className="fixed inset-0 bg-black z-40 flex flex-col animate-in fade-in slide-in-from-right duration-500 pb-20 overflow-hidden">
            {/* Header Fijo Premium */}
            <div className="p-6 flex items-center justify-between border-b border-emerald-900/20 bg-black/90 backdrop-blur-3xl z-50">
                <div className="flex items-center gap-5">
                    <button onClick={onBack} className="p-3 bg-emerald-950/30 border border-emerald-500/10 hover:bg-emerald-500/20 rounded-2xl active:scale-75 transition-all text-emerald-500">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-white">
                            Mi Bóveda <LibraryIcon className="text-emerald-500" size={20} />
                        </h1>
                        <p className="text-[9px] text-emerald-600/60 font-black tracking-[0.2em] uppercase">
                            {items.length} Joyas Extraídas 🔋
                        </p>
                    </div>
                </div>
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/10 rounded-2xl text-emerald-500/50">
                    <Search size={22} />
                </div>
            </div>

            {/* Rejilla de Contenido */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-emerald-950/5 to-black">
                {items.length === 0 && !loading ? (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="p-10 bg-emerald-950/20 rounded-full mb-6 border border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                            <Music size={56} className="text-emerald-900" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white/80">La selva está muda</h2>
                        <p className="text-[11px] text-emerald-900 font-bold uppercase tracking-widest mt-2 max-w-[240px]">Todavía no has cosechado canciones para escuchar offline.</p>
                        <button onClick={onBack} className="mt-8 px-8 py-3 bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest rounded-full active:scale-90 transition-all">Explorar Tendencias</button>
                    </div>
                ) : (
                    <LibraryGrid
                        items={items}
                        loading={loading}
                        onPlay={handlePlay}
                        onDelete={(id) => setDeleteConfirm(id)}
                    />
                )}
            </div>

            {/* Modal de Confirmación Amazónico */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-zinc-950 border border-emerald-500/10 p-8 rounded-[2.5rem] w-full max-w-xs shadow-[0_0_100px_rgba(0,0,0,1)] text-center ring-1 ring-white/5">
                        <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <AlertTriangle size={36} />
                        </div>
                        <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-white">¿Soltar Presa?</h3>
                        <p className="text-[11px] text-emerald-900 font-bold uppercase tracking-widest mb-8 leading-relaxed">Esta joya será eliminada de tu bólido local permanentemente.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition-all"
                            >
                                Confirmar Destrucción
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="w-full py-4 bg-emerald-950/30 text-emerald-500 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-emerald-500/10 active:scale-95 transition-all"
                            >
                                Mantener en Bóveda
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
