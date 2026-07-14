import { Schema, model, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['owner', 'staff'], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Never leak the password hash in JSON responses.
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete (ret as Record<string, unknown>).passwordHash
    return ret
  },
})

export type User = InferSchemaType<typeof userSchema>
export const UserModel = model('User', userSchema)
