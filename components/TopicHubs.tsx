import React from 'react';
import {
  ArrowUpLeft,
  BookOpen,
  ExternalLink,
  Radar,
  ShieldCheck,
  Siren,
} from 'lucide-react';
import { CYBER_CASES, TOPIC_HUBS, TopicHub } from '../portalData';
import { KnowledgeArticle, Presentation } from '../types';

interface TopicHubsProps {
  articles: KnowledgeArticle[];
  presentations: Presentation[];
  onOpenPresentation: (presentation: Presentation) => void;
  onExploreCategory: (category: string) => void;
}

const TONE_STYLES = {
  sky: {
    shell: 'from-sky-500/15 via-white to-white',
    badge: 'bg-sky-50 text-sky-700 border-sky-100',
    accent: 'text-sky-700',
    subtle: 'bg-sky-50 border-sky-100',
    button: 'bg-sky-600 hover:bg-sky-700 text-white',
  },
  amber: {
    shell: 'from-amber-500/15 via-white to-white',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    accent: 'text-amber-700',
    subtle: 'bg-amber-50 border-amber-100',
    button: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  rose: {
    shell: 'from-rose-500/15 via-white to-white',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
    accent: 'text-rose-700',
    subtle: 'bg-rose-50 border-rose-100',
    button: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  emerald: {
    shell: 'from-emerald-500/15 via-white to-white',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    accent: 'text-emerald-700',
    subtle: 'bg-emerald-50 border-emerald-100',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  indigo: {
    shell: 'from-indigo-500/15 via-white to-white',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    accent: 'text-indigo-700',
    subtle: 'bg-indigo-50 border-indigo-100',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
} as const;

const normalize = (value: string) => value.toLowerCase();

const matchesAny = (value: string, keywords: string[]) => {
  const normalized = normalize(value);
  return keywords.some(keyword => normalized.includes(normalize(keyword)));
};

const getRelatedArticles = (hub: TopicHub, articles: KnowledgeArticle[]) =>
  articles
    .filter(article => {
      const haystack = `${article.title} ${article.summary} ${article.topicLabel} ${article.category}`;
      return hub.topicIds.includes(article.topicId) || matchesAny(haystack, hub.keywords);
    })
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, 2);

const getRelatedPresentations = (hub: TopicHub, presentations: Presentation[]) =>
  presentations
    .filter(presentation => {
      const haystack = `${presentation.title} ${presentation.description} ${presentation.category}`;
      return hub.categories.includes(presentation.category) || matchesAny(haystack, hub.keywords);
    })
    .sort((left, right) => {
      if (left.isNew && !right.isNew) return -1;
      if (!left.isNew && right.isNew) return 1;
      return new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime();
    })
    .slice(0, 3);

const getRelatedCases = (hub: TopicHub) => {
  const featured = CYBER_CASES.filter(caseItem => hub.featuredCaseIds.includes(caseItem.id));
  const additional = CYBER_CASES.filter(caseItem => {
    if (hub.featuredCaseIds.includes(caseItem.id)) return false;
    const haystack = `${caseItem.title} ${caseItem.summary} ${caseItem.category} ${caseItem.tags.join(' ')}`;
    return matchesAny(haystack, hub.keywords);
  });

  return [...featured, ...additional].slice(0, 2);
};

const TopicHubs: React.FC<TopicHubsProps> = ({
  articles,
  presentations,
  onOpenPresentation,
  onExploreCategory,
}) => {
  return (
    <section id="topics" className="scroll-mt-20 py-14 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 text-slate-700 text-xs font-black uppercase tracking-widest mb-3 bg-white px-3 py-1 rounded-full border border-slate-200">
            <Radar className="w-3.5 h-3.5" />
            מרכזי נושא
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            דפי נושא שמרכזים בשבילך את מה שצריך עכשיו
          </h2>
          <p className="text-slate-600 mt-3 text-lg font-medium leading-relaxed">
            כל מרכז נושא מחבר בין חומרי המאגרון, העדכונים החיים והפרשיות העדכניות, כדי שלא תצטרכו
            לרדוף אחרי המידע בין כמה מקומות.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {TOPIC_HUBS.map(hub => {
            const styles = TONE_STYLES[hub.tone];
            const relatedArticles = getRelatedArticles(hub, articles);
            const relatedPresentations = getRelatedPresentations(hub, presentations);
            const relatedCases = getRelatedCases(hub);
            const exploreCategory =
              relatedPresentations[0]?.category || hub.categories.find(Boolean) || 'הכל';

            return (
              <article
                key={hub.id}
                className={`rounded-[2rem] border border-slate-200 bg-gradient-to-br ${styles.shell} p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-black ${styles.badge}`}
                    >
                      {hub.label}
                    </span>
                    <h3 className="text-2xl font-black text-slate-950 mt-4 leading-tight">
                      {hub.title}
                    </h3>
                  </div>
                  <div className={`rounded-2xl border px-4 py-3 text-right ${styles.subtle}`}>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">
                      פוקוס
                    </p>
                    <p className={`text-sm font-bold leading-snug ${styles.accent}`}>{hub.focus}</p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                  {hub.description}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="rounded-2xl bg-white border border-slate-200 p-3 text-center">
                    <p className="text-2xl font-black text-slate-950">{relatedArticles.length}</p>
                    <p className="text-xs font-bold text-slate-500">עדכונים</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-slate-200 p-3 text-center">
                    <p className="text-2xl font-black text-slate-950">{relatedPresentations.length}</p>
                    <p className="text-xs font-bold text-slate-500">חומרים</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-slate-200 p-3 text-center">
                    <p className="text-2xl font-black text-slate-950">{relatedCases.length}</p>
                    <p className="text-xs font-bold text-slate-500">פרשיות</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className={`w-4 h-4 ${styles.accent}`} />
                        <h4 className="text-sm font-black text-slate-900">פעולות השבוע</h4>
                      </div>
                      <div className="space-y-2">
                        {hub.priorityActions.map(action => (
                          <div
                            key={action}
                            className="rounded-2xl bg-white/80 border border-slate-200 px-4 py-3 text-sm text-slate-700 font-medium"
                          >
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Siren className={`w-4 h-4 ${styles.accent}`} />
                        <h4 className="text-sm font-black text-slate-900">איתותים שכדאי לשים לב אליהם</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hub.watchSignals.map(signal => (
                          <span
                            key={signal}
                            className="px-3 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600"
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ExternalLink className={`w-4 h-4 ${styles.accent}`} />
                        <h4 className="text-sm font-black text-slate-900">מה חדש עכשיו</h4>
                      </div>
                      <div className="space-y-2">
                        {relatedArticles.length > 0 ? (
                          relatedArticles.map(article => (
                            <a
                              key={article.id}
                              href={article.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-2xl bg-white border border-slate-200 px-4 py-3 hover:border-slate-300 hover:-translate-y-0.5 transition-all"
                            >
                              <p className="text-xs font-black text-slate-400 mb-1">
                                {article.topicLabel} · {article.source}
                              </p>
                              <p className="text-sm font-bold text-slate-900 leading-snug">
                                {article.title}
                              </p>
                            </a>
                          ))
                        ) : (
                          <div className="rounded-2xl bg-white border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500 font-medium">
                            ברגע שיגיעו עדכונים חדשים בנושא הזה, הם יופיעו כאן אוטומטית.
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className={`w-4 h-4 ${styles.accent}`} />
                        <h4 className="text-sm font-black text-slate-900">חומרים מתוך המאגרון</h4>
                      </div>
                      <div className="space-y-2">
                        {relatedPresentations.length > 0 ? (
                          relatedPresentations.map(presentation => (
                            <button
                              key={presentation.id}
                              onClick={() => onOpenPresentation(presentation)}
                              className="w-full text-right rounded-2xl bg-white border border-slate-200 px-4 py-3 hover:border-slate-300 hover:-translate-y-0.5 transition-all"
                            >
                              <p className="text-xs font-black text-slate-400 mb-1">
                                {presentation.category}
                              </p>
                              <p className="text-sm font-bold text-slate-900 leading-snug">
                                {presentation.title}
                              </p>
                            </button>
                          ))
                        ) : (
                          <div className="rounded-2xl bg-white border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500 font-medium">
                            עדיין אין חומר מסומן בנושא הזה, אבל אפשר להוסיף אותו דרך Google Drive או פאנל הניהול.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {relatedCases[0] && (
                  <div className="mt-5 rounded-[1.5rem] bg-slate-950 text-white p-5">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      פרשה לשים עליה עין
                    </p>
                    <h4 className="text-lg font-black leading-snug mb-2">{relatedCases[0].title}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">{relatedCases[0].hook}</p>
                    <button
                      onClick={() =>
                        document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })
                      }
                      className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white"
                    >
                      עבור לפרשיות
                      <ArrowUpLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => onExploreCategory(exploreCategory)}
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all ${styles.button}`}
                  >
                    פתח חומרים בנושא
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById('updates')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    עבור לעדכונים החיים
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopicHubs;
