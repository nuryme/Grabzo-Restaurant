import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { MenuItem } from '../../types'

export interface CartLine {
  item: MenuItem
  qty: number
  note: string
}

interface CartState {
  lines: CartLine[]
}

type Action =
  | { type: 'add'; item: MenuItem }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'setNote'; id: string; note: string }
  | { type: 'clear' }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) => l.item._id === action.item._id)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.item._id === action.item._id ? { ...l, qty: l.qty + 1 } : l,
          ),
        }
      }
      return { lines: [...state.lines, { item: action.item, qty: 1, note: '' }] }
    }
    case 'setQty': {
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => l.item._id !== action.id) }
      }
      return {
        lines: state.lines.map((l) =>
          l.item._id === action.id ? { ...l, qty: action.qty } : l,
        ),
      }
    }
    case 'setNote':
      return {
        lines: state.lines.map((l) =>
          l.item._id === action.id ? { ...l, note: action.note } : l,
        ),
      }
    case 'clear':
      return { lines: [] }
  }
}

interface CartApi {
  lines: CartLine[]
  count: number
  total: number
  qtyOf: (id: string) => number
  add: (item: MenuItem) => void
  setQty: (id: string, qty: number) => void
  setNote: (id: string, note: string) => void
  clear: () => void
}

const CartCtx = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] })

  const api = useMemo<CartApi>(() => {
    const count = state.lines.reduce((n, l) => n + l.qty, 0)
    const total = state.lines.reduce((sum, l) => sum + l.item.price * l.qty, 0)
    return {
      lines: state.lines,
      count,
      total,
      qtyOf: (id) => state.lines.find((l) => l.item._id === id)?.qty ?? 0,
      add: (item) => dispatch({ type: 'add', item }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      setNote: (id, note) => dispatch({ type: 'setNote', id, note }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state])

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartApi {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
