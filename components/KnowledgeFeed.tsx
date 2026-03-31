import React from 'react';
import { ExternalLink, Globe2, RefreshCw, Rss } from 'lucide-react';
import { KnowledgeArticle, KnowledgeTopic } from '../types';

interface KnowledgeFeedProps {
  articles: KnowledgeArticle[];
  topics: KnowledgeTopic[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const KnowledgeFeed: React.FC<KnowledgeFeedProps> = ({
  articles,
  topics,
  loading,
  error,
  onRefresh,
}) => {
  return (
    <section id="updates" className="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-sky-700 text-xs font-black uppercase tracking-widest mb-3 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              <Rss className="w-3.5 h-3.5" />
              מה חדש עכשיו
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">עדכונים חיים במאגרון</h2>
            <p className="text-gray-500 mt-2 text-base font-medium">
              תכנים שמתעדכנים מהאינטרנט לפי תחומי המעקב שהוגדרו במערכת, כדי שהמאגרון יישאר חי ורלוונטי
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-sky-200 text-sky-700 hover:bg-sky-50 transition-all font-bold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            רענון עדכונים
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-7">
          {topics.map(topic => (
            <span
              key={topic.id}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold"
            >
              <Globe2 className="w-3.5 h-3.5 text-sky-600" />
              {topic.label}
            </span>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 font-medium">
            {error}
          </div>
        )}

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {articles.map(article => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="group block bg-slate-950 text-white rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-sky-200">
                    {article.topicLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-300">{formatDate(article.publishedAt)}</span>
                </div>

                <h3 className="text-xl font-black leading-snug mb-3 group-hover:text-sky-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm mb-5">{article.summary}</p>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="font-bold text-white">{article.source}</p>
                    <p className="text-slate-400">{article.category}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sky-300 font-bold">
                    מקור מלא
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-gray-300 bg-gray-50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <Rss className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">אין עדיין עדכונים להצגה</h3>
            <p className="text-gray-500 font-medium">
              אפשר להגדיר תחומי מעקב חדשים דרך פאנל הניהול ולרענן את המקורות.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default KnowledgeFeed;
