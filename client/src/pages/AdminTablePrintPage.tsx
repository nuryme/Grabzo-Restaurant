import { useSearchParams } from 'react-router-dom'
import { restaurant } from '../config'
import { Button } from '../components/ui/Button'

export default function AdminTablePrintPage() {
  const [params] = useSearchParams()
  const name = params.get('name') ?? 'Table'
  const token = params.get('token') ?? ''
  const orderUrl = `${window.location.origin}/order?t=${token}`
  // ponytail: public QR image API, no dependency install — swap for a self-hosted
  // generator (e.g. the `qrcode` package) if offline/print-quality needs grow.
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(orderUrl)}`

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white p-8 text-center">
      <p className="font-heading text-2xl font-bold text-charcoal">
        {restaurant.name}
        <span className="text-brand">.</span>
      </p>
      <img src={qrSrc} alt={`QR code for ${name}`} width={320} height={320} />
      <p className="font-heading text-3xl font-bold text-charcoal">{name}</p>
      <p className="text-charcoal-muted">Scan to Order</p>
      <Button onClick={() => window.print()} className="print:hidden">
        Print
      </Button>
    </div>
  )
}
