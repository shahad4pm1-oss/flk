import type { AstroEvent, Experience, Site } from '../types'
import { sites, suitability, suitabilityMeta } from '../data/sites'
import { countdownLabel, daysUntil, fmtDay, fmtMonth, fmtWeekday, parseDate, sar } from '../lib/format'
import { moonInfo } from '../lib/moon'
import Art from './Art'
import { btnGhost, btnGold, FavButton, Icon, Stars } from './ui'

export function ExperienceCard({ exp, fav, onFav, onOpen, onBook }: { exp: Experience; fav: boolean; onFav: () => void; onOpen: () => void; onBook: () => void }) {
  return (
    <article className="group glass rounded-3xl overflow-hidden flex flex-col hover:border-gold/40 transition">
      <div className="relative">
        <Art scene={exp.scene} seed={exp.id} className="w-full aspect-[16/10] block transition duration-700 group-hover:scale-[1.03]" />
        <div className="absolute top-3 left-3"><FavButton active={fav} onClick={onFav} compact /></div>
        <span className="absolute top-3 right-3 rounded-full bg-night/70 border border-white/10 px-3 py-1 text-xs text-gold-soft">{exp.category}</span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-white leading-snug">{exp.title}</h3>
          <Stars value={exp.rating} className="shrink-0 mt-1" />
        </div>
        <p className="text-sm text-mist">{exp.tagline}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-mist">
          <span className="flex items-center gap-1"><Icon name="pin" className="w-4 h-4 text-gold" />{exp.location}</span>
          <span className="flex items-center gap-1"><Icon name="clock" className="w-4 h-4 text-gold" />{exp.duration}</span>
        </div>
        <div className="mt-auto pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-mist">يبدأ من (تقديري)</p>
            <p className="font-display text-xl text-gold num">{sar(exp.price)}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className={btnGhost + ' px-4'} onClick={onOpen}>عرض التفاصيل</button>
            <button type="button" className={btnGold + ' px-4'} onClick={onBook}>احجز</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function SiteCard({ site, fav, onFav, onOpen }: { site: Site; fav: boolean; onFav: () => void; onOpen: () => void }) {
  const suit = suitabilityMeta[suitability(site)]
  return (
    <article className="group glass rounded-3xl overflow-hidden flex flex-col hover:border-gold/40 transition">
      <button type="button" onClick={onOpen} className="relative text-right" aria-label={`تفاصيل ${site.name}`}>
        <Art scene={site.scene} seed={site.id} className="w-full aspect-[16/10] block transition duration-700 group-hover:scale-[1.03]" />
        <span className="absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-medium bg-night/80" style={{ color: suit.color }}>ملاءمة {suit.label}</span>
      </button>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-gold">{site.region}</p>
            <h3 className="font-display text-xl text-white">{site.name}</h3>
          </div>
          <FavButton active={fav} onClick={onFav} compact />
        </div>
        <p className="text-sm text-mist">{site.tagline}</p>
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-mist">
          <span className="num font-mono">بورتل {site.bortle} · {site.sqm.toFixed(1)} mag</span>
          <button type="button" onClick={onOpen} className="text-gold hover:underline inline-flex items-center gap-1">التفاصيل<Icon name="arrow" className="w-4 h-4" /></button>
        </div>
      </div>
    </article>
  )
}

const visColor = { ممتازة: '#6EE7B7', جيدة: '#E6B860', متوسطة: '#F59E8B' } as const

export function EventCard({ ev, onSite, compact = false }: { ev: AstroEvent; onSite?: (id: string) => void; compact?: boolean }) {
  const days = daysUntil(ev.date)
  const moon = moonInfo(parseDate(ev.date))
  const site = sites.find((s) => s.id === ev.suggestedSite)
  return (
    <article className="glass rounded-3xl p-5 flex gap-4 sm:gap-5 hover:border-violet/50 transition">
      <div className="shrink-0 w-[68px] rounded-2xl bg-gradient-to-b from-deep to-night border border-white/10 text-center py-2.5 h-fit">
        <p className="text-[11px] text-gold">{fmtMonth(ev.date)}</p>
        <p className="font-display text-3xl text-white num leading-tight">{fmtDay(ev.date)}</p>
        <p className="text-[10px] text-mist num">{parseDate(ev.date).getFullYear()}</p>
      </div>
      <div className="min-w-0 flex-1 grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet/15 px-2.5 py-0.5 text-xs text-violet-soft">{ev.type}</span>
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-sand num">{countdownLabel(days)}</span>
        </div>
        <h3 className="font-display text-xl text-white">{ev.title}</h3>
        {!compact && <p className="text-sm text-mist leading-relaxed">{ev.description}</p>}
        <dl className={`grid ${compact ? "" : "sm:grid-cols-2"} gap-x-4 gap-y-1.5 text-xs`}>
          <div className="flex gap-1.5"><dt className="text-mist">أفضل وقت:</dt><dd className="text-sand">{ev.bestTime}</dd></div>
          <div className="flex gap-1.5">
            <dt className="text-mist">المشاهدة من السعودية:</dt>
            <dd style={{ color: visColor[ev.visibility] }}>{ev.visibility}</dd>
          </div>
          {ev.rate && <div className="flex gap-1.5"><dt className="text-mist">المعدل:</dt><dd className="text-sand">{ev.rate}</dd></div>}
          {ev.type !== 'كسوف' && (
            <div className="flex gap-1.5"><dt className="text-mist">إضاءة القمر:</dt><dd className="text-sand num">~{moon.illumination}% ({moon.name})</dd></div>
          )}
        </dl>
        {!compact && <p className="text-xs text-mist border-r-2 border-gold/40 pr-3">{ev.visibilityNote}</p>}
        {!compact && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-[11px] text-mist">{fmtWeekday(ev.date)}{ev.endDate ? ' – ليلة الذروة' : ''}</span>
            {site && onSite && (
              <button type="button" onClick={() => onSite(site.id)} className="text-xs text-gold hover:underline inline-flex items-center gap-1">
                <Icon name="pin" className="w-3.5 h-3.5" />موقع مقترح: {site.name}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
