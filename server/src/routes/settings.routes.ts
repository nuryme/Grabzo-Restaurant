import { Router } from 'express'
import { SettingsModel } from '../models/Settings.js'
import { settingsSchema } from '../validators/schemas.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const settingsRouter = Router()

async function getOrCreateSettings() {
  return (await SettingsModel.findOne()) ?? (await SettingsModel.create({}))
}

// Public: restaurant info for the landing page.
settingsRouter.get('/', async (_req, res) => {
  res.json(await getOrCreateSettings())
})

// Owner: update restaurant info.
settingsRouter.put('/', requireAuth, requireRole('owner'), async (req, res) => {
  const data = settingsSchema.parse(req.body)
  const settings = await getOrCreateSettings()
  Object.assign(settings, data)
  await settings.save()
  res.json(settings)
})
