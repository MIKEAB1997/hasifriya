
import React from 'react';
import { Presentation } from '../types';
import PresentationCard from './PresentationCard';

interface PresentationRowProps {
  title: string;
  presentations: Presentation[];
  onSelect: (p: Presentation) => void;
}

const PresentationRow: React.FC<PresentationRowProps> = ({ title, presentations, onSelect }) => {
  if (presentations.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5 px-6">
        <h2 className="text-white text-lg font-extrabold">{title}</h2>
        <span className="text-gray-600 text-xs font-bold bg-white/5 px-2.5 py-1 rounded-lg">{presentations.length}</span>
      </div>
      <div className="flex gap-5 overflow-x-auto hide-scrollbar px-6 pb-2">
        {presentations.map((p) => (
          <PresentationCard key={p.id} presentation={p} onClick={onSelect} />
        ))}
      </div>
    </section>
  );
};

export default PresentationRow;
