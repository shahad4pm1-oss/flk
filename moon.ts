const SYNODIC = 29.530588853
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)

/** حساب تقريبي لعمر القمر ونسبة إضاءته في تاريخ معين */
export function moonInfo(date: Date) {
  const days = (date.getTime() - REF_NEW_MOON) / 86400000
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC
  const phase = age / SYNODIC
  const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100)
  const names = ['محاق', 'هلال متزايد', 'تربيع أول', 'أحدب متزايد', 'بدر', 'أحدب متناقص', 'تربيع ثانٍ', 'هلال متناقص']
  const name = names[Math.round(phase * 8) % 8]
  return { age, phase, illumination, name }
}

/** هل الليلة مناسبة لرصد الأجرام الخافتة؟ */
export function darkSkyRating(illumination: number) {
  if (illumination <= 25) return { label: 'ليلة مثالية للرصد', tone: 'good' as const }
  if (illumination <= 60) return { label: 'رصد جيد بعد غياب القمر', tone: 'mid' as const }
  return { label: 'القمر ساطع: الأفضل لرصد القمر والكواكب', tone: 'low' as const }
}
