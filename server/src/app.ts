import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/error.js'
import { authRouter } from './routes/auth.routes.js'
import { menuRouter } from './routes/menu.routes.js'
import { settingsRouter } from './routes/settings.routes.js'
import { orderRouter } from './routes/order.routes.js'
import { tableRouter } from './routes/table.routes.js'
import { categoryRouter } from './routes/category.routes.js'
import { menuAdminRouter } from './routes/menuAdmin.routes.js'
import { userRouter } from './routes/user.routes.js'
import { dashboardRouter } from './routes/dashboard.routes.js'
import { uploadRouter } from './routes/upload.routes.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.clientOrigin, credentials: true }))
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  // Public
  app.use('/api/auth', authRouter)
  app.use('/api/menu', menuRouter)
  app.use('/api/settings', settingsRouter)
  app.use('/api/tables', tableRouter) // /resolve is public; rest is owner-gated
  app.use('/api/orders', orderRouter) // create/track public; rest staff-gated

  // Admin (gated inside each router)
  app.use('/api/admin/categories', categoryRouter)
  app.use('/api/admin/menu-items', menuAdminRouter)
  app.use('/api/admin/users', userRouter)
  app.use('/api/admin/dashboard', dashboardRouter)
  app.use('/api/admin/upload', uploadRouter)

  app.use(errorHandler)
  return app
}
