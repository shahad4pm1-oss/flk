import { useState } from 'react'
import type { Experience, Review, Site } from '../types'
import { bortleLabel, sites, suitability, suitabilityMeta } from '../data/sites'
import { experiences } from '../data/experiences'
import { fmtDate, sar, toISO } from '../lib/format'
import Art from './Art'
import { btnGhost, btnGold, DemoTag, FavButton, Icon, Modal, Stars } from './ui'

export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length)
    return <p className="text-mist text-sm rounded-2xl border border-white/10 p-4">لا توجد تقييمات بعد. ستكون من أوائل المشاركين في هذه التجربة.</p>
  return (
    <ul className="grid gap-3">
      {reviews.map((r, i) => (
        <li key={i} className="rounded-2xl border border-white/10 bg-night/40 p-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-semibold text-sand">{r.name}</span>
            <span className="flex items-center gap-2 text-xs text-mist">
              <span className="text-gold" aria-label={`${r.rating} من 5`}>{'★'.repeat(r.rating)}<span className="text-white/20">{'★'.repeat(5 - r.rating)}</span></span>
              {r.date}
            </span>
          </div>
          <p className="text-sm text-mist leading-relaxed">{r.text}</p>
        </li>
      ))}
    </ul>
  )
}

function Section({ title, icon, children }: { title: string; icon: Parameters<typeof Icon>[0]['name']; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <h3 className="flex items-center gap-2 font-display text-lg text-white">
        <Icon name={icon} className="w-5 h-5 text-gold" />
        {title}
      </h3>
      {children}
    </section>
  )
}

export function BortleMeter({ value }: { value: number }) {
  return (
    <div>
      <div className="flex gap-1" aria-label={`مقياس بورتل ${value} من 9`}>
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 rounded-full ${i + 1 === value ? 'ring-2 ring-white/80' : ''}`}
            style={{ background: `hsl(${235 - i * 26} ${40 + i * 6}% ${12 + i * 7}%)`, opacity: i + 1 <= value ? 1 : 0.45 }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-mist mt-1 num font-mono">
        <span>1 مظلمة</span>
        <span>9 مدينة</span>
      </div>
    </div>
  )
}

export function SiteDetail({ site, onClose, fav, onFav, onShowMap, onOpenExp }: { site: Site | null; onClose: () => void; fav: boolean; onFav: () => void; onShowMap?: () => void; onOpenExp: (id: string) => void }) {
  if (!site) return null
  const suit = suitabilityMeta[suitability(site)]
  const related = experiences.filter((e) => e.siteId === site.id)
  return (
    <Modal open onClose={onClose} label={site.name} wide>
      <div className="relative">
        <Art scene={site.scene} seed={site.id} className="w-full h-56 sm:h-72 block" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy to-transparent" />
        <div className="absolute bottom-4 right-5 left-5">
          <p className="text-gold text-sm flex items-center gap-1"><Icon name="pin" className="w-4 h-4" />{site.region}</p>
          <h2 className="font-display text-3xl text-white">{site.name}</h2>
        </div>
      </div>
      <div className="p-5 sm:p-7 grid gap-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full px-3 py-1 text-sm font-medium" style={{ background: suit.color + '22', color: suit.color }}>ملاءمة الرصد: {suit.label}</span>
          {site.certified && <span className="rounded-full px-3 py-1 text-sm bg-violet/15 text-violet-soft">{site.certified}</span>}
          <DemoTag>القياسات تقديرية</DemoTag>
        </div>
        <p className="text-mist leading-loose">{site.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['مقياس بورتل', `${site.bortle} من 9`],
            ['سطوع السماء', `${site.sqm.toFixed(1)}`],
            ['الارتفاع', `${site.altitude.toLocaleString('en-US')} م`],
            ['أفضل موسم', site.bestSeason],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-white/10 bg-night/40 p-3">
              <p className="text-[11px] text-mist">{k}</p>
              <p className="num font-mono text-lg text-sand mt-1">{v}</p>
            </div>
          ))}
        </div>

        <Section title="مستوى التلوث الضوئي" icon="moon">
          <BortleMeter value={site.bortle} />
          <p className="text-sm text-mist">
            {bortleLabel(site.bortle)}. {suit.note}. سطوع السماء التقديري {site.sqm.toFixed(1)} mag/arcsec² (كلما ارتفع الرقم كانت السماء أظلم).
          </p>
        </Section>

        <div className="grid sm:grid-cols-2 gap-6">
          <Section title="الموقع والتكلفة" icon="pin">
            <ul className="text-sm text-mist grid gap-2">
              <li>المسافة: <span className="text-sand">{site.distance}</span></li>
              <li>الإحداثيات: <span className="num font-mono text-sand" dir="ltr">{site.lat.toFixed(2)}°N, {site.lng.toFixed(2)}°E</span></li>
              <li>التكلفة التقديرية: <span className="text-gold">{site.cost}</span></li>
            </ul>
          </Section>
          <Section title="اشتراطات السلامة" icon="shield">
            <ul className="text-sm text-mist grid gap-2">
              {site.safety.map((s) => (
                <li key={s} className="flex gap-2"><Icon name="check" className="w-4 h-4 mt-0.5 shrink-0 text-emerald-300" />{s}</li>
              ))}
            </ul>
          </Section>
        </div>

        {related.length > 0 && (
          <Section title="تجارب في هذا الموقع" icon="telescope">
            <div className="grid gap-2">
              {related.map((e) => (
                <button key={e.id} type="button" onClick={() => onOpenExp(e.id)} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-night/40 p-3 text-right hover:border-gold/50 transition">
                  <span className="min-w-0">
                    <span className="block text-sand truncate">{e.title}</span>
                    <span className="text-xs text-mist">{e.duration}</span>
                  </span>
                  <span className="text-gold text-sm whitespace-nowrap num">{sar(e.price)}</span>
                </button>
              ))}
            </div>
          </Section>
        )}

        <Section title="التقييمات" icon="star">
          <Reviews reviews={site.reviews} />
        </Section>

        <div className="flex flex-wrap gap-3 sticky bottom-0 -mx-5 sm:-mx-7 px-5 sm:px-7 py-4 bg-navy/95 border-t border-white/10">
          <FavButton active={fav} onClick={onFav} label="حفظ الموقع" />
          {onShowMap && (
            <button type="button" className={btnGhost} onClick={onShowMap}>
              <Icon name="map" className="w-4 h-4" />عرض على الخريطة
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export function ExperienceDetail({ exp, onClose, fav, onFav, onBook, onOpenSite }: { exp: Experience | null; onClose: () => void; fav: boolean; onFav: () => void; onBook: () => void; onOpenSite: (id: string) => void }) {
  if (!exp) return null
  const site = sites.find((s) => s.id === exp.siteId)
  return (
    <Modal open onClose={onClose} label={exp.title} wide>
      <div className="relative">
        <Art scene={exp.scene} seed={exp.id} className="w-full h-56 sm:h-72 block" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy to-transparent" />
        <div className="absolute bottom-4 right-5 left-5">
          <p className="text-gold text-sm">{exp.category}</p>
          <h2 className="font-display text-3xl text-white">{exp.title}</h2>
        </div>
      </div>
      <div className="p-5 sm:p-7 grid gap-7">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mist">
          <Stars value={exp.rating} />
          <span className="flex items-center gap-1.5"><Icon name="pin" className="w-4 h-4 text-gold" />{exp.location}</span>
          <span className="flex items-center gap-1.5"><Icon name="clock" className="w-4 h-4 text-gold" />{exp.duration}</span>
          <span className="flex items-center gap-1.5"><Icon name="users" className="w-4 h-4 text-gold" />{exp.groupSize}</span>
        </div>
        <p className="text-mist leading-loose">{exp.description}</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Section title="تشمل التجربة" icon="check">
            <ul className="text-sm text-mist grid gap-2">
              {exp.includes.map((s) => (
                <li key={s} className="flex gap-2"><Icon name="star" filled className="w-3.5 h-3.5 mt-1 shrink-0 text-gold" />{s}</li>
              ))}
            </ul>
          </Section>
          <Section title="اشتراطات السلامة" icon="shield">
            <ul className="text-sm text-mist grid gap-2">
              {exp.safety.map((s) => (
                <li key={s} className="flex gap-2"><Icon name="check" className="w-4 h-4 mt-0.5 shrink-0 text-emerald-300" />{s}</li>
              ))}
            </ul>
          </Section>
        </div>

        {site && (
          <Section title="موقع التجربة" icon="map">
            <button type="button" onClick={() => onOpenSite(site.id)} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-night/40 p-3 text-right hover:border-gold/50 transition">
              <Art scene={site.scene} seed={site.id} milky={false} className="w-20 h-14 rounded-xl shrink-0" />
              <span className="min-w-0">
                <span className="block text-sand">{site.name}</span>
                <span className="text-xs text-mist">مقياس بورتل {site.bortle} · ملاءمة {suitabilityMeta[suitability(site)].label}</span>
              </span>
            </button>
          </Section>
        )}

        <Section title="التقييمات" icon="star">
          <Reviews reviews={exp.reviews} />
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 -mx-5 sm:-mx-7 px-5 sm:px-7 py-4 bg-navy/95 border-t border-white/10">
          <div>
            <p className="text-xs text-mist">السعر التقديري للفرد</p>
            <p className="font-display text-2xl text-gold num">{sar(exp.price)}</p>
          </div>
          <div className="flex gap-2">
            <FavButton active={fav} onClick={onFav} compact />
            <button type="button" className={btnGold} onClick={onBook}>احجز التجربة</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function BookingModal({ exp, onClose }: { exp: Experience | null; onClose: () => void }) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [date, setDate] = useState(toISO(new Date(tomorrow.getTime() + 6 * 86400000)))
  const [people, setPeople] = useState(2)
  const [name, setName] = useState('')
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState('')
  if (!exp) return null
  const total = exp.price * people

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || date < toISO(tomorrow)) return setError('اختر تاريخاً يبدأ من الغد.')
    if (people < 1 || people > 12) return setError('عدد الأشخاص يجب أن يكون بين 1 و12.')
    setError('')
    setDone('FLK-' + Math.random().toString(36).slice(2, 7).toUpperCase())
  }

  return (
    <Modal open onClose={onClose} label={`حجز ${exp.title}`}>
      {done ? (
        <div className="p-7 text-center grid gap-4 justify-items-center">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-emerald-400/15 text-emerald-300 mt-4">
            <Icon name="check" className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl text-white">تم استلام طلب الحجز</h2>
          <p className="text-mist text-sm max-w-xs">
            {name ? `شكراً ${name}، ` : ''}حجزك لتجربة «{exp.title}» يوم <span className="text-sand">{fmtDate(date)}</span> لعدد <span className="text-sand num">{people}</span> {people > 2 ? 'أشخاص' : people === 2 ? 'شخصين' : 'شخص'}.
          </p>
          <div className="rounded-2xl border border-white/10 bg-night/50 px-5 py-3 grid gap-1">
            <span className="text-xs text-mist">رقم الحجز التجريبي</span>
            <span className="font-mono text-xl text-gold tracking-widest" dir="ltr">{done}</span>
          </div>
          <DemoTag>حجز تجريبي: لم يتم أي دفع أو تأكيد فعلي</DemoTag>
          <button type="button" className={btnGold} onClick={onClose}>تم</button>
        </div>
      ) : (
        <form onSubmit={submit} className="p-6 sm:p-7 grid gap-5" noValidate>
          <div className="pl-10">
            <p className="text-gold text-sm">حجز تجربة</p>
            <h2 className="font-display text-2xl text-white">{exp.title}</h2>
            <p className="text-mist text-sm mt-1">{exp.location} · {exp.duration}</p>
          </div>
          <label className="grid gap-1.5 text-sm">
            <span className="text-sand">تاريخ التجربة</span>
            <input id="book-date" type="date" required min={toISO(tomorrow)} value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl bg-night border border-white/15 px-4 py-3 text-white num focus:border-gold outline-none" />
          </label>
          <div className="grid gap-1.5 text-sm">
            <span className="text-sand" id="people-label">عدد الأشخاص</span>
            <div className="flex items-center gap-3" role="group" aria-labelledby="people-label">
              <button type="button" aria-label="إنقاص" onClick={() => setPeople((p) => Math.max(1, p - 1))} className="w-11 h-11 rounded-xl border border-white/15 text-xl text-sand hover:border-gold">−</button>
              <output id="book-people" className="num font-mono text-2xl text-white w-10 text-center">{people}</output>
              <button type="button" aria-label="زيادة" onClick={() => setPeople((p) => Math.min(12, p + 1))} className="w-11 h-11 rounded-xl border border-white/15 text-xl text-sand hover:border-gold">+</button>
              <span className="text-xs text-mist">الحد الأقصى 12</span>
            </div>
          </div>
          <label className="grid gap-1.5 text-sm">
            <span className="text-sand">الاسم <span className="text-mist">(اختياري)</span></span>
            <input id="book-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: سارة" className="rounded-xl bg-night border border-white/15 px-4 py-3 text-white focus:border-gold outline-none" />
          </label>
          <div className="flex items-center justify-between rounded-2xl bg-night/50 border border-white/10 px-4 py-3">
            <span className="text-mist text-sm num">{sar(exp.price)} × {people}</span>
            <span className="font-display text-2xl text-gold num">{sar(total)}</span>
          </div>
          {error && <p className="text-rose-300 text-sm" role="alert">{error}</p>}
          <button type="submit" className={btnGold + ' py-3 text-base'}>تأكيد الحجز التجريبي</button>
          <p className="text-center text-xs text-mist">نموذج عرض فقط. لا يوجد دفع إلكتروني.</p>
        </form>
      )}
    </Modal>
  )
}
