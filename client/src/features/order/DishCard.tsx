import { taka } from '../../lib/format'
import { useCart } from './CartContext'
import type { MenuItem } from '../../types'

export function DishCard({ item, canOrder }: { item: MenuItem; canOrder: boolean }) {
  const cart = useCart()
  const qty = cart.qtyOf(item._id)
  const soldOut = !item.available

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className={`h-40 w-full object-cover ${soldOut ? 'opacity-50 grayscale' : ''}`}
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
        {item.popular && !soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-heading text-base font-semibold text-charcoal">
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 h-10 text-sm text-charcoal-muted">{item.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-heading text-lg font-bold text-charcoal">{taka(item.price)}</span>

          {canOrder && !soldOut && (
            qty === 0 ? (
              <button
                onClick={() => cart.add(item)}
                className="h-10 rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <StepBtn label="Decrease" onClick={() => cart.setQty(item._id, qty - 1)}>
                  −
                </StepBtn>
                <span className="w-5 text-center font-heading text-base font-semibold">{qty}</span>
                <StepBtn label="Increase" onClick={() => cart.setQty(item._id, qty + 1)}>
                  +
                </StepBtn>
              </div>
            )
          )}
        </div>
      </div>
    </article>
  )
}

function StepBtn({
  children,
  label,
  onClick,
}: {
  children: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-lg font-bold text-charcoal ring-1 ring-line transition-colors hover:bg-brand-50"
    >
      {children}
    </button>
  )
}
