
import { Presentation } from './types';

export const DEFAULT_CATEGORIES = [
  'אסטרטגיה ותכנון',
  'טכנולוגיה ו-AI',
  'מיומנויות רכות',
  'ניתוח נתונים',
  'תרבות ארגונית',
  'שיווק ומכירות',
  'פיננסים וכלכלה'
];

// מאגר מוקאפים איכותי (50+ תמונות) לפי קטגוריות ויזואליות
export const MOCKUP_LIBRARY: Record<string, string[]> = {
  strategy: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000',
    'https://images.unsplash.com/photo-1454165833767-027ffea9e787?q=80&w=1000',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000'
  ],
  tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1000',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=1000',
    'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000'
  ],
  marketing: [
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1000',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c207?q=80&w=1000',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000',
    'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1000'
  ],
  culture: [
    'https://images.unsplash.com/photo-1522071823991-b3840a439223?q=80&w=1000',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000',
    'https://images.unsplash.com/photo-1600880212340-0234403d18ff?q=80&w=1000'
  ],
  data: [
    'https://images.unsplash.com/photo-1551288049-bbda00097c8b?q=80&w=1000',
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1000',
    'https://images.unsplash.com/photo-1504868584819-f8eec2421750?q=80&w=1000',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
    'https://images.unsplash.com/photo-1551288049-bbda00097c8b?q=80&w=1000'
  ],
  finance: [
    'https://images.unsplash.com/photo-1591696208162-a97b74174e9c?q=80&w=1000',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000',
    'https://images.unsplash.com/photo-1579621970795-87f957f60017?q=80&w=1000'
  ],
  soft_skills: [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000'
  ],
  abstract: [
    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000',
    'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1000',
    'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000'
  ]
};

export const INITIAL_PRESENTATIONS: Presentation[] = [
  {
    id: '1',
    title: 'מלחמות הסייבר של הבינה המלאכותית',
    description: 'דו"ח איומים גלובלי: כיצד מעצמות העולם משתמשות ב-AI במלחמות סייבר, ואילו איומים חדשים צצים בזירה הדיגיטלית.',
    category: 'טכנולוגיה ו-AI',
    thumbnailUrl: MOCKUP_LIBRARY.tech[1],
    driveUrl: '/pdfs/AI_Cyber_Wars_World_Leaders_Threat_Report.pdf',
    isNew: true,
    addedAt: '2026-02-16'
  },
  {
    id: '2',
    title: 'אינטליגנציה התנהגותית וחיישנים דיגיטליים',
    description: 'סקירה מעמיקה על שימוש בחיישנים דיגיטליים לניתוח דפוסי התנהגות, זיהוי מגמות ושיפור תהליכי קבלת החלטות.',
    category: 'ניתוח נתונים',
    thumbnailUrl: MOCKUP_LIBRARY.data[1],
    driveUrl: '/pdfs/Behavioral_Intelligence_Digital_Sensors.pdf',
    isNew: true,
    addedAt: '2026-02-16'
  },
  {
    id: '3',
    title: 'אסטרטגיית המבצר הדיגיטלי',
    description: 'מדריך אסטרטגי לבניית הגנה דיגיטלית רב-שכבתית, כולל עקרונות ארכיטקטורת אבטחה וניהול סיכונים בעידן הדיגיטלי.',
    category: 'אסטרטגיה ותכנון',
    thumbnailUrl: MOCKUP_LIBRARY.strategy[0],
    driveUrl: '/pdfs/Digital_Fortress_Strategy.pdf',
    addedAt: '2026-02-16'
  },
  {
    id: '4',
    title: 'שחקנים לא-מדינתיים בזירה הגלובלית',
    description: 'ניתוח עוצמתם הגוברת של שחקנים לא-מדינתיים בפוליטיקה הבינלאומית, כולל ארגוני טרור, תאגידי ענק וקבוצות האקרים.',
    category: 'אסטרטגיה ותכנון',
    thumbnailUrl: MOCKUP_LIBRARY.strategy[2],
    driveUrl: '/pdfs/Nonstate_Actors_Global_Power.pdf',
    addedAt: '2026-02-16'
  },
  {
    id: '5',
    title: 'ניהול פרויקטים למי שלא מנהל פרויקטים',
    description: 'מדריך מעשי ונגיש לעקרונות ניהול פרויקטים, מיועד לאנשי מקצוע שנדרשים להוביל משימות ללא רקע פורמלי בתחום.',
    category: 'מיומנויות רכות',
    thumbnailUrl: MOCKUP_LIBRARY.soft_skills[0],
    driveUrl: '/pdfs/Project_Management_for_Non-Managers.pdf',
    isNew: true,
    addedAt: '2026-02-16'
  },
  {
    id: '6',
    title: 'Shadow AI: מסיכון ליתרון',
    description: 'כיצד ארגונים מתמודדים עם השימוש הבלתי מפוקח ב-AI על ידי עובדים, והפיכת הסיכון להזדמנות אסטרטגית.',
    category: 'טכנולוגיה ו-AI',
    thumbnailUrl: MOCKUP_LIBRARY.tech[3],
    driveUrl: '/pdfs/Shadow_AI_Risk_to_Advantage.pdf',
    addedAt: '2026-02-16'
  },
  {
    id: '7',
    title: 'הדרקון ומלחמת השבבים',
    description: 'ניתוח גיאופוליטי של מלחמת השבבים בין סין לארה"ב, השלכותיה על שרשרת האספקה הגלובלית ועל עתיד הטכנולוגיה.',
    category: 'אסטרטגיה ותכנון',
    thumbnailUrl: MOCKUP_LIBRARY.tech[5],
    driveUrl: '/pdfs/The_Dragon_and_the_Chip_War.pdf',
    addedAt: '2026-02-16'
  }
];
