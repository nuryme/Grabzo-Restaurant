import { useState } from 'react'
import type { Category } from '../../types'
import { useCreateCategory, useDeleteCategory } from './useMenuAdmin'

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState('')
  const create = useCreateCategory()
  const remove = useDeleteCategory()

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-line">
      <h2 className="font-heading text-lg font-semibold text-charcoal">Categories</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c._id}
            className="flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-sm ring-1 ring-line"
          >
            {c.name}
            <button
              type="button"
              aria-label={`Delete ${c.name}`}
              onClick={() => remove.mutate(c._id)}
              className="text-charcoal-muted hover:text-red-600"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {remove.error && (
        <p className="mt-2 text-sm text-red-600">{(remove.error as Error).message}</p>
      )}
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          create.mutate(
            { name: name.trim(), sortOrder: categories.length },
            { onSuccess: () => setName('') },
          )
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="h-10 flex-1 rounded-lg border border-line px-3 text-sm"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg bg-charcoal px-4 text-sm font-medium text-white hover:bg-charcoal-soft"
        >
          Add
        </button>
      </form>
    </div>
  )
}
