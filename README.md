# Prime Interview — סימולציית הערכת מועמדים

אפליקציית Web עצמאית לבחינת מועמדים לתפקיד ניהול ותמיכה ביישומים עסקיים: מבחן סימולציה בן 20 דקות הכולל ניהול קריאות ITSM, מענה למיילים לפי מודל DISC, ותדרוך למנהל מערכות מידע (CIO). בסיום המבחן נשלחים כל נתוני הפעילות ל-Gemini 1.5 Flash לניתוח וניקוד אוטומטי.

**חי כרגע ב:** https://primelease-interview.web.app
**כניסת מגייס (/admin):** `adibe@primelease.co.il`

## טכנולוגיות

- React (Vite) + Tailwind CSS
- Firebase Firestore + Firebase Auth (Anonymous לנבחנים, Email/Password למגייס)
- Firebase Hosting
- Gemini 1.5 Flash (Google AI Studio API) — נקרא ישירות מהדפדפן בסיום המבחן

## מצב הפרויקט (כבר הוגדר)

- **GCP project**: `prime-interview-504916` (https://console.cloud.google.com/welcome?project=prime-interview-504916), עם billing account מקושר (נדרש רק כדי להפעיל את Auth Admin API; השימוש בפועל נשאר בגבולות ה-free tier של Firebase Spark).
- **Firestore**: מסד Native ב-location `me-west1` (Tel Aviv).
- **Auth**: מופעלים Anonymous (לנבחנים) ו-Email/Password (למגייס, משתמש יחיד: `adibe@primelease.co.il`).
- **Hosting site**: `primelease-interview` → https://primelease-interview.web.app (ה-siteId `prime-interview` היה תפוס גלובלית על ידי פרויקט Firebase אחר).
- **חוקי אבטחה** (`firestore.rules`) כבר פרוסים.
- **מפתח Gemini** מוגבל (HTTP referrer restriction) לדומיין ה-Hosting ול-localhost:5173 לפיתוח.
- **`firebase-tools` CLI אינו מותקן** במחשב הפיתוח — כל הפעולות למעלה בוצעו ישירות דרך ה-REST APIs של Firebase/GCP (`gcloud auth print-access-token` + curl). לפריסה חוזרת של Hosting יש סקריפט חלופי: ראה `scripts/deploy-hosting.mjs`.

## פיתוח מקומי

`.env.local` כבר מכיל את כל המפתחות הדרושים (לא ב-git).

```bash
npm install
npm run dev
```

## פריסה

אין `firebase-tools` מותקן, לכן הפריסה מתבצעת דרך סקריפט REST ייעודי (דורש `gcloud auth login` עם הרשאות לפרויקט):

```bash
npm run deploy
```

חוקי Firestore (`firestore.rules`) נפרסים דרך ה-Firebase Rules API — ראה את הפקודות בהיסטוריית הפיתוח, או התקן `firebase-tools` ותריץ `firebase deploy --only firestore:rules`.

## מבנה נתונים ב-Firestore

כל מבחן מיוצג כמסמך יחיד באוסף `sessions`. ראה `src/lib/firestoreSession.js` ו-`src/lib/sessionStore.js` למבנה המלא.

## נתוני תוכן

תוכן הקריאות (ITSM) והמיילים (DISC), כולל תשובות נכונות/גישה מצופה המשמשות לניקוד ה-AI, מוגדר ב-`src/data/ticketSchedule.js` ו-`src/data/emailSchedule.js`.
