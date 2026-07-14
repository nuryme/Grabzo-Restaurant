import { Router } from 'express'
import { cloudinary, cloudinaryConfigured } from '../config/cloudinary.js'
import { env } from '../config/env.js'
import { HttpError } from '../middlewares/error.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const uploadRouter = Router()

// Owner requests a signed set of params, then uploads the file straight to
// Cloudinary from the browser (the file never passes through our server).
uploadRouter.post('/signature', requireAuth, requireRole('owner'), (_req, res) => {
  if (!cloudinaryConfigured) throw new HttpError(503, 'Image uploads are not configured')

  const timestamp = Math.round(Date.now() / 1000)
  const folder = 'grabzo/menu'
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    env.cloudinary.apiSecret,
  )

  res.json({
    signature,
    timestamp,
    folder,
    apiKey: env.cloudinary.apiKey,
    cloudName: env.cloudinary.cloudName,
  })
})
