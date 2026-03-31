import React from 'react';
import { BookOpen, BrainCircuit, ChevronLeft, Smartphone } from 'lucide-react';

type SupportAction = 'glossary' | 'hardening' | 'scenarios';

interface SupportCard {
  id: SupportAction;
  label: string;
  title: string;
  description: string;
  accent: string;
  glow: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface SupportShelfProps {
  onOpen: (action: SupportAction) => void;
}

const SUPPORT_CARDS: SupportCard[] = [
  {
    id: 'glossary',
    label: 'מושגי יסוד',
    title: 'מילון מושגים',
    description: 'מקום אחד למונחים, קיצורים והגדרות שמסבירים מהר מה עומד מאחורי התוכן.',
    accent: 'from-sky-400/30 via-blue-500/10 to-transparent',
    glow: 'border-sky-300/15 bg-sky-500/8',
    Icon: BookOpen,
  },
  {
    id: 'hardening',
    label: 'צ׳ק ליסט',
    title: 'הקשחת מובייל',
    description: 'מדריך קצר ופרקטי לאבטחת הטלפון, רשתות פתוחות, נסיעות והרשאות אפליקציה.',
    accent: 'from-emerald-400/25 via-emerald-500/10 to-transparent',
    glow: 'border-emerald-300/15 bg-emerald-500/8',
    Icon: Smartphone,
  },
  {
    id: 'scenarios',
    label: 'תרגול',
    title: 'סימולציות מהירות',
    description: 'תרחישי אמת קצרים שמאפשרים לבדוק תגובה, לזהות דגלים אדומים ולהתאמן.',
    accent: 'from-violet-400/28 via-violet-500/10 to-transparent',
    glow: 'border-violet-300/15 bg-violet-500/8',
    Icon: BrainCircuit,
  },
];

const SupportShelf: React.FC<SupportShelfProps> = ({ onOpen }) => {
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black tracking-[0.24em] text-white/65">
          CONTENT SUPPORT
        </span>
        <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">מדף עזר ולא עולם נוסף</h3>
        <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
          כאן שמים תכנים משלימים כמו מילון, הקשחת מובייל ותרגול. הם חשובים, אבל לא תופסים מקום של עולם ראשי
          בתוך הספרייה.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {SUPPORT_CARDS.map(card => {
          const { Icon } = card;

          return (
            <button
              key={card.id}
              onClick={() => onOpen(card.id)}
              className={`group relative overflow-hidden rounded-[1.85rem] border p-5 text-right transition-all hover:-translate-y-1 ${card.glow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%)]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-black text-white/75">
                      {card.label}
                    </span>
                    <h4 className="mt-4 text-xl font-black text-white">{card.title}</h4>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-white/80">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 min-h-[84px] text-sm leading-7 text-white/72">{card.description}</p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white">
                  פתחו את התוכן
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SupportShelf;
