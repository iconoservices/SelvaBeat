import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { getTrending } from '@/api/youtubeService';
import { useToastStore } from '@/store/useToastStore';
import { Play, TrendingUp, Sparkles, Flame } from 'lucide-react';
import TrackCard from '@/components/TrackCard';

/**
 * 🏠 Home Page v4.1.0 - "Cosecha de Éxitos"
 */
const Home = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { loadVideo } = usePlayerStore();
    const addToast = useToastStore(state => state.addToast);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setLoading(true);
                const data = await getTrending();
                setTracks(data);
            } catch (error) {
                console.error("Home: Fallo en cosecha:", error);
                addToast("Error al conectar con la selva.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const handlePlay = (track) => {
        // En v4.1.0 el motor gestiona la obtención de streams
        loadVideo(track, null);
        addToast(`Sintonizando: ${track.title}`, "info");
    };

    if (loading && tracks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40 animate-pulse">Explorando Selva...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hero Section / Trending */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flame className="text-orange-500" size={20} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Tendencias Hoy</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tracks.slice(0, 6).map((track, idx) => (
                        <div key={track.id} className="group relative" style={{ animationDelay: `${idx * 100}ms` }}>
                            <TrackCard
                                track={track}
                                onPlay={() => handlePlay(track)}
                            />
                            {idx === 0 && (
                                <div className="absolute -top-2 -left-2 bg-emerald-500 text-black text-[8px] font-black px-2 py-1 rounded-md shadow-lg rotate-[-5deg] z-10">
                                    TOP #1
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Explorar Más */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-emerald-500" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Recomendados</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tracks.slice(6).map((track) => (
                        <div
                            key={track.id}
                            onClick={() => handlePlay(track)}
                            className="bg-white/5 border border-white/5 rounded-2xl p-3 hover:bg-white/10 transition-all cursor-pointer group"
                        >
                            <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
                                <img src={track.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={track.title} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                                        <Play fill="black" size={20} />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-[11px] font-bold line-clamp-1">{track.title}</h3>
                            <p className="text-[9px] text-white/40 uppercase font-black tracking-tighter truncate">{track.uploader}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
