import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import type { Category, MenuItem } from '../../types'
import {
  uploadMenuImage,
  useCreateMenuItem,
  useUpdateMenuItem,
  type MenuItemInput,
} from './useMenuAdmin'

const EMPTY: MenuItemInput = {
  name: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  prepTimeMin: 10,
  available: true,
  popular: false,
}

export function MenuItemForm({
  categories,
  editing,
  onDone,
}: {
  categories: Category[]
  editing: MenuItem | null
  onDone: () => void
}) {
  const create = useCreateMenuItem()
  const update = useUpdateMenuItem()
  const { register, handleSubmit, reset, setValue, watch, formState } = useForm<MenuItemInput>({
    defaultValues: EMPTY,
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const imageUrl = watch('imageUrl')

  useEffect(() => {
    reset(
      editing
        ? {
            name: editing.name,
            description: editing.description,
            price: editing.price,
            category: editing.category,
            imageUrl: editing.imageUrl,
            prepTimeMin: editing.prepTimeMin,
            available: editing.available,
            popular: editing.popular ?? false,
          }
        : { ...EMPTY, category: categories[0]?._id ?? '' },
    )
  }, [editing, categories, reset])

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      if (editing) {
        await update.mutateAsync({ id: editing._id, ...values })
      } else {
        await create.mutateAsync(values)
      }
      onDone()
    } catch (e) {
      setError((e as Error).message || 'Save failed')
    }
  })

  const pending = create.isPending || update.isPending

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 ring-1 ring-line">
      <h2 className="font-heading text-lg font-semibold text-charcoal">
        {editing ? `Edit ${editing.name}` : 'Add menu item'}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-charcoal-muted">Name</span>
          <input
            {...register('name', { required: true })}
            className="h-11 w-full rounded-lg border border-line px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-charcoal-muted">Category</span>
          <select
            {...register('category', { required: true })}
            className="h-11 w-full rounded-lg border border-line px-3"
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-charcoal-muted">Price (৳)</span>
          <input
            type="number"
            min={0}
            {...register('price', { required: true, valueAsNumber: true })}
            className="h-11 w-full rounded-lg border border-line px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-charcoal-muted">Prep time (min)</span>
          <input
            type="number"
            min={1}
            {...register('prepTimeMin', { required: true, valueAsNumber: true })}
            className="h-11 w-full rounded-lg border border-line px-3"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-charcoal-muted">Description</span>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full rounded-lg border border-line px-3 py-2"
          />
        </label>

        <div className="text-sm sm:col-span-2">
          <span className="mb-1 block text-charcoal-muted">Image</span>
          <div className="flex items-center gap-3">
            {imageUrl && (
              <img src={imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setUploading(true)
                setError('')
                try {
                  setValue('imageUrl', await uploadMenuImage(file))
                } catch (err) {
                  setError((err as Error).message || 'Upload failed')
                } finally {
                  setUploading(false)
                }
              }}
              className="text-sm"
            />
            {uploading && <span className="text-charcoal-muted">Uploading…</span>}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('available')} className="h-4 w-4" />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('popular')} className="h-4 w-4" />
          Popular (featured on landing page)
        </label>
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-4 flex gap-3">
        <Button type="submit" disabled={pending || uploading || formState.isSubmitting}>
          {editing ? 'Save changes' : 'Add item'}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
