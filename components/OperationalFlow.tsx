import React from 'react';
import { Database, FolderTree, Newspaper, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: FolderTree,
    title: 'Drive הוא מקור האמת',
    body: 'כל תיקייה ראשית הופכת לנושא, וכל קובץ נכנס אוטומטית למצגות, מדיה או תמונות.',
  },
  {
    icon: Sparkles,
    title: 'האתר משייך לבד',
    body: 'הנושא מאחד באותו מסך את כל סוגי התוכן: חומרים, כתבות, אירועי אמת וסרטונים.',
  },
  {
    icon: Newspaper,
    title: 'כתבות ואירועים מתווספים לפי נושא',
    body: 'עדכוני רשת נמשכים לפי תחומי מעקב, ואירועי אמת נשמרים כמאגר לקחים מסודר.',
  },
  {
    icon: Database,
    title: 'השלב הבא הוא מנוע משותף',
    body: 'כדי שהכול יתעדכן לכולם ולא רק בדפדפן מקומי, נחבר את ניהול התוכן למסד משותף.',
  },
];

const OperationalFlow: React.FC = () => {
  return (
    <section className="border-y border-slate-200 bg-slate-50/80 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
              איך המאגרון עובד
            </span>
            <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
              זרימת תוכן קצרה, ברורה ומתאימה למובייל
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
              המטרה היא לא להעמיס את דף הבית, אלא לבנות ציר פשוט: מקור תוכן, שיוך אוטומטי, דפי נושא ברורים ועדכון שוטף.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">
            כרגע: Drive + עדכוני רשת
            <span className="mx-2 text-slate-300">|</span>
            בהמשך: מסד תוכן משותף
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map(step => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950 sm:text-base">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{step.body}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OperationalFlow;
