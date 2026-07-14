import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { restaurant } from '../config'
import { taka } from '../lib/format'
import { CartProvider, useCart } from '../features/order/CartContext'
import { OrderMenu } from '../features/order/OrderMenu'
import { CartSheet } from '../features/order/CartSheet'
import { useTable } from '../features/order/api'
import { getActiveOrders } from '../features/order/activeOrder'

export default function OrderPage() {
  const [params] = useSearchParams()
  const token = params.get('t')
  const { data: table, isLoading, isError } = useTable(token)

  // Ordering is only enabled with a valid QR token; otherwise the menu is browse-only.
  const canOrder = Boolean(token && table && !isError)

  return (
    <CartProvider>
      <div className="min-h-svh bg-white pb-28">
        <TopBanner
          canOrder={canOrder}
          tableName={table?.tableName}
          resolving={Boolean(token) && isLoading}
          invalidToken={Boolean(token) && isError}
        />
        <Container>
          <OrderMenu canOrder={canOrder} />
        </Container>

        {canOrder && table && <CartBar qrToken={token!} tableName={table.tableName} />}
      </div>
    </CartProvider>
  )
}

function TopBanner({
  canOrder,
  tableName,
  resolving,
  invalidToken,
}: {
  canOrder: boolean
  tableName?: string
  resolving: boolean
  invalidToken: boolean
}) {
  const activeOrders = getActiveOrders()
  return (
    <div className="border-b border-line bg-cream">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="font-heading text-lg font-bold text-charcoal">
            {restaurant.name}
            <span className="text-brand">.</span>
          </Link>
          {resolving ? (
            <span className="text-sm text-charcoal-muted">Finding your table…</span>
          ) : canOrder ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-charcoal ring-1 ring-line">
              🍽️ Ordering from <strong>{tableName}</strong>
            </span>
          ) : (
            <span className="rounded-full bg-white px-4 py-1.5 text-sm text-charcoal-muted ring-1 ring-line">
              {invalidToken ? 'Table not found — rescan the QR' : 'Browsing menu'}
            </span>
          )}
        </div>

        {!canOrder && !resolving && (
          <p className="mt-3 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
            Scan the QR code at your table to place an order.
          </p>
        )}

        {activeOrders && activeOrders.orderIds.length > 0 && (
          <Link
            to={`/order/${activeOrders.orderIds[0]}`}
            className="mt-3 flex items-center justify-between rounded-xl bg-charcoal px-4 py-3 text-sm font-medium text-white"
          >
            <span>You have an active order — track it</span>
            <span aria-hidden>→</span>
          </Link>
        )}
      </Container>
    </div>
  )
}

function CartBar({ qrToken, tableName }: { qrToken: string; tableName: string }) {
  const cart = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      {cart.count > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-4"
        >
          <Container className="!px-0">
            <button
              onClick={() => setOpen(true)}
              className="flex h-14 w-full items-center justify-between rounded-full bg-brand px-6 text-white transition-colors hover:bg-brand-600"
            >
              <span className="flex items-center gap-2 font-medium">
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-2 text-sm">
                  {cart.count}
                </span>
                View order
              </span>
              <span className="font-heading text-lg font-bold">{taka(cart.total)}</span>
            </button>
          </Container>
        </motion.div>
      )}

      <CartSheet
        open={open}
        onClose={() => setOpen(false)}
        qrToken={qrToken}
        tableName={tableName}
      />
    </>
  )
}
