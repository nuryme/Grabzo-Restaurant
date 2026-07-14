import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { getSocket } from '../../lib/socket'
import { playChime } from './chime'
import type { Order, OrderStatus } from '../../types'

interface OrdersResponse {
  active: Order[]
  completed: Order[]
}

/** Live list of kitchen orders. Refetches on new orders / status changes and
 *  plays a chime when a new order arrives. */
export function useKitchenOrders() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: () => api<OrdersResponse>('/orders'),
    refetchInterval: 30_000, // safety net if a socket event is missed
  })

  useEffect(() => {
    const socket = getSocket()
    socket.emit('kitchen:join', localStorage.getItem('grabzo_token'))

    const onNew = () => {
      playChime()
      qc.invalidateQueries({ queryKey: ['orders'] })
    }
    const onStatus = () => qc.invalidateQueries({ queryKey: ['orders'] })

    socket.on('order:new', onNew)
    socket.on('order:status', onStatus)
    return () => {
      socket.off('order:new', onNew)
      socket.off('order:status', onStatus)
    }
  }, [qc])

  return query
}

export function useAdvanceStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api<Order>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api<Order>(`/orders/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useUpdateEstimate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estimatedMinutes }: { id: string; estimatedMinutes: number }) =>
      api<Order>(`/orders/${id}/estimate`, {
        method: 'PATCH',
        body: JSON.stringify({ estimatedMinutes }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}
