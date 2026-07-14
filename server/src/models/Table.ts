import { Schema, model, type InferSchemaType } from 'mongoose'

const tableSchema = new Schema(
  {
    tableName: { type: String, required: true, trim: true },
    // Opaque token embedded in the QR code — the QR never contains the table name.
    qrToken: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type Table = InferSchemaType<typeof tableSchema>
export const TableModel = model('Table', tableSchema)
