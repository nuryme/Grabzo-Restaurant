import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { RequireAuth } from './features/auth/RequireAuth'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const OrderPage = lazy(() => import('./pages/OrderPage'))
const OrderStatusPage = lazy(() => import('./pages/OrderStatusPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const KitchenPage = lazy(() => import('./pages/KitchenPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const AdminTablesPage = lazy(() => import('./pages/AdminTablesPage'))
const AdminTablePrintPage = lazy(() => import('./pages/AdminTablePrintPage'))
const AdminMenuPage = lazy(() => import('./pages/AdminMenuPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/order', element: <OrderPage /> },
  { path: '/order/:id', element: <OrderStatusPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/kitchen',
    element: (
      <RequireAuth>
        <KitchenPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin',
    element: (
      <RequireAuth ownerOnly>
        <AdminDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin/tables',
    element: (
      <RequireAuth ownerOnly>
        <AdminTablesPage />
      </RequireAuth>
    ),
  },
  { path: '/admin/tables/print', element: <AdminTablePrintPage /> },
  {
    path: '/admin/menu',
    element: (
      <RequireAuth ownerOnly>
        <AdminMenuPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <RequireAuth ownerOnly>
        <AdminUsersPage />
      </RequireAuth>
    ),
  },
])
