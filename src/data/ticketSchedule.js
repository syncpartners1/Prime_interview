import { CLASSIFICATION, URGENCY } from './constants'

// Ticket arrival pacing: while the system is under load, new tickets land
// every 30 seconds; once a burst has been absorbed, the pace eases to every
// 60 seconds before the next burst kicks back in. Over the 20-minute test
// this produces 30 tickets (comfortably above the "at least 25" target),
// so the candidate can classify/prioritize (catalog) every ticket but
// cannot realistically write full work notes on all of them.
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

const fillerTemplates = [
  {
    category: 'INC',
    title: 'מדפסת התלושים בכספים לא מדפיסה',
    description: 'שרת ההדפסה במחלקת הכספים מפסיק להדפיס תלושי שכר לקראת סוף החודש.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'בדיקת תור ההדפסה, הפניה לצוות תשתיות, עדכון זמן שחזור משוער.',
  },
  {
    category: 'REQ',
    title: 'איפוס סיסמה למערכת השכר',
    description: 'בקשה לאיפוס סיסמה למערכת השכר עבור עובד חדש שמתחיל השבוע.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'אימות זהות מבקש, איפוס לפי נוהל אבטחת מידע סטנדרטי.',
  },
  {
    category: 'INC',
    title: 'VPN מנותק לעובדים מרוחקים',
    description: 'שירות ה-VPN מתנתק לסירוגין לעובדים מרוחקים בסניף הצפון.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling: 'בדיקת שרת ה-VPN, אימות עומס רשת, עדכון העובדים המושפעים.',
  },
  {
    category: 'CR',
    title: 'דוח יצוא נוסף למסך המלאי',
    description: 'בקשה להוסיף אפשרות יצוא ל-Excel במסך ניהול המלאי.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P3,
    expectedHandling: 'תיעוד הדרישה והעברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  {
    category: 'INC',
    title: 'תיבת הדואר הארגונית לא מקבלת מיילים',
    description: 'תיבת הדואר הארגונית אינה מקבלת מיילים חיצוניים כבר כ-20 דקות.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling: 'הסלמה מיידית לצוות תשתיות דואר, בדיקת שרתי SMTP, עדכון הארגון.',
  },
  {
    category: 'REQ',
    title: 'הרשאת VPN למנהל פרויקטים חדש',
    description: 'בקשת הרשאת גישה מרחוק (VPN) עבור מנהל פרויקטים שהצטרף לאחרונה.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling: 'אימות אישור מנהל ישיר, הקצאת הרשאה לפי נוהל SLA רגיל.',
  },
  {
    category: 'INC',
    title: 'מלאי שגוי בסניף אחד ב-WMS',
    description: 'מערכת ניהול המחסן (WMS) מציגה כמות מלאי שגויה בסניף אחד בלבד.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling: 'בדיקת סנכרון נתונים מול הסניף, איתור מקור הפער, עדכון מלאי ידני זמני.',
  },
  {
    category: 'CR',
    title: 'שינוי תבנית חשבונית ללקוחות',
    description: 'בקשה לשנות את עיצוב תבנית החשבונית הנשלחת ללקוחות במייל.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P3,
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
