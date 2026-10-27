export type Scene = 'dunes' | 'rocks' | 'crater' | 'canyon' | 'mountains' | 'cliff' | 'coast'

export interface Review { name: string; rating: number; text: string; date: string }

export interface Site {
  id: string
  name: string
  region: string
  lat: number
  lng: number
  scene: Scene
  /** مقياس بورتل التقديري (1 أظلم سماء — 9 سماء مدينة) */
  bortle: number
  /** سطوع السماء التقديري بوحدة mag/arcsec² */
  sqm: number
  /** درجة الملاءمة التقديرية من 10 */
  score: number
  altitude: number
  bestSeason: string
  distance: string
  tagline: string
  description: string
  highlights: string[]
  safety: string[]
  cost: string
  certified?: string
  reviews: Review[]
}

export interface AstroEvent {
  id: string
  title: string
  type: 'زخة شهب' | 'كسوف' | 'تقابل كوكبي' | 'ظاهرة سماوية'
  date: string
  endDate?: string
  bestTime: string
  visibility: 'ممتازة' | 'جيدة' | 'متوسطة'
  visibilityNote: string
  description: string
  rate?: string
  verified: boolean
  suggestedSite?: string
}

export interface Experience {
  id: string
  title: string
  category: 'رصد النجوم' | 'تصوير فلكي' | 'رحلات الصحراء' | 'أحداث فلكية'
  siteId?: string
  location: string
  scene: Scene
  price: number
  duration: string
  groupSize: string
  rating: number
  tagline: string
  description: string
  includes: string[]
  safety: string[]
  reviews: Review[]
}
