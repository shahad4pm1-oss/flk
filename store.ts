import { useCallback, useEffect, useState } from 'react'

export type FavKind = 'site' | 'exp'
const KEY = 'falak:favorites'

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

/** المفضلة محفوظة محلياً في متصفح المستخدم */
export function useFavorites() {
  const [favs, setFavs] = useState<string[]>(read)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favs))
    } catch {
      /* التخزين غير متاح: تبقى المفضلة لهذه الجلسة فقط */
    }
  }, [favs])
  const key = (kind: FavKind, id: string) => `${kind}:${id}`
  const has = useCallback((kind: FavKind, id: string) => favs.includes(key(kind, id)), [favs])
  const toggle = useCallback((kind: FavKind, id: string) => {
    const k = key(kind, id)
    setFavs((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]))
  }, [])
  return { favs, has, toggle }
}

export type Route = 'home' | 'map' | 'calendar' | 'experiences' | 'favorites'
const ROUTES: Route[] = ['home', 'map', 'calendar', 'experiences', 'favorites']

export function useHashRoute() {
  const get = (): Route => {
    const h = window.location.hash.replace('#', '') as Route
    return ROUTES.includes(h) ? h : 'home'
  }
  const [route, setRoute] = useState<Route>(get)
  useEffect(() => {
    const on = () => setRoute(get())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = useCallback((r: Route) => {
    if (window.location.hash !== '#' + r) window.location.hash = r
    else setRoute(r)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  return { route, go }
}
