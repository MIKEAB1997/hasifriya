
import React from 'react';
import { Presentation } from '../types';

interface PresentationCardProps {
  presentation: Presentation;
  onClick: (p: Presentation) => void;
}

const PresentationCard: React.FC<PresentationCardProps> = ({ presentation, onClick }) => {
  return (
    <div 
      className="flex-none w-44 md:w-56 group cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => onClick(presentation)}
    >
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface mb-2 shadow-lg">
        <img 
          src={presentation.thumbnailUrl} 
          alt={presentation.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
        />
        {presentation.isNew && (
          <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
            חדש
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
          <span className="text-white text-xs font-bold">צפה עכשיו</span>
        </div>
      </div>
      <h3 className="text-white text-sm font-semibold truncate leading-tight mb-1">
        {presentation.title}
      </h3>
      <p className="text-gray-400 text-[11px] truncate">
        {presentation.category}
      </p>
    </div>
  );
};

export default PresentationCard;
