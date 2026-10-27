import { useCallback, useState } from 'react'
import { BookingModal, ExperienceDetail, SiteDetail } from './components/Details'
import { Icon } from './components/ui'
import { experiences } from './data/experiences'
import { sites } from './data/sites'
import { useFavorites, useHashRoute, type FavKind, type Route } from './lib/store'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import { CalendarPage, ExperiencesPage, FavoritesPage } from './pages/OtherPages'

export interface Actions {
  openSite: (id: string) => void
  openExp: (id: string) => void
  book: (id: string) => void
  isFav: (k: FavKind, id: string) => boolean
  toggleFav: (k: FavKind, id: string) => void
}

const nav: { id: Route; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { id: 'home', label: 'الرئيسية', icon: 'star' },
  { id: 'map', label: 'الخريطة', icon: 'map' },
  { id: 'calendar', label: 'التقويم', icon: 'calendar' },
  { id: 'experiences', label: 'التجارب', icon: 'telescope' },
  { id: 'favorites', label: 'المفضلة', icon: 'heart' },
]

export default function App() {
  const { route, go } = useHashRoute()
  const { favs, has, toggle } = useFavorites()
  const [siteId, setSiteId] = useState<string | null>(null)
  const [expId, setExpId] = useState<string | null>(null)
  const [bookId, setBookId] = useState<string | null>(null)
  const [mapSel, setMapSel] = useState<string | null>(null)

  const actions: Actions = {
    openSite: useCallback((id: string) => { setExpId(null); setSiteId(id) }, []),
    openExp: useCallback((id: string) => { setSiteId(null); setExpId(id) }, []),
    book: useCallback((id: string) => { setExpId(null); setBookId(id) }, []),
    isFav: has,
    toggleFav: toggle,
  }
  const site = sites.find((s) => s.id === siteId) ?? null
  const exp = experiences.find((e) => e.id === expId) ?? null
  const bookExp = experiences.find((e) => e.id === bookId) ?? null
  const favCount = favs.length

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <div className="sky" />
      <header className="sticky z-[900] bg-night/75 backdrop-blur-md border-b border-white/5" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="gutter max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
          <button type="button" onClick={() => go('home')} className="flex items-center gap-2.5" aria-label="فلك: الصفحة الرئيسية">
            <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
              <circle cx="16" cy="16" r="14" fill="none" stroke="#E6B860" strokeWidth="1.5" />
              <path d="M16 5l2.2 8.8L27 16l-8.8 2.2L16 27l-2.2-8.8L5 16l8.8-2.2z" fill="#F3D79E" />
            </svg>
            <span className="font-display text-2xl text-white leading-none">فَلَك</span>
            <span className="hidden sm:inline text-xs text-mist border-r border-white/15 pr-2.5">السياحة الفلكية السعودية</span>
          </button>
          <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
            {nav.map((n) => (
              <button
                type="button"
                key={n.id}
                onClick={() => go(n.id)}
                aria-current={route === n.id ? 'page' : undefined}
                className={`relative rounded-full px-4 py-2 text-sm transition ${route === n.id ? 'bg-white/10 text-gold' : 'text-mist hover:text-white'}`}
              >
                {n.label}
                {n.id === 'favorites' && favCount > 0 && <span className="mr-1.5 rounded-full bg-gold text-night text-[10px] font-bold px-1.5 num">{favCount}</span>}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1" key={route}>
        <div className="fade-up">
          {route === 'home' && <Home go={go} actions={actions} />}
          {route === 'map' && <MapPage actions={actions} selected={mapSel} setSelected={setMapSel} />}
          {route === 'calendar' && <CalendarPage actions={actions} />}
          {route === 'experiences' && <ExperiencesPage actions={actions} />}
          {route === 'favorites' && <FavoritesPage actions={actions} favs={favs} go={go} />}
        </div>
      </main>

      <footer className="gutter border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto py-8 flex flex-wrap items-center justify-between gap-3 text-xs text-mist">
          <p>فَلَك · نموذج أولي لهاكاثون السياحة الفلكية في المملكة العربية السعودية</p>
          <p>جميع المواقع والأسعار والتقييمات بيانات تجريبية لأغراض العرض. بيانات الخريطة © OpenStreetMap.</p>
        </div>
      </footer>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-[900] bg-night/90 backdrop-blur-md border-t border-white/10 grid grid-cols-5"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
        aria-label="التنقل السفلي"
      >
        {nav.map((n) => (
          <button type="button" key={n.id} onClick={() => go(n.id)} aria-current={route === n.id ? 'page' : undefined} className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] ${route === n.id ? 'text-gold' : 'text-mist'}`}>
            <Icon name={n.icon} className="w-5 h-5" filled={n.id === 'favorites' && route === n.id} />
            {n.label}
            {n.id === 'favorites' && favCount > 0 && <span className="absolute top-1.5 left-1/2 -translate-x-[-10px] rounded-full bg-gold text-night text-[9px] font-bold px-1 num">{favCount}</span>}
          </button>
        ))}
      </nav>

      <SiteDetail
        site={site}
        onClose={() => setSiteId(null)}
        fav={site ? has('site', site.id) : false}
        onFav={() => site && toggle('site', site.id)}
        onShowMap={site ? () => { setMapSel(site.id); setSiteId(null); go('map') } : undefined}
        onOpenExp={actions.openExp}
      />
      <ExperienceDetail
        exp={exp}
        onClose={() => setExpId(null)}
        fav={exp ? has('exp', exp.id) : false}
        onFav={() => exp && toggle('exp', exp.id)}
        onBook={() => exp && actions.book(exp.id)}
        onOpenSite={actions.openSite}
      />
      {bookExp && <BookingModal key={bookExp.id} exp={bookExp} onClose={() => setBookId(null)} />}
    </div>
  )
}
