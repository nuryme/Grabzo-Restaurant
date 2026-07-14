import { Schema, model, type InferSchemaType } from 'mongoose'

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 }, // integer BDT
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    imageUrl: { type: String, default: '' },
    prepTimeMin: { type: Number, required: true, min: 1, default: 10 },
    available: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export type MenuItem = InferSchemaType<typeof menuItemSchema>
export const MenuItemModel = model('MenuItem', menuItemSchema)
