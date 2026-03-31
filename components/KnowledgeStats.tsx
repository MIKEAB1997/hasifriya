
import React from 'react';
import { PORTAL_STATS } from '../portalData';

// Compact horizontal-scroll stats strip — placed right under the hero
const KnowledgeStats: React.FC = () => {
  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-4 divide-x divide-slate-800 rtl:divide-x-reverse">
          {PORTAL_STATS.map((stat, idx) => (
            <div key={idx} className="flex-none sm:flex-1 py-5 px-6 sm:px-8 text-center">
              <div className={`text-2xl sm:text-3xl font-black mb-0.5 ${stat.color}`}>{stat.value}</div>
              <div className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">{stat.label}</div>
              <div className="text-slate-500 text-[11px] font-medium whitespace-nowrap mt-0.5">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeStats;
