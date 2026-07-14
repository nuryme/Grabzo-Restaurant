import { Router } from 'express'
import {
  advanceStatusSchema,
  cancelOrderSchema,
  createOrderSchema,
  estimateSchema,
} from '../validators/schemas.js'
import {
  advanceStatus,
  cancelOrder,
  createOrder,
  listActiveOrders,
  listRecentCompleted,
  updateEstimate,
} from '../services/order.service.js'
import { OrderModel } from '../models/Order.js'
import { HttpError } from '../middlewares/error.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const orderRouter = Router()

// --- Public (customer) ---

orderRouter.post('/', async (req, res) => {
  const input = createOrderSchema.parse(req.body)
  const order = await createOrder(input)
  res.status(201).json(order)
})

orderRouter.get('/:id', async (req, res) => {
  const order = await OrderModel.findById(req.params.id).catch(() => null)
  if (!order) throw new HttpError(404, 'Order not found')
  res.json(order)
})

// --- Staff / owner ---

orderRouter.get('/', requireAuth, requireRole('owner', 'staff'), async (_req, res) => {
  const [active, completed] = await Promise.all([listActiveOrders(), listRecentCompleted()])
  res.json({ active, completed })
})

orderRouter.patch('/:id/status', requireAuth, requireRole('owner', 'staff'), async (req, res) => {
  const { status } = advanceStatusSchema.parse(req.body)
  res.json(await advanceStatus(String(req.params.id), status))
})

orderRouter.patch('/:id/cancel', requireAuth, requireRole('owner', 'staff'), async (req, res) => {
  const { reason } = cancelOrderSchema.parse(req.body)
  res.json(await cancelOrder(String(req.params.id), reason))
})

orderRouter.patch('/:id/estimate', requireAuth, requireRole('owner', 'staff'), async (req, res) => {
  const { estimatedMinutes } = estimateSchema.parse(req.body)
  res.json(await updateEstimate(String(req.params.id), estimatedMinutes))
})
