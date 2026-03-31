
import React, { useRef } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar pb-1"
    >
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex-none px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap border ${
            selected === cat
              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
