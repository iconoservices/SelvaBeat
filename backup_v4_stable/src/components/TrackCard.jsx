import React from 'react';
import { Play, TrendingUp, Music, Clock } from 'lucide-react';

/**
 * TrackCard - Tarjeta Premium de Video (Paso 10)
 * 
 * Basada en el UX de YT Premium, con hover effects y truncamiento
 * agresivo de títulos largos.
 */
const TrackCard = ({ track, onClick }) => {
    // Piped formats: track.title, track.uploaderName, track.thumbnail, track.duration
    return (
        <div
            onClick={onClick}
            className="group relative bg-surface/50 border border-white/5 rounded-3xl overflow-hidden active:scale-95 transition-all cursor-pointer hover:bg-surface/80 hover:border-primary/20 hover:shadow-2xl shadow-black/80 ring-1 ring-white/5"
        >
            {/* THUMBNAIL */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={track.thumbnail || track.thumbnailUrl}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="thumb"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary p-4 rounded-full shadow-lg shadow-primary/30 text-white">
                        <Play size={28} fill="white" className="ml-1" />
                    </div>
                </div>

                {/* DURACION (Piped duration y views) */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1 border border-white/10">
                    <Clock size={12} className="text-primary" /> {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                </div>
            </div>

            {/* METADATA */}
            <div className="p-4">
                <h3 className="text-sm font-bold text-white leading-tight mb-1 truncate uppercase tracking-tighter w-full">{track.title}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-500 font-mono font-black uppercase truncate tracking-widest">{track.uploaderName || track.uploader}</p>
                    {track.isTrending && (
                        <TrendingUp size={12} className="text-primary" />
                    )}
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1 text-primary">
                        <Music size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Hi-Fi</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <span className="text-[10px] font-mono uppercase tracking-tighter">{(track.views / 1000000).toFixed(1)}M Views</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackCard;
