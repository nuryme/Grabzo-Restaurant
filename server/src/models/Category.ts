import { Schema, model, type InferSchemaType } from 'mongoose'

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export type Category = InferSchemaType<typeof categorySchema>
export const CategoryModel = model('Category', categorySchema)
