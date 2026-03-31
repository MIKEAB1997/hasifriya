
import React from 'react';
import { FileText, User, Calendar, BrainCircuit, Layers } from 'lucide-react';
import { Presentation } from '../types';

interface PresentationCardProps {
  presentation: Presentation;
  onClick: (p: Presentation) => void;
}

const PresentationCard: React.FC<PresentationCardProps> = ({ presentation, onClick }) => {
  const hasQuiz = presentation.quiz && presentation.quiz.length > 0;
  const hasSlides = presentation.slides && presentation.slides.length > 0;
  const slideCount = hasSlides ? presentation.slides!.length : null;

  return (
    <div
      className="group flex flex-col bg-surface border border-gray-200 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-gray-200/80"
      onClick={() => onClick(presentation)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-surface-light">
        <img
          src={presentation.thumbnailUrl}
          alt={presentation.title}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 text-xs font-bold bg-black/55 text-white border border-white/20 rounded-full backdrop-blur-md">
            {presentation.category}
          </span>
        </div>

        {/* NEW badge */}
        {presentation.isNew && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-black bg-primary text-white rounded-full uppercase tracking-wider shadow-lg shadow-primary/30">
              חדש
            </span>
          </div>
        )}

        {/* Hover play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-primary/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Slide count */}
        {slideCount && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
            <Layers className="w-3 h-3 text-gray-200" />
            <span className="text-xs font-bold text-gray-200">{slideCount} שקפים</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
          {presentation.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-grow mb-4">
          {presentation.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            {presentation.author ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span>{presentation.author}</span>
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(presentation.addedAt).toLocaleDateString('he-IL')}</span>
              </>
            )}
          </div>
          {hasQuiz && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>תרגול</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationCard;
