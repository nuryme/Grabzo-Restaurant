import { useState } from 'react'
import { taka } from '../../lib/format'
import { useAdvanceStatus, useCancelOrder, useUpdateEstimate } from './useKitchenOrders'
import { useToast } from '../../components/ui/ToastProvider'
import type { Order, OrderStatus } from '../../types'

const NEXT_ACTION: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  received: { label: 'Accept', next: 'accepted' },
  accepted: { label: 'Start preparing', next: 'preparing' },
  preparing: { label: 'Mark ready', next: 'ready' },
  ready: { label: 'Complete', next: 'completed' },
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  received: 'bg-brand-50 text-brand-700',
  accepted: 'bg-blue-50 text-blue-700',
  preparing: 'bg-amber-50 text-amber-700',
  ready: 'bg-accent-50 text-accent-600',
  completed: 'bg-cream text-charcoal-muted',
  cancelled: 'bg-red-50 text-red-700',
}

function minutesAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}

export function OrderCard({ order }: { order: Order }) {
  const status = order.status as OrderStatus
  const advance = useAdvanceStatus()
  const cancel = useCancelOrder()
  const estimate = useUpdateEstimate()
  const toast = useToast()
  const [estValue, setEstValue] = useState(order.estimatedMinutes)

  const action = NEXT_ACTION[status]
  const cancellable = status === 'received' || status === 'accepted' || status === 'preparing'
  const active = cancellable || status === 'ready'

  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-line">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-heading text-lg font-bold text-charcoal">
            #{order.orderNumber} · {order.tableName}
          </p>
          <p className="text-sm text-charcoal-muted">{minutesAgo(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[status]}`}>
          {status}
        </span>
      </div>

      <ul className="mt-4 space-y-2 border-t border-line pt-4">
        {order.items.map((it, i) => (
          <li key={i}>
            <p className="font-medium text-charcoal">
              {it.qty} × {it.name}
            </p>
            {it.note && <p className="text-sm text-brand-700">↳ {it.note}</p>}
          </li>
        ))}
      </ul>

      {order.orderNote && (
        <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-sm text-charcoal-soft">
          Note: {order.orderNote}
        </p>
      )}

      {order.cancelReason && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          Cancelled: {order.cancelReason}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-sm text-charcoal-muted">
        <span>Total {taka(order.total)}</span>
        {active && <span>Est. {order.estimatedMinutes} min</span>}
      </div>

      {/* Estimate controls */}
      {active && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={estValue}
            onChange={(e) => setEstValue(Number(e.target.value))}
            className="h-10 w-16 rounded-xl border border-line bg-cream px-2 text-center outline-none focus:border-brand"
            aria-label="Estimated minutes"
          />
          <button
            onClick={() => estimate.mutate({ id: order._id, estimatedMinutes: estValue })}
            className="h-10 rounded-xl bg-cream px-3 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50"
          >
            Set
          </button>
          <button
            onClick={() => {
              const next = order.estimatedMinutes + 5
              setEstValue(next)
              estimate.mutate({ id: order._id, estimatedMinutes: next })
            }}
            className="h-10 rounded-xl bg-cream px-3 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50"
          >
            +5 min
          </button>
        </div>
      )}

      {/* Primary + cancel actions */}
      {action && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => advance.mutate({ id: order._id, status: action.next })}
            disabled={advance.isPending}
            className="h-12 flex-1 rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            {action.label}
          </button>
          {cancellable && (
            <button
              onClick={() =>
                toast.prompt(
                  `Cancel order #${order.orderNumber}?`,
                  'Cancel order',
                  (reason) => cancel.mutate({ id: order._id, reason: reason || undefined }),
                  'Reason (optional)',
                )
              }
              className="h-12 rounded-full bg-white px-5 font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </article>
  )
}
