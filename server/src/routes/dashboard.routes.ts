import { Router } from 'express'
import { OrderModel } from '../models/Order.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const dashboardRouter = Router()
dashboardRouter.use(requireAuth, requireRole('owner', 'staff'))

dashboardRouter.get('/', async (_req, res) => {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const todayFilter = { createdAt: { $gte: startOfDay } }

  const [ordersToday, preparing, ready, completedToday, revenueAgg] = await Promise.all([
    OrderModel.countDocuments(todayFilter),
    OrderModel.countDocuments({ status: 'preparing' }),
    OrderModel.countDocuments({ status: 'ready' }),
    OrderModel.countDocuments({ ...todayFilter, status: 'completed' }),
    OrderModel.aggregate([
      { $match: { ...todayFilter, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ])

  res.json({
    ordersToday,
    preparing,
    ready,
    completedToday,
    revenueToday: revenueAgg[0]?.total ?? 0,
  })
})
