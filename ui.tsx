import { useEffect, type ReactNode } from 'react'

type IconName = 'star' | 'heart' | 'map' | 'calendar' | 'compass' | 'pin' | 'clock' | 'users' | 'close' | 'search' | 'shield' | 'moon' | 'arrow' | 'check' | 'telescope' | 'info'

const paths: Record<IconName, ReactNode> = {
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" />,
  map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zm0 0v14m6-12v14" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4m8-4v4" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  pin: <><path d="M12 21s-6-5.5-6-11a6 6 0 0112 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7m5.5 8.5a6.5 6.5 0 00-4-6" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  shield: <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />,
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  arrow: <path d="M19 12H5m6-6l-6 6 6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  telescope: <path d="M3 13l12-6 2 4-12 6zM14 9.5l4-2 2 4-4 2M9 15l-3 6m5-6l3 6" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-9.5v.5" /></>,
}

export function Icon({ name, className = 'w-5 h-5', filled = false }: { name: IconName; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export function Stars({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-gold ${className}`}>
      <Icon name="star" filled className="w-4 h-4" />
      <span className="num font-mono text-sm">{value.toFixed(1)}</span>
    </span>
  )
}

export function FavButton({ active, onClick, label = 'المفضلة', compact = false }: { active: boolean; onClick: () => void; label?: string; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-pressed={active}
      aria-label={active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      className={`inline-flex items-center gap-2 rounded-full border transition ${compact ? 'p-2' : 'px-4 py-2 text-sm'} ${
        active ? 'bg-rose-400/15 border-rose-300/40 text-rose-200' : 'bg-night/60 border-white/15 text-sand hover:border-gold/60 hover:text-gold'
      }`}
    >
      <Icon name="heart" filled={active} className="w-4 h-4" />
      {!compact && <span>{active ? 'في المفضلة' : label}</span>}
    </button>
  )
}

export function DemoTag({ children = 'بيانات تجريبية' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-gold/50 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold-soft">
      <Icon name="info" className="w-3.5 h-3.5" />
      {children}
    </span>
  )
}

export function Modal({ open, onClose, children, label, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; label: string; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" aria-label="إغلاق" className="absolute inset-0 bg-night/80 backdrop-blur-sm cursor-default" onClick={onClose} />
      <div
        className={`pop relative w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-navy shadow-2xl shadow-black/60`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-3 left-3 z-10 rounded-full bg-night/70 p-2 text-sand hover:text-gold border border-white/10"
        >
          <Icon name="close" className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function Empty({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="glass rounded-3xl px-6 py-12 text-center flex flex-col items-center gap-3">
      <div className="grid place-items-center w-14 h-14 rounded-full bg-violet/15 text-violet-soft">
        <Icon name="telescope" className="w-7 h-7" />
      </div>
      <h3 className="font-display text-xl text-sand">{title}</h3>
      <p className="text-mist text-sm max-w-sm">{hint}</p>
      {action}
    </div>
  )
}

export function SectionHead({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        <p className="text-gold text-xs tracking-wider mb-2">{eyebrow}</p>
        <h2 className="font-display text-2xl sm:text-3xl text-white">{title}</h2>
        {sub && <p className="text-mist mt-2 max-w-2xl text-sm sm:text-base">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export const btnGold = 'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-gold to-gold-soft px-5 py-2.5 text-sm font-semibold text-night shadow-lg shadow-gold/20 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed'
export const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-sand hover:border-gold/60 hover:text-gold transition'
export const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm transition whitespace-nowrap ${active ? 'bg-violet/25 border-violet text-white' : 'border-white/15 text-mist hover:border-white/40 hover:text-sand'}`
