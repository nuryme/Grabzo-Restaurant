import { NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { restaurant } from '../config'
import { useAuth } from '../features/auth/AuthContext'

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/tables', label: 'Tables', end: false },
  { to: '/admin/menu', label: 'Menu', end: false },
  { to: '/admin/users', label: 'Users', end: false },
]

function navClass(isActive: boolean): string {
  return isActive
    ? 'rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700'
    : 'rounded-full px-3 py-1.5 text-sm font-medium text-charcoal-soft hover:bg-cream'
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-svh bg-cream">
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="font-heading text-lg font-bold text-charcoal">
              {restaurant.name}
              <span className="text-brand">.</span> Admin
            </span>
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => navClass(isActive)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/kitchen" className="text-sm font-medium text-charcoal-soft hover:text-brand">
              Kitchen
            </NavLink>
            <span className="hidden text-sm text-charcoal-muted sm:inline">{user?.name}</span>
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="rounded-full bg-cream px-4 py-2 text-sm font-medium text-charcoal ring-1 ring-line hover:bg-brand-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8">{children}</main>
    </div>
  )
}
