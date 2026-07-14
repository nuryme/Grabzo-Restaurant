/** Shared domain types mirroring the backend API. */

export interface Category {
  _id: string
  name: string
  sortOrder: number
}

export interface MenuItem {
  _id: string
  name: string
  description: string
  price: number // integer BDT
  category: string // category id
  imageUrl: string
  prepTimeMin: number
  available: boolean
  popular?: boolean
}

export type OrderStatus =
  | 'received'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export interface OrderItem {
  name: string
  price: number
  qty: number
  note?: string
}

export interface StatusEntry {
  status: OrderStatus
  at: string
}

export interface Order {
  _id: string
  orderNumber: number
  tableName: string
  items: OrderItem[]
  orderNote?: string
  customerName?: string
  phone?: string
  status: OrderStatus
  estimatedMinutes: number
  total: number
  cancelReason?: string
  statusHistory?: StatusEntry[]
  createdAt: string
}

export interface Table {
  _id: string
  tableName: string
  qrToken: string
  active: boolean
  createdAt: string
}

export interface StaffUser {
  _id: string
  name: string
  email: string
  role: 'owner' | 'staff'
  active: boolean
  createdAt: string
}

export interface RestaurantSettings {
  name: string
  tagline: string
  phone: string
  address: string
  hours: string
  mapEmbedUrl?: string
}
