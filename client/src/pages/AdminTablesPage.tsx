import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { Button } from '../components/ui/Button'
import { useBulkCreateTables, useCreateTable, useDeleteTable, useTables } from '../features/admin/useTables'
import { useToast } from '../components/ui/ToastProvider'

export default function AdminTablesPage() {
  const { data: tables, isLoading } = useTables()
  const createTable = useCreateTable()
  const bulkCreate = useBulkCreateTables()
  const deleteTable = useDeleteTable()
  const toast = useToast()

  const [name, setName] = useState('')
  const [bulkCount, setBulkCount] = useState(5)
  const [bulkPrefix, setBulkPrefix] = useState('Table')

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Tables</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form
          className="flex items-end gap-3 rounded-2xl bg-white p-5 ring-1 ring-line"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            createTable.mutate(name.trim(), { onSuccess: () => setName('') })
          }}
        >
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-charcoal-muted">New table name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Table 9"
              className="h-11 w-full rounded-lg border border-line px-3"
            />
          </label>
          <Button type="submit" disabled={createTable.isPending}>
            Add
          </Button>
        </form>

        <form
          className="flex items-end gap-3 rounded-2xl bg-white p-5 ring-1 ring-line"
          onSubmit={(e) => {
            e.preventDefault()
            if (bulkCount < 1) return
            bulkCreate.mutate({ count: bulkCount, prefix: bulkPrefix.trim() || 'Table' })
          }}
        >
          <label className="w-20 text-sm">
            <span className="mb-1 block text-charcoal-muted">Count</span>
            <input
              type="number"
              min={1}
              max={100}
              value={bulkCount}
              onChange={(e) => setBulkCount(Number(e.target.value))}
              className="h-11 w-full rounded-lg border border-line px-3"
            />
          </label>
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-charcoal-muted">Prefix</span>
            <input
              value={bulkPrefix}
              onChange={(e) => setBulkPrefix(e.target.value)}
              className="h-11 w-full rounded-lg border border-line px-3"
            />
          </label>
          <Button type="submit" variant="secondary" disabled={bulkCreate.isPending}>
            Bulk generate
          </Button>
        </form>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-charcoal-muted">Loading…</p>
      ) : !tables?.length ? (
        <p className="py-16 text-center text-charcoal-muted">No tables yet — add one above.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <div
              key={table._id}
              className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-line"
            >
              <p className="h-8 font-heading text-lg font-semibold text-charcoal">
                {table.tableName}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <a
                  href={`/order?t=${table.qrToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50"
                >
                  Open
                </a>
                <Link
                  to={`/admin/tables/print?name=${encodeURIComponent(table.tableName)}&token=${table.qrToken}`}
                  target="_blank"
                  className="rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50"
                >
                  Print QR
                </Link>
                <button
                  onClick={() =>
                    toast.confirm(`Delete ${table.tableName}?`, 'Delete', () =>
                      deleteTable.mutate(table._id),
                    )
                  }
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
