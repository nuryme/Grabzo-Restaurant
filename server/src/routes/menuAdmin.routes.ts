import { Router } from 'express'
import { MenuItemModel } from '../models/MenuItem.js'
import { menuItemSchema } from '../validators/schemas.js'
import { HttpError } from '../middlewares/error.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const menuAdminRouter = Router()
menuAdminRouter.use(requireAuth, requireRole('owner'))

menuAdminRouter.post('/', async (req, res) => {
  const data = menuItemSchema.parse(req.body)
  res.status(201).json(await MenuItemModel.create(data))
})

menuAdminRouter.put('/:id', async (req, res) => {
  const data = menuItemSchema.parse(req.body)
  const item = await MenuItemModel.findByIdAndUpdate(req.params.id, data, { new: true })
  if (!item) throw new HttpError(404, 'Menu item not found')
  res.json(item)
})

// Quick availability / out-of-stock toggle without sending the whole item.
menuAdminRouter.patch('/:id/availability', async (req, res) => {
  const available = Boolean(req.body?.available)
  const item = await MenuItemModel.findByIdAndUpdate(
    req.params.id,
    { available },
    { new: true },
  )
  if (!item) throw new HttpError(404, 'Menu item not found')
  res.json(item)
})

menuAdminRouter.delete('/:id', async (req, res) => {
  const deleted = await MenuItemModel.findByIdAndDelete(req.params.id)
  if (!deleted) throw new HttpError(404, 'Menu item not found')
  res.json({ ok: true })
})
