import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  UserCheck,
} from 'lucide-react';
import { CYBER_CASES, CyberCase } from '../portalData';

const SEVERITY_CONFIG = {
  critical: {
    label: 'קריטי',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border border-red-200',
    line: 'bg-red-500',
    Icon: AlertTriangle,
  },
  high: {
    label: 'גבוה',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    line: 'bg-amber-500',
    Icon: AlertCircle,
  },
  medium: {
    label: 'בינוני',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    line: 'bg-blue-500',
    Icon: AlertCircle,
  },
};

const CaseCard: React.FC<{ caseItem: CyberCase; isLast: boolean }> = ({ caseItem, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[caseItem.severity];
  const { Icon } = sev;

  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md flex-shrink-0 mt-5 ${sev.dot}`} />
        {!isLast && <div className="w-0.5 bg-gray-200 flex-grow mt-2" />}
      </div>

      <div className="flex-grow mb-8 bg-surface border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className={`h-1 w-full ${sev.line}`} />

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <span className="text-xs font-black text-gray-400 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
              {caseItem.year}
            </span>
            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${sev.badge}`}>
              <Icon className="w-3 h-3" />
              {sev.label}
            </span>
            <span className="text-xs font-bold text-primary bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">
              {caseItem.category}
            </span>
          </div>

          <h3 className="text-gray-900 font-black text-lg sm:text-xl mb-2 leading-snug">
            {caseItem.title}
          </h3>

          {caseItem.hook && (
            <p className="text-primary font-bold text-sm mb-2 italic">"{caseItem.hook}"</p>
          )}

          <p className="text-gray-600 text-sm leading-relaxed">{caseItem.summary}</p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-primary text-xs font-bold mt-3 hover:underline"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                פחות פרטים
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                עוד פרטים
              </>
            )}
          </button>

          {expanded && (
            <div className="mt-4 space-y-3 animate-fade-in">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-1.5">השפעה</p>
                <p className="text-red-800 text-sm leading-relaxed">{caseItem.impact}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  לקח כללי
                </p>
                <p className="text-blue-800 text-sm leading-relaxed">{caseItem.lesson}</p>
              </div>
              {caseItem.employeeLesson && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-black text-green-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    מה אני עושה אחרת מחר?
                  </p>
                  <p className="text-green-800 text-sm leading-relaxed font-medium">{caseItem.employeeLesson}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {caseItem.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CyberCasesProps {
  modal?: boolean;
  cases?: CyberCase[];
  title?: string;
  subtitle?: string;
}

const CyberCases: React.FC<CyberCasesProps> = ({
  modal,
  cases = CYBER_CASES,
  title,
  subtitle,
}) => {
  const content = (
    <div className={modal ? 'p-6 sm:p-8' : 'max-w-4xl mx-auto px-4 sm:px-6'}>
      {!modal && (
        <div className="text-center mb-12">
          <span className="inline-block text-primary text-xs font-black uppercase tracking-widest mb-2 bg-primary/8 px-3 py-1 rounded-full border border-primary/15">
            מה קורה עכשיו
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
            {title || 'פרשיות עדכניות ולקחים מהשטח'}
          </h2>
          <p className="text-gray-500 mt-3 text-lg font-medium max-w-xl mx-auto">
            {subtitle ||
              'מתחילים מהאירועים החדשים ביותר, ואז יורדים לארכיון של מקרים מפורסמים שבנו את עולם האבטחה'}
          </p>
        </div>
      )}
      <div className="relative">
        {cases.length > 0 ? (
          cases.map((caseItem, idx) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} isLast={idx === cases.length - 1} />
          ))
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-gray-300 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-2">לא נמצאו פרשיות</h3>
            <p className="text-gray-500 font-medium">נסו לחפש במונח אחר או לנקות את הסינון הפעיל.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (modal) return content;

  return (
    <section id="cases" className="scroll-mt-20 py-14 sm:py-20 bg-background">
      {content}
    </section>
  );
};

export default CyberCases;
