import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { Order } from '../../types'

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => api<Order>(`/orders/${id}`),
    enabled: Boolean(id),
  })
}
