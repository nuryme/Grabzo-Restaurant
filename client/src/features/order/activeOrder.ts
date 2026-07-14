/** Remembers the customer's orders for the current table so they can return to
 *  tracking after closing the tab, and so placing another order adds to the
 *  same tracking list instead of replacing it. Entries older than a day are
 *  dropped — a new day is a new dining session, not yesterday's order. */
const KEY = 'grabzo_active_orders'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

interface StoredOrder {
  id: string
  addedAt: number
}

interface StoredData {
  token: string
  orders: StoredOrder[]
}

export interface ActiveOrders {
  token: string
  orderIds: string[]
}

function read(): StoredData | null {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (!raw) return null
    if (Array.isArray(raw.orders)) return raw as StoredData
    // Legacy shape from before per-order timestamps — migrate in place.
    if (Array.isArray(raw.orderIds)) {
      return {
        token: raw.token,
        orders: raw.orderIds.map((id: string) => ({ id, addedAt: Date.now() })),
      }
    }
    return null
  } catch {
    return null
  }
}

/** Drops orders older than a day, persisting the trim if anything changed. */
function prune(data: StoredData | null): StoredData | null {
  if (!data) return null
  const cutoff = Date.now() - MAX_AGE_MS
  const orders = data.orders.filter((o) => o.addedAt >= cutoff)
  if (orders.length === 0) {
    localStorage.removeItem(KEY)
    return null
  }
  if (orders.length !== data.orders.length) {
    localStorage.setItem(KEY, JSON.stringify({ token: data.token, orders }))
  }
  return { token: data.token, orders }
}

export function addActiveOrder(orderId: string, token: string): void {
  const current = prune(read())
  const orders =
    current?.token === token
      ? [...current.orders, { id: orderId, addedAt: Date.now() }]
      : [{ id: orderId, addedAt: Date.now() }]
  localStorage.setItem(KEY, JSON.stringify({ token, orders }))
}

export function getActiveOrders(): ActiveOrders | null {
  const data = prune(read())
  return data ? { token: data.token, orderIds: data.orders.map((o) => o.id) } : null
}
