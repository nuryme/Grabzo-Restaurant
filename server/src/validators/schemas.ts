import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const createOrderSchema = z.object({
  qrToken: z.string().min(1),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        qty: z.number().int().min(1).max(50),
        note: z.string().max(200).optional(),
      }),
    )
    .min(1),
  orderNote: z.string().max(300).optional(),
  customerName: z.string().max(80).optional(),
  phone: z.string().max(30).optional(),
})

export const advanceStatusSchema = z.object({
  // Kitchen advances to the explicit next status; server verifies it's legal.
  status: z.enum(['accepted', 'preparing', 'ready', 'completed']),
})

export const cancelOrderSchema = z.object({
  reason: z.string().max(200).optional(),
})

export const estimateSchema = z.object({
  estimatedMinutes: z.number().int().min(1).max(240),
})

export const menuItemSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(''),
  price: z.number().int().min(0),
  category: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  prepTimeMin: z.number().int().min(1).max(240),
  available: z.boolean().optional().default(true),
  popular: z.boolean().optional().default(false),
})

export const categorySchema = z.object({
  name: z.string().min(1).max(80),
  sortOrder: z.number().int().optional().default(0),
})

export const createTableSchema = z.object({
  tableName: z.string().min(1).max(60),
})

export const bulkTablesSchema = z.object({
  count: z.number().int().min(1).max(100),
  prefix: z.string().max(30).optional().default('Table'),
})

export const createUserSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(['owner', 'staff']),
})

export const updateUserSchema = z.object({
  active: z.boolean().optional(),
  password: z.string().min(6).max(100).optional(),
})

export const settingsSchema = z.object({
  name: z.string().max(120).optional(),
  tagline: z.string().max(300).optional(),
  phone: z.string().max(40).optional(),
  address: z.string().max(200).optional(),
  hours: z.string().max(120).optional(),
  mapEmbedUrl: z.string().max(500).optional(),
})
