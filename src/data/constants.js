export const TEST_DURATION_SEC = 20 * 60

export const URGENCY = {
  P1: 'P1',
  P2: 'P2',
  P3: 'P3',
  P4: 'P4',
}

export const URGENCY_LABELS = {
  P1: 'P1 - קריטי',
  P2: 'P2 - גבוה',
  P3: 'P3 - בינוני',
  P4: 'P4 - נמוך',
}

export const CLASSIFICATION = {
  INCIDENT: 'incident',
  CHANGE_REQUEST: 'change_request',
  SERVICE_REQUEST: 'service_request',
}

export const CLASSIFICATION_LABELS = {
  incident: 'תקלה (Incident)',
  change_request: 'בקשת שינוי (Change Request)',
  service_request: 'בקשת שירות (Service Request)',
}

export const TICKET_STATUS = {
  IN_PROGRESS: 'in_progress',
  ESCALATED: 'escalated',
  CLOSED: 'closed',
}

export const TICKET_STATUS_LABELS = {
  in_progress: 'בטיפול',
  escalated: 'הסלמה',
  closed: 'נסגר',
}

export const DISC_STYLE = {
  D: 'D',
  I: 'I',
  S: 'S',
  C: 'C',
}

export const DISC_STYLE_LABELS = {
  D: 'D - תכליתי',
  I: 'I - נלהב',
  S: 'S - יציב',
  C: 'C - מדויק',
}

export const RESPONSE_STRATEGIES = [
  { value: 'direct_bottom_line', label: 'תשובה קצרה ותכליתית עם שורה תחתונה' },
  { value: 'warm_enthusiastic', label: 'תשובה חמה ומתלהבת, מחברת לרעיון' },
  { value: 'reassuring_detailed', label: 'תשובה מרגיעה עם פירוט שלבים' },
  { value: 'factual_structured', label: 'תשובה עובדתית ומובנית עם נתונים' },
]

export const SYSTEM_LOAD_LEVELS = [
  { max: 1, label: 'רגוע', color: 'green' },
  { max: 3, label: 'עמוס', color: 'yellow' },
  { max: 5, label: 'עומס גבוה', color: 'orange' },
  { max: Infinity, label: 'קריטי', color: 'red' },
]
