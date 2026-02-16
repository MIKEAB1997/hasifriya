
import React from 'react';
import { Presentation } from '../types';

interface PresentationCardProps {
  presentation: Presentation;
  onClick: (p: Presentation) => void;
}

const PresentationCard: React.FC<PresentationCardProps> = ({ presentation, onClick }) => {
  return (
    <div
      className="flex-none w-48 md:w-60 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      onClick={() => onClick(presentation)}
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface mb-3 shadow-lg border border-white/5 group-hover:border-primary/30 transition-all">
        <img
          src={presentation.thumbnailUrl}
          alt={presentation.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        {presentation.isNew && (
          <div className="absolute top-2.5 right-2.5 bg-primary text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg shadow-lg shadow-primary/30 uppercase tracking-wider">
            חדש
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
          <div className="flex items-center gap-1.5 text-white text-xs font-bold">
            <span className="material-icons text-sm">play_circle</span>
            צפייה
          </div>
        </div>
      </div>
      <h3 className="text-white text-sm font-bold truncate leading-tight mb-1">
        {presentation.title}
      </h3>
      <p className="text-gray-500 text-xs truncate">
        {presentation.category}
      </p>
    </div>
  );
};

export default PresentationCard;
