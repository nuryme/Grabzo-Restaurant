import { useMemo, useState } from 'react'
import { useMenu } from '../menu/useMenu'
import { DishCard } from './DishCard'
import type { MenuItem } from '../../types'

export function OrderMenu({ canOrder }: { canOrder: boolean }) {
  const { data, isLoading } = useMenu()
  const [cat, setCat] = useState<string>('all')
  const [q, setQ] = useState('')

  const items = useMemo(() => {
    if (!data) return []
    const query = q.trim().toLowerCase()
    return data.items.filter((it: MenuItem) => {
      const matchCat = cat === 'all' || it.category === cat
      const matchQ =
        !query ||
        it.name.toLowerCase().includes(query) ||
        it.description.toLowerCase().includes(query)
      return matchCat && matchQ
    })
  }, [data, cat, q])

  return (
    <div>
      {/* Search + category chips stick under the table banner. */}
      <div className="sticky top-0 z-20 -mx-5 border-b border-line bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the menu…"
          className="mb-3 h-11 w-full rounded-full border border-line bg-cream px-5 text-sm outline-none focus:border-brand focus:bg-white"
          aria-label="Search the menu"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>
            All
          </Chip>
          {data?.categories.map((c) => (
            <Chip key={c._id} active={cat === c._id} onClick={() => setCat(c._id)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((it) => <DishCard key={it._id} item={it} canOrder={canOrder} />)}
      </div>

      {!isLoading && items.length === 0 && (
        <p className="py-16 text-center text-charcoal-muted">No dishes match your search.</p>
      )}
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
        active ? 'bg-charcoal text-white' : 'bg-cream text-charcoal-soft hover:bg-brand-50'
      }`}
    >
      {children}
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <div className="h-40 w-full animate-pulse bg-cream" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-cream" />
        <div className="h-3 w-full animate-pulse rounded bg-cream" />
        <div className="h-8 w-1/3 animate-pulse rounded bg-cream" />
      </div>
    </div>
  )
}
