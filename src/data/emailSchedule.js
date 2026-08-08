import { DISC_STYLE } from './constants'

// 10 distinct emails arrive over the test (4 personas, several send a
// follow-up later on) so the candidate has to keep adapting to each
// communication style repeatedly, not just once per sender.
// discStyle/expectedApproach are seed data used only for AI scoring and the
// recruiter's admin log — never shown to the candidate.
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
    atSec: 150,
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
    atSec: 270,
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
    atSec: 390,
    sender: 'עמית',
    role: 'מנהל בקרה ואיכות',
    discStyle: DISC_STYLE.C,
    subject: 'בקשה ל-RCA ומדדי SLA',
    body:
      'רשמתי לפניי 4 תקלות חוזרות במודול הכספים במהלך השבוע החולף. מצורף קובץ נתונים. מבקש לקבל ניתוח RCA (Root Cause Analysis) מלא ומדדי SLA של טיפול הצוות.',
    expectedApproach:
      'מפורט ומבוסס עובדות: התייחסות נקודתית לנתונים, שימוש במונחים מקצועיים ומדויקים, מענה מובנה.',
  },
  {
    id: 'EMAIL-DAVID-2',
    atSec: 510,
    sender: 'דוד',
    role: 'סמנכ"ל תפעול',
    discStyle: DISC_STYLE.D,
    subject: 'עדיין מחכה',
    body: 'עברו כמה דקות ואין תשובה. אני צריך שורה תחתונה עכשיו: פתור או לא פתור, ומתי.',
    expectedApproach:
      'קצר ותכליתי במיוחד: עדכון סטטוס מיידי ללא הקדמות, מחויבות ברורה לזמן הבא.',
  },
  {
    id: 'EMAIL-SHIRLY-2',
    atSec: 630,
    sender: 'שירלי',
    role: 'מנהלת חווית לקוח',
    discStyle: DISC_STYLE.I,
    subject: 'עוד רעיון קטן :)',
    body:
      'אגב, חשבתי גם שכדאי להוסיף סקר שביעות רצון קצר ומצחיק לעובדים אחרי כל טיפול! מה דעתך? יכול להיות ממש כיף!',
    expectedApproach:
      'חיובי ומעודד, תוך ניתוב עדין להתמקדות בנושאים הדחופים יותר של הרגע, ללא ביטול ההתלהבות.',
  },
  {
    id: 'EMAIL-RONIT-2',
    atSec: 750,
    sender: 'רונית',
    role: 'רכזת קשרי לקוחות',
    discStyle: DISC_STYLE.S,
    subject: 'תודה, ועוד שאלה קטנה',
    body:
      'תודה על התשובה הקודמת, זה ממש הרגיע אותי. רק רציתי לוודא - יהיה מוקד תמיכה זמין גם בזמן העדכון עצמו, נכון?',
    expectedApproach: 'המשך טון מרגיע ותומך, מתן ביטחון קונקרטי ומדויק לשאלה הספציפית.',
  },
  {
    id: 'EMAIL-AMIT-2',
    atSec: 870,
    sender: 'עמית',
    role: 'מנהל בקרה ואיכות',
    discStyle: DISC_STYLE.C,
    subject: 'נתונים נוספים מצורפים',
    body:
      'מצרף נתונים נוספים מהשבוע האחרון. אשמח גם לקבל ניתוח מגמה לאורך זמן, לא רק תמונת מצב נקודתית.',
    expectedApproach: 'מענה מובנה ומבוסס נתונים, התייחסות למגמה לאורך זמן ולא רק לאירוע בודד.',
  },
  {
    id: 'EMAIL-DAVID-3',
    atSec: 990,
    sender: 'דוד',
    role: 'סמנכ"ל תפעול',
    discStyle: DISC_STYLE.D,
    subject: 'סיכום דחוף',
    body: 'אני צריך סיכום אחד-שניים משפטים על מצב המערכות לפני הישיבה שלי בעוד רבע שעה.',
    expectedApproach: 'תמצות קיצוני: שורה תחתונה על מצב המערכות, ללא פירוט טכני.',
  },
  {
    id: 'EMAIL-SHIRLY-3',
    atSec: 1110,
    sender: 'שירלי',
    role: 'מנהלת חווית לקוח',
    discStyle: DISC_STYLE.I,
    subject: 'מתי נדבר?',
    body: 'היי, מתי נוכל לדבר על הצ\'אטבוט? אני כל כך נרגשת מזה, ממש אי אפשר לחכות!',
    expectedApproach: 'טון חם וממשיך לעודד, תוך קביעת ציפייה ברורה למועד המשך שיחה.',
  },
]
