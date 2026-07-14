import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { Table } from '../../types'

const KEY = ['admin', 'tables']

export function useTables() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<Table[]>('/tables'),
  })
}

export function useCreateTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (tableName: string) =>
      api<Table>('/tables', { method: 'POST', body: JSON.stringify({ tableName }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useBulkCreateTables() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { count: number; prefix: string }) =>
      api<Table[]>('/tables/bulk', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api<{ ok: true }>(`/tables/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
