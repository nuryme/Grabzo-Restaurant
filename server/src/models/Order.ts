import { Schema, model, type InferSchemaType } from 'mongoose'
import { ORDER_STATUSES } from '../domain/orderFlow.js'

// Items are snapshots: name + price are copied at order time so later menu
// edits never change a placed order.
const orderItemSchema = new Schema(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    note: { type: String, default: '', trim: true },
  },
  { _id: false },
)

const statusEntrySchema = new Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
)

const orderSchema = new Schema(
  {
    orderNumber: { type: Number, required: true },
    table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    tableName: { type: String, required: true }, // snapshot for display
    items: { type: [orderItemSchema], required: true },
    orderNote: { type: String, default: '', trim: true },
    customerName: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'received' },
    estimatedMinutes: { type: Number, required: true },
    total: { type: Number, required: true },
    statusHistory: { type: [statusEntrySchema], default: [] },
    cancelReason: { type: String, default: '' },
  },
  { timestamps: true },
)

export type Order = InferSchemaType<typeof orderSchema>
export const OrderModel = model('Order', orderSchema)
