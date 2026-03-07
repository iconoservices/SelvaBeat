import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Music, Loader2, Zap, AlertCircle } from 'lucide-react';
import { searchVideos, getTrending, getVideoStreams } from '@/api/youtubeService';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useToastStore } from '@/store/useToastStore';
import TrackCard from '@/components/TrackCard';

/**
 * Feed de Emergencia: Shadow Content (Paso 10)
 * 
 * Se activa si Piped está 100% saturado para que el usuario siempre 
 * tenga algo que presionar. Éxitos de la Selva y Cumbia.
 */
// El Feed de Emergencia ha sido purgado. Ahora somos 100% dependientes de InocoOS.

const Home = () => {
    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [useFallback, setUseFallback] = useState(false);

    const { loadVideo, setLoading: setPlayerLoading } = usePlayerStore();
    const addToast = useToastStore(state => state.addToast);

    const fetchTrending = async () => {
        setLoading(true);
        setUseFallback(false);
        try {
            console.log("🔄 Home: Cosechando tendencias...");
            const data = await getTrending('MX');

            // BLINDAJE: Si data no es un array, lo convertimos en uno
            const verifiedTracks = Array.isArray(data) ? data : [];

            if (verifiedTracks.length === 0) {
                console.warn("🍃 Home: Feed vacío o error en Worker.");
                setUseFallback(true);
            }

            setTracks(verifiedTracks);
            console.log(`✅ Home: ${verifiedTracks.length} pistas cargadas.`);
        } catch (e) {
            console.error("⚠️ Home: Error en el radar de InocoOS. Home degradado.", e);
            setTracks([]); // Aseguramos que sea una lista vacía para evitar fallos de .map()
            setUseFallback(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrending();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setIsSearching(true);
        setUseFallback(false);
        try {
            const data = await searchVideos(query);
            setTracks(data.items || []);
        } catch (e) {
            addToast("Búsqueda bloqueada. Intenta de nuevo en 5s.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (track) => {
        // Dosificación v3.9.2: Solo cargamos metadata, dejamos que useAudioEngine pida el stream
        const videoId = track.id || (track.url && track.url.split('v=')[1]) || track.videoId;

        loadVideo({
            id: videoId,
            title: track.title,
            uploader: track.uploaderName || track.uploader,
            thumbnail: track.thumbnail || track.thumbnailUrl,
        }, null); // El motor detectará el null y pedirá el audio con sus tiempos controlados
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-32 animate-in fade-in duration-700">
            {/* NETWORK STATUS PILL (Local a Home) */}
            <div className="flex justify-center mb-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase border animate-pulse ${useFallback ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-primary/10 border-primary/30 text-primary'}`}>
                    {useFallback ? <AlertCircle size={10} /> : <Zap size={10} />}
                    {useFallback ? 'Modo: Saturación (Feed de Emergencia)' : 'Modo: Online (Bypass Activo)'}
                </div>
            </div>

            {/* SEARCH BAR PREMIUM */}
            <form onSubmit={handleSearch} className="sticky top-4 z-30 mb-8">
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Busca en la selva..."
                        className="w-full bg-surface/80 backdrop-blur-2xl border border-white/10 p-5 pl-14 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl"
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={22} />
                    {loading && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 text-primary animate-spin" size={22} />}
                </div>
            </form>

            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                    {useFallback ? 'Recomendaciones Locales' : isSearching ? 'Resultados' : 'Tendencias'}
                    {useFallback ? <Zap className="text-amber-500" size={20} /> : isSearching ? <Music className="text-primary" size={20} /> : <TrendingUp className="text-primary" size={20} />}
                </h2>
                {(isSearching || useFallback) && (
                    <button onClick={() => { setIsSearching(false); setQuery(''); fetchTrending(); }} className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-full">Actualizar</button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tracks.map((track, i) => (
                    <TrackCard
                        key={track.id || i}
                        track={track}
                        onClick={() => handlePlay(track)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
