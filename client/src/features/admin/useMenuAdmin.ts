import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '../../lib/api'
import type { Category, MenuItem } from '../../types'

const KEY = ['menu']

interface MenuData {
  categories: Category[]
  items: MenuItem[]
}

export function useMenuData() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<MenuData>('/menu'),
  })
}

function useInvalidateMenu() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: KEY })
}

export function useCreateCategory() {
  const invalidate = useInvalidateMenu()
  return useMutation({
    mutationFn: (data: { name: string; sortOrder: number }) =>
      api<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: invalidate,
  })
}

export function useUpdateCategory() {
  const invalidate = useInvalidateMenu()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; sortOrder: number }) =>
      api<Category>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: invalidate,
  })
}

export function useDeleteCategory() {
  const invalidate = useInvalidateMenu()
  return useMutation({
    mutationFn: (id: string) => api<{ ok: true }>(`/admin/categories/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })
}

export interface MenuItemInput {
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  prepTimeMin: number
  available: boolean
  popular: boolean
}

export function useCreateMenuItem() {
  const invalidate = useInvalidateMenu()
  return useMutation({
    mutationFn: (data: MenuItemInput) =>
      api<MenuItem>('/admin/menu-items', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: invalidate,
  })
}

export function useUpdateMenuItem() {
  const invalidate = useInvalidateMenu()
  return useMutation({
    mutationFn: ({ id, ...data }: MenuItemInput & { id: string }) =>
      api<MenuItem>(`/admin/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: invalidate,
  })
}

export function useToggleAvailability() {
  const invalidate = useInvalidateMenu()
  return useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      api<MenuItem>(`/admin/menu-items/${id}/availability`, {
        method: 'PATCH',
        body: JSON.stringify({ available }),
      }),
    onSuccess: invalidate,
  })
}

export function useDeleteMenuItem() {
  const invalidate = useInvalidateMenu()
  return useMutation({
    mutationFn: (id: string) => api<{ ok: true }>(`/admin/menu-items/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })
}

interface UploadSignature {
  signature: string
  timestamp: number
  folder: string
  apiKey: string
  cloudName: string
}

/** Requests a signed upload from our server, then uploads straight to Cloudinary. */
export async function uploadMenuImage(file: File): Promise<string> {
  const sig = await api<UploadSignature>('/admin/upload/signature', { method: 'POST' })

  const form = new FormData()
  form.append('file', file)
  form.append('api_key', sig.apiKey)
  form.append('timestamp', String(sig.timestamp))
  form.append('signature', sig.signature)
  form.append('folder', sig.folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  })
  const body = await res.json()
  if (!res.ok) throw new ApiError(res.status, body?.error?.message ?? 'Image upload failed')
  return body.secure_url as string
}
