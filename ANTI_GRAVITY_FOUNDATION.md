# Anti-Gravity Foundation

## Goal
להכין את המאגרון לשכבת עיצוב חדשה בסגנון `anti-gravity` בלי לשבור את:

- חלוקת התוכן לפי קטגוריות
- מנגנון ה-preview למצגות, סרטונים, כתבות ואירועי אמת
- החיפוש, ה-Drive sync והעדכונים החיים
- התמיכה במובייל וב-fallbackים מהירים

## Current Stable Content Model

המערכת כבר מופרדת בפועל ל-3 שכבות:

1. Data
- `services/googleDriveService.ts`
- `services/webKnowledgeService.ts`
- `services/presentationService.ts`

2. Content routing
- `portalData.ts`
- `App.tsx`
- `components/TopicExplorer.tsx`

3. Visual rendering
- `components/LibraryHero.tsx`
- `components/PortalNavbar.tsx`
- `components/TopicExplorer.tsx`
- `components/WorldScene.tsx`
- `components/worldVisuals.ts`

## Design Seams Ready For Anti-Gravity

### 1. Hero seam
`components/LibraryHero.tsx`

זה המקום הנכון להחליף את שכבת הפתיחה ל:
- anti-gravity motion field
- floating category anchors
- giant kinetic background
- cinematic depth

בלי לגעת בלוגיקת הקטגוריות.

### 2. Category seam
`components/TopicExplorer.tsx`

זה המקום שבו כל קטגוריה מוצגת כעת.
בעתיד אפשר להחליף:
- card layout
- transitions
- media deck
- tab interaction
- category shell

אבל לא לשנות את מודל התוכן עצמו.

### 3. Ambient seam
`components/WorldScene.tsx`
`components/worldVisuals.ts`

כרגע אלה אחראים על הרקע הוויזואלי וה-preview הגרפי.
בהמשך אפשר לחבר כאן:
- anti-gravity particles
- orbital lines
- motion fog
- procedural depth
- per-category atmospheres

## Implementation Rules

כדי שהשדרוג הבא יישאר יציב:

1. לא לשנות את shape של `SearchTopicShortcut`
2. לא לשבור את מפת הקטגוריות והשיוך מה-Drive
3. כל שכבת עיצוב חדשה חייבת לעבוד גם בלי WebGL
4. כל motion חייב לכבד `prefers-reduced-motion`
5. כל קטגוריה חייבת לשמור על:
- cover / preview
- tabs ברורים
- cards קריאים
- CTA ראשי אחד או שניים לכל היותר

## Recommended Next Build Order

1. לבנות design tokens גלובליים לקצוות:
- depth
- glow
- glass
- motion
- category accents

2. להוסיף category shells:
- `CyberShell`
- `PhishingShell`
- `MobileShell`
- `AILeakageShell`
- `InsiderShell`

3. לחבר motion layer נפרדת:
- background only
- optional
- lazy loaded
- disabled on weak/mobile mode

4. לעדכן את `TopicExplorer` כך שכל קטגוריה תוכל לבחור renderer שונה,
אבל עם אותו contract של content cards.

## Component Contracts To Preserve

### LibraryHero
Must receive:
- active category
- preview image
- scene variant
- actions for categories / cases / support

### TopicExplorer
Must receive:
- active topic id
- filtered presentations
- filtered articles
- filtered videos
- filtered images
- open callbacks

### WorldScene
Must stay decorative only.
No business logic inside.

## Mobile Requirements

שכבת anti-gravity בעתיד צריכה לעבוד כך:

- Mobile default: static / low-motion mode
- Tablet: medium motion
- Desktop: full atmosphere

במילים אחרות:
- לא לקשור חוויית שימוש בסיסית ל-canvas
- לא להסתיר כפתורים ו-content מאחורי אפקטים
- לא להעמיס על ה-hero לפני שהקטגוריות נגישות

## What Is Already Ready

- hero extracted to dedicated component
- content previews already normalized
- category selection is primary navigation
- support content separated from main categories
- deployment pipeline unchanged

## What To Avoid

- להחזיר מסך כניסה נפרד לפני הספרייה
- להפוך את כל האתר ל-scrollytelling איטי
- להעמיס 3D חובה על כל מסך
- לשלב motion שמסתיר את ה-content עצמו
