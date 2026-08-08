import { DISC_STYLE } from './constants'

// atSec: seconds elapsed from test start when the email arrives.
// expectedApproach is seed data sent to Gemini at scoring time — never shown to the candidate.
export const emailSchedule = [
  {
    id: 'EMAIL-DAVID',
    atSec: 30,
    sender: 'דוד',
    role: 'סמנכ"ל תפעול',
    discStyle: DISC_STYLE.D,
    subject: 'ה-ERP איטי - צריך צפי עכשיו',
    body:
      'ה-ERP איטי בטירוף, הנהגים יושבים ולא מעמיסים סחורה. אל תסבירו לי למה, פשוט תגידו לי מתי זה פותר. אני רוצה צפי מדויק תוך 5 דקות.',
    expectedApproach:
      'קצר ותכליתי: ללא הסברים טכניים. שורה תחתונה: מה נעשה כרגע, מתי יהיה עדכון הבא ואיש קשר.',
  },
  {
    id: 'EMAIL-SHIRLY',
    atSec: 210,
    sender: 'שירלי',
    role: 'מנהלת חווית לקוח',
    discStyle: DISC_STYLE.I,
    subject: 'רעיון מדהים לצ\'אטבוט!',
    body:
      'היי!! הקשב, עלה לי רעיון מדהים! אם נוסיף צ\'אטבוט קטן במערכת התמיכה הפנימית העובדים ממש יעופו על זה וזה ירים את המורל במחלקה! בוא נריץ את זה שבוע הבא?',
    expectedApproach:
      'חיובי ומחבר: התלהבות מהיוזמה, טון חם, תוך ניתוב מסודר לבדיקת היתכנות ללא דחייה פוגענית.',
  },
  {
    id: 'EMAIL-RONIT',
    atSec: 420,
    sender: 'רונית',
    role: 'רכזת קשרי לקוחות',
    discStyle: DISC_STYLE.S,
    subject: 'דאגה לגבי עדכון גרסה',
    body:
      'שלום, שמעתי שמתכננים לעדכן את גרסת המערכת שבוע הבא. הצוות שלי ממש מודאג מזה שתהיינה תקלות והעבודה תתעכב. אפשר לדעת מה מתוכנן ואיך נערכים לזה ברוגע?',
    expectedApproach:
      'מרגיע ומעניק ביטחון: פירוט שלבי התמיכה וההדרכה, הבהרה שיש ליווי צמוד ושאין ממה לחשוש.',
  },
  {
    id: 'EMAIL-AMIT',
    atSec: 600,
    sender: 'עמית',
    role: 'מנהל בקרה ואיכות',
    discStyle: DISC_STYLE.C,
    subject: 'בקשה ל-RCA ומדדי SLA',
    body:
      'רשמתי לפניי 4 תקלות חוזרות במודול הכספים במהלך השבוע החולף. מצורף קובץ נתונים. מבקש לקבל ניתוח RCA (Root Cause Analysis) מלא ומדדי SLA של טיפול הצוות.',
    expectedApproach:
      'מפורט ומבוסס עובדות: התייחסות נקודתית לנתונים, שימוש במונחים מקצועיים ומדויקים, מענה מובנה.',
  },
]
