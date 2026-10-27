import { useId, useMemo } from 'react'
import type { Scene } from '../types'

// رسومات سماوية مولّدة برمجياً بدلاً من الصور الخارجية، لتعمل العروض دون اتصال

function rng(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 400
const H = 260

function wave(r: () => number, base: number, amp: number, step = 8) {
  const a = [r() * 6, r() * 6, r() * 6]
  const f = [0.012 + r() * 0.01, 0.03 + r() * 0.02, 0.07 + r() * 0.03]
  const pts: string[] = []
  for (let x = 0; x <= W; x += step) {
    const y = base - amp * (0.6 * Math.sin(x * f[0] + a[0]) + 0.3 * Math.sin(x * f[1] + a[1]) + 0.1 * Math.sin(x * f[2] + a[2]))
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return `M0,${H} L${pts.join(' L')} L${W},${H} Z`
}

function jagged(r: () => number, base: number, amp: number, n: number) {
  const pts: string[] = []
  for (let i = 0; i <= n; i++) {
    const x = (W / n) * i
    const y = base - amp * (0.3 + r() * 0.7) * (i % 2 ? 1 : 0.45)
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return `M0,${H} L${pts.join(' L')} L${W},${H} Z`
}

function ground(scene: Scene, r: () => number, ids: { g1: string; g2: string; rim: string }) {
  const far = `url(#${ids.g1})`
  const near = `url(#${ids.g2})`
  switch (scene) {
    case 'dunes':
      return (
        <>
          <path d={wave(r, 205, 18)} fill={far} />
          <path d={wave(r, 225, 22)} fill={near} />
          <path d={wave(r, 244, 14)} fill="#0b0712" opacity=".9" />
          <g transform={`translate(${70 + r() * 220},224)`}>
            <path d="M0,0 L14,-16 L28,0 Z" fill="#120b10" />
            <path d="M10,0 L14,-6 L18,0 Z" fill="#f3b45c" opacity=".9" />
            <circle cx="14" cy="-3" r="14" fill="#f3b45c" opacity=".12" />
          </g>
        </>
      )
    case 'rocks': {
      const rocks = Array.from({ length: 4 }, (_, i) => {
        const x = 30 + i * 95 + r() * 30
        const w = 40 + r() * 45
        const h = 55 + r() * 70
        const top = 232 - h
        return `M${x},236 C${x - 6},${top + h * 0.5} ${x + w * 0.1},${top + 10} ${x + w * 0.35},${top} C${x + w * 0.6},${top - 6} ${x + w * 1.05},${top + 12} ${x + w},${top + h * 0.45} C${x + w * 0.9},${top + h * 0.7} ${x + w * 1.1},${236 - 10} ${x + w},236 Z`
      })
      return (
        <>
          <path d={wave(r, 228, 6)} fill={far} />
          {rocks.map((d, i) => (
            <path key={i} d={d} fill={near} stroke={`url(#${ids.rim})`} strokeWidth="1.2" />
          ))}
          <path d={wave(r, 246, 4)} fill="#0b0712" />
        </>
      )
    }
    case 'crater':
      return (
        <>
          <path d={jagged(r, 200, 18, 10)} fill={far} opacity=".8" />
          <path d={`M0,${H} L0,214 C80,206 120,210 150,222 C180,238 240,238 262,222 C290,208 340,206 ${W},214 L${W},${H} Z`} fill={near} />
          <ellipse cx="206" cy="232" rx="44" ry="5" fill="#e9e4f5" opacity=".55" />
          <ellipse cx="206" cy="232" rx="60" ry="9" fill="#e9e4f5" opacity=".08" />
        </>
      )
    case 'canyon':
      return (
        <>
          <path d={wave(r, 230, 6)} fill={far} />
          <path d={`M0,${H} L0,40 L28,44 L40,70 L62,76 L70,130 L92,150 L98,${H} Z`} fill={near} stroke={`url(#${ids.rim})`} strokeWidth="1" />
          <path d={`M${W},${H} L${W},60 L372,58 L356,90 L340,96 L330,150 L310,170 L302,${H} Z`} fill={near} stroke={`url(#${ids.rim})`} strokeWidth="1" />
          {Array.from({ length: 6 }, (_, i) => {
            const x = 140 + i * 24 + r() * 10
            return (
              <g key={i} transform={`translate(${x},238)`} fill="#0b0712">
                <rect x="-1" y="-22" width="2" height="22" />
                <path d="M0,-22 C-8,-26 -12,-22 -14,-18 M0,-22 C8,-26 12,-22 14,-18 M0,-22 C-4,-30 -10,-30 -12,-28 M0,-22 C4,-30 10,-30 12,-28" stroke="#0b0712" strokeWidth="3" fill="none" />
              </g>
            )
          })}
          <path d={wave(r, 248, 4)} fill="#0b0712" />
        </>
      )
    case 'mountains':
      return (
        <>
          <path d={jagged(r, 190, 60, 9)} fill={far} opacity=".7" />
          <path d={jagged(r, 222, 55, 7)} fill={near} />
          <path d={wave(r, 214, 4)} fill="#c9cfee" opacity=".07" />
          <path d={wave(r, 248, 6)} fill="#0b0712" />
        </>
      )
    case 'cliff':
      return (
        <>
          <ellipse cx="360" cy="236" rx="120" ry="34" fill="#f3b45c" opacity=".16" />
          <path d={wave(r, 238, 3)} fill={far} />
          <path d={`M0,${H} L0,150 L150,146 L190,150 L206,170 L212,214 L230,236 L240,${H} Z`} fill={near} stroke={`url(#${ids.rim})`} strokeWidth="1.2" />
          <g transform="translate(120,146)" fill="#0b0712">
            <rect x="-1" y="-20" width="2" height="20" transform="rotate(-12)" />
            <rect x="-9" y="-30" width="20" height="7" rx="2" transform="rotate(-28)" />
            <circle cx="16" cy="-12" r="4" />
            <rect x="13" y="-9" width="6" height="9" />
          </g>
        </>
      )
    case 'coast':
      return (
        <>
          <rect x="0" y="210" width={W} height="50" fill="#0a1338" />
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={150 + r() * 100} y={216 + i * 5} width={20 + r() * 50} height="1" fill="#f3d79e" opacity={0.35 - i * 0.04} />
          ))}
          <path d={`M0,${H} L0,226 C60,222 90,232 140,234 L180,${H} Z`} fill={near} />
        </>
      )
  }
}

export default function Art({ scene, seed, className = '', milky = true }: { scene: Scene; seed: string; className?: string; milky?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const ids = { sky: `s${uid}`, mw: `m${uid}`, blur: `b${uid}`, g1: `g1${uid}`, g2: `g2${uid}`, rim: `r${uid}`, glow: `w${uid}` }
  const { stars, band, tilt } = useMemo(() => {
    const r = rng(seed + scene)
    const tilt = -35 + r() * 70
    const stars = Array.from({ length: 110 }, () => ({ x: r() * W, y: r() * 200, s: r() < 0.08 ? 1.6 + r() : 0.35 + r() * 0.7, o: 0.4 + r() * 0.6, c: r() < 0.12 ? '#f3d79e' : r() < 0.2 ? '#b9a6ff' : '#ffffff' }))
    const band = Array.from({ length: 90 }, () => ({ x: (r() - 0.5) * 520, y: (r() - 0.5) * 40 * (0.4 + r()), s: 0.3 + r() * 0.5 }))
    return { stars, band, tilt }
  }, [seed, scene])
  const r = rng(seed)
  const warm = scene === 'dunes' || scene === 'rocks' || scene === 'canyon' || scene === 'cliff'
  const eclipse = scene === 'coast'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={ids.sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#03050f" />
          <stop offset=".55" stopColor="#0c1645" />
          <stop offset=".85" stopColor={eclipse ? '#3a3170' : warm ? '#3b2a5e' : '#24306e'} />
          <stop offset="1" stopColor={eclipse ? '#c08a4a' : warm ? '#7a4a4a' : '#3b3f7a'} />
        </linearGradient>
        <radialGradient id={ids.mw}>
          <stop offset="0" stopColor="#f6e9d2" stopOpacity=".55" />
          <stop offset=".35" stopColor="#b9a6ff" stopOpacity=".22" />
          <stop offset="1" stopColor="#13215a" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.blur} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id={ids.g1} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={warm ? '#4a2c2a' : '#262a4f'} />
          <stop offset="1" stopColor="#140d18" />
        </linearGradient>
        <linearGradient id={ids.g2} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={warm ? '#2d1a1c' : '#181a33'} />
          <stop offset="1" stopColor="#0b0712" />
        </linearGradient>
        <linearGradient id={ids.rim} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e6b860" stopOpacity=".5" />
          <stop offset="1" stopColor="#b9a6ff" stopOpacity=".1" />
        </linearGradient>
        <radialGradient id={ids.glow}>
          <stop offset=".3" stopColor="#fff6e0" stopOpacity=".95" />
          <stop offset=".45" stopColor="#f3d79e" stopOpacity=".5" />
          <stop offset="1" stopColor="#8b6cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${ids.sky})`} />
      {milky && !eclipse && (
        <g transform={`translate(200,110) rotate(${tilt})`}>
          <ellipse rx="260" ry="34" fill={`url(#${ids.mw})`} filter={`url(#${ids.blur})`} />
          <ellipse rx="120" ry="7" cx="20" cy="3" fill="#0a0d24" opacity=".45" filter={`url(#${ids.blur})`} />
          {band.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.s} fill="#fff" opacity=".7" />
          ))}
        </g>
      )}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill={s.c} opacity={eclipse ? s.o * 0.4 : s.o} />
      ))}
      {eclipse && (
        <g transform="translate(250,90)">
          <circle r="70" fill={`url(#${ids.glow})`} />
          <circle r="26" fill="#03050f" />
          <circle r="26" fill="none" stroke="#fff6e0" strokeOpacity=".7" strokeWidth="1" />
        </g>
      )}
      {ground(scene, r, ids)}
    </svg>
  )
}
