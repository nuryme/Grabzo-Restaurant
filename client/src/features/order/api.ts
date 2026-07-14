import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { Order } from '../../types'
import type { CartLine } from './CartContext'

interface ResolvedTable {
  id: string
  tableName: string
}

/** Resolve a QR token to a table. Disabled (and browse-only) when no token is present. */
export function useTable(token: string | null) {
  return useQuery({
    queryKey: ['table', token],
    queryFn: () => api<ResolvedTable>(`/tables/resolve?t=${encodeURIComponent(token!)}`),
    enabled: Boolean(token),
    retry: false,
  })
}

export interface PlaceOrderInput {
  qrToken: string
  lines: CartLine[]
  orderNote?: string
  customerName?: string
  phone?: string
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (input: PlaceOrderInput) =>
      api<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          qrToken: input.qrToken,
          items: input.lines.map((l) => ({
            menuItemId: l.item._id,
            qty: l.qty,
            note: l.note || undefined,
          })),
          orderNote: input.orderNote || undefined,
          customerName: input.customerName || undefined,
          phone: input.phone || undefined,
        }),
      }),
  })
}
