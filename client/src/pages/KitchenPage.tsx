import { Link, useNavigate } from 'react-router-dom'
import { restaurant } from '../config'
import { useAuth } from '../features/auth/AuthContext'
import { useKitchenOrders } from '../features/kitchen/useKitchenOrders'
import { OrderCard } from '../features/kitchen/OrderCard'

export default function KitchenPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading } = useKitchenOrders()

  const active = data?.active ?? []
  const completed = data?.completed ?? []

  return (
    <div className="min-h-svh bg-cream">
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="font-heading text-lg font-bold text-charcoal">
              {restaurant.name}
              <span className="text-brand">.</span> Kitchen
            </span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
              {active.length} active
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'owner' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-charcoal-soft hover:text-brand"
              >
                Admin
              </Link>
            )}
            <span className="hidden text-sm text-charcoal-muted sm:inline">{user?.name}</span>
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="rounded-full bg-cream px-4 py-2 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        {isLoading ? (
          <p className="py-16 text-center text-charcoal-muted">Loading orders…</p>
        ) : active.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-heading text-2xl font-bold text-charcoal">All caught up 🎉</p>
            <p className="mt-1 text-charcoal-muted">New orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {active.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

        {completed.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-charcoal-muted">
              Recently completed
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {completed.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
