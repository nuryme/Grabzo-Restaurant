import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { UserModel } from '../models/User.js'
import { createUserSchema, updateUserSchema } from '../validators/schemas.js'
import { HttpError } from '../middlewares/error.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const userRouter = Router()
userRouter.use(requireAuth, requireRole('owner'))

userRouter.get('/', async (_req, res) => {
  res.json(await UserModel.find().sort({ createdAt: 1 }))
})

userRouter.post('/', async (req, res) => {
  const { name, email, password, role } = createUserSchema.parse(req.body)
  const exists = await UserModel.exists({ email: email.toLowerCase() })
  if (exists) throw new HttpError(400, 'A user with that email already exists')
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await UserModel.create({ name, email, passwordHash, role })
  res.status(201).json(user)
})

userRouter.patch('/:id', async (req, res) => {
  const data = updateUserSchema.parse(req.body)
  const user = await UserModel.findById(req.params.id)
  if (!user) throw new HttpError(404, 'User not found')
  if (String(user._id) === req.user!.sub && data.active === false) {
    throw new HttpError(400, 'You cannot deactivate your own account')
  }
  if (data.active !== undefined) user.active = data.active
  if (data.password) user.passwordHash = await bcrypt.hash(data.password, 10)
  await user.save()
  res.json(user)
})

userRouter.delete('/:id', async (req, res) => {
  if (req.params.id === req.user!.sub) throw new HttpError(400, 'You cannot delete your own account')
  const deleted = await UserModel.findByIdAndDelete(req.params.id)
  if (!deleted) throw new HttpError(404, 'User not found')
  res.json({ ok: true })
})
