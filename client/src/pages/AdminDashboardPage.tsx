import { AdminLayout } from '../layouts/AdminLayout'
import { taka } from '../lib/format'
import { useDashboard } from '../features/admin/useDashboard'

const STAT_CARDS = [
  { key: 'ordersToday', label: "Today's Orders" },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'completedToday', label: 'Completed Today' },
] as const

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard()

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Dashboard</h1>

      {isLoading ? (
        <p className="py-16 text-center text-charcoal-muted">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {STAT_CARDS.map(({ key, label }) => (
            <div key={key} className="rounded-2xl bg-white p-5 ring-1 ring-line">
              <p className="h-10 text-sm text-charcoal-muted">{label}</p>
              <p className="mt-1 font-heading text-3xl font-bold text-charcoal">
                {data?.[key] ?? 0}
              </p>
            </div>
          ))}
          <div className="rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100">
            <p className="h-10 text-sm text-brand-700">Today's Revenue</p>
            <p className="mt-1 font-heading text-3xl font-bold text-brand-700">
              {taka(data?.revenueToday ?? 0)}
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
