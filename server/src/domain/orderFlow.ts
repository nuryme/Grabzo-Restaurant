/** Order lifecycle rules — the single source of truth for status transitions. */

export const ORDER_STATUSES = [
  'received',
  'accepted',
  'preparing',
  'ready',
  'completed',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

/** Forward-only path; one step at a time, no skipping. */
const NEXT: Record<OrderStatus, OrderStatus | null> = {
  received: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
  cancelled: null,
}

/** Cancellation is allowed only before the order is Ready. */
const CANCELLABLE: OrderStatus[] = ['received', 'accepted', 'preparing']

export function canAdvance(from: OrderStatus, to: OrderStatus): boolean {
  return NEXT[from] === to
}

export function canCancel(from: OrderStatus): boolean {
  return CANCELLABLE.includes(from)
}

/** Statuses that still need kitchen attention (shown as "active"). */
export const ACTIVE_STATUSES: OrderStatus[] = ['received', 'accepted', 'preparing', 'ready']
