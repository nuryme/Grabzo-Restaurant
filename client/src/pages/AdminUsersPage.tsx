import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AdminLayout } from '../layouts/AdminLayout'
import { Button } from '../components/ui/Button'
import { useAuth } from '../features/auth/AuthContext'
import { useCreateUser, useDeleteUser, useSetUserActive, useUsers } from '../features/admin/useUsers'
import { useToast } from '../components/ui/ToastProvider'

interface Fields {
  name: string
  email: string
  password: string
  role: 'owner' | 'staff'
}

export default function AdminUsersPage() {
  const { user: me } = useAuth()
  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser()
  const setActive = useSetUserActive()
  const deleteUser = useDeleteUser()
  const toast = useToast()
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState } = useForm<Fields>({
    defaultValues: { role: 'staff' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      await createUser.mutateAsync(values)
      reset({ role: 'staff' })
    } catch (e) {
      setError((e as Error).message || 'Could not create user')
    }
  })

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Users</h1>

      <form onSubmit={onSubmit} className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-line">
        <h2 className="font-heading text-lg font-semibold text-charcoal">Add staff account</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            {...register('name', { required: true })}
            placeholder="Name"
            className="h-11 rounded-lg border border-line px-3 text-sm"
          />
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Email"
            className="h-11 rounded-lg border border-line px-3 text-sm"
          />
          <input
            {...register('password', { required: true, minLength: 6 })}
            type="password"
            placeholder="Password (min 6 chars)"
            className="h-11 rounded-lg border border-line px-3 text-sm"
          />
          <select
            {...register('role', { required: true })}
            className="h-11 rounded-lg border border-line px-3 text-sm"
          >
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <Button type="submit" className="mt-4" disabled={formState.isSubmitting}>
          Create account
        </Button>
      </form>

      {isLoading ? (
        <p className="py-16 text-center text-charcoal-muted">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-charcoal-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => {
                const isSelf = u._id === me?._id
                return (
                  <tr key={u._id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 font-medium text-charcoal">{u.name}</td>
                    <td className="px-5 py-3 text-charcoal-muted">{u.email}</td>
                    <td className="px-5 py-3 capitalize text-charcoal-muted">{u.role}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          u.active
                            ? 'rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-600'
                            : 'rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-charcoal-muted ring-1 ring-line'
                        }
                      >
                        {u.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          disabled={isSelf}
                          title={isSelf ? "You can't deactivate your own account" : undefined}
                          onClick={() => setActive.mutate({ id: u._id, active: !u.active })}
                          className="rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50 disabled:opacity-40"
                        >
                          {u.active ? 'Deactivate' : 'Reactivate'}
                        </button>
                        <button
                          disabled={isSelf}
                          onClick={() =>
                            toast.confirm(`Delete ${u.name}?`, 'Delete', () =>
                              deleteUser.mutate(u._id),
                            )
                          }
                          className="rounded-full px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
