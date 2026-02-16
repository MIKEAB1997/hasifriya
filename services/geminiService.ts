
import { MOCKUP_LIBRARY } from "../constants";

/**
 * Generates a simple summary in Hebrew (no AI).
 */
export async function generatePresentationSummary(title: string, description: string): Promise<string> {
  return description || `מצגת מקצועית בנושא ${title} להעשרה ופיתוח הידע האישי.`;
}

/**
 * Selects the best mockup from our library based on keyword matching.
 */
export async function selectBestMockup(title: string, description: string): Promise<string> {
  const text = `${title} ${description}`.toLowerCase();

  const categoryMap: Record<string, string[]> = {
    strategy: ['אסטרטגיה', 'תכנון', 'תוכנית', 'יעדים', 'מטרות'],
    tech: ['טכנולוגיה', 'ai', 'בינה', 'מלאכותית', 'דיגיטל', 'תוכנה', 'מחשב', 'סייבר'],
    marketing: ['שיווק', 'מכירות', 'פרסום', 'לקוח', 'מותג', 'קמפיין'],
    culture: ['תרבות', 'ארגונית', 'ערכים', 'צוות', 'עובדים', 'גיוס'],
    data: ['נתונים', 'ניתוח', 'דוח', 'סטטיסטיקה', 'מדדים', 'BI'],
    finance: ['פיננסים', 'כלכלה', 'תקציב', 'רווח', 'השקעה', 'כסף'],
    soft_skills: ['מיומנויות', 'רכות', 'תקשורת', 'מנהיגות', 'ניהול', 'פרזנטציה'],
  };

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(kw => text.includes(kw))) {
      const library = MOCKUP_LIBRARY[category];
      return library[Math.floor(Math.random() * library.length)];
    }
  }

  const abstractLib = MOCKUP_LIBRARY.abstract;
  return abstractLib[Math.floor(Math.random() * abstractLib.length)];
}
