import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { taka } from '../../lib/format'
import { useCart } from './CartContext'
import { usePlaceOrder } from './api'
import { addActiveOrder } from './activeOrder'

interface CheckoutFields {
  customerName: string
  phone: string
  orderNote: string
}

export function CartSheet({
  open,
  onClose,
  qrToken,
  tableName,
}: {
  open: boolean
  onClose: () => void
  qrToken: string
  tableName: string
}) {
  const cart = useCart()
  const navigate = useNavigate()
  const placeOrder = usePlaceOrder()
  const { register, handleSubmit } = useForm<CheckoutFields>({
    defaultValues: { customerName: '', phone: '', orderNote: '' },
  })

  const onSubmit = handleSubmit((values) => {
    if (cart.count === 0) return
    placeOrder.mutate(
      { qrToken, lines: cart.lines, ...values },
      {
        onSuccess: (order) => {
          addActiveOrder(order._id, qrToken)
          cart.clear()
          onClose()
          navigate(`/order/${order._id}`)
        },
      },
    )
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90svh] w-full max-w-6xl flex-col rounded-t-3xl bg-white"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            role="dialog"
            aria-label="Your order"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-charcoal">Your order</h2>
                <p className="text-sm text-charcoal-muted">{tableName}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-charcoal"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.lines.length === 0 ? (
                <p className="py-12 text-center text-charcoal-muted">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.lines.map((l) => (
                    <li key={l.item._id} className="rounded-2xl bg-cream p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-charcoal">{l.item.name}</p>
                          <p className="text-sm text-charcoal-muted">{taka(l.item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            aria-label="Decrease"
                            onClick={() => cart.setQty(l.item._id, l.qty - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold ring-1 ring-line"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-semibold">{l.qty}</span>
                          <button
                            aria-label="Increase"
                            onClick={() => cart.setQty(l.item._id, l.qty + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold ring-1 ring-line"
                          >
                            +
                          </button>
                          <button
                            aria-label={`Remove ${l.item.name}`}
                            onClick={() => cart.setQty(l.item._id, 0)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal-muted hover:bg-red-50 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <input
                        value={l.note}
                        onChange={(e) => cart.setNote(l.item._id, e.target.value)}
                        placeholder="Note (e.g. no onion, less spicy)"
                        className="mt-3 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand"
                      />
                    </li>
                  ))}
                </ul>
              )}

              {cart.lines.length > 0 && (
                <div className="mt-5 space-y-3">
                  <input
                    {...register('customerName')}
                    placeholder="Your name (optional)"
                    className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand"
                  />
                  <input
                    {...register('phone')}
                    placeholder="Phone (optional)"
                    inputMode="tel"
                    className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand"
                  />
                  <input
                    {...register('orderNote')}
                    placeholder="Note for the kitchen (optional)"
                    className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand"
                  />
                </div>
              )}
            </div>

            {cart.lines.length > 0 && (
              <div className="border-t border-line px-5 py-4">
                {placeOrder.isError && (
                  <p className="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
                    {(placeOrder.error as Error).message}
                  </p>
                )}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-charcoal-muted">Total</span>
                  <span className="font-heading text-xl font-bold text-charcoal">
                    {taka(cart.total)}
                  </span>
                </div>
                <button
                  onClick={onSubmit}
                  disabled={placeOrder.isPending}
                  className="h-14 w-full rounded-full bg-brand text-base font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
                >
                  {placeOrder.isPending ? 'Placing order…' : `Place order · ${taka(cart.total)}`}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
