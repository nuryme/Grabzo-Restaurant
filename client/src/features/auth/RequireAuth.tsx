import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../../lib/api'
import { useAuth, type AuthUser } from './AuthContext'

/**
 * Guards staff/owner routes. The localStorage session is only a hint — the real
 * check is a server round-trip that validates the JWT (and that the account is
 * still active). A 401 (tampered/expired/deactivated token) is bounced to
 * /login; a transient server/network error does NOT destroy the session.
 * `ownerOnly` additionally requires the owner role.
 */
export function RequireAuth({
  children,
  ownerOnly = false,
}: {
  children: ReactNode
  ownerOnly?: boolean
}) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const { data, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api<{ user: AuthUser }>('/auth/me'),
    enabled: Boolean(user),
    retry: false,
    staleTime: 60_000,
  })

  const unauthorized = error instanceof ApiError && error.status === 401

  // Only a real 401 clears the stale local session.
  useEffect(() => {
    if (unauthorized) logout()
  }, [unauthorized, logout])

  if (!user || unauthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Don't flash protected UI before the first verification resolves.
  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream text-charcoal-muted">
        Checking access…
      </div>
    )
  }

  // Use the server-verified role when available; fall back to the session hint
  // if the verify request failed for a non-auth reason (server blip).
  const role = data?.user.role ?? user.role
  if (ownerOnly && role !== 'owner') {
    return <Navigate to="/kitchen" replace />
  }

  return <>{children}</>
}
