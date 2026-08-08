import { CLASSIFICATION, URGENCY } from './constants'

// atSec: seconds elapsed from test start when the ticket arrives.
// correctClassification / correctUrgency / expectedHandling are the seed
// "correct answer" data sent to Gemini at scoring time — never shown to the candidate.
export const ticketSchedule = [
  {
    id: 'INC-101',
    atSec: 0,
    title: 'מסך אישור הזמנות אינו מגיב',
    description:
      'מסך אישור הזמנות במערכת ה-ERP אינו מגיב לכל עובדי מחלקת הלוגיסטיקה.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling:
      'עצירת תהליך, הסלמה מיידית לתשתיות, הצעת מעקף ידני זמני.',
  },
  {
    id: 'REQ-102',
    atSec: 150,
    title: 'בקשת הרשאת גישה לדוח BI',
    description:
      'בקשה להרשאת גישה לדוח מכירות חודשי ב-BI עבור מנהל אזור חדש.',
    correctClassification: CLASSIFICATION.SERVICE_REQUEST,
    correctUrgency: URGENCY.P4,
    expectedHandling:
      'בדיקת אישור מנהל, ניתוב לצוות אבטחת מידע / טיפול לפי SLA רגיל.',
  },
  {
    id: 'INC-103',
    atSec: 300,
    title: 'קריסות לסירוגין ב-CRM',
    description:
      'מערכת ה-CRM קורסת לסירוגין בעת שמירת איש קשר חדש. מדווח ע"י 3 נציגים.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P2,
    expectedHandling:
      'איסוף לוגים מתחנות הקצה, בדיקת שירותי CRM, עדכון הצוות.',
  },
  {
    id: 'CR-104',
    atSec: 510,
    title: 'הוספת שדה מספר עוסק מורשה',
    description:
      'דרישה דחופה להוספת שדה \'מספר עוסק מורשה\' בטופס הקלט של מערכת הגבייה.',
    correctClassification: CLASSIFICATION.CHANGE_REQUEST,
    correctUrgency: URGENCY.P3,
    expectedHandling:
      'הבהרה כי מדובר בשינוי קוד (CR), העברה לוועדת שינויים (CAB), ללא ביצוע מיידי.',
  },
  {
    id: 'INC-105',
    atSec: 720,
    title: 'כפילויות ב-API בין קופות למלאי',
    description:
      'מבצעי מכירות בלייב - ממשק ה-API בין קופות הסניפים למלאי המרכזי מייצר כפילויות.',
    correctClassification: CLASSIFICATION.INCIDENT,
    correctUrgency: URGENCY.P1,
    expectedHandling:
      'הפעלת נוהל חירום, תיאום עם צוות אינטגרציה, עדכון הנהלת תפעול.',
  },
]
