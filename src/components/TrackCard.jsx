import React from 'react';
import { Play, TrendingUp, Music, Clock } from 'lucide-react';

/**
 * 🎴 TrackCard - Tarjeta Premium v4.1.0
 * 
 * Normalizada para el Motor Soberano.
 */
const TrackCard = ({ track, onPlay }) => {
    return (
        <div
            onClick={onPlay}
            className="group relative bg-white/5 border border-white/5 rounded-3xl overflow-hidden active:scale-95 transition-all cursor-pointer hover:bg-white/10 hover:border-emerald-500/20 hover:shadow-2xl shadow-black/80 ring-1 ring-white/5"
        >
            {/* THUMBNAIL */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={track.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="thumbnail"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-emerald-500 p-4 rounded-full shadow-lg shadow-emerald-500/30 text-black">
                        <Play size={28} fill="black" className="ml-1" />
                    </div>
                </div>

                {/* DURACION (Si existe en metadata) */}
                {track.duration > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1 border border-white/10">
                        <Clock size={12} className="text-emerald-500" />
                        {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                )}
            </div>

            {/* METADATA */}
            <div className="p-4">
                <h3 className="text-sm font-bold text-white leading-tight mb-1 truncate uppercase tracking-tighter w-full">{track.title}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/40 font-black uppercase truncate tracking-widest">{track.uploader}</p>
                    <div className="flex items-center gap-1 text-emerald-500/50">
                        <Music size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Premium</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackCard;
