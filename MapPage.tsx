import { useMemo, useState } from 'react'
import Art from '../components/Art'
import SiteMap from '../components/SiteMap'
import { BortleMeter } from '../components/Details'
import { btnGold, chip, DemoTag, Empty, FavButton, Icon } from '../components/ui'
import { regions, sites, suitability, suitabilityMeta, type Suitability } from '../data/sites'
import type { Actions } from '../App'

const suitOrder: Suitability[] = ['excellent', 'very-good', 'good', 'fair']

export default function MapPage({ actions, selected, setSelected }: { actions: Actions; selected: string | null; setSelected: (id: string | null) => void }) {
  const [region, setRegion] = useState<string>('all')
  const [suit, setSuit] = useState<Suitability | 'all'>('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(
    () =>
      sites.filter(
        (s) =>
          (region === 'all' || s.region === region) &&
          (suit === 'all' || suitability(s) === suit) &&
          (!q.trim() || (s.name + s.region + s.tagline).includes(q.trim())),
      ),
    [region, suit, q],
  )
  const current = filtered.find((s) => s.id === selected) ?? null
  const reset = () => {
    setRegion('all')
    setSuit('all')
    setQ('')
  }

  return (
    <div className="gutter max-w-7xl mx-auto w-full py-8 grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-gold text-xs tracking-wider mb-2">خريطة مواقع الرصد</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white">اختر سماءك</h1>
        </div>
        <DemoTag>مستويات التلوث الضوئي تقديرية وليست قياسات حقيقية</DemoTag>
      </header>

      <div className="glass rounded-3xl p-4 grid gap-3">
        <label className="relative block">
          <span className="sr-only">ابحث عن موقع</span>
          <Icon name="search" className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-mist" />
          <input id="site-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الموقع أو المنطقة…" className="w-full rounded-2xl bg-night/70 border border-white/10 py-3 pr-12 pl-4 text-white placeholder:text-mist/60 focus:border-gold outline-none" />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="تصفية حسب المنطقة">
          <button type="button" className={chip(region === 'all')} onClick={() => setRegion('all')}>كل المناطق</button>
          {regions.map((r) => (
            <button type="button" key={r} className={chip(region === r)} onClick={() => setRegion(r)}>{r}</button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="تصفية حسب الملاءمة">
          <button type="button" className={chip(suit === 'all')} onClick={() => setSuit('all')}>كل مستويات الملاءمة</button>
          {suitOrder.map((k) => (
            <button type="button" key={k} className={chip(suit === k) + ' inline-flex items-center gap-2'} onClick={() => setSuit(k)}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: suitabilityMeta[k].color }} />
              {suitabilityMeta[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-5 items-start">
        <div className="grid gap-3 order-2 lg:order-1 min-w-0">
          <p className="text-sm text-mist num">{filtered.length} من {sites.length} مواقع</p>
          {filtered.length === 0 ? (
            <Empty title="لا توجد مواقع مطابقة" hint="جرّب منطقة أخرى أو مستوى ملاءمة مختلفاً، أو امسح كلمات البحث." action={<button type="button" className={btnGold} onClick={reset}>إعادة ضبط الفلاتر</button>} />
          ) : (
            filtered.map((s) => {
              const meta = suitabilityMeta[suitability(s)]
              const active = s.id === selected
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-right transition ${active ? 'border-gold/70 bg-deep/70' : 'border-white/10 bg-navy/60 hover:border-white/30'}`}
                >
                  <Art scene={s.scene} seed={s.id} milky={false} className="w-20 h-16 rounded-xl shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg text-white truncate">{s.name}</span>
                    <span className="block text-xs text-mist">{s.region}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs" style={{ color: meta.color }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
                      {meta.label} · <span className="num font-mono">بورتل {s.bortle}</span>
                    </span>
                  </span>
                  <span className="num font-mono text-sm text-gold shrink-0">{s.score.toFixed(1)}</span>
                </button>
              )
            })
          )}
        </div>

        <div className="order-1 lg:order-2 grid gap-4 lg:sticky lg:top-24 min-w-0">
          <div className="relative rounded-3xl overflow-hidden border border-white/10">
            <SiteMap sites={filtered} selectedId={selected} onSelect={setSelected} className="h-[360px] sm:h-[480px] w-full" />
            <div className="absolute bottom-3 right-3 z-[500] rounded-2xl bg-night/85 border border-white/10 p-3 text-xs grid gap-1.5">
              {suitOrder.map((k) => (
                <span key={k} className="flex items-center gap-2 text-mist">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: suitabilityMeta[k].color }} />
                  {suitabilityMeta[k].label}
                </span>
              ))}
            </div>
          </div>

          {current ? (
            <div className="glass rounded-3xl p-5 grid gap-4 fade-up" key={current.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gold">{current.region}</p>
                  <h2 className="font-display text-2xl text-white">{current.name}</h2>
                  <p className="text-sm text-mist mt-1">{current.tagline}</p>
                </div>
                <FavButton active={actions.isFav('site', current.id)} onClick={() => actions.toggleFav('site', current.id)} compact />
              </div>
              <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
                <div className="grid gap-2">
                  <p className="text-xs text-mist">التلوث الضوئي (تقديري): <span className="text-sand num font-mono">بورتل {current.bortle} · {current.sqm.toFixed(1)} mag/arcsec²</span></p>
                  <BortleMeter value={current.bortle} />
                  <p className="text-sm" style={{ color: suitabilityMeta[suitability(current)].color }}>
                    ملاءمة الرصد: {suitabilityMeta[suitability(current)].label}، {suitabilityMeta[suitability(current)].note}
                  </p>
                </div>
                <button type="button" className={btnGold} onClick={() => actions.openSite(current.id)}>التفاصيل الكاملة</button>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-mist glass rounded-3xl p-5">اختر موقعاً من الخريطة أو القائمة لعرض مستوى التلوث الضوئي ومدى ملاءمته للرصد.</p>
          )}
        </div>
      </div>
    </div>
  )
}
