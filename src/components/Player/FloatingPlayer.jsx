import React, { useRef, useState, useEffect } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { offlineDB } from '@/utils/db';
import ReactPlayer from 'react-player';
import {
    Play, Pause, ChevronDown, X, SkipForward, SkipBack,
    Maximize2, Download, Share, Music, Loader2, RefreshCcw
} from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

/**
 * FloatingPlayer v6.0.0 (Pure Music Experience)
 * Audio nativo perfecto a través de puente cero-CORS. 
 * Sin parches, sin vistas de youtube rotas.
 */
const FloatingPlayer = () => {
    const {
        videoData, streams, isPlaying, isMinimized, isLoading,
        togglePlaying, setIsMinimized, closePlayer, setLoading,
        storageFree, currentTime, duration, isOfflineMode, setPlaying
    } = usePlayerStore();

    const addToast = useToastStore(state => state.addToast);
    const [isDownloading, setIsDownloading] = useState(false);

    // Motor puro
    const { handleTimeUpdate, setAudioDuration, cleanRAM, source } = useAudioEngine();
    // Debug: log source changes
    useEffect(() => {
        console.log('🔎 source:', source);
    }, [source]);
    const playerRef = useRef(null);

    const handleDownload = async () => {
        addToast("Bóveda bloqueada por DRM oficial.", "error");
    };

    if (!videoData) return null;

    // Calculo del ancho de la barra
    const progressWidth = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={`fixed inset-0 bg-black z-[1000] flex flex-col transition-all duration-500 overflow-hidden ${isMinimized ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>

            {/* Puente Secreto de Audio — en viewport pero imperceptible */}
            <div style={{ position: 'fixed', bottom: '0', right: '0', width: '1px', height: '1px', opacity: '0.01', overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
                {source && source.type === 'youtube' && (
                    <ReactPlayer
                        ref={playerRef}
                        url={source.url}
                        playing={isPlaying}
                        controls={false}
                        width="320px"
                        height="180px"
                        volume={1}
                        onProgress={(state) => handleTimeUpdate(state.playedSeconds)}
                        onDuration={(dur) => setAudioDuration(dur)}
                        onReady={() => setLoading(false)}
                        onBuffer={() => setLoading(true)}
                        onBufferEnd={() => setLoading(false)}
                        onError={(e) => {
                            console.error("🚨 Error Crítico de Audio:", e);
                            addToast("Fallo en la sintonía. Intenta otra canción.", "error");
                        }}
                        config={{
                            youtube: {
                                playerVars: {
                                    showinfo: 0,
                                    modestbranding: 1,
                                    rel: 0,
                                    disablekb: 1,
                                    iv_load_policy: 3,
                                    autoplay: 1
                                }
                            }
                        }}
                    />
                )}
                {source && source.type === 'local' && (
                    <audio
                        src={source.url}
                        autoPlay
                        onTimeUpdate={(e) => handleTimeUpdate(e.target.currentTime)}
                        onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                    />
                )}
            </div>

            {/* HUD de Carga Pro */}
            {isLoading && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-3xl">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl animate-pulse"></div>
                            <RefreshCcw className="animate-spin text-emerald-500 relative z-10" size={48} />
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 block mb-1">Decodificando</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Premium */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black to-transparent absolute top-0 left-0 right-0 z-50">
                <button onClick={() => setIsMinimized(true)} className="p-3 bg-white/5 border border-white/10 rounded-2xl transition-all active:scale-75 text-white/70 hover:text-white">
                    <ChevronDown size={24} />
                </button>
                <div className="text-center flex-1 px-4">
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border inline-block bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                        {isOfflineMode ? 'Bóveda Offline 🔋' : 'Sintonía Activa 📡'}
                    </p>
                    <p className="text-[10px] font-bold truncate max-w-[200px] mx-auto text-white/30 uppercase mt-2 tracking-tighter">{videoData.title}</p>
                </div>
                <button onClick={() => { cleanRAM(); closePlayer(); }} className="p-3 bg-white/5 border border-red-500/10 rounded-2xl transition-all active:scale-75 text-red-500/70 hover:text-red-500">
                    <X size={24} />
                </button>
            </div>

            {/* ESCENARIO VISUAL (Solo Portada HQ) */}
            <div className="w-full aspect-square md:aspect-video mt-16 shadow-2xl relative bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-white/5 p-10">
                <img
                    src={videoData.thumbnail}
                    className="w-full h-full object-cover blur-3xl opacity-20 absolute inset-0 scale-150"
                    alt="bg-blur"
                />

                <div className="relative w-full h-full max-w-[400px] mx-auto flex items-center justify-center rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                    <img
                        src={videoData.thumbnail}
                        className="w-full h-full object-cover z-10 transition-opacity duration-700"
                        alt="artwork"
                    />
                </div>
            </div>

            {/* CONTROLES Y METADATA */}
            <div className="flex-1 flex flex-col p-8 justify-between bg-black/80">
                <div>
                    <h2 className="text-3xl font-black leading-tight mb-2 tracking-tighter text-white line-clamp-2">{videoData.title}</h2>
                    <p className="text-emerald-500 font-bold uppercase text-[12px] tracking-wider">{videoData.uploader}</p>
                </div>

                <div className="w-full space-y-8">
                    {/* Barra de Progreso */}
                    <div className="w-full space-y-3">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5 cursor-pointer">
                            <div
                                className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all ease-linear"
                                style={{ width: `${progressWidth}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-gray-400 font-bold">
                            <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                            <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>

                    {/* Mandos de Reproducción */}
                    <div className="flex items-center justify-around">
                        <button className="text-white/20 hover:text-emerald-500 active:scale-75 transition-all"><SkipBack size={32} /></button>
                        <button
                            onClick={togglePlaying}
                            className="w-20 h-20 bg-emerald-500 text-black rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] active:scale-95 transition-all hover:scale-105"
                        >
                            {isPlaying ? <Pause size={38} fill="black" /> : <Play size={38} fill="black" className="ml-1" />}
                        </button>
                        <button className="text-white/20 hover:text-emerald-500 active:scale-75 transition-all"><SkipForward size={32} /></button>
                    </div>
                </div>

                {/* Acciones de Bóveda */}
                <div className="grid grid-cols-4 gap-4 pb-8 border-t border-emerald-500/10 pt-8">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading || isOfflineMode}
                        className={`flex flex-col items-center gap-2 group ${(isDownloading || isOfflineMode) ? 'opacity-20' : ''}`}
                    >
                        <div className={`p-4 rounded-[1.5rem] transition-all active:scale-90 flex items-center justify-center ${isDownloading || isOfflineMode ? 'bg-emerald-500 text-black' : 'bg-emerald-950/20 border border-emerald-500/10 group-hover:bg-emerald-500/20'}`}>
                            {isDownloading ? <Loader2 size={22} className="animate-spin text-black" /> : <Download size={22} />}
                        </div>
                        <span className="text-[7px] font-black uppercase text-emerald-900 tracking-widest">Cosechar</span>
                    </button>
                    <div className="flex flex-col items-center gap-2 opacity-30"><div className="p-4 bg-white/5 border border-white/5 rounded-[1.5rem]"><Share size={22} /></div><span className="text-[7px] font-black uppercase text-gray-500 tracking-widest">Link</span></div>
                    <div className="flex flex-col items-center gap-2 opacity-30"><div className="p-4 bg-white/5 border border-white/5 rounded-[1.5rem]"><Maximize2 size={22} /></div><span className="text-[7px] font-black uppercase text-gray-500 tracking-widest">Visuals</span></div>
                    <div className="flex flex-col items-center gap-2"><div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"><Music size={22} /></div><span className="text-[7px] font-black uppercase text-emerald-500 tracking-widest">Master</span></div>
                </div>
            </div>
        </div>
    );
};

export default FloatingPlayer;
