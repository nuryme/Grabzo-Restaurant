import { useState } from 'react'
import { AdminLayout } from '../layouts/AdminLayout'
import { taka } from '../lib/format'
import type { MenuItem } from '../types'
import { CategoryManager } from '../features/admin/CategoryManager'
import { MenuItemForm } from '../features/admin/MenuItemForm'
import { useDeleteMenuItem, useMenuData, useToggleAvailability } from '../features/admin/useMenuAdmin'
import { useToast } from '../components/ui/ToastProvider'

export default function AdminMenuPage() {
  const { data, isLoading } = useMenuData()
  const toggleAvailability = useToggleAvailability()
  const deleteItem = useDeleteMenuItem()
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const toast = useToast()

  const categories = data?.categories ?? []
  const items = data?.items ?? []
  const categoryName = (id: string) => categories.find((c) => c._id === id)?.name ?? '—'

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Menu</h1>

      {isLoading ? (
        <p className="py-16 text-center text-charcoal-muted">Loading…</p>
      ) : (
        <div className="mt-6 space-y-6">
          <CategoryManager categories={categories} />

          <MenuItemForm categories={categories} editing={editing} onDone={() => setEditing(null)} />

          {!items.length ? (
            <p className="py-8 text-center text-charcoal-muted">No menu items yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col rounded-2xl bg-white p-4 ring-1 ring-line"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.imageUrl || 'https://placehold.co/80x80?text=%20'}
                      alt=""
                      className="h-16 w-16 flex-none rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading font-semibold text-charcoal">
                        {item.name}
                      </p>
                      <p className="text-sm text-charcoal-muted">{categoryName(item.category)}</p>
                      <p className="mt-1 text-sm font-semibold text-brand-700">
                        {taka(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={(e) =>
                          toggleAvailability.mutate({ id: item._id, available: e.target.checked })
                        }
                        className="h-4 w-4"
                      />
                      Available
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(item)}
                        className="rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          toast.confirm(`Delete ${item.name}?`, 'Delete', () =>
                            deleteItem.mutate(item._id),
                          )
                        }
                        className="rounded-full px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
