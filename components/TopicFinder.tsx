import React from 'react';
import { ArrowUpLeft, Search, Sparkles } from 'lucide-react';
import { SearchTopicShortcut } from '../portalData';

type FinderTopic = SearchTopicShortcut & {
  presentationCount: number;
  articleCount: number;
  caseCount: number;
  isActive: boolean;
};

interface TopicFinderProps {
  topics: FinderTopic[];
  onSelectTopic: (topic: SearchTopicShortcut) => void;
  onClear: () => void;
  hasActiveSearch: boolean;
}

const TONE_STYLES = {
  sky: 'from-sky-500/15 to-white border-sky-100 hover:border-sky-200',
  amber: 'from-amber-500/15 to-white border-amber-100 hover:border-amber-200',
  rose: 'from-rose-500/15 to-white border-rose-100 hover:border-rose-200',
  emerald: 'from-emerald-500/15 to-white border-emerald-100 hover:border-emerald-200',
  indigo: 'from-indigo-500/15 to-white border-indigo-100 hover:border-indigo-200',
} as const;

const TopicFinder: React.FC<TopicFinderProps> = ({
  topics,
  onSelectTopic,
  onClear,
  hasActiveSearch,
}) => {
  return (
    <section className="py-10 sm:py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-7">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-3 bg-primary/8 px-3 py-1 rounded-full border border-primary/15">
              <Sparkles className="w-3.5 h-3.5" />
              מצא לפי נושא
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              כניסה מהירה לתכנים שחוזרים הכי הרבה
            </h2>
            <p className="text-gray-500 mt-2 text-base font-medium leading-relaxed">
              גם אם מחפשים "דיוג", "פישינג", "הנדסה חברית" או "Deepfake", המאגרון ינתב אתכם
              לאותם חומרים רלוונטיים.
            </p>
          </div>

          {hasActiveSearch && (
            <button
              onClick={onClear}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all font-bold"
            >
              <Search className="w-4 h-4" />
              נקה חיפוש וסינון
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className={`text-right rounded-[1.75rem] border bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${TONE_STYLES[topic.tone]} ${
                topic.isActive ? 'ring-2 ring-primary/20 shadow-lg' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-white/80 border border-white text-xs font-black text-gray-600">
                    {topic.label}
                  </span>
                  <h3 className="text-lg font-black text-gray-900 mt-3">{topic.description}</h3>
                </div>
                <ArrowUpLeft className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {topic.aliases.slice(0, 3).map(alias => (
                  <span
                    key={alias}
                    className="px-2.5 py-1 rounded-full bg-white/90 border border-gray-200 text-xs font-bold text-gray-500"
                  >
                    {alias}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white border border-gray-200 px-3 py-2 text-center">
                  <div className="text-lg font-black text-gray-900">{topic.presentationCount}</div>
                  <div className="text-[11px] font-bold text-gray-500">חומרים</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-200 px-3 py-2 text-center">
                  <div className="text-lg font-black text-gray-900">{topic.articleCount}</div>
                  <div className="text-[11px] font-bold text-gray-500">עדכונים</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-200 px-3 py-2 text-center">
                  <div className="text-lg font-black text-gray-900">{topic.caseCount}</div>
                  <div className="text-[11px] font-bold text-gray-500">פרשיות</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicFinder;
