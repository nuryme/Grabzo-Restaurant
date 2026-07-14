import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { restaurant } from '../config'
import { taka } from '../lib/format'
import { useOrder } from '../features/order/useOrder'
import { useOrderLive } from '../features/order/useOrderLive'
import { Countdown } from '../features/order/Countdown'
import { getActiveOrders } from '../features/order/activeOrder'
import { PROGRESS_STEPS, STATUS_HEADLINE, stepIndex } from '../features/order/statusMeta'
import type { OrderStatus } from '../types'

export default function OrderStatusPage() {
  const { id = '' } = useParams()
  const stored = getActiveOrders()
  const orderIds = useMemo(
    () => Array.from(new Set([...(stored?.orderIds ?? []), id].filter(Boolean))),
    [stored, id],
  )

  return (
    <div className="min-h-svh bg-cream">
      <div className="border-b border-line bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link to="/" className="font-heading text-lg font-bold text-charcoal">
            {restaurant.name}
            <span className="text-brand">.</span>
          </Link>
          {stored?.token && (
            <Link
              to={`/order?t=${stored.token}`}
              className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Order more
            </Link>
          )}
        </Container>
      </div>

      <Container className="max-w-xl space-y-6 py-8">
        {orderIds.map((orderId) => (
          <OrderTrackingCard key={orderId} id={orderId} />
        ))}
      </Container>
    </div>
  )
}

function OrderTrackingCard({ id }: { id: string }) {
  const { data: order, isLoading, isError } = useOrder(id)
  useOrderLive(id)

  if (isLoading) {
    return <CardShell>Loading your order…</CardShell>
  }
  if (isError || !order) {
    return <CardShell>We couldn't find that order.</CardShell>
  }

  const status = order.status as OrderStatus
  const cancelled = status === 'cancelled'
  const current = stepIndex(status)

  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">
          {STATUS_HEADLINE[status]}
        </h1>
        <span className="text-sm text-charcoal-muted">
          #{order.orderNumber} · {order.tableName}
        </span>
      </div>

      {cancelled ? (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {order.cancelReason
            ? `Reason: ${order.cancelReason}`
            : 'This order was cancelled. Please speak to our staff.'}
        </p>
      ) : (
        <>
          <Countdown order={order} />
          <Progress current={current} />
        </>
      )}

      <div className="mt-8">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-charcoal-muted">
          Your items
        </h2>
        <ul className="mt-3 divide-y divide-line">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-start justify-between py-3">
              <div>
                <p className="font-medium text-charcoal">
                  {it.qty} × {it.name}
                </p>
                {it.note && <p className="text-sm text-charcoal-muted">Note: {it.note}</p>}
              </div>
              <span className="font-medium text-charcoal">{taka(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        {order.orderNote && (
          <p className="mt-3 text-sm text-charcoal-muted">Kitchen note: {order.orderNote}</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="font-medium text-charcoal-muted">Total</span>
          <span className="font-heading text-xl font-bold text-charcoal">
            {taka(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}

function Progress({ current }: { current: number }) {
  return (
    <ol className="mt-6 space-y-3">
      {PROGRESS_STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step.key} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                done
                  ? 'bg-accent text-white'
                  : active
                    ? 'bg-brand text-white'
                    : 'bg-cream text-charcoal-muted ring-1 ring-line'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={`font-medium ${active ? 'text-charcoal' : done ? 'text-charcoal-soft' : 'text-charcoal-muted'}`}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6 text-center text-charcoal-muted ring-1 ring-line sm:p-8">
      {children}
    </div>
  )
}
