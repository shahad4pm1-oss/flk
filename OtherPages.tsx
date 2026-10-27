import { useMemo, useState } from 'react'
import { EventCard, ExperienceCard, SiteCard } from '../components/Cards'
import { btnGold, chip, DemoTag, Empty, Icon } from '../components/ui'
import { events } from '../data/events'
import { categories, experiences } from '../data/experiences'
import { sites } from '../data/sites'
import { countdownLabel, daysUntil, fmtDate } from '../lib/format'
import type { Route } from '../lib/store'
import type { AstroEvent } from '../types'
import type { Actions } from '../App'

function PageHead({ eyebrow, title, sub, tag }: { eyebrow: string; title: string; sub: string; tag?: string }) {
  return (
    <header className="grid gap-2">
      <p className="text-gold text-xs tracking-wider">{eyebrow}</p>
      <h1 className="font-display text-3xl sm:text-4xl text-white">{title}</h1>
      <p className="text-mist max-w-2xl">{sub}</p>
      {tag && <div className="mt-1"><DemoTag>{tag}</DemoTag></div>}
    </header>
  )
}

const eventTypes: AstroEvent['type'][] = ['زخة شهب', 'كسوف', 'تقابل كوكبي']

export function CalendarPage({ actions }: { actions: Actions }) {
  const [type, setType] = useState<string>('all')
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [])
  const upcoming = sorted.filter((e) => daysUntil(e.date) >= 0)
  const list = upcoming.filter((e) => type === 'all' || e.type === type)
  const next = upcoming[0]

  return (
    <div className="gutter max-w-5xl mx-auto w-full py-8 grid gap-8">
      <PageHead
        eyebrow="التقويم الفلكي"
        title="مواعيد السماء القادمة"
        sub="أبرز الأحداث المرئية من المملكة مرتبة حسب التاريخ. إضاءة القمر محسوبة تقريبياً لكل تاريخ."
        tag="تواريخ الذروة من التقاويم الفلكية المعروفة، وقد تختلف بيوم. تحقق قبل السفر"
      />

      {next && (
        <div className="relative overflow-hidden rounded-3xl border border-violet/30 bg-gradient-to-l from-deep via-ink to-navy p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-violet/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs text-gold">الحدث القادم</p>
            <h2 className="font-display text-3xl text-white mt-1">{next.title}</h2>
            <p className="text-mist mt-2">{fmtDate(next.date)} · {next.bestTime}</p>
          </div>
          <div className="relative text-center">
            <p className="font-display text-6xl text-gold num">{daysUntil(next.date)}</p>
            <p className="text-sm text-mist">{countdownLabel(daysUntil(next.date))}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="نوع الحدث">
        <button type="button" className={chip(type === 'all')} onClick={() => setType('all')}>كل الأحداث</button>
        {eventTypes.map((t) => (
          <button type="button" key={t} className={chip(type === t)} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty title="لا توجد أحداث من هذا النوع قريباً" hint="اختر نوعاً آخر أو اعرض كل الأحداث." action={<button type="button" className={btnGold} onClick={() => setType('all')}>عرض كل الأحداث</button>} />
      ) : (
        <ol className="grid gap-4 relative">
          {list.map((e) => (
            <li key={e.id}>
              <EventCard ev={e} onSite={actions.openSite} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

type Sort = 'rating' | 'price-asc' | 'price-desc'

export function ExperiencesPage({ actions }: { actions: Actions }) {
  const [cat, setCat] = useState<string>('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('rating')
  const list = useMemo(() => {
    const t = q.trim()
    const r = experiences.filter((e) => (cat === 'all' || e.category === cat) && (!t || (e.title + e.location + e.tagline + e.category).includes(t)))
    return r.sort((a, b) => (sort === 'rating' ? b.rating - a.rating : sort === 'price-asc' ? a.price - b.price : b.price - a.price))
  }, [cat, q, sort])

  return (
    <div className="gutter max-w-7xl mx-auto w-full py-8 grid gap-6">
      <PageHead eyebrow="اكتشف التجارب" title="ليالٍ لا تُنسى تحت سماء المملكة" sub="من رصد النجوم مع فلكي محترف إلى التخييم في الربع الخالي." tag="الأسعار تقديرية والتجارب نماذج للعرض" />
      <div className="glass rounded-3xl p-4 grid gap-3 sm:grid-cols-[1fr_auto] items-center">
        <label className="relative block">
          <span className="sr-only">ابحث عن تجربة</span>
          <Icon name="search" className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-mist" />
          <input id="exp-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن تجربة أو مدينة…" className="w-full rounded-2xl bg-night/70 border border-white/10 py-3 pr-12 pl-4 text-white placeholder:text-mist/60 focus:border-gold outline-none" />
        </label>
        <label className="flex items-center gap-2 text-sm text-mist">
          ترتيب
          <select id="exp-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-xl bg-night/70 border border-white/10 px-3 py-2.5 text-white focus:border-gold outline-none">
            <option value="rating">الأعلى تقييماً</option>
            <option value="price-asc">السعر: الأقل أولاً</option>
            <option value="price-desc">السعر: الأعلى أولاً</option>
          </select>
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:col-span-2" role="group" aria-label="نوع التجربة">
          <button type="button" className={chip(cat === 'all')} onClick={() => setCat('all')}>الكل</button>
          {categories.map((c) => (
            <button type="button" key={c} className={chip(cat === c)} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>
      <p className="text-sm text-mist num">{list.length} تجارب</p>
      {list.length === 0 ? (
        <Empty
          title="لم نجد تجارب مطابقة"
          hint={`لا توجد نتائج${q ? ` لـ «${q}»` : ''}. جرّب كلمة أخرى مثل «العلا» أو «تصوير».`}
          action={<button type="button" className={btnGold} onClick={() => { setQ(''); setCat('all') }}>مسح البحث</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((e) => (
            <ExperienceCard key={e.id} exp={e} fav={actions.isFav('exp', e.id)} onFav={() => actions.toggleFav('exp', e.id)} onOpen={() => actions.openExp(e.id)} onBook={() => actions.book(e.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FavoritesPage({ actions, favs, go }: { actions: Actions; favs: string[]; go: (r: Route) => void }) {
  const favSites = sites.filter((s) => favs.includes('site:' + s.id))
  const favExps = experiences.filter((e) => favs.includes('exp:' + e.id))
  const empty = !favSites.length && !favExps.length
  return (
    <div className="gutter max-w-7xl mx-auto w-full py-8 grid gap-8">
      <PageHead eyebrow="المفضلة" title="رحلتك القادمة" sub="المواقع والتجارب التي حفظتها. تُحفظ على هذا الجهاز فقط." />
      {empty ? (
        <Empty
          title="لا توجد عناصر محفوظة بعد"
          hint="اضغط على أيقونة القلب في أي موقع أو تجربة لحفظها هنا والرجوع إليها لاحقاً."
          action={
            <div className="flex flex-wrap gap-2 justify-center">
              <button type="button" className={btnGold} onClick={() => go('map')}>استكشف المواقع</button>
              <button type="button" className="text-gold text-sm px-4" onClick={() => go('experiences')}>تصفح التجارب</button>
            </div>
          }
        />
      ) : (
        <>
          {favSites.length > 0 && (
            <section className="grid gap-4">
              <h2 className="font-display text-2xl text-white">مواقع محفوظة <span className="text-mist text-base num">({favSites.length})</span></h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favSites.map((s) => (
                  <SiteCard key={s.id} site={s} fav onFav={() => actions.toggleFav('site', s.id)} onOpen={() => actions.openSite(s.id)} />
                ))}
              </div>
            </section>
          )}
          {favExps.length > 0 && (
            <section className="grid gap-4">
              <h2 className="font-display text-2xl text-white">تجارب محفوظة <span className="text-mist text-base num">({favExps.length})</span></h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favExps.map((e) => (
                  <ExperienceCard key={e.id} exp={e} fav onFav={() => actions.toggleFav('exp', e.id)} onOpen={() => actions.openExp(e.id)} onBook={() => actions.book(e.id)} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
