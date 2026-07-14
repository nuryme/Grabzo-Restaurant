import { Router } from 'express'
import { MenuItemModel } from '../models/MenuItem.js'
import { CategoryModel } from '../models/Category.js'

export const menuRouter = Router()

// Public menu: categories + available items. Used by the customer ordering page
// and the landing page's featured section.
menuRouter.get('/', async (_req, res) => {
  const [categories, items] = await Promise.all([
    CategoryModel.find().sort({ sortOrder: 1, name: 1 }),
    MenuItemModel.find().sort({ name: 1 }),
  ])
  res.json({ categories, items })
})
