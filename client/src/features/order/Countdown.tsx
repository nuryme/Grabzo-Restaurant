import { useEffect, useState } from 'react'
import type { Order } from '../../types'

/**
 * Time display for the tracking card.
 *
 * The live countdown only starts once the kitchen hits "Start preparing" —
 * before that the food isn't being cooked, so a ticking timer would be
 * misleading. While the order is waiting (received/accepted) we show the
 * expected prep time statically. Hidden once ready/completed/cancelled.
 */
export function Countdown({ order }: { order: Order }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (order.status === 'ready' || order.status === 'completed' || order.status === 'cancelled') {
    return null
  }

  // Not being cooked yet — show the estimate, no countdown.
  if (order.status !== 'preparing') {
    return (
      <div className="mt-4 rounded-2xl bg-cream p-5 text-center">
        <p className="font-heading text-4xl font-bold text-charcoal">~{order.estimatedMinutes} min</p>
        <p className="mt-1 text-sm text-charcoal-muted">estimated prep time</p>
        <p className="mt-1 text-xs text-charcoal-muted">
          The timer starts when the kitchen begins preparing your order.
        </p>
      </div>
    )
  }

  // Preparing: count down from when preparing started + the current estimate.
  const preparingAt = order.statusHistory?.find((s) => s.status === 'preparing')?.at
  const start = preparingAt ? new Date(preparingAt).getTime() : now
  const target = start + order.estimatedMinutes * 60_000
  const remainingMs = target - now
  const overdue = remainingMs <= 0

  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return (
    <div className="mt-4 rounded-2xl bg-cream p-5 text-center">
      {overdue ? (
        <>
          <p className="font-heading text-3xl font-bold text-brand">Any moment now…</p>
          <p className="mt-1 text-sm text-charcoal-muted">Your food is nearly ready</p>
        </>
      ) : (
        <>
          <p className="font-heading text-5xl font-bold tabular-nums text-charcoal" aria-live="polite">
            {minutes}
            <span className="text-2xl text-charcoal-muted"> min </span>
            {String(seconds).padStart(2, '0')}
            <span className="text-2xl text-charcoal-muted"> s</span>
          </p>
          <p className="mt-1 text-sm text-charcoal-muted">estimated time left</p>
        </>
      )}
    </div>
  )
}
