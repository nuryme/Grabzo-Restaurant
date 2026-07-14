import { Router } from 'express'
import { CategoryModel } from '../models/Category.js'
import { MenuItemModel } from '../models/MenuItem.js'
import { categorySchema } from '../validators/schemas.js'
import { HttpError } from '../middlewares/error.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const categoryRouter = Router()
categoryRouter.use(requireAuth, requireRole('owner'))

categoryRouter.get('/', async (_req, res) => {
  res.json(await CategoryModel.find().sort({ sortOrder: 1, name: 1 }))
})

categoryRouter.post('/', async (req, res) => {
  const data = categorySchema.parse(req.body)
  res.status(201).json(await CategoryModel.create(data))
})

categoryRouter.put('/:id', async (req, res) => {
  const data = categorySchema.parse(req.body)
  const cat = await CategoryModel.findByIdAndUpdate(req.params.id, data, { new: true })
  if (!cat) throw new HttpError(404, 'Category not found')
  res.json(cat)
})

categoryRouter.delete('/:id', async (req, res) => {
  const inUse = await MenuItemModel.exists({ category: req.params.id })
  if (inUse) throw new HttpError(400, 'Category has menu items — move or delete them first')
  const deleted = await CategoryModel.findByIdAndDelete(req.params.id)
  if (!deleted) throw new HttpError(404, 'Category not found')
  res.json({ ok: true })
})
