# Prime Interview — סימולציית הערכת מועמדים

אפליקציית Web עצמאית לבחינת מועמדים לתפקיד ניהול ותמיכה ביישומים עסקיים: מבחן סימולציה בן 20 דקות הכולל ניהול קריאות ITSM, מענה למיילים לפי מודל DISC, ותדרוך למנהל מערכות מידע (CIO). בסיום המבחן נשלחים כל נתוני הפעילות ל-Gemini 1.5 Flash לניתוח וניקוד אוטומטי.

## טכנולוגיות

- React (Vite) + Tailwind CSS
- Firebase Firestore + Firebase Auth (Anonymous לנבחנים, Email/Password למגייס)
- Firebase Hosting
- Gemini 1.5 Flash (Google AI Studio API) — נקרא ישירות מהדפדפן בסיום המבחן

## הגדרת סביבה (חד-פעמי)

1. **Firebase project**: פרויקט ה-GCP `prime-interview-504916` (https://console.cloud.google.com/welcome?project=prime-interview-504916). הוסף אליו את Firebase (Firebase console → Add Firebase to existing GCP project).
2. **Firestore**: צור מסד נתונים Firestore במצב Native, ב-location **`me-west1` (Tel Aviv)** — בחירה זו היא חד-פעמית ולא ניתנת לשינוי לאחר יצירת המסד.
3. **Auth**: הפעל שני ספקי כניסה ב-Firebase Authentication:
   - **Anonymous** — עבור נבחנים.
   - **Email/Password** — עבור המגייס. צור ידנית משתמש אחד (למשל `syncpartners1@gmail.com`) תחת Authentication → Users.
4. **פריסת חוקי אבטחה**: `firebase deploy --only firestore:rules`.
5. **מפתחות סביבה**: העתק את `.env.example` ל-`.env.local` ומלא:
   - את פרטי קונפיגורציית ה-Web App מ-Firebase console (Project settings → General → Your apps).
   - מפתח Gemini API מ-Google AI Studio (`VITE_GEMINI_API_KEY`).
6. **הגבלת מפתח Gemini**: לאחר הפריסה, הגבל את מפתח ה-API (ב-Google Cloud Console → APIs & Services → Credentials) ל-HTTP referrer של דומיין ה-Hosting שלך, כדי לצמצם חשיפה — המפתח מגיע מהדפדפן (client-side) כפי שהוגדר במפרט המוצר.

## פיתוח מקומי

```bash
npm install
npm run dev
```

## פריסה

```bash
npm run build
firebase deploy
```

## מבנה נתונים ב-Firestore

כל מבחן מיוצג כמסמך יחיד באוסף `sessions`. ראה `src/lib/firestoreSession.js` ו-`src/lib/sessionStore.js` למבנה המלא.

## נתוני תוכן

תוכן הקריאות (ITSM) והמיילים (DISC), כולל תשובות נכונות/גישה מצופה המשמשות לניקוד ה-AI, מוגדר ב-`src/data/ticketSchedule.js` ו-`src/data/emailSchedule.js`.
