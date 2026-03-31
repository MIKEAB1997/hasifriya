
import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen } from 'lucide-react';

interface Term {
  term: string;
  definition: string;
  category: string;
}

const GLOSSARY_TERMS: Term[] = [
  // סייבר התקפי
  { term: 'APT – Advanced Persistent Threat', definition: 'איום מתקדם ומתמשך – מתקפת סייבר ממוקדת וארוכת טווח, לרוב בחסות מדינה, שמטרתה חדירה עמוקה לארגון לצורך ריגול או חבלה.', category: 'סייבר התקפי' },
  { term: 'Zero-Day', definition: 'פגיעות אבטחה שלא הייתה ידועה ליצרן התוכנה, ולכן אין לה עדכון תיקון. מהווה את אחד האיומים המסוכנים ביותר.', category: 'סייבר התקפי' },
  { term: 'Ransomware', definition: 'תוכנה זדונית שמצפינה קבצים במחשב הקורבן ודורשת כופר (לרוב בקריפטו) תמורת מפתח הפענוח.', category: 'סייבר התקפי' },
  { term: 'Phishing', definition: 'מתקפת הנדסה חברתית שבה התוקף מתחזה לגורם לגיטימי (בנק, חברה) כדי לגנוב פרטי כניסה או מידע רגיש.', category: 'סייבר התקפי' },
  { term: 'Supply Chain Attack', definition: 'מתקפה שמנצלת חולשות בשרשרת האספקה של תוכנה או חומרה כדי לחדור לארגון דרך ספק צד שלישי.', category: 'סייבר התקפי' },
  { term: 'DDoS – Distributed Denial of Service', definition: 'מתקפת מניעת שירות מבוזרת – הצפת שרת או שירות בתעבורה מאסיבית ממקורות רבים כדי להשבית אותו.', category: 'סייבר התקפי' },
  { term: 'Social Engineering', definition: 'הנדסה חברתית – מניפולציה פסיכולוגית של אנשים לביצוע פעולות או חשיפת מידע חסוי, ללא שימוש בכלים טכניים.', category: 'סייבר התקפי' },
  { term: 'Malware', definition: 'תוכנה זדונית – כינוי כולל לוירוסים, סוסים טרויאניים, תולעים, ריגול ותוכנות כופר.', category: 'סייבר התקפי' },

  // הגנת סייבר
  { term: 'SOC – Security Operations Center', definition: 'מרכז תפעול אבטחה – צוות שמנטר ומגיב לאירועי אבטחה בזמן אמת, 24/7.', category: 'הגנת סייבר' },
  { term: 'SIEM', definition: 'Security Information and Event Management – מערכת שאוספת, מנתחת ומתריעה על אירועי אבטחה מכל הארגון בזמן אמת.', category: 'הגנת סייבר' },
  { term: 'EDR – Endpoint Detection & Response', definition: 'פתרון אבטחה שמנטר תחנות קצה (מחשבים, מובייל) ומזהה פעילות חשודה בזמן אמת.', category: 'הגנת סייבר' },
  { term: 'Zero Trust', definition: 'גישת אבטחה שמניחה שאף משתמש או מכשיר אינו מהימן כברירת מחדל, גם אם נמצא בתוך הרשת הארגונית.', category: 'הגנת סייבר' },
  { term: 'MFA – Multi-Factor Authentication', definition: 'אימות רב-גורמי – דרישה לשני אמצעי זיהוי או יותר (סיסמה + SMS + ביומטרי) לצורך כניסה למערכת.', category: 'הגנת סייבר' },
  { term: 'Firewall', definition: 'חומת אש – מערכת שמסננת תעבורת רשת נכנסת ויוצאת לפי כללים מוגדרים מראש.', category: 'הגנת סייבר' },
  { term: 'Encryption', definition: 'הצפנה – תהליך המרת מידע לקוד בלתי קריא, כך שרק בעלי המפתח המתאים יכולים לפענח אותו.', category: 'הגנת סייבר' },
  { term: 'Penetration Testing', definition: 'מבדק חדירה – סימולציה מבוקרת של מתקפת סייבר על ארגון כדי לאתר חולשות לפני שתוקפים אמיתיים ימצאו אותן.', category: 'הגנת סייבר' },
  { term: 'IAM – Identity & Access Management', definition: 'ניהול זהויות והרשאות – מערכת שמנהלת מי יכול לגשת למה בארגון, כולל הקצאה וביטול הרשאות.', category: 'הגנת סייבר' },

  // בינה מלאכותית ו-AI
  { term: 'Shadow AI', definition: 'שימוש בכלי AI על ידי עובדים ללא ידיעה או אישור של הארגון, מה שיוצר סיכוני אבטחה ותאימות.', category: 'AI ואבטחה' },
  { term: 'Deepfake', definition: 'תוכן מדיה מזויף (וידאו, אודיו, תמונות) שנוצר באמצעות AI ונראה אותנטי לחלוטין.', category: 'AI ואבטחה' },
  { term: 'AI Red Teaming', definition: 'בדיקת עמידות מערכות AI מפני מניפולציות, הטיות ושימוש לרעה באמצעות סימולציות מתקפה.', category: 'AI ואבטחה' },
  { term: 'LLM – Large Language Model', definition: 'מודל שפה גדול – מערכת AI שאומנה על כמויות טקסט עצומות ומסוגלת להבין ולייצר שפה טבעית.', category: 'AI ואבטחה' },
  { term: 'Prompt Injection', definition: 'מתקפה על מערכות AI שבה תוקף מזריק הוראות זדוניות דרך הקלט כדי לגרום למודל לפעול בניגוד להוראותיו.', category: 'AI ואבטחה' },

  // ציות ורגולציה
  { term: 'GDPR', definition: 'תקנת הגנת המידע הכללית של האיחוד האירופי – חוק שמסדיר איסוף, עיבוד ושמירה של מידע אישי.', category: 'ציות ורגולציה' },
  { term: 'ISO 27001', definition: 'תקן בינלאומי לניהול אבטחת מידע – מסגרת שיטתית לניהול סיכוני אבטחה בארגון.', category: 'ציות ורגולציה' },
  { term: 'Incident Response', definition: 'תגובה לאירוע – תהליך מובנה לזיהוי, הכלה, חקירה והתאוששות מאירוע סייבר.', category: 'ציות ורגולציה' },
  { term: 'Data Breach', definition: 'פריצת מידע – אירוע שבו מידע רגיש נחשף, נגנב או נפרץ ללא הרשאה.', category: 'ציות ורגולציה' },
];

const CATEGORIES = [...new Set(GLOSSARY_TERMS.map(t => t.category))];

interface GlossaryModalProps {
  onClose: () => void;
}

const GlossaryModal: React.FC<GlossaryModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = GLOSSARY_TERMS;
    if (activeCategory) results = results.filter(t => t.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(t =>
        t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      );
    }
    return results;
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map: Record<string, Term[]> = {};
    filtered.forEach(t => {
      (map[t.category] = map[t.category] || []).push(t);
    });
    return map;
  }, [filtered]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col border border-gray-200 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-surface-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-gray-900 font-extrabold text-xl">מילון מושגים</h2>
              <p className="text-gray-400 text-xs">{GLOSSARY_TERMS.length} מושגים מעולמות הסייבר ואבטחת המידע</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search + Filters */}
        <div className="px-6 pt-5 pb-3 space-y-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              autoFocus
              className="w-full bg-surface-light pr-10 pl-4 py-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-primary/40 transition-all placeholder:text-gray-400 text-gray-900"
              placeholder="חיפוש מושג..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${!activeCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              הכל
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">לא נמצאו מושגים</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, terms]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-primary text-xs font-extrabold uppercase tracking-wider">{category}</h3>
                  <span className="text-gray-400 text-[10px] bg-gray-100 px-2 py-0.5 rounded">{terms.length}</span>
                </div>
                <div className="space-y-2">
                  {terms.map((t, i) => (
                    <div key={i} className="bg-surface-light border border-gray-100 rounded-2xl p-4 hover:border-primary/20 transition-all">
                      <h4 className="text-gray-900 font-bold text-sm mb-1.5" dir="ltr" style={{ textAlign: 'right' }}>{t.term}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{t.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;
