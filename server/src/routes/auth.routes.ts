import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { loginSchema } from '../validators/schemas.js'
import { UserModel } from '../models/User.js'
import { signToken } from '../services/token.js'
import { HttpError } from '../middlewares/error.js'
import { requireAuth } from '../middlewares/auth.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)
  const user = await UserModel.findOne({ email: email.toLowerCase() })
  if (!user || !user.active) throw new HttpError(401, 'Invalid credentials')

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw new HttpError(401, 'Invalid credentials')

  const token = signToken({ sub: String(user._id), role: user.role, name: user.name })
  res.json({ token, user: user.toJSON() })
})

// Verify the caller's token and return the live user record. The client uses
// this to confirm a session is still valid (and not deactivated) before showing
// protected pages — localStorage alone is not trusted.
authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.user!.sub)
  if (!user || !user.active) throw new HttpError(401, 'Session no longer valid')
  res.json({ user: user.toJSON() })
})
