import Art from '../components/Art'
import { EventCard, ExperienceCard, SiteCard } from '../components/Cards'
import { btnGhost, btnGold, Icon, SectionHead } from '../components/ui'
import { events } from '../data/events'
import { experiences } from '../data/experiences'
import { sites } from '../data/sites'
import { daysUntil, fmtDate, toISO } from '../lib/format'
import { darkSkyRating, moonInfo } from '../lib/moon'
import type { Route } from '../lib/store'
import type { Actions } from '../App'

function MoonGlyph({ phase }: { phase: number }) {
  // الجزء المضيء = نصف قرص + قوس الفاصل بين الليل والنهار على القمر
  const waxing = phase < 0.5
  const k = Math.cos(phase * 2 * Math.PI)
  const rx = (Math.abs(k) * 44).toFixed(2)
  const crescent = k > 0
  const lit = waxing
    ? `M0,-44 A44,44 0 0 1 0,44 A${rx},44 0 0 ${crescent ? 0 : 1} 0,-44`
    : `M0,-44 A44,44 0 0 0 0,44 A${rx},44 0 0 ${crescent ? 1 : 0} 0,-44`
  return (
    <svg viewBox="-50 -50 100 100" className="w-14 h-14 shrink-0" aria-hidden="true">
      <circle r="44" fill="#1A2550" />
      <path d={lit} fill="#F3D79E" />
      <circle r="44" fill="none" stroke="#F3D79E" strokeOpacity=".3" />
    </svg>
  )
}

export default function Home({ go, actions }: { go: (r: Route) => void; actions: Actions }) {
  const moon = moonInfo(new Date())
  const tonight = darkSkyRating(moon.illumination)
  const upcoming = events.filter((e) => daysUntil(e.date) >= 0).slice(0, 3)
  const topSites = [...sites].sort((a, b) => b.score - a.score).slice(0, 3)
  const featured = [...experiences].sort((a, b) => b.rating - a.rating).slice(0, 3)
  const next = upcoming[0]

  return (
    <div className="grid gap-16 sm:gap-24 pb-10">
      <section className="relative overflow-hidden rounded-b-[2.5rem] sm:rounded-[2.5rem] sm:mt-4 border-b sm:border border-white/10">
        <Art scene="rocks" seed="hero-falak" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-l from-night/90 via-night/55 to-transparent" />
        <div className="relative gutter py-16 sm:py-24 sm:px-12 max-w-3xl fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-night/50 px-3 py-1 text-xs text-gold-soft mb-5">
            <Icon name="star" filled className="w-3.5 h-3.5" />السياحة الفلكية في المملكة العربية السعودية
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.15] text-white">
            سماء الجزيرة العربية <span className="gold-text">كما رآها الأجداد</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-mist leading-relaxed max-w-xl">
            اكتشف أظلم مواقع الرصد من العُلا إلى الربع الخالي، وتابع زخات الشهب والكسوف القادم، واحجز ليلتك تحت درب التبانة.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className={btnGold + ' px-6 py-3 text-base'} onClick={() => go('map')}>
              <Icon name="compass" className="w-5 h-5" />استكشف مواقع الرصد
            </button>
            <button type="button" className={btnGhost + ' px-6 py-3 text-base bg-night/40'} onClick={() => go('experiences')}>
              تصفّح التجارب
            </button>
          </div>
        </div>
      </section>

      <div className="gutter max-w-6xl mx-auto w-full grid gap-16 sm:gap-24 -mt-8 sm:-mt-14">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-4">
          <div className="glass rounded-3xl p-5 flex items-center gap-5">
            <MoonGlyph phase={moon.phase} />
            <div className="min-w-0">
              <p className="text-xs text-mist">سماء الليلة · {fmtDate(toISO(new Date()))}</p>
              <p className="font-display text-xl text-white">{moon.name} <span className="text-mist text-base num">· إضاءة {moon.illumination}%</span></p>
              <p className={`text-sm ${tonight.tone === 'good' ? 'text-emerald-300' : tonight.tone === 'mid' ? 'text-gold' : 'text-rose-200'}`}>{tonight.label}</p>
            </div>
          </div>
          {next && (
            <button type="button" onClick={() => go('calendar')} className="glass rounded-3xl p-5 flex items-center justify-between gap-4 text-right hover:border-violet/50 transition">
              <div className="min-w-0">
                <p className="text-xs text-mist">الحدث القادم</p>
                <p className="font-display text-xl text-white">{next.title}</p>
                <p className="text-sm text-gold">{fmtDate(next.date)}</p>
              </div>
              <div className="text-center shrink-0">
                <p className="font-display text-4xl text-violet-soft num">{daysUntil(next.date)}</p>
                <p className="text-xs text-mist">يوماً</p>
              </div>
            </button>
          )}
        </div>

        <section>
          <SectionHead
            eyebrow="مواقع الرصد"
            title="أظلم سماء في المملكة"
            sub="مواقع مختارة بحسب انخفاض التلوث الضوئي وسهولة الوصول. القيم المعروضة تقديرية لأغراض العرض."
            action={<button type="button" className={btnGhost} onClick={() => go('map')}><Icon name="map" className="w-4 h-4" />كل المواقع على الخريطة</button>}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topSites.map((s) => (
              <SiteCard key={s.id} site={s} fav={actions.isFav('site', s.id)} onFav={() => actions.toggleFav('site', s.id)} onOpen={() => actions.openSite(s.id)} />
            ))}
          </div>
        </section>

        <section>
          <SectionHead
            eyebrow="التقويم الفلكي"
            title="أحداث قادمة تستحق السهر"
            action={<button type="button" className={btnGhost} onClick={() => go('calendar')}><Icon name="calendar" className="w-4 h-4" />التقويم الكامل</button>}
          />
          <div className="grid lg:grid-cols-3 gap-4">
            {upcoming.map((e) => (
              <EventCard key={e.id} ev={e} compact />
            ))}
          </div>
        </section>

        <section>
          <SectionHead
            eyebrow="تجارب مميزة"
            title="عِش الليلة، لا تكتفِ بمشاهدتها"
            action={<button type="button" className={btnGhost} onClick={() => go('experiences')}>كل التجارب<Icon name="arrow" className="w-4 h-4" /></button>}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((e) => (
              <ExperienceCard key={e.id} exp={e} fav={actions.isFav('exp', e.id)} onFav={() => actions.toggleFav('exp', e.id)} onOpen={() => actions.openExp(e.id)} onBook={() => actions.book(e.id)} />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10">
          <Art scene="coast" seed="eclipse-banner" className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-l from-night/95 via-night/70 to-night/20" />
          <div className="relative p-7 sm:p-12 max-w-xl grid gap-4">
            <p className="text-gold text-sm">2 أغسطس 2027</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white">الكسوف الكلي يعبر غرب المملكة</h2>
            <p className="text-mist leading-relaxed">أحد أطول حالات الكسوف الكلي في هذا القرن، ويمر مساره فوق جدة ومكة المكرمة. فرصة تاريخية لوضع المملكة على خريطة السياحة الفلكية العالمية.</p>
            <div><button type="button" className={btnGold} onClick={() => actions.openExp('eclipse-camp')}>اكتشف مخيم الكسوف</button></div>
          </div>
        </section>
      </div>
    </div>
  )
}
