import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'

export interface DashboardStats {
  ordersToday: number
  preparing: number
  ready: number
  completedToday: number
  revenueToday: number
}

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api<DashboardStats>('/admin/dashboard'),
    refetchInterval: 30_000,
  })
}
