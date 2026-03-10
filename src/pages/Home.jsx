import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { getTrending } from '@/api/youtubeService';
import { useToastStore } from '@/store/useToastStore';
import { Play, Sparkles, Flame, Bell, ChevronRight } from 'lucide-react';
import TrackCard from '@/components/TrackCard';

/**
 * 🏠 Home Page v5.0.0 - "Sinfonía Midnight"
 */
const Home = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { loadVideo } = usePlayerStore();
    const addToast = useToastStore(state => state.addToast);

    // Datos estáticos para los carruseles (Simulando el modelo)
    const featuredPlaylists = [
        { id: 1, title: 'Top Global 2024', color: 'from-orange-500', icon: '🌍' },
        { id: 2, title: 'Indie Soberano', color: 'from-blue-500', icon: '✨' },
        { id: 3, title: 'Favoritos Selva', color: 'from-yellow-500', icon: '💛' },
        { id: 4, title: 'Éxitos Urbanos', color: 'from-purple-500', icon: '🚀' },
        { id: 5, title: 'Concentración Pro', color: 'from-emerald-500', icon: '🧠' },
        { id: 6, title: 'Gimnasio Bestia', color: 'from-red-500', icon: '💪' },
        { id: 7, title: 'Dormir Profundo', color: 'from-indigo-600', icon: '🌙' },
    ];

    const topArtists = [
        { id: 'badbunny', name: 'Bad Bunny', img: 'https://i.scdn.co/image/ab6761610000e5eb989ed05e810ca24857467111' },
        { id: 'taylor', name: 'Taylor Swift', img: 'https://i.scdn.co/image/ab6761610000e5eb8594241e389e87498305c6e8' },
        { id: 'theweeknd', name: 'The Weeknd', img: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1c5d013f93d26cc80' },
        { id: 'karolg', name: 'Karol G', img: 'https://i.scdn.co/image/ab6761610000e5eb90d29631215b00c2a2da8929' },
        { id: 'rosalia', name: 'Rosalia', img: 'https://i.scdn.co/image/ab6761610000e5eb1e792576ca5758c0788647ba' },
        { id: 'jbalvin', name: 'J Balvin', img: 'https://i.scdn.co/image/ab6761610000e5eb18606c483cc1e48fd1d88698' },
        { id: 'feid', name: 'Feid', img: 'https://i.scdn.co/image/ab6761610000e5eb3544d93026362d29497d3121' },
        { id: 'shakira', name: 'Shakira', img: 'https://i.scdn.co/image/ab6761610000e5eb8ac876db2e957367cb6eb884' },
        { id: 'quevedo', name: 'Quevedo', img: 'https://i.scdn.co/image/ab6761610000e5eb604439ef04d5386b627192ea' },
        { id: 'myketowers', name: 'Myke Towers', img: 'https://i.scdn.co/image/ab6761610000e5eb8090f48866e409b552e6949b' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const trending = await getTrending();
                const { searchVideos } = await import('@/api/youtubeService');
                const discovery = await searchVideos('exitos musicales 2024 oficial');

                // 🛸 El "Filtro Soberano" (Aniquilación de Mixes Mixta)
                const isGarbage = (t) => {
                    // 1. Filtrar por Duración (Si dura más de 8 minutos, es un mix sí o sí)
                    if (t.duration > 480) return true;

                    // 2. Filtrar por Texto de Título
                    const blackList = [
                        'mix', 'completo', 'full album', '1 hour', 'envivo', 'reggaeton mix',
                        'variado', 'sesión', 'dj set', 'megamix', 'lo mejor de', 'recopilatorio',
                        'playlist', 'estreno 2025', 'éxitos 2025', 'top hits', 'top songs',
                        'medley', 'best songs', 'top 30'
                    ];
                    return blackList.some(word => t.title.toLowerCase().includes(word));
                };

                const all = [...trending, ...discovery].filter(t => !isGarbage(t));

                // Unificador de IDs para evitar clones
                const seen = new Set();
                const clean = all.filter(t => {
                    const tid = t.id || t.videoId;
                    if (seen.has(tid)) return false;
                    seen.add(tid);
                    return true;
                });

                setTracks(clean.slice(0, 24));
            } catch (error) {
                console.error("Home: Fallo en carga:", error);
                addToast("Error al conectar con la selva.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addToast]);

    const handlePlay = (track) => {
        loadVideo(track, null);
        addToast(`Sintonizando: ${track.title}`, "info");
    };

    if (loading && tracks.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-emerald-500 font-mono text-[10px] animate-pulse tracking-widest uppercase">Sintonizando la Selva...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-28 animate-in fade-in duration-700 max-w-lg mx-auto">
            {/* 🛸 CABECERA PREMIUM (Glassmorphism) */}
            <header className="px-5 pt-10 pb-6 flex items-center justify-between sticky top-0 z-40 bg-[#050505]/60 backdrop-blur-xl">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter text-gradient leading-tight">¡Hola, JuanMa!</h1>
                    <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Tu Selva</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Bell size={16} className="text-white/60" />
                    </button>
                    <div className="w-8 h-8 rounded-full border border-emerald-500/30 p-0.5">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                        </div>
                    </div>
                </div>
            </header>

            {/* 🎭 BANNER DESTACADO */}
            <section className="px-5 mb-8">
                <div className="relative h-36 rounded-[2rem] overflow-hidden group shadow-xl shadow-black/40">
                    <img
                        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent flex flex-col justify-center px-6">
                        <span className="text-emerald-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Featured Playlist</span>
                        <h2 className="text-xl font-black text-white leading-tight mb-3">Lanzamientos<br />Semanales</h2>
                        <button className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full w-fit active:scale-95 transition-transform">
                            Escuchar Ahora
                        </button>
                    </div>
                </div>
            </section>

            {/* 🌀 SECCIÓN: PLAYLISTS POPULARES (Horizontal) */}
            <section className="mb-8">
                <div className="px-5 flex items-center justify-between mb-3">
                    <h2 className="text-sm font-black tracking-tight text-white/90 uppercase tracking-[0.1em]">Tus Playlists</h2>
                    <ChevronRight size={16} className="text-white/20" />
                </div>
                <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar pb-1">
                    {featuredPlaylists.map(pl => (
                        <div key={pl.id} className="min-w-[110px] group cursor-pointer">
                            <div className={`aspect-square rounded-[1.5rem] bg-gradient-to-br ${pl.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform duration-500 ring-1 ring-white/10`}>
                                {pl.icon}
                            </div>
                            <p className="mt-2 text-[10px] font-bold text-white/40 text-center truncate px-2">{pl.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 👤 SECCIÓN: ARTISTAS DEL MOMENTO (Círculos) */}
            <section className="mb-8">
                <div className="px-5 flex items-center justify-between mb-3">
                    <h2 className="text-sm font-black tracking-tight text-white/90 uppercase tracking-[0.1em]">Artistas</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar text-center pb-1">
                    {topArtists.map(artist => (
                        <div key={artist.id} className="min-w-[64px] group cursor-pointer">
                            <div className="w-16 h-16 rounded-full border border-transparent group-hover:border-emerald-500/50 p-1 transition-all duration-500 bg-white/5 ring-1 ring-white/10">
                                <img src={artist.img} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={artist.name} />
                            </div>
                            <p className="mt-2 text-[8px] font-black text-white/30 uppercase tracking-tighter truncate">{artist.name.split(' ')[0]}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🔥 SECCIÓN: RECOMENDADOS (Grid de Tendencias) */}
            <section className="px-5">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Flame size={14} className="text-emerald-500" />
                    </div>
                    <h2 className="text-sm font-black tracking-tight text-white uppercase tracking-[0.1em]">Top Perú</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {tracks.map((track) => (
                        <TrackCard
                            key={track.id}
                            track={track}
                            onPlay={() => handlePlay(track)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
