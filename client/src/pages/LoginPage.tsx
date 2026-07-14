import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { restaurant } from '../config'
import { useAuth } from '../features/auth/AuthContext'

interface Fields {
  email: string
  password: string
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState } = useForm<Fields>()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/kitchen'

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (e) {
      setError((e as Error).message || 'Login failed')
    }
  })

  return (
    <div className="flex min-h-svh items-center bg-cream">
      <Container className="max-w-md">
        <div className="rounded-3xl bg-white p-8 ring-1 ring-line">
          <h1 className="font-heading text-2xl font-bold text-charcoal">
            {restaurant.name}
            <span className="text-brand">.</span> Staff
          </h1>
          <p className="mt-1 text-charcoal-muted">Sign in to the kitchen dashboard.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Email"
              autoComplete="username"
              className="h-12 w-full rounded-xl border border-line bg-cream px-4 outline-none focus:border-brand focus:bg-white"
            />
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-line bg-cream px-4 outline-none focus:border-brand focus:bg-white"
            />
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
            )}
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="h-12 w-full rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              {formState.isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </Container>
    </div>
  )
}
