import React, { useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { searchCleanCatalog } from '@/api/musicService';
import { useToastStore } from '@/store/useToastStore';
import { Search as SearchIcon, Loader2, Info, Music } from 'lucide-react';
import TrackCard from '@/components/TrackCard';

/**
 * 🔍 SearchPage v6.0.0 - "Premium Music Browser"
 * Eliminado el radar 'Salvaje' para cumplir con la visión de audio puro.
 */
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { loadVideo } = usePlayerStore();
    const addToast = useToastStore(state => state.addToast);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setLoading(true);
            const data = await searchCleanCatalog(query);
            setResults(data);
            if (data.length === 0) addToast("No se encontraron resultados en el catálogo.", "info");
        } catch (error) {
            addToast("Error de conexión con el catálogo maestro.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = async (track) => {
        addToast("Sintonizando...", "info");
        try {
            const { searchInternal, getVideoStreams } = await import('@/api/musicService');

            let videoId = null;

            // Ruta 1: Buscar en la red interna por nombre
            try {
                const res = await searchInternal(track.hybridQuery || `${track.title} ${track.uploader}`);
                if (res && res.length > 0) {
                    videoId = res[0].id;
                }
            } catch (e) {
                console.warn("searchInternal fallo, intentando ruta directa...");
            }

            if (!videoId) {
                addToast("Audio no encontrado en red.", "error");
                return;
            }

            const streamData = await getVideoStreams(videoId);

            const finalTrack = {
                id: videoId,
                title: track.title,
                uploader: track.uploader,
                thumbnail: track.thumbnail,
                duration: track.duration
            };
            loadVideo(finalTrack, streamData);

        } catch (e) {
            console.error("handlePlay error:", e);
            addToast("Error al sintonizar.", "error");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Cabecera Premium */}
            <div className="px-5 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">Explorar</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Catálogo Pro Activo</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Music size={20} />
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-emerald-500 transition-colors">
                        <SearchIcon size={20} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Artistas, álbumes o canciones..."
                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Buscar'}
                    </button>
                </form>
            </div>

            {/* Resultados */}
            <div className="px-5 space-y-6">
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {results.map((track) => (
                            <TrackCard
                                key={track.id}
                                track={track}
                                onPlay={() => handlePlay(track)}
                            />
                        ))}
                    </div>
                ) : !loading && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-10">
                        <div className="p-10 bg-white/5 rounded-[4rem] mb-6">
                            <SearchIcon size={64} />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-[0.5em] text-center max-w-[250px] leading-relaxed">
                            Buscando en Apple Music & Spotify Master Library
                        </p>
                    </div>
                )}
            </div>

            {/* Info de Calidad */}
            <div className="px-5">
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] flex gap-4 items-center">
                    <div className="w-10 h-10 shrink-0 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                        <Info size={20} />
                    </div>
                    <p className="text-[9px] font-bold text-emerald-500/60 uppercase leading-loose tracking-wider">
                        Estás navegando en el catálogo oficial de alta fidelidad. SelvaBeat prioriza grabaciones de estudio originales.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

