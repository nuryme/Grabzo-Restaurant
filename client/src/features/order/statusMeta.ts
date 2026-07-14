import type { OrderStatus } from '../../types'

/** Customer-facing progress steps (cancelled is handled separately). */
export const PROGRESS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
]

export function stepIndex(status: OrderStatus): number {
  return PROGRESS_STEPS.findIndex((s) => s.key === status)
}

export const STATUS_HEADLINE: Record<OrderStatus, string> = {
  received: 'Order received',
  accepted: 'The kitchen has your order',
  preparing: 'Your food is being prepared',
  ready: 'Your order is ready!',
  completed: 'Enjoy your meal!',
  cancelled: 'Order cancelled',
}
