import { Schema, model, type InferSchemaType } from 'mongoose'

// Singleton document holding restaurant-wide info shown on the landing page.
const settingsSchema = new Schema(
  {
    name: { type: String, default: 'Grabzo' },
    tagline: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    hours: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
  },
  { timestamps: true },
)

export type Settings = InferSchemaType<typeof settingsSchema>
export const SettingsModel = model('Settings', settingsSchema)
