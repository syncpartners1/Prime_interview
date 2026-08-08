import { CLASSIFICATION, URGENCY } from './constants'

// Ticket arrival pacing: while the system is under load, new tickets land
// every 30 seconds; once a burst has been absorbed, the pace eases to every
// 60 seconds before the next burst kicks back in. Over the 20-minute test
// this produces 30 distinct tickets, so the candidate can classify/
// prioritize (catalog) every ticket but cannot realistically write full
// work notes on all of them.
const GAP_CYCLE_SEC = [30, 30, 30, 30, 30, 30, 60, 60, 60]
const LAST_ARRIVAL_SEC = 1140 // 19:00 — leaves a buffer before the 20:00 cutoff

// The 5 "flagship" tickets carry the scenario's narrative (used by the CIO
// briefing pattern-recognition rubric). Their original moments land exactly
// on this pacing curve (0, 150, 300, 510, 720).
const flagshipByAtSec = {
  0: {
    id: 'INC-101',
    title: 'מסך אישור הזמנות אינו מגיב',
    description:
      'מסך אישור הזמנות במערכת ה-ERP אינו מגיב לכל עובדי מחלקת הלוגיסטיקה.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling:
      'עצירת תהליך, הסלמה מיידית לתשתיות, הצעת מעקף ידני זמני.',
  },
  150: {
    id: 'REQ-102',
    title: 'בקשת הרשאת גישה לדוח BI',
    description:
      'בקשה להרשאת גישה לדוח מכירות חודשי ב-BI עבור מנהל אזור חדש.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling:
      'בדיקת אישור מנהל, ניתוב לצוות אבטחת מידע / טיפול לפי SLA רגיל.',
  },
  300: {
    id: 'INC-103',
    title: 'קריסות לסירוגין ב-CRM',
    description:
      'מערכת ה-CRM קורסת לסירוגין בעת שמירת איש קשר חדש. מדווח ע"י 3 נציגים.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling:
      'איסוף לוגים מתחנות הקצה, בדיקת שירותי CRM, עדכון הצוות.',
  },
  510: {
    id: 'CR-104',
    title: 'הוספת שדה מספר עוסק מורשה',
    description:
      'דרישה דחופה להוספת שדה \'מספר עוסק מורשה\' בטופס הקלט של מערכת הגבייה.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P3,
    expectedHandling:
      'הבהרה כי מדובר בשינוי קוד (CR), העברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  720: {
    id: 'INC-105',
    title: 'כפילויות ב-API בין קופות למלאי',
    description:
      'מבצעי מכירות בלייב - ממשק ה-API בין קופות הסניפים למלאי המרכזי מייצר כפילויות.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling:
      'הפעלת נוהל חירום, תיאום עם צוות אינטגרציה, עדכון הנהלת תפעול.',
  },
}

// 25 unique filler tickets — one per remaining 30-second slot, so every
// arrival in the test is a genuinely distinct scenario (no repeated content
// under a new ID).
const fillerTemplates = [
  {
    category: 'INC',
    title: 'אתר המכירות קורס בזמן מבצע',
    description: 'אתר המכירות המקוון קורס תחת עומס בזמן מבצע, לקוחות לא מצליחים לבצע רכישה.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling: 'הסלמה מיידית לצוות תשתיות ואתר, בדיקת עומס שרתים, עדכון הנהלת מכירות.',
  },
  {
    category: 'INC',
    title: 'שיחות מתנתקות במוקד השירות',
    description: 'שירות הטלפוניה (VoIP) במוקד השירות מנתק שיחות עם לקוחות באמצע השיחה.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling: 'בדיקת ספק ה-VoIP, אימות עומס רשת, עדכון צוות המוקד.',
  },
  {
    category: 'REQ',
    title: 'רישיון Office למחשב עובד חדש',
    description: 'בקשה להתקנת רישיון Office נוסף עבור מחשב של עובד חדש שמצטרף השבוע.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'אימות אישור מנהל, הקצאת רישיון לפי מלאי קיים, טיפול לפי SLA רגיל.',
  },
  {
    category: 'CR',
    title: 'שדה הערות פנימיות ב-CRM',
    description: 'בקשה להוסיף שדה "הערות פנימיות" לטופס פתיחת לקוח חדש במערכת ה-CRM.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'תיעוד הדרישה והעברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  {
    category: 'INC',
    title: 'כשל בגיבוי הלילי',
    description: 'מערכת הגיבויים הלילית נכשלת שלושה לילות ברציפות ללא התראה קודמת.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling: 'בדיקת שרת הגיבויים, הרצת גיבוי ידני מיידי, פתיחת חקירת שורש.',
  },
  {
    category: 'REQ',
    title: 'גישה לתיקיית שיתוף ברשת',
    description: 'בקשה לגישה לתיקיית שיתוף ברשת עבור עובד חדש ממחלקת השיווק.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'אימות אישור מנהל ישיר, הקצאת הרשאה לפי נוהל SLA רגיל.',
  },
  {
    category: 'INC',
    title: 'בקרת הכניסה לא מזהה עובדים',
    description: 'מערכת בקרת הכניסה (כרטיסי גישה) לא מזהה עובדים בכניסה הראשית למשרד.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling: 'הסלמה מיידית לאבטחה ותשתיות, פתיחת דלת ידנית זמנית, עדכון עובדים.',
  },
  {
    category: 'INC',
    title: 'Wi-Fi מתנתק בסניף הדרומי',
    description: 'רשת ה-Wi-Fi במשרדי הסניף הדרומי מתנתקת לסירוגין לאורך היום.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'בדיקת נקודות גישה, אימות עומס רשת, עדכון עובדי הסניף.',
  },
  {
    category: 'CR',
    title: 'עדכון חתימת מייל ארגונית',
    description: 'בקשה לשנות את חתימת המייל הארגונית לתבנית אחידה חדשה לכל העובדים.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'תיעוד הדרישה והעברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  {
    category: 'INC',
    title: 'מערכת ניהול המשימות איטית',
    description: 'מערכת ניהול המשימות הפנימית איטית מאוד בעת שמירת עדכונים.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling: 'בדיקת ביצועי שרת האפליקציה, איתור צוואר בקבוק, עדכון משתמשים.',
  },
  {
    category: 'REQ',
    title: 'איפוס נעילת חשבון משתמש',
    description: 'בקשה לאפס נעילת חשבון משתמש לאחר מספר ניסיונות כניסה כושלים.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'אימות זהות המשתמש, איפוס נעילה לפי נוהל אבטחת מידע סטנדרטי.',
  },
  {
    category: 'INC',
    title: 'שירות ה-SSO אינו מאפשר כניסה',
    description: 'שירות הכניסה האחידה (SSO) אינו מאפשר התחברות לאף מערכת ארגונית.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling: 'הסלמה מיידית לצוות זהויות והרשאות, בדיקת שרת האימות, עדכון כלל הארגון.',
  },
  {
    category: 'CR',
    title: 'דוח שעות עבודה חודשי חדש',
    description: 'בקשה להוספת דוח שעות עבודה חודשי חדש למערכת הנוכחות.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'תיעוד הדרישה והעברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  {
    category: 'INC',
    title: 'אי-סנכרון הזמנות מול המחסן',
    description: 'מערכת ניהול ההזמנות בסניפים אינה מסתנכרנת עם המחסן המרכזי.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling: 'בדיקת שירות הסנכרון, אימות תור ההודעות, עדכון מנהלי הסניפים.',
  },
  {
    category: 'REQ',
    title: 'הצטרפות לקבוצת דיוור פנימית',
    description: 'בקשה להצטרפות עובד לקבוצת דיוור פנים-ארגונית.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'אימות אישור מנהל, הוספה לרשימת התפוצה לפי נוהל SLA רגיל.',
  },
  {
    category: 'INC',
    title: 'מדפסת רשת מפיקה דפים ריקים',
    description: 'מדפסת הרשת בקומה השנייה מפיקה דפים ריקים בלבד.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'בדיקת מצב דיו/טונר, הפניה לטכנאי מדפסות, עדכון זמן שחזור משוער.',
  },
  {
    category: 'CR',
    title: 'עדכון תבנית הצעת מחיר',
    description: 'בקשה לעדכן את תבנית הצעת המחיר הנשלחת ללקוחות.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'תיעוד הדרישה והעברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  {
    category: 'INC',
    title: 'שער התשלומים דוחה כל עסקה',
    description: 'שער התשלומים הסולק כרטיסי אשראי מחזיר שגיאה בכל העסקאות.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling: 'הפעלת נוהל חירום, תיאום מיידי מול ספק הסליקה, עדכון הנהלת כספים.',
  },
  {
    category: 'REQ',
    title: 'הרשאת יועץ חיצוני למערכת פרויקטים',
    description: 'בקשת הרשאה למערכת ניהול הפרויקטים עבור יועץ חיצוני חדש.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'אימות אישור מנהל הפרויקט, הקצאת הרשאה מוגבלת לפי נוהל SLA רגיל.',
  },
  {
    category: 'INC',
    title: 'אפליקציית המובייל קורסת בפתיחה',
    description: 'אפליקציית המובייל של השירות קורסת בפתיחה עבור חלק מהמשתמשים.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling: 'בדיקת לוגי קריסה, זיהוי גרסת מכשיר בעייתית, עדכון צוות הפיתוח.',
  },
  {
    category: 'CR',
    title: 'הוספת שפה נוספת לממשק',
    description: 'בקשה להוסיף שפה נוספת (אנגלית) לממשק המערכת הפנימית.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'תיעוד הדרישה והעברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  {
    category: 'INC',
    title: 'שרת הדפוס לא שומר הגדרות ברירת מחדל',
    description: 'שרת הדפוס המרכזי אינו שומר הגדרות מדפסת כברירת מחדל לאחר הפעלה מחדש.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'בדיקת תצורת שרת הדפוס, שחזור הגדרות, עדכון משתמשים.',
  },
  {
    category: 'REQ',
    title: 'שדרוג תוכנת עיצוב לצוות השיווק',
    description: 'בקשה לשדרוג תוכנת עיצוב עבור צוות השיווק לגרסה החדשה.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'אימות תקציב ורישוי מול מנהל צוות השיווק, טיפול לפי SLA רגיל.',
  },
  {
    category: 'INC',
    title: 'מלאי שלילי במספר מוצרים',
    description: 'מערכת בקרת המלאי בסניפים מציגה מלאי שלילי במספר מוצרים במקביל.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling: 'הפעלת נוהל חירום, בדיקת סנכרון נתוני מלאי, עדכון הנהלת תפעול.',
  },
  {
    category: 'CR',
    title: 'עדכון לוגו במסמכי החברה',
    description: 'בקשה להוספת לוגו מעודכן לתחתית מסמכי החברה הרשמיים.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'תיעוד הדרישה והעברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
]

function buildArrivalTimes() {
  const times = [0]
  let cursor = 0
  let cycleIndex = 0
  while (true) {
    const gap = GAP_CYCLE_SEC[cycleIndex % GAP_CYCLE_SEC.length]
    const next = cursor + gap
    if (next > LAST_ARRIVAL_SEC) break
    times.push(next)
    cursor = next
    cycleIndex += 1
  }
  return times
}

function buildTicketSchedule() {
  const schedule = []
  const counters = { INC: 105, REQ: 102, CR: 104 } // next id after flagship numbers
  let fillerIndex = 0

  for (const atSec of buildArrivalTimes()) {
    const flagship = flagshipByAtSec[atSec]
    if (flagship) {
      schedule.push({ atSec, ...flagship })
      continue
    }

    const template = fillerTemplates[fillerIndex % fillerTemplates.length]
    fillerIndex += 1
    counters[template.category] += 1
    const id = `${template.category}-${counters[template.category]}`

    schedule.push({
      id,
      atSec,
      title: template.title,
      description: template.description,
      correctClassification: template.correctClassification,
      correctUrgency: template.correctUrgency,
      expectedHandling: template.expectedHandling,
    })
  }

  return schedule
}

export const ticketSchedule = buildTicketSchedule()
