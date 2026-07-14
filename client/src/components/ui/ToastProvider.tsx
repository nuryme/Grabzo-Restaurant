import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Variant = 'info' | 'error'

interface BaseToast {
  id: number
  variant: Variant
  message: string
}

type ToastItem =
  | (BaseToast & { kind: 'message' })
  | (BaseToast & { kind: 'confirm'; confirmLabel: string; onConfirm: () => void })
  | (BaseToast & {
      kind: 'prompt'
      placeholder?: string
      submitLabel: string
      onSubmit: (value: string) => void
    })

interface ToastApi {
  /** One-off notice, auto-dismisses. */
  show: (message: string, variant?: Variant) => void
  /** Replaces window.confirm — stays until the user picks Cancel or confirms. */
  confirm: (message: string, confirmLabel: string, onConfirm: () => void) => void
  /** Replaces window.prompt — collects free text with Skip/Submit. */
  prompt: (
    message: string,
    submitLabel: string,
    onSubmit: (value: string) => void,
    placeholder?: string,
  ) => void
}

const ToastCtx = createContext<ToastApi | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      show: (message, variant = 'info') => {
        const id = nextId++
        setToasts((t) => [...t, { id, kind: 'message', message, variant }])
        setTimeout(() => dismiss(id), 4000)
      },
      confirm: (message, confirmLabel, onConfirm) => {
        const id = nextId++
        setToasts((t) => [
          ...t,
          { id, kind: 'confirm', message, confirmLabel, onConfirm, variant: 'error' },
        ])
      },
      prompt: (message, submitLabel, onSubmit, placeholder) => {
        const id = nextId++
        setToasts((t) => [
          ...t,
          { id, kind: 'prompt', message, submitLabel, onSubmit, placeholder, variant: 'info' },
        ])
      },
    }),
    [dismiss],
  )

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const [value, setValue] = useState('')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="pointer-events-auto w-full max-w-sm rounded-2xl bg-charcoal px-4 py-3 text-sm text-white shadow-lg"
    >
      <p>{toast.message}</p>

      {toast.kind === 'confirm' && (
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={onDismiss}
            className="rounded-full px-3 py-1.5 font-medium text-white/70 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.onConfirm()
              onDismiss()
            }}
            className="rounded-full bg-red-500 px-3 py-1.5 font-medium text-white hover:bg-red-600"
          >
            {toast.confirmLabel}
          </button>
        </div>
      )}

      {toast.kind === 'prompt' && (
        <div className="mt-3 space-y-2">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={toast.placeholder}
            className="h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-white outline-none placeholder:text-white/50 focus:border-white/50"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onDismiss}
              className="rounded-full px-3 py-1.5 font-medium text-white/70 hover:text-white"
            >
              Skip
            </button>
            <button
              onClick={() => {
                toast.onSubmit(value)
                onDismiss()
              }}
              className="rounded-full bg-brand px-3 py-1.5 font-medium text-white hover:bg-brand-600"
            >
              {toast.submitLabel}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
