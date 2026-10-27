const arDate = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })
const arDay = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { day: 'numeric' })
const arMonth = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { month: 'short' })
const arWeekday = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { weekday: 'long' })

export const parseDate = (iso: string) => new Date(iso + 'T20:00:00')
export const fmtDate = (iso: string) => arDate.format(parseDate(iso))
export const fmtDay = (iso: string) => arDay.format(parseDate(iso))
export const fmtMonth = (iso: string) => arMonth.format(parseDate(iso))
export const fmtWeekday = (iso: string) => arWeekday.format(parseDate(iso))
export const sar = (n: number) => `${n.toLocaleString('en-US')} ر.س`

export function daysUntil(iso: string, from = new Date()) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()
  const d = parseDate(iso)
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return Math.round((b - a) / 86400000)
}

export function countdownLabel(days: number) {
  if (days < 0) return 'انتهى'
  if (days === 0) return 'الليلة'
  if (days === 1) return 'غداً'
  if (days === 2) return 'بعد يومين'
  if (days <= 10) return `بعد ${days} أيام`
  return `بعد ${days} يوماً`
}

export const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
