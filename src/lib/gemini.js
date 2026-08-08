import { ticketSchedule } from '../data/ticketSchedule'
import { emailSchedule } from '../data/emailSchedule'

// Use the "-latest" alias (rather than pinning a dated model like gemini-1.5-flash,
// which Google has since sunset) so this endpoint keeps working as models retire.
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

const REQUIRED_SCORE_KEYS = [
  'prioritization_score',
  'disc_adaptation_score',
  'pattern_recognition_score',
  'cio_briefing_score',
  'overall_score',
]

const REQUIRED_TEXT_KEYS = ['disc_analysis', 'key_strengths', 'areas_for_improvement']

const SYSTEM_INSTRUCTION = `אתה בוחן מומחה המעריך מועמדים לתפקיד ניהול ותמיכה ביישומים עסקיים, על סמך תרגיל סימולציה בן 20 דקות.
עליך לנקד את המועמד לפי מטריצת המשקלים הבאה:
- 30% תיעדוף וניהול עומס: טיפול נכון בדחיפות (P1 לפני P4), סיווג נכון בין Incident, Change Request ו-Service Request, והאם ההחלטה על סטטוס הקריאה (טיפול ישיר / העברה למנהלת התמיכה / העברה למפתח / העברה למחלקה אחרת / סגירה) הייתה מתאימה לתוכן הקריאה - כולל ציון קריאות ספציפיות שנסגרו בטעות או נותבו בצורה לא נכונה.
- 30% התאמת תקשורת למודל DISC: התאמת הטון, האורך והסגנון של התשובות החופשיות לכל אחד מארבעת סוגי השולחים (D, I, S, C). זהה במפורש כל מייל שבו תגובת המועמד לא הייתה מותאמת לסגנון התקשורת של השולח, וציין זאת בפירוט.
- 20% זיהוי תבניות וראייה רוחבית: האם המועמד שם לב לקריאות חוזרות על אותה מערכת/רכיב תחת מזהים שונים (למשל אותה תקלת ERP או CRM שחוזרת בניסוח מעט שונה מאוחר יותר) וזיהה בכך סיכון מערכתי מצטבר, ולא רק טיפל בכל קריאה בנפרד; והאם קישר בין תקלות שונות לכאורה לבעיה שורשית משותפת, במיוחד בתדרוך למנמ"ר.
- 20% איכות תדרוך המנמ"ר: תכליתיות, זיהוי סיכונים עסקיים והמלצות מעשיות.

החזר אך ורק JSON תקין בדיוק במבנה הבא, ללא טקסט נוסף:
{
  "prioritization_score": number (0-100),
  "disc_adaptation_score": number (0-100),
  "pattern_recognition_score": number (0-100),
  "cio_briefing_score": number (0-100),
  "overall_score": number (0-100),
  "disc_analysis": string (בעברית - כלול בו התייחסות מפורשת לכל מקרה של מענה שלא הותאם לסגנון התקשורת של השולח),
  "key_strengths": string[] (בעברית),
  "areas_for_improvement": string[] (בעברית),
  "ticket_handling_issues": string[] (בעברית - קריאות ספציפיות (לפי מזהה) שסווגו/תועדפו/נותבו לא נכון, או שנסגרו בלי טיפול מתאים; מערך ריק אם אין),
  "disc_mismatches": string[] (בעברית - מיילים ספציפיים (לפי שולח) שבהם המענה לא הותאם לסגנון התקשורת שלהם; מערך ריק אם אין)
}`

function buildScoringPayload(sessionData) {
  return {
    seed_reference_data: {
      tickets: ticketSchedule.map((t) => ({
        id: t.id,
        description: t.description,
        correctClassification: t.correctClassification,
        correctUrgency: t.correctUrgency,
        expectedHandling: t.expectedHandling,
      })),
      emails: emailSchedule.map((e) => ({
        id: e.id,
        sender: e.sender,
        discStyle: e.discStyle,
        body: e.body,
        expectedApproach: e.expectedApproach,
      })),
    },
    candidate_activity: {
      candidateName: sessionData.candidateName,
      tickets: sessionData.tickets,
      emails: sessionData.emails,
      briefing: sessionData.briefing,
      actionLog: sessionData.actionLog,
    },
  }
}

export function validateScoreShape(json) {
  if (!json || typeof json !== 'object') return false
  for (const key of REQUIRED_SCORE_KEYS) {
    if (typeof json[key] !== 'number' || json[key] < 0 || json[key] > 100) return false
  }
  for (const key of REQUIRED_TEXT_KEYS) {
    if (json[key] === undefined) return false
  }
  if (typeof json.disc_analysis !== 'string') return false
  if (!Array.isArray(json.key_strengths) || !Array.isArray(json.areas_for_improvement)) return false
  return true
}

export async function callGeminiScoring(sessionData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('חסר מפתח Gemini API (VITE_GEMINI_API_KEY)')

  const payload = buildScoringPayload(sessionData)

  const requestBody = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [{ role: 'user', parts: [{ text: JSON.stringify(payload) }] }],
    generationConfig: { responseMimeType: 'application/json' },
  }

  const attempt = async () => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)
    try {
      const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`שגיאת Gemini API (${res.status}): ${text}`)
      }
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('תגובת Gemini לא הכילה תוכן')
      const parsed = JSON.parse(text)
      if (!validateScoreShape(parsed)) throw new Error('מבנה תגובת Gemini אינו תקין')
      return parsed
    } finally {
      clearTimeout(timeout)
    }
  }

  try {
    return await attempt()
  } catch {
    return await attempt()
  }
}
