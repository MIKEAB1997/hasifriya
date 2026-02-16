
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
    <section className="mb-8">
      <h2 className="text-white text-lg font-bold mb-4 px-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-2">
        {presentations.map((p) => (
          <PresentationCard key={p.id} presentation={p} onClick={onSelect} />
        ))}
      </div>
    </section>
  );
};

export default PresentationRow;
