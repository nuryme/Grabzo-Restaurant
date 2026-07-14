import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { fallbackFeatured } from '../../config'
import type { Category, MenuItem } from '../../types'

interface MenuResponse {
  categories: Category[]
  items: MenuItem[]
}

/** Full menu (used by the ordering page). */
export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: () => api<MenuResponse>('/menu'),
  })
}

/**
 * Featured dishes for the landing page. Falls back to sample data when the
 * backend isn't running yet, so the marketing page always renders.
 */
export function useFeatured() {
  return useQuery({
    queryKey: ['menu', 'featured'],
    queryFn: async () => {
      try {
        const { items } = await api<MenuResponse>('/menu')
        const popular = items.filter((i) => i.popular && i.available)
        return (popular.length ? popular : items.slice(0, 4)) || fallbackFeatured
      } catch {
        return fallbackFeatured
      }
    },
    initialData: fallbackFeatured,
  })
}
