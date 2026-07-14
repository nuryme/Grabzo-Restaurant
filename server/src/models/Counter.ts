import { Schema, model } from 'mongoose'

// Atomic daily sequence for human-friendly order numbers (resets per day).
const counterSchema = new Schema({
  _id: String, // e.g. "order-2026-07-12"
  seq: { type: Number, default: 0 },
})

const CounterModel = model('Counter', counterSchema)

export async function nextOrderNumber(): Promise<number> {
  const key = `order-${new Date().toISOString().slice(0, 10)}`
  const doc = await CounterModel.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  )
  return doc.seq
}
