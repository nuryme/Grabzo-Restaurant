import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { TableModel } from '../models/Table.js'
import { bulkTablesSchema, createTableSchema } from '../validators/schemas.js'
import { HttpError } from '../middlewares/error.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const tableRouter = Router()

// Public: resolve a QR token to a table name. Returns only the name — never the
// token list or other tables.
tableRouter.get('/resolve', async (req, res) => {
  const token = String(req.query.t ?? '')
  if (!token) throw new HttpError(400, 'Missing table token')
  const table = await TableModel.findOne({ qrToken: token, active: true })
  if (!table) throw new HttpError(404, 'Table not found')
  res.json({ id: table._id, tableName: table.tableName })
})

// --- Owner only below ---
tableRouter.use(requireAuth, requireRole('owner'))

tableRouter.get('/', async (_req, res) => {
  res.json(await TableModel.find().sort({ createdAt: 1 }))
})

tableRouter.post('/', async (req, res) => {
  const { tableName } = createTableSchema.parse(req.body)
  const table = await TableModel.create({ tableName, qrToken: uuid() })
  res.status(201).json(table)
})

// Bulk generate N tables at once (restaurants rarely add them one by one).
tableRouter.post('/bulk', async (req, res) => {
  const { count, prefix } = bulkTablesSchema.parse(req.body)
  const existing = await TableModel.countDocuments()
  const docs = Array.from({ length: count }, (_, i) => ({
    tableName: `${prefix} ${existing + i + 1}`,
    qrToken: uuid(),
  }))
  const created = await TableModel.insertMany(docs)
  res.status(201).json(created)
})

tableRouter.delete('/:id', async (req, res) => {
  const deleted = await TableModel.findByIdAndDelete(req.params.id)
  if (!deleted) throw new HttpError(404, 'Table not found')
  res.json({ ok: true })
})
