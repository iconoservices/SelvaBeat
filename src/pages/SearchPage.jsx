import React, { useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { searchVideos } from '@/api/youtubeService';
import { useToastStore } from '@/store/useToastStore';
import { Search as SearchIcon, Play, Music, Loader2, Info } from 'lucide-react';
import TrackCard from '@/components/TrackCard';

/**
 * 🔍 SearchPage v4.2.0 - "Radar de la Selva"
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
            const data = await searchVideos(query);
            setResults(data);
            if (data.length === 0) addToast("No se encontraron rastros en la selva.", "info");
        } catch (error) {
            addToast("Error de conexión con el radar.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Barra de Búsqueda Premium */}
            <div className="relative">
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-emerald-500 transition-colors">
                        <SearchIcon size={20} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar en la selva..."
                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Rastrear'}
                    </button>
                </form>
            </div>

            {/* Resultados */}
            <div className="space-y-6">
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((track) => (
                            <TrackCard
                                key={track.id}
                                track={track}
                                onPlay={() => loadVideo(track, null)}
                            />
                        ))}
                    </div>
                ) : !loading && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <div className="p-8 bg-white/5 rounded-[3rem] mb-4">
                            <SearchIcon size={48} />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-[0.4em]">Introduce tu búsqueda</p>
                    </div>
                )}
            </div>

            {/* Tip InocoOS */}
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex gap-4 items-center">
                <div className="w-10 h-10 shrink-0 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                    <Info size={20} />
                </div>
                <p className="text-[10px] font-bold text-emerald-500/60 uppercase leading-relaxed tracking-tight">
                    El radar InocoOS filtra automáticamente videoclips musicales para garantizar la mejor experiencia de audio hi-fi.
                </p>
            </div>
        </div>
    );
};

export default SearchPage;
