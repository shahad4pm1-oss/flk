import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { Site } from '../types'
import { suitability, suitabilityMeta } from '../data/sites'
import regionGeo from '../data/region.geo.json'

interface Props {
  sites: Site[]
  selectedId: string | null
  onSelect: (id: string) => void
  className?: string
}

const KSA_BOUNDS = L.latLngBounds([16.2, 34.5], [32.2, 55.7])

function pinIcon(site: Site, active: boolean) {
  const color = suitabilityMeta[suitability(site)].color
  return L.divIcon({
    className: '',
    html: `<div class="site-pin ${active ? 'active' : ''}" style="color:${color}"><span style="background:${color}"></span></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

export default function SiteMap({ sites, selectedId, onSelect, className = '' }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!el.current) return
    const m = L.map(el.current, { zoomControl: true, attributionControl: true, minZoom: 4, maxZoom: 11, scrollWheelZoom: false })
    m.fitBounds(KSA_BOUNDS)
    // خريطة أساس متجهة تبقى ظاهرة حتى لو تعذّر تحميل بلاطات OpenStreetMap
    L.geoJSON(regionGeo as GeoJSON.FeatureCollection, {
      style: (f) =>
        f?.properties?.ksa
          ? { color: '#E6B860', weight: 1.6, fillColor: '#1A2A6E', fillOpacity: 0.55, opacity: 0.9 }
          : { color: '#3A4680', weight: 0.8, fillColor: '#0E1640', fillOpacity: 0.5, opacity: 0.7 },
      interactive: false,
    }).addTo(m)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    const ro = new ResizeObserver(() => m.invalidateSize())
    ro.observe(el.current)
    return () => {
      ro.disconnect()
      m.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    const g = layer.current
    if (!g) return
    g.clearLayers()
    sites.forEach((s) => {
      const mk = L.marker([s.lat, s.lng], { icon: pinIcon(s, s.id === selectedId), keyboard: true, title: s.name, zIndexOffset: s.id === selectedId ? 1000 : 0 })
      mk.bindTooltip(s.name, { direction: 'top', offset: [0, -10], className: 'site-label', permanent: s.id === selectedId })
      mk.on('click', () => onSelectRef.current(s.id))
      mk.addTo(g)
    })
  }, [sites, selectedId])

  useEffect(() => {
    const s = sites.find((x) => x.id === selectedId)
    if (s && map.current) map.current.flyTo([s.lat, s.lng], Math.max(map.current.getZoom(), 6), { duration: 0.8 })
  }, [selectedId, sites])

  return <div ref={el} dir="ltr" className={className} aria-label="خريطة مواقع الرصد في المملكة" />
}
