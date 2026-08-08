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
  HANDLE_DIRECTLY: 'handle_directly',
  TRANSFER_SUPPORT_MANAGER: 'transfer_support_manager',
  TRANSFER_DEVELOPER: 'transfer_developer',
  TRANSFER_OTHER_DEPT: 'transfer_other_dept',
  CLOSED: 'closed',
}

export const TICKET_STATUS_LABELS = {
  handle_directly: 'טפל ישירות',
  transfer_support_manager: 'העבר למנהלת התמיכה',
  transfer_developer: 'העבר למפתח',
  transfer_other_dept: 'העבר למחלקה אחרת',
  closed: 'סגור את הבקשה',
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

export const SYSTEM_LOAD_LEVELS = [
  { max: 5, label: 'רגוע', color: 'green' },
  { max: 12, label: 'עמוס', color: 'yellow' },
  { max: 20, label: 'עומס גבוה', color: 'orange' },
  { max: Infinity, label: 'קריטי', color: 'red' },
]
