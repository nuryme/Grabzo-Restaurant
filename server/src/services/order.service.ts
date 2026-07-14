import { z } from 'zod'
import { HttpError } from '../middlewares/error.js'
import { OrderModel } from '../models/Order.js'
import { MenuItemModel } from '../models/MenuItem.js'
import { TableModel } from '../models/Table.js'
import { nextOrderNumber } from '../models/Counter.js'
import { canAdvance, canCancel, ACTIVE_STATUSES, type OrderStatus } from '../domain/orderFlow.js'
import { getIo } from '../socket/io.js'
import type { createOrderSchema } from '../validators/schemas.js'

type CreateOrderInput = z.infer<typeof createOrderSchema>

/** Create an order from a valid QR token. Snapshots prices, computes total + estimate. */
export async function createOrder(input: CreateOrderInput) {
  const table = await TableModel.findOne({ qrToken: input.qrToken, active: true })
  if (!table) throw new HttpError(404, 'Table not found — please rescan the QR code')

  // Load all referenced menu items in one query.
  const ids = input.items.map((i) => i.menuItemId)
  const menuItems = await MenuItemModel.find({ _id: { $in: ids } })
  const byId = new Map(menuItems.map((m) => [String(m._id), m]))

  const items = input.items.map((line) => {
    const item = byId.get(line.menuItemId)
    if (!item) throw new HttpError(400, 'One of the items is no longer on the menu')
    if (!item.available) throw new HttpError(400, `${item.name} is currently unavailable`)
    return {
      menuItem: item._id,
      name: item.name,
      price: item.price,
      qty: line.qty,
      note: line.note ?? '',
    }
  })

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  // Kitchen cooks in parallel, so the estimate is the longest single item, not the sum.
  const estimatedMinutes = Math.max(
    ...items.map((i) => byId.get(String(i.menuItem))!.prepTimeMin),
  )

  const orderNumber = await nextOrderNumber()
  const order = await OrderModel.create({
    orderNumber,
    table: table._id,
    tableName: table.tableName,
    items,
    orderNote: input.orderNote ?? '',
    customerName: input.customerName ?? '',
    phone: input.phone ?? '',
    status: 'received',
    estimatedMinutes,
    total,
    statusHistory: [{ status: 'received', at: new Date() }],
  })

  // Notify the kitchen in real time.
  getIo().to('kitchen').emit('order:new', order.toJSON())
  return order
}

async function getOrderOr404(id: string) {
  const order = await OrderModel.findById(id).catch(() => null)
  if (!order) throw new HttpError(404, 'Order not found')
  return order
}

/** Advance an order one legal step forward. */
export async function advanceStatus(id: string, to: OrderStatus) {
  const order = await getOrderOr404(id)
  if (!canAdvance(order.status as OrderStatus, to)) {
    throw new HttpError(400, `Cannot move order from ${order.status} to ${to}`)
  }
  order.status = to
  order.statusHistory.push({ status: to, at: new Date() })
  await order.save()
  emitStatus(order)
  return order
}

/** Cancel an order (only before Ready), with an optional customer-facing reason. */
export async function cancelOrder(id: string, reason?: string) {
  const order = await getOrderOr404(id)
  if (!canCancel(order.status as OrderStatus)) {
    throw new HttpError(400, `Cannot cancel an order that is ${order.status}`)
  }
  order.status = 'cancelled'
  order.cancelReason = reason ?? ''
  order.statusHistory.push({ status: 'cancelled', at: new Date() })
  await order.save()
  emitStatus(order)
  return order
}

/** Kitchen updates the time estimate; pushed live to the customer. */
export async function updateEstimate(id: string, minutes: number) {
  const order = await getOrderOr404(id)
  order.estimatedMinutes = minutes
  await order.save()
  getIo().to(`order:${id}`).emit('order:estimate', { id, estimatedMinutes: minutes })
  return order
}

function emitStatus(order: { id: string; toJSON: () => unknown }) {
  const payload = order.toJSON()
  getIo().to(`order:${order.id}`).emit('order:status', payload)
  getIo().to('kitchen').emit('order:status', payload)
}

/** Orders the kitchen still needs to act on, newest first. */
export function listActiveOrders() {
  return OrderModel.find({ status: { $in: ACTIVE_STATUSES } }).sort({ createdAt: -1 })
}

export function listRecentCompleted(limit = 30) {
  return OrderModel.find({ status: { $in: ['completed', 'cancelled'] } })
    .sort({ updatedAt: -1 })
    .limit(limit)
}
