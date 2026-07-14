import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '../../lib/socket'
import type { Order } from '../../types'

/**
 * Live-updates a customer's order tracking page: joins the order's room and
 * patches the React Query cache when the kitchen changes status or estimate.
 */
export function useOrderLive(id: string) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!id) return
    const socket = getSocket()
    socket.emit('order:join', id)

    const onStatus = (order: Order) => {
      if (order._id === id) qc.setQueryData(['order', id], order)
    }
    const onEstimate = ({ id: oid, estimatedMinutes }: { id: string; estimatedMinutes: number }) => {
      if (oid !== id) return
      qc.setQueryData<Order>(['order', id], (prev) =>
        prev ? { ...prev, estimatedMinutes } : prev,
      )
    }

    socket.on('order:status', onStatus)
    socket.on('order:estimate', onEstimate)
    return () => {
      socket.off('order:status', onStatus)
      socket.off('order:estimate', onEstimate)
    }
  }, [id, qc])
}
