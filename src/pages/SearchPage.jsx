import React, { useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { searchVideos, searchCleanCatalog } from '@/api/youtubeService';
import { useToastStore } from '@/store/useToastStore';
import { Search as SearchIcon, Play, Music, Loader2, Info, Radio } from 'lucide-react';
import TrackCard from '@/components/TrackCard';

/**
 * 🔍 SearchPage v5.1.0 - "Dual Radar System"
 */
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [radar, setRadar] = useState('clean'); // 'clean' o 'dirty'
    const { loadVideo } = usePlayerStore();
    const addToast = useToastStore(state => state.addToast);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setLoading(true);
            const data = radar === 'clean'
                ? await searchCleanCatalog(query)
                : await searchVideos(query);

            setResults(data);
            if (data.length === 0) addToast("No se encontraron rastros en la selva.", "info");
        } catch (error) {
            addToast("Error de conexión con el radar.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = async (track) => {
        addToast("Sintonizando...", "info");
        try {
            const { searchVideos, getVideoStreams } = await import('@/api/youtubeService');

            // Si es híbrido (Apple), buscamos el video match en YouTube
            const query = track.isHybrid ? (track.hybridQuery || `${track.title} ${track.uploader} official audio`) : track.title;
            const res = await searchVideos(query);

            if (res && res.length > 0) {
                const targetId = res[0].id;
                const streamData = await getVideoStreams(targetId);

                const finalTrack = {
                    ...res[0],
                    title: track.title,
                    uploader: track.uploader,
                    thumbnail: track.thumbnail
                };
                loadVideo(finalTrack, streamData);
            } else {
                addToast("Audio no encontrado.", "error");
            }
        } catch (e) {
            addToast("Error de conexión con la red.", "error");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Cabecera y Selector de Radares */}
            <div className="px-5 pt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-white">Radar</h2>
                    <div className="flex bg-white/5 border border-white/10 rounded-full p-1 h-9">
                        <button
                            onClick={() => setRadar('clean')}
                            className={`px-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${radar === 'clean' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-white/40 hover:text-white'}`}
                        >
                            Catálogo Pro
                        </button>
                        <button
                            onClick={() => setRadar('dirty')}
                            className={`px-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-1 ${radar === 'dirty' ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'text-white/40 hover:text-white'}`}
                        >
                            <Radio size={12} /> Salvaje
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-[var(--active-color)] transition-colors" style={{ '--active-color': radar === 'clean' ? '#10b981' : '#f97316' }}>
                        <SearchIcon size={20} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={radar === 'clean' ? "Buscar artistas, música oficial..." : "Buscar mixes, podcasts, covers..."}
                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all disabled:opacity-50 ${radar === 'clean' ? 'bg-emerald-500' : 'bg-orange-500'}`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Rastrear'}
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
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <div className="p-8 bg-white/5 rounded-[3rem] mb-4">
                            <SearchIcon size={48} />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-center max-w-[200px]">
                            {radar === 'clean' ? "RADAR GLOBAL: SOLO EDICIONES DE ESTUDIO OFICIALES" : "RADAR SALVAJE: MODO YOUTUBE SIN CENSURA"}
                        </p>
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
